// /pages/api/upload-evidence.js
export const config = {
  api: {
    bodyParser: false, // disable Vercel body parsing
  },
};

function nodeRequestToWebStream(req) {
  return new ReadableStream({
    start(controller) {
      req.on("data", (chunk) => controller.enqueue(chunk));
      req.on("end", () => controller.close());
      req.on("error", (err) => controller.error(err));
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webStream = nodeRequestToWebStream(req);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby7U1ysyohvJYxUy6FIPXEutPFepsOKMSiHrmmyTHErj3een7AxzAT6wfdx3yXgfvihIg/exec",
      {
        method: "POST",
        headers: {
          ...req.headers,
          host: undefined,
        },
        body: webStream,   // ✅ converted body
        duplex: "half",    // ✅ required for streaming
      }
    );

    const contentType = response.headers.get("content-type") || "text/plain";
    const text = await response.text();

    res.setHeader("content-type", contentType);
    return res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy failed:", err);
    return res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
