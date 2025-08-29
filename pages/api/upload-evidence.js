export default function handler(req, res) {
  // ✅ Allow CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://pce.nakurucountychiefnursingofficer.site'); // your frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test response
  res.status(200).json({ message: 'CORS is working!' });
}
