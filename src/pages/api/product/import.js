import { supabase } from "@/config/Supabase";
import formidable from "formidable";
import fs from "fs";
import Papa from "papaparse";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const file = files.file[0];
    if (!file) {
      return res.status(400).json({ error: "CSV file required" });
    }

    console.log(file)

    try {
      const fileContent = fs.readFileSync(file.filepath, "utf8");

      const parsed = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsed.errors.length > 0) {
        return res.status(400).json({
          error: "CSV parsing error",
          details: parsed.errors,
        });
      }

      const records = parsed.data.map((row) => ({
        name: row["Product Name"],
        sku: row["SKU"],

        vendor: row["Product/Vendor SKU"],
        colors: row["Product Color(s)"]
          ? row["Product Color(s)"].split(",").map((c) => c.trim())
          : [],

        category: row["Category 1"],
        family: row["Product Family"],

        price_usd: row["Price (original1) USD"]
          ? parseFloat(row["Price (original1) USD"])
          : null,

        moq: row["Vendor's MOQ"]
          ? parseInt(row["Vendor's MOQ"])
          : 0,

        production_time: row["Production Time"],
        brand: row["Product Brand__c"],

        shipping_weight: row["Product ShippingWeight"]
          ? parseFloat(row["Product ShippingWeight"])
          : null,

        link: row["Product Vendor_Link__c"],
      }));

      // Remove rows missing required fields
      const validRecords = records.filter(
        (r) => r.name && r.sku
      );

      // Batch upsert
      const chunkSize = 500;

      for (let i = 0; i < validRecords.length; i += chunkSize) {
        const chunk = validRecords.slice(i, i + chunkSize);

        const { error } = await supabase
          .from("products")
          .upsert(chunk, { onConflict: "sku" });

        if (error) {
          return res.status(500).json({ error: error.message });
        }
      }

      return res.status(200).json({
        message: "Import successful",
        totalProcessed: records.length,
        totalInsertedOrUpdated: validRecords.length,
      });

    } catch (error) {
      return res.status(500).json({
        error: "Import failed",
        details: error.message,
      });
    }
  });
}