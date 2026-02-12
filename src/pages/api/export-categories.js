
import Papa from "papaparse";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "invalid request method" });
  }

  const data = req.body;

  // ✅ Build CSV with filename included
  const csvData = data.map(row => {
    return {
      "reference_id": row.reference_id,
      "image_url": row.image_url,
      "category": row.category,
      "product_family": row.product_family,
    };
  });

  const csv = Papa.unparse(csvData);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename=categories_${Date.now()}.csv`);
  res.send(csv);
}
