export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://pce.nakurucountychiefnursingofficer.site");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  return res.status(200).json({ success: true, message: "CORS working!" });
}

