export const config = {
  api: {
    bodyParser: false, // must disable body parsing
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      // Collect raw body into a buffer
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const bodyBuffer = Buffer.concat(chunks);

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": req.headers["content-type"], // forward same type
          },
          body: bodyBuffer, // send collected buffer
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      return res.status(response.status).json(data);
    } catch (err) {
      return res.status(500).json({
        error: "Proxy failed",
        details: err.message,
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
