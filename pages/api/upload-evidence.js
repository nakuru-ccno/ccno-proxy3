export const config = {
  api: {
    bodyParser: false, // we handle raw streams
  },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const targetUrl = process.env.APPS_SCRIPT_URL; // e.g. your script endpoint

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          ...req.headers,
        },
        body: req,   // forward the raw body
        duplex: "half", // 👈 required for Node 18+ streaming
      });

      const text = await response.text();

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(response.status).send(text);
    } catch (err) {
      console.error("Proxy failed:", err);
      res.status(500).json({ error: "Proxy failed", details: err.message });
    }
    return;
  }

  res.status(405).json({ error: "running" });
}
