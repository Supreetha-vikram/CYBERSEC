// ================================
// Project 24 - Backend API (Kali)
// ================================

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------
// 1. Hash Generator
// -------------------------------
app.post("/generate-hash", (req, res) => {

  const fs = require("fs");
  const crypto = require("crypto");

  const password = req.body.password;
  if (!password) {
    return res.status(400).json({ error: "Password cannot be empty" });
  }

  const hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  fs.writeFileSync("hashes.txt", hash + "\n");

  console.log("[+] Hash generated & saved");

  res.json({ hash });
});


// -------------------------------
// 2. Rule File Generator (ROBUST FIX)
// -------------------------------
app.post("/api/save-rules", (req, res) => {
  console.log("[+] /save-rules called with:", req.body);

  let rulesFile = ":\n"; // identity rule always
  const meta = {};

  // CASE 1: rules array
  if (Array.isArray(req.body.rules)) {
    req.body.rules.forEach(rule => {
      rulesFile += rule + "\n";

      if (rule === "c") meta.capitalize = true;
      if (rule === "l") meta.lowercase = true;
      if (rule.startsWith("$")) meta.appendDigits = true;
      if (rule.startsWith("^")) meta.prependDigits = true;
      if (rule === "$2$0$2$4") meta.appendYear = true;
      if (rule.includes("sa") || rule.includes("se")) meta.leetspeak = true;
      if (rule === "r") meta.reverse = true;
      if (rule === "d") meta.duplicate = true;
      if (rule === "t") meta.toggleCase = true;
    });
  }

  // CASE 2: boolean flags
  else {
    if (req.body.capitalize) {
      rulesFile += "c\n";
      meta.capitalize = true;
    }
    if (req.body.lowercase) {
      rulesFile += "l\n";
      meta.lowercase = true;
    }
    if (req.body.appendDigits) {
      rulesFile += "$1\n$2\n$3\n";
      meta.appendDigits = true;
    }
    if (req.body.prependDigits) {
      rulesFile += "^1\n^2\n^3\n";
      meta.prependDigits = true;
    }
    if (req.body.appendYear) {
      rulesFile += "$2$0$2$4\n";
      meta.appendYear = true;
    }
    if (req.body.leetspeak) {
      rulesFile += "sa@\nse3\nsi1\nso0\n";
      meta.leetspeak = true;
    }
    if (req.body.reverse) {
      rulesFile += "r\n";
      meta.reverse = true;
    }
    if (req.body.duplicate) {
      rulesFile += "d\n";
      meta.duplicate = true;
    }
    if (req.body.toggleCase) {
      rulesFile += "t\n";
      meta.toggleCase = true;
    }
  }

  fs.writeFileSync("rules.rule", rulesFile);
  fs.writeFileSync("rules.json", JSON.stringify(meta, null, 2));

  console.log("[+] Rules written to rules.rule");
  console.log(rulesFile);

  res.json({
    message: "Rules saved successfully",
    ruleCount: Object.keys(meta).length
  });
});


// -------------------------------
// 3. Run Hashcat (DICTIONARY SUPPORT ADDED)
// -------------------------------
app.post("/run-hashcat", (req, res) => {
  console.log("[+] /run-hashcat called");

  const { attackType, dictionary } = req.body;

  const attackModes = {
    "MD5": 0,
    "SHA-1": 100,
    "SHA-256": 1400,
    "NTLM": 1000
  };

  const mode = attackModes[attackType] ?? 1400;
  const startTime = Date.now();

  // 🔑 ADDITIVE DICTIONARY FALLBACK (NO LOGIC CHANGE)
  const dictFile =
    dictionary && typeof dictionary === "string" && dictionary.trim()
      ? dictionary
      : "wordlist.txt";

  const cmd = `
    hashcat -m ${mode} hashes.txt ${dictFile} \
    -r rules.rule \
    --outfile=result.txt \
    --potfile-disable \
    --force
  `;

  exec(cmd, () => {
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    fs.writeFileSync("time.txt", timeTaken);

    const rulesMeta = fs.existsSync("rules.json")
      ? JSON.parse(fs.readFileSync("rules.json", "utf-8"))
      : {};

    const ruleCount = Object.values(rulesMeta).filter(Boolean).length;

    const history = fs.existsSync("history.json")
      ? JSON.parse(fs.readFileSync("history.json", "utf-8"))
      : [];

    history.push({
      attackType,
      mode,
      time: Number(timeTaken),
      ruleCount,
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync("history.json", JSON.stringify(history, null, 2));

    console.log("[+] Hashcat finished");

    res.json({
      message: `Attack ${attackType} completed`,
      attackType,
      ruleCount,
      time: timeTaken
    });
  });
});


// -------------------------------
// 4. Fetch Results
// -------------------------------
app.get("/results", (req, res) => {
  if (!fs.existsSync("result.txt")) return res.json([]);

  const time = fs.readFileSync("time.txt", "utf-8");

  const rules = fs.existsSync("rules.json")
    ? JSON.parse(fs.readFileSync("rules.json"))
    : {};

  const history = fs.existsSync("history.json")
    ? JSON.parse(fs.readFileSync("history.json"))
    : [];

  const lastAttack = history[history.length - 1] || {};

  const results = fs.readFileSync("result.txt", "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(line => {
      const [hash, password] = line.split(":");
      return {
        hash,
        password,
        time,
        rules,
        attackType: lastAttack.attackType
      };
    });

  res.json(results);
});


// -------------------------------
app.listen(5000, "0.0.0.0", () => {
  console.log("Backend API running on port 5000");
});
