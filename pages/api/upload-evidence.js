export const config = {
  api: {
    bodyParser: false, // we’ll collect manually
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    // Just return back the size + headers so we know it works
    res.status(200).json({
      message: "Echo successful",
      length: bodyBuffer.length,
      contentType: req.headers["content-type"],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
