import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UniversalExtraction, ExtractionResult } from "@/types/extraction";

interface UseUniversalExtractionResult {
  isExtracting: boolean;
  extractionError: string | null;
  extract: (textContent: string, fileName: string, fileType?: string) => Promise<UniversalExtraction | null>;
  extractMultiple: (files: Array<{ textContent: string; fileName: string; fileType?: string }>) => Promise<UniversalExtraction[]>;
}

export function useUniversalExtraction(): UseUniversalExtractionResult {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  const extract = useCallback(async (
    textContent: string,
    fileName: string,
    fileType?: string
  ): Promise<UniversalExtraction | null> => {
    setIsExtracting(true);
    setExtractionError(null);

    try {
      const { data, error } = await supabase.functions.invoke<ExtractionResult>("analyze-extract", {
        body: { textContent, fileName, fileType },
      });

      if (error) {
        throw new Error(error.message || "Extraction failed");
      }

      if (!data?.success || !data.extraction) {
        throw new Error(data?.error || "No extraction data returned");
      }

      return data.extraction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Extraction failed";
      setExtractionError(errorMessage);
      console.error("Universal extraction error:", err);
      return null;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const extractMultiple = useCallback(async (
    files: Array<{ textContent: string; fileName: string; fileType?: string }>
  ): Promise<UniversalExtraction[]> => {
    setIsExtracting(true);
    setExtractionError(null);

    const results: UniversalExtraction[] = [];

    try {
      // Process files sequentially to avoid rate limiting
      for (const file of files) {
        const result = await extract(file.textContent, file.fileName, file.fileType);
        if (result) {
          results.push(result);
        }
      }

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Multiple extraction failed";
      setExtractionError(errorMessage);
      console.error("Multiple extraction error:", err);
      return results;
    } finally {
      setIsExtracting(false);
    }
  }, [extract]);

  return {
    isExtracting,
    extractionError,
    extract,
    extractMultiple,
  };
}
