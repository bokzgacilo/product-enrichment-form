import { supabase } from "@/config/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;

    // Basic required validation
    if (!payload.name || !payload.sku) {
      return res.status(400).json({
        error: "product_name and product_sku are required",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: "Product created successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected server error",
      details: err.message,
    });
  }
}