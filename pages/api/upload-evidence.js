export const config = {
  api: {
    bodyParser: false, // ❌ turn off body parser so we can forward the raw stream
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": req.headers["content-type"], // 👈 forward same type
          },
          body: req, // 👈 forward raw request stream
          duplex: "half", // 👈 required for streaming body
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

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
