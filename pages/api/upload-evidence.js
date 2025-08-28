import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

const MAIN_FOLDER_ID = '1xdKb5lx75qDl4LVJr3kjOL1GjGBbVySK';
const ADMIN_EMAIL = 'tiongikevin99@gmail.com';

const folderMap = {
  "C14 ANC (Antenatal Care)": "1DvwJPebOAA65grvLTNz_EZBkMpBrsDTE",
  "C15 POSTNATAL CARE": "1H8rncMWbQJmwzn_p3hJfscvXZxWRtOfd",
  "C16 MPDSR (Maternal and Perinatal Death Surveillance and Response)": "1QxYCth8KlD5-fY2HWQoSoF56cIsXlrIA",
  "C17 FAMILY PLANNING": "1J3V-edcjEZoPXiVqXeX675TbAfDznN54",
  "C18 IMMUNIZATION": "1WIg4PXq8VaIcd9Q709ykfNp-RD3lHyMo",
  "C21 HIV SERVICES": "11DghoXp77YTtJLksehpaXSpmCxYIM1As",
  "C23 BURDEN OF CANCER REDUCED": "1Vo-9ipQ9QFtRrT7wK9lPuYqAcb4zFaTt",
  "C27 SUPPORT SUPERVISION": "1JN9Bgw5ib4Hv6Cfdu1K9UGCu66BKonxR",
  "C02 Referral System Improved": "1vgit8e1FAAoPkRtdOgnjDgZgPOOglGTC",
  "C04 Operationalization of Health Facilities to Better Services": "1AkHQC6HAlb3fieO54eEdwW7gH1hUWRT_",
  "C10 Theater Services Improved": "1nvYC8arEuyjPu4uaS01FRKdT7Ifn1Ham",
  "C11 In-Patient Services Improved": "1GSXAThoQImrZPoiCEMNmhYZQ_22Zk9R6"
};

export const config = {
  api: {
    bodyParser: false, // Let formidable handle multipart
  },
};

export default async function handler(req, res) {
  // -------------------
  // CORS headers
  // -------------------
  res.setHeader('Access-Control-Allow-Origin', 'https://pce.nakurucountychiefnursingofficer.site'); 
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // -------------------
    // Parse multipart form
    // -------------------
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      const evidenceName = fields.evidenceName || '';
      const category = fields.category || '';
      const subCounty = fields.subCounty || '';

      if (!evidenceName || !category || !subCounty) {
        return res.status(400).json({ success: false, message: 'Missing evidenceName, category, or subCounty' });
      }

      // -------------------
      // Handle folder (simulate Google Drive folder map)
      // -------------------
      const categoryFolderId = folderMap[category] || MAIN_FOLDER_ID;
      // In Vercel Node.js, you would normally proxy to Google Drive API here
      // We'll just simulate a saved file for testing
      const savedFiles = [];
      if (files && Object.keys(files).length > 0) {
        for (let key in files) {
          const file = files[key];
          savedFiles.push({
            name: `${evidenceName} – ${file.originalFilename}`,
            type: file.mimetype,
            size: file.size,
          });
        }
      }

      // -------------------
      // Send back success
      // -------------------
      return res.status(200).json({
        success: true,
        message: 'Files processed successfully',
        evidenceName,
        category,
        subCounty,
        files: savedFiles
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
