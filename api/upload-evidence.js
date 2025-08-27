import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // ✅ Allow CORS so frontend can call this proxy
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ success: false, message: "Error parsing form data" });

    try {
      // ✅ handle fields as arrays
      const evidenceName = fields.evidenceName?.[0] || "";
      const category = fields.category?.[0] || "";
      const subCounty = fields.subCounty?.[0] || "";

      if (!evidenceName || !category || !subCounty) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      // ✅ Forward data to Google Apps Script
      const formData = new FormData();
      formData.append("evidenceName", evidenceName);
      formData.append("category", category);
      formData.append("subCounty", subCounty);

      if (files) {
        for (let key in files) {
          const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];
          for (let file of fileArray) {
            const buffer = fs.readFileSync(file.filepath);
            formData.append("files", buffer, file.originalFilename);
          }
        }
      }

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxH-oKIj24QF7ce-LeETyqxbH9CVB0g8Gor2AIpE6caZs2hqhYPPtOCT39ktBwwQLWo0w/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        return res.status(500).json({ success: false, message: "Apps Script error", raw: text });
      }

      res.status(200).json(data);

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}
