// api/submit.js
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

function pad3(n) {
  return String(n).padStart(3, "0");
}

async function readJsonIfExists(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Vercel parses JSON bodies automatically if Content-Type is application/json
  const body = req.body || {};
  
  const email = normalizeEmail(body.email);
  const teamName = body.team_name ? String(body.team_name).trim() : '';
  const leaderName = body.leader_name ? String(body.leader_name).trim() : '';
  const phone = body.phone ? String(body.phone).trim() : '';
  
  // Basic validation
  if (!email || !teamName || !leaderName || !phone) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields (team_name, leader_name, email, phone).' 
    });
  }

  // In Vercel serverless functions, the file system is read-only except for /tmp.
  // The state will reset frequently. For production, you MUST use a real database (e.g., Vercel KV or Vercel Postgres).
  const bundledCounterPath = path.join(process.cwd(), "api", "_data", "counter.json");
  const bundledSubmissionsPath = path.join(process.cwd(), "api", "_data", "submissions.json");
  
  const runtimeCounterPath = path.join(os.tmpdir(), "invenza-counter.json");
  const runtimeSubmissionsPath = path.join(os.tmpdir(), "invenza-submissions.json");

  // Load submissions
  const submissions =
    (await readJsonIfExists(runtimeSubmissionsPath)) ||
    (await readJsonIfExists(bundledSubmissionsPath)) ||
    { registrations: [] };

  const registrations = Array.isArray(submissions.registrations) ? submissions.registrations : [];
  
  // Check for duplicate email
  const emailExists = registrations.some((r) => normalizeEmail(r && r.email) === email);
  if (emailExists) {
    return res.status(400).json({ success: false, error: 'Email already registered.' });
  }

  // Load current count
  const current =
    (await readJsonIfExists(runtimeCounterPath)) ||
    (await readJsonIfExists(bundledCounterPath)) ||
    { count: 0 };

  const nextCount = (Number(current.count) || 0) + 1;
  const teamID = "INV-" + pad3(nextCount);
  const updated = { count: nextCount };

  // Write counter back
  try {
    await writeJson(runtimeCounterPath, updated);
  } catch (e) {
    console.error('Could not write runtime counter:', e);
  }

  // Save new submission
  const updatedSubmissions = {
    registrations: registrations.concat([{ 
      teamID, 
      email, 
      teamName, 
      leaderName, 
      phone,
      selectedProblem: body.selected_problem || '',
      submittedAt: new Date().toISOString()
    }]),
  };

  try {
    await writeJson(runtimeSubmissionsPath, updatedSubmissions);
  } catch (e) {
    console.error('Could not write runtime submissions:', e);
  }

  return res.status(200).json({
    success: true,
    teamID
  });
};
