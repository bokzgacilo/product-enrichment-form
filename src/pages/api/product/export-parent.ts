import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const products = req.body

  const headers = [
    "url",
    "vendor",
    "brand",
    "name",
    "sku",
    "colors",
    "sizes",
    "category",
    "family",
    "price_usd",
    "size_chart_link",
    "how_to_measure_guide_link",
    "decoration_method",
    "moq",
    "production_time",
    "shipping_weight",
    "tax_code"
  ]

  // Prevent Excel formula injection
  const sanitizeExcel = (value: string) => {
    if (/^[=+\-@]/.test(value)) {
      return "'" + value
    }
    return value
  }

  const escapeCSV = (value: any) => {
    let str = String(value ?? "")

    str = sanitizeExcel(str)

    // escape quotes
    str = str.replace(/"/g, '""')

    return `"${str}"`
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8")
  res.setHeader("Content-Disposition", "attachment; filename=products.csv")

  // UTF-8 BOM for Excel
  res.write("\uFEFF")

  // Write header row
  res.write(headers.join(",") + "\n")

  // Stream rows (memory safe)
  for (const p of products) {
    const row = headers.map(h => escapeCSV(p[h])).join(",")
    res.write(row + "\n")
  }

  res.end()
}