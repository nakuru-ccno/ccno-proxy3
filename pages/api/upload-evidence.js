// /api/upload-evidence.js
export const config = {
  api: {
    bodyParser: false, // disable built-in body parsing so we can stream
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Forward the request as a stream to Apps Script
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
      {
        method: "POST",
        headers: {
          ...req.headers,
          host: undefined, // prevent host mismatch
        },
        body: req,        // stream request
        duplex: "half",   // 👈 REQUIRED for Node >=18
      }
    );

    // Apps Script usually returns JSON or plain text
    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    res.setHeader("content-type", contentType);
    return res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy failed:", err);
    return res.status(500).json({
      error: "Proxy failed",
      details: err.message,
    });
  }
}
