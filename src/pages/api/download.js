
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
            sizeLimit: "50mb",
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(404).json({ message: "invalid request method" });
    }

    const data = req.body;
    const zip = new JSZip();

    const csvData = data.map(row => ({
        "Reference Code": row.ReferenceCode,
        "Image URL": row.ImageURL,
        "Logo Name": row.logoName,
        "Logo Color": row.logoColor,
        "Placement": row.placement,
        "Deco Method": row.decoMethod,
        "No Logo": row.noLogo,
    }));

    const csv = Papa.unparse(csvData);
    zip.folder("products").file("products.csv", csv);
    const imagesFolder = zip.folder("images");

    for (const row of data) {
        const url = row.ImageURL;

        const color_code = getColorCode(row.logoColor);
        const deco_method_code = getDecoMethodCode(row.decoMethod);
        const logo_code = getLogoCode(row.logoName);
        const placement_code = getPlacementCode(row.placement);

        const parts = [
            row.ReferenceCode,
            logo_code,
            color_code,
            placement_code,
            deco_method_code
        ];

        // remove null, undefined, empty strings
        const filtered = parts.filter(p => p && p !== "");

        // join with correct format
        const filename = filtered.join("_") + ".jpg";
        if (!url) continue;

        try {
            const imageResponse = await fetch(url);

            if (!imageResponse.ok) {
                console.warn("Failed to fetch", url);
                continue;
            }

            const arrayBuffer = await imageResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            imagesFolder.file(filename, buffer);
        } catch (err) {
            console.error("Image fetch error:", err);
        }
    }
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=export.zip");
    res.send(zipBuffer);
}
