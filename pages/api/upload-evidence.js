export const config = {
  api: {
    bodyParser: false, // ✅ disable body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Step 1: Collect the entire incoming body into a Buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    // ✅ Step 2: Forward as Buffer (NOT req stream → prevents duplex error)
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
      {
        method: "POST",
        headers: {
          // copy incoming headers except host/content-length (they break forwarding)
          "content-type": req.headers["content-type"] || "application/octet-stream",
        },
        body: bodyBuffer, // ✅ send buffered body
      }
    );

    // ✅ Step 3: Send Apps Script response back
    const text = await response.text();
    res
      .status(response.status)
      .setHeader("content-type", response.headers.get("content-type") || "text/plain")
      .send(text);

  } catch (err) {
    console.error("Proxy failed:", err);
    return res
      .status(500)
      .json({ error: "Proxy failed", details: err.message || err.toString() });
  }
}
