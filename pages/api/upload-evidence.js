// api/upload-evidence.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Forward the body and headers to your Apps Script endpoint
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
      {
        method: "POST",
        headers: {
          ...req.headers,
          host: undefined, // avoid host header mismatch
        },
        body: req,         // forward raw request body (stream)
        duplex: "half",    // 👈 REQUIRED in Node 18+
      }
    );

    const text = await response.text();

    return res.status(response.status).send(text);
  } catch (error) {
    console.error("Proxy failed", error);
    return res.status(500).json({
      error: "Proxy failed",
      details: error.message,
    });
  }
}
