// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getColorCode } from "@/helper/getColorCode";
import { getDecoMethodCode } from "@/helper/getDecoMethodCode";
import { getLogoCode } from "@/helper/getLogoCode";
import { getPlacementCode } from "@/helper/getPlacementCode";
import JSZip from "jszip";
import Papa from "papaparse";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

// ✅ Single source of truth for filename generation
function buildImageFilename(row) {
  const color_code = getColorCode(row.logoColor);
  const deco_method_code = getDecoMethodCode(row.decoMethod);
  const logo_code = getLogoCode(row.logoName);
  const placement_code = getPlacementCode(row.placement);

  const parts = [
    row.SKU,
    logo_code,
    color_code,
    placement_code,
    deco_method_code,
  ];

  const filtered = parts.filter(p => p && p !== "");

  return filtered.join("_") + ".jpg";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "invalid request method" });
  }

  const data = req.body;
  const zip = new JSZip();

  // ✅ Build CSV with filename included
  const csvData = data.map(row => {
    const filename = buildImageFilename(row);

    return {
      "SKU": row.SKU,
      "Reference Code": row.ReferenceCode,
      "Image URL": row.ImageURL,
      "Image Filename": filename,
      "Logo Name": row.logoName,
      "Logo Color": row.logoColor,
      "Placement": row.placement,
      "Deco Method": row.decoMethod,
      "No Logo": row.noLogo,
      "PDP Link": row.pdpLink,
    };
  });

  const csv = Papa.unparse(csvData);

  zip.folder("products").file("products.csv", csv);
  const imagesFolder = zip.folder("images");

  // ✅ Download and store images
  for (const row of data) {
    const url = row.ImageURL;
    if (!url) continue;

    const filename = buildImageFilename(row);

    try {
      const imageResponse = await fetch(url);

      if (!imageResponse.ok) {
        console.warn("Failed to fetch", url);
        continue;
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = filename.replace(/[\\/]/g, "");

      imagesFolder.file(safeName, buffer);
    } catch (err) {
      console.error("Image fetch error:", err);
    }
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=export.zip");
  res.send(zipBuffer);
}
