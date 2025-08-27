export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Change * to your domain later
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Proxy is running 🚀",
    });
  }

  if (req.method === "POST") {
    try {
      // ✅ Parse body safely
      let body = req.body;
      if (typeof body === "string") {
        body = JSON.parse(body);
      }

      const { evidenceName, category, subCounty } = body;

      if (!evidenceName || !category || !subCounty) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Evidence received successfully",
        data: { evidenceName, category, subCounty },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON",
        error: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
