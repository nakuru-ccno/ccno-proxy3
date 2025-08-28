// pages/api/upload-evidence.js
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // You can replace * with your domain
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Parse multipart/form-data
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error parsing form data" });
    }

    try {
      // Extract metadata
      const evidenceName = Array.isArray(fields.evidenceName) ? fields.evidenceName[0] : fields.evidenceName;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
      const subCounty = Array.isArray(fields.subCounty) ? fields.subCounty[0] : fields.subCounty;

      if (!evidenceName || !category || !subCounty) {
        return res.status(400).json({ success: false, message: "Missing evidenceName, category, or subCounty" });
      }

      // Prepare FormData to forward
      const formData = new FormData();
      formData.append("evidenceName", evidenceName);
      formData.append("category", category);
      formData.append("subCounty", subCounty);

      // Append files
      if (files) {
        for (let key in files) {
          const file = files[key];
          // For multiple files, formidable may return array
          if (Array.isArray(file)) {
            file.forEach(f => {
              const buffer = fs.readFileSync(f.filepath);
              formData.append("files", buffer, f.originalFilename);
            });
          } else {
            const buffer = fs.readFileSync(file.filepath);
            formData.append("files", buffer, file.originalFilename);
          }
        }
      }

      // Forward to Google Apps Script
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzh9WOMMX8S4S6RupDr_YDyGTdfCCQyYDduKPMQsZtVUI5gcWd4GDZglDCFI1WyVnHZ0g/exec",
        { method: "POST", body: formData }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: "Invalid response from Apps Script" };
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}
