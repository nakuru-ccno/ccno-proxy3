import formidable from "formidable";
import fetch from "node-fetch";
import Cors from "cors";

// Enable CORS for your front-end domain
const cors = Cors({
  origin: "*", // change '*' to your front-end URL later
  methods: ["POST"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

// Disable default body parser (we'll use formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing form data" });

    try {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbyutVpeRZmG4ivWXK57OzPwUZkRJJileP_h1IGV2KkGk_y3EyJ70qYmwsF-4fyC3sQtpg/exec"; // replace this

      const formData = new FormData();

      // Add all form fields (e.g., evidenceName, category, subCounty)
      Object.keys(fields).forEach((key) => {
        formData.append(key, fields[key]);
      });

      // Add all uploaded files
      if (files.file) {
        const fileArray = Array.isArray(files.file) ? files.file : [files.file];
        for (const f of fileArray) {
          // Read file as Blob
          formData.append("file", f.filepath ? await fs.promises.readFile(f.filepath) : f);
        }
      }

      const response = await fetch(scriptUrl, { method: "POST", body: formData });
      const data = await response.json();

      res.status(200).json(data);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to forward to Apps Script" });
    }
  });
}

