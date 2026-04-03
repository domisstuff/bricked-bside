export default function handler(req, res) {
  if (!req.query || !req.query.key) {
    return res.status(400).json({ error: "Missing access key" });
  }

  // Optional security: simple access key check
  if (req.query.key !== "fatbed") {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Return the exported data
  try {
    res.status(200).json({ data: global.savedData || [] });
  } catch (err) {
    res.status(500).json({ error: "No data available" });
  }
}
