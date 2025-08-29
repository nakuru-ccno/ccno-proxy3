// pages/api/upload-evidence.js
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      // Collect raw body (buffer)
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks);

      // Forward to Apps Script
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": req.headers["content-type"] || "application/json",
          },
          body: rawBody,
        }
      );

      const text = await response.text();

      return res.status(response.status).send(text);
    } catch (error) {
      console.error("Proxy error:", error);
      return res.status(500).json({ error: "Proxy failed", details: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

