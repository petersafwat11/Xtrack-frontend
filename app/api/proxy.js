import axios from "axios";

export default async function handler(req, res) {
  try {
    const { path, ...query } = req.query;
    if (!path) return res.status(400).json({ error: "Path is required" });

    // Construct the full API URL
    const baseUrl = "http://178.128.210.208:8000";
    const apiUrl = `${baseUrl}/${path}?${new URLSearchParams(query)}`;

    console.log("Proxying request to:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: { "Accept": "application/json" },
      timeout: 90000,
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
