export default async function handler(req, res) {
  // Allow only GET and POST
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "Proxy is running 🚀"
    });
  }

  if (req.method === "POST") {
    try {
      // Parse incoming body
      const { evidenceName, category, subCounty } = req.body;

      if (!evidenceName || !category || !subCounty) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      // 👉 Your actual logic here (Google Drive upload / email)
      // For now just simulate success:
      return res.status(200).json({
        success: true,
        message: "Evidence received successfully",
        data: { evidenceName, category, subCounty }
      });

    } catch (error) {
      console.error("Error in upload-evidence:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Any other method
  return res.status(405).json({
    success: false,
    message: "Method not allowed"
  });
}
