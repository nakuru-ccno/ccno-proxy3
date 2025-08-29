export const config = {
  api: {
    bodyParser: false, // disable default body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Collect raw body into Buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    // Forward to Apps Script with duplex: "half"
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
      {
        method: "POST",
        headers: {
          "content-type": req.headers["content-type"] || "application/octet-stream",
        },
        body: bodyBuffer,
        duplex: "half", // 👈 required in Node 18+ when sending a body
      }
    );

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
