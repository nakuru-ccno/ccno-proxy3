// pages/api/upload-evidence.js
export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Test GET request to confirm proxy is running
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Proxy is running!' });
  }

  // Handle POST request (your upload endpoint)
  if (req.method === 'POST') {
    // For testing, just return fields and dummy file info
    return res.status(200).json({
      message: 'Upload endpoint reached!',
      fields: req.body,
      file: { name: 'dummy.txt', size: 123 },
    });
  }

  // All other methods not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

