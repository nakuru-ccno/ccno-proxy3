export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      // Forward request to Google Apps Script
      const googleScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

      // Send body as stream with duplex: "half"
      const response = await fetch(googleScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": req.headers["content-type"] || "application/json",
        },
        body: req, // forward stream directly
        duplex: "half", // <-- CRUCIAL FIX
      });

      const data = await response.text();

      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(response.status).send(data);
    } catch (error) {
      return res.status(500).json({
        error: "Proxy failed",
        details: error.message,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
