// pages/api/upload-evidence.js
export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // For testing, just return fields and dummy file info
    return res.status(200).json({
      message: 'Upload endpoint reached!',
      fields: req.body,
      file: { name: 'dummy.txt', size: 123 },
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
