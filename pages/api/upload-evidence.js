export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    // Handle CORS preflight
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      // Forward the request to your Apps Script endpoint
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req.body || {}),
          // 👇 required for Node 18+ when body is present
          duplex: "half",
        }
      );

      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        error: "Proxy failed",
        details: err.message,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
