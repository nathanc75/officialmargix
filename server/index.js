import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Object storage setup
const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

async function signObjectURL({ bucketName, objectName, method, ttlSec }) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1000).toISOString(),
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to sign object URL: ${response.status}`);
  }
  const { signed_url } = await response.json();
  return signed_url;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// File upload endpoint - returns presigned URL
app.post("/api/uploads/request-url", async (req, res) => {
  try {
    const { name, size, contentType } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Missing required field: name" });
    }

    const privateDir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!privateDir) {
      return res.status(500).json({ error: "Object storage not configured" });
    }

    const objectId = randomUUID();
    const extension = name.split('.').pop() || '';
    const objectName = `uploads/${objectId}.${extension}`;
    
    // Parse the private dir to get bucket name
    const parts = privateDir.startsWith('/') ? privateDir.slice(1).split('/') : privateDir.split('/');
    const bucketName = parts[0];
    const fullObjectName = parts.slice(1).join('/') + '/' + objectName;

    const uploadURL = await signObjectURL({
      bucketName,
      objectName: fullObjectName,
      method: "PUT",
      ttlSec: 900,
    });

    res.json({
      uploadURL,
      objectPath: `/objects/${objectName}`,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// List uploaded files (for demo purposes, stores in memory)
const uploadedFiles = [];

app.post("/api/uploads/complete", (req, res) => {
  const { name, objectPath, size, contentType } = req.body;
  uploadedFiles.push({
    id: randomUUID(),
    name,
    objectPath,
    size,
    contentType,
    uploadedAt: new Date().toISOString(),
  });
  res.json({ success: true, file: uploadedFiles[uploadedFiles.length - 1] });
});

app.get("/api/uploads", (req, res) => {
  res.json(uploadedFiles);
});

let supabase = null;
if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

app.get("/api/metrics", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Database not configured" });
  const { restaurant_id } = req.query;
  if (!restaurant_id) return res.status(400).json({ error: "restaurant_id required" });

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("restaurant_id", restaurant_id);

  if (error) return res.status(500).json({ error: error.message });

  let totals = {
    orders: orders.length,
    revenue: 0,
    fees: 0,
    promos: 0,
    refunds: 0,
    net_profit: 0
  };

  for (const o of orders) {
    totals.revenue += o.item_subtotal_cents;
    totals.fees += o.fees_cents;
    totals.promos += o.promos_cents;
    totals.refunds += o.refunds_cents;
    totals.net_profit +=
      o.item_subtotal_cents - o.fees_cents - o.promos_cents - o.refunds_cents;
  }

  res.json({
    restaurant_id,
    totals_cents: totals,
    totals_dollars: {
      revenue: totals.revenue / 100,
      fees: totals.fees / 100,
      promos: totals.promos / 100,
      refunds: totals.refunds / 100,
      net_profit: totals.net_profit / 100
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    } else {
      next();
    }
  });
}

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 5000) : 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
