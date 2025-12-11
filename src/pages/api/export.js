import Papa from "papaparse";

export default function handler(req, res) {
  const { data } = req.body;

  const csv = Papa.unparse(data);

  const title = 'export_' + Date.now();

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=" + title + ".csv");

  return res.status(200).send(csv);
}
