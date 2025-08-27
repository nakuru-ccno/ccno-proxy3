import fetch from "node-fetch";
import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ success: false, message: "Error parsing form data" });

    try {
      const { evidenceName, category, subCounty } = fields;
      if (!evidenceName || !category || !subCounty)
        return res.status(400).json({ success: false, message: "Missing required fields" });

      const formData = new FormData();
      formData.append("evidenceName", evidenceName);
      formData.append("category", category);
      formData.append("subCounty", subCounty);

      if (files) {
        for (let key in files) {
          const file = files[key];
          const buffer = fs.readFileSync(file.filepath);
          formData.append(key, buffer, file.originalFilename);
        }
      }

      const response = await fetch("https://script.google.com/macros/s/AKfycbxH-oKIj24QF7ce-LeETyqxbH9CVB0g8Gor2AIpE6caZs2hqhYPPtOCT39ktBwwQLWo0w/exec", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      res.status(200).json(data);

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}
