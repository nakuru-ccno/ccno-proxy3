import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // ✅ Allow CORS
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
      const { evidenceName, category, subCounty } = fields;
      if (!evidenceName || !category || !subCounty) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }

      // ✅ Build FormData for Apps Script
      const formData = new FormData();
      formData.append("evidenceName", evidenceName.toString());
      formData.append("category", category.toString());
      formData.append("subCounty", subCounty.toString());

      if (files) {
        for (let key in files) {
          const file = files[key];
          if (Array.isArray(file)) {
            for (const f of file) {
              formData.append("files", fs.createReadStream(f.filepath), f.originalFilename);
            }
          } else {
            formData.append("files", fs.createReadStream(file.filepath), file.originalFilename);
          }
        }
      }

      // ✅ Use node-fetch with form-data headers
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxH-oKIj24QF7ce-LeETyqxbH9CVB0g8Gor2AIpE6caZs2hqhYPPtOCT39ktBwwQLWo0w/exec",
        {
          method: "POST",
          body: formData,
          headers: formData.getHeaders(), // 👈 Important
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, message: text };
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}
