export default function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (or replace * with your domain)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
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
      const { evidenceName, category, subCounty } = req.body;

      return res.status(200).json({
        success: true,
        message: "Evidence received successfully",
        data: { evidenceName, category, subCounty },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
