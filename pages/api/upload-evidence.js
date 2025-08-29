export const config = {
  api: {
    bodyParser: false, // disable body parsing, we handle it
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", (err) => reject(err));
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const bodyBuffer = await getRawBody(req);

      const response = await fetch(process.env.APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": req.headers["content-type"], // forward the content type
        },
        body: bodyBuffer,
        duplex: "half", // 👈 required for Node >=18
      });

      const text = await response.text();
      return res.status(response.status).send(text);
    } catch (err) {
      console.error("Proxy failed:", err);
      return res
        .status(500)
        .json({ error: "Proxy failed", details: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
