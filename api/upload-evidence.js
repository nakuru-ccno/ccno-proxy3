// pages/api/proxy.js
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // ✅ Always set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error parsing form data" });
    }

    try {
      // Extract values safely
      const evidenceName = Array.isArray(fields.evidenceName) ? fields.evidenceName[0] : fields.evidenceName;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
      const subCounty = Array.isArray(fields.subCounty) ? fields.subCounty[0] : fields.subCounty;

      if (!evidenceName || !category || !subCounty) {
        return res.status(400).json({ success: false, message: "Missing evidenceName, category, or subCounty" });
      }

      // Prepare forward form
      const formData = new FormData();
      formData.append("evidenceName", evidenceName);
      formData.append("category", category);
      formData.append("subCounty", subCounty);

      if (files) {
        for (let key in files) {
          const file = files[key];
          const buffer = fs.readFileSync(file.filepath);
          formData.append("files", buffer, file.originalFilename);
        }
      }

      // Forward to Apps Script
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwsaOSD6feMC6Z6e532tM842z61-JTIq_e-DN4Ewrv1jDJqJKo3G6BA3bn-NC1y4gj9rQ/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: "Invalid response from Apps Script" };
      }

      res.status(200).json(data);

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}
