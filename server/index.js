import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.get("/api/metrics", async (req, res) => {
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

app.listen(3001, '0.0.0.0', () => console.log("Backend running on port 3001"));
