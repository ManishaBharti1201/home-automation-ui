const express = require("express");
const http = require("http");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const {
  getTuyaAccessToken,
  calculateSign,
  getStringToSign,
  CLIENT_ID,
  CLIENT_SECRET,
} = require("./tuyaService");

const STREAM_DIR = path.resolve(__dirname, "streams");
if (!fs.existsSync(STREAM_DIR)) fs.mkdirSync(STREAM_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  "/streams",
  express.static(STREAM_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".m3u8")) {
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      } else if (filePath.endsWith(".ts")) {
        res.setHeader("Content-Type", "video/MP2T");
      }
    },
  }),
);

const ffmpegProcesses = {}; // id -> process

const DEVICE_MAP = {
  eba7ab5c1f6a3c9fabfaox: "Security Camera",
  "04348481600194f74f53": "Garage bulb 2",
  "062025582cf432e12b55": "Garage bulb 1",
  ebace458dfa30f1a28ouzo: "Puja",
  eb82de64788b89910dj0ri: "WIFI报警水浸",
  eb983962fe625a3cecm94t: "fountain",
  eb7808944838719ea1yctc: "Aqua Light",
  ebf7e89f76b6c51114f2ci: "pump",
  ebe9d4b02cca4e57ddhwwv: "Filter",
  eb4a8281458f2a33f0g2tv: "heater",
  ebef989f18f6b4123bmqix: "Aqua light 2",
  eba76027112512d0c4yste: "Garden",
  ebe76b7ca03fe085c2tfum: "Garden 2",
  eb348887c8926694acl2d1: "Garage Door",
  // ebfd63f8defd4c8952ecyt: "Main Door", // u
};

// Allow overriding the external SSE source via environment variables
const EXTERNAL_SSE_URL = process.env.EXTERNAL_SSE_URL || "http://homelab.tail1ccd16.ts.net:8080//sse/devices/updates";

/**
 * Normalizes device status values to a boolean (ON/OFF).
 * Handles: 1/0, true/false, "open"/"closed", "on"/"off"
 */
function normalizeStatus(statusArray) {
  if (!Array.isArray(statusArray) || statusArray.length === 0) return false;

  // Priority: 'switch_1', 'switch', or just the first element
  const mainStatus =
    statusArray.find((s) =>
      /^(switch|control|movement|alarm|led)/i.test(s.code),
    ) || statusArray[0];

  const val = mainStatus.value;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val === 1;

  if (typeof val === "string") {
    const lower = val.toLowerCase();
    return ["true", "1", "open", "on"].includes(lower);
  }

  // Check the legacy representation or shorthand if value is missing
  return String(mainStatus["1"]) === "true" || mainStatus["1"] === true;
}

// SSE Clients
let clients = [];
// Cache to store the last known state of every device
let deviceStateCache = {};

/**
 * Connects to the external SSE source and broadcasts updates to internal clients.
 */
function initExternalSSE() {
  console.log(`[external-sse] Connecting to ${EXTERNAL_SSE_URL}...`);

  const req = http.get(EXTERNAL_SSE_URL, (res) => {
    res.setEncoding("utf8");
    let buffer = "";
    let currentEvent = null;

    res.on("data", (chunk) => {
      console.log(`[external-sse] Received chunk of size: ${chunk.length}`);
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep partial line

      lines.forEach((line) => {
        const trimmed = line.replace("\r", "").trim();
        if (!trimmed) return;

        // console.log(`[external-sse] Processing line: "${trimmed}" (Current event state: ${currentEvent})`);

        if (trimmed.startsWith("event:")) {
          currentEvent = trimmed.split("event:")[1].trim();
          console.log(`[external-sse] Event type set to: ${currentEvent}`);
        } else if (
          trimmed.startsWith("data:") &&
          currentEvent === "device-update"
        ) {
          try {
            const jsonStr = trimmed.split("data:")[1].trim();
            console.log(`[external-sse] Parsing JSON data: ${jsonStr}`);
            
            const payload = JSON.parse(jsonStr);
            const { devId, status, name: incomingName } = payload;

            // Prioritize name from update payload, then from cache, finally fallback to DEVICE_MAP
            const existingCache = deviceStateCache[devId] ? JSON.parse(deviceStateCache[devId]) : null;
            const name = incomingName || (existingCache && existingCache.name) || DEVICE_MAP[devId] || "Unknown Device";
            
            const isOn = normalizeStatus(status);

            // Logical mapping to UI categories
            const isAquarium =
              [
                "eb7808944838719ea1yctc", // Aqua Light
                "ebef989f18f6b4123bmqix", // Aqua light 2
                "ebf7e89f76b6c51114f2ci", // pump
                "ebe9d4b02cca4e57ddhwwv", // Filter
                "eb4a8281458f2a33f0g2tv", // heater
              ].includes(devId);

            const isLivingRoom =
              [
                "062025582cf432e12b55", // Garage bulb 1
                "04348481600194f74f53", // Garage bulb 2
                "eba76027112512d0c4yste", // Garden
                "eba7ab5c1f6a3c9fabfaox", // Security Camera
                "ebe76b7ca03fe085c2tfum", // Garden 2
                "eb348887c8926694acl2d1", // Garage Door
                "ebfd63f8defd4c8952ecyt", // Main Door
              ].includes(devId);

            console.log(
              `[external-sse] Update [${name}]: ${isOn ? "ON" : "OFF"}`,
            );
            const sseData = JSON.stringify({
              devId,
              name,
              status: { value: isOn },
              isOn,
              isLivingRoom,
              isAquarium,
            });
            
            // Update the cache with the latest normalized state
            deviceStateCache[devId] = sseData;
            
            console.log(`[external-sse] Broadcasting to ${clients.length} clients: ${sseData}`);
            clients.forEach((c) => c.res.write(`data: ${sseData}\n\n`));
          } catch (e) {
            console.warn("[external-sse] Parse error:", e.message);
          }
        } else {
          console.log(`[external-sse] Line ignored. Starts with data? ${trimmed.startsWith("data:")}. Event match? ${currentEvent === "device-update"}`);
        }
      });
    });

    res.on("end", () => {
      console.warn("[external-sse] Connection closed. Reconnecting in 10s...");
      setTimeout(initExternalSSE, 10000);
    });
  });

  req.on("error", (err) => {
    console.error("[external-sse] Connection failed:", err.message);
    setTimeout(initExternalSSE, 10000);
  });
}

initExternalSSE();

// SSE Endpoint for device updates
app.get("/api/status-stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // SYNC ON START: Send all currently cached device states to the new client
  console.log(`[gateway] Syncing ${Object.keys(deviceStateCache).length} cached states to new client`);
  Object.values(deviceStateCache).forEach((cachedData) => {
    res.write(`data: ${cachedData}\n\n`);
  });

  const clientId = Date.now();
  clients.push({ id: clientId, res });

  req.on("close", () => {
    clients = clients.filter((c) => c.id !== clientId);
  });
});

/**
 * Health endpoint to validate gateway deployment
 */
app.get("/api/health", (req, res) => {
  console.log(`[gateway] Health check requested at ${new Date().toISOString()}`);
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()) + "s",
    ffmpeg: ffmpegAvailable,
    timestamp: new Date().toISOString()
  });
});

// Check ffmpeg availability
const { spawnSync } = require("child_process");
let ffmpegAvailable = true;
try {
  const ver = spawnSync("ffmpeg", ["-version"]);
  if (ver.error) {
    ffmpegAvailable = false;
    console.warn(
      "ffmpeg not found on PATH. Use Docker image which includes ffmpeg.",
    );
  }
} catch (e) {
  ffmpegAvailable = false;
}

app.post("/api/stream/start", async (req, res) => {
  const { id, streamUrl } = req.body || {};
  if (!id || !streamUrl)
    return res.status(400).json({ error: "id and streamUrl required" });
  if (!ffmpegAvailable)
    return res
      .status(500)
      .json({
        error:
          "ffmpeg not available on server. Run gateway via Docker or install ffmpeg.",
      });
  if (ffmpegProcesses[id]) {
    return res.json({ ok: true, hls: `/streams/${id}/index.m3u8` });
  }

  try {
    startFfmpeg(id, streamUrl);
    return res.json({ ok: true, hls: `/streams/${id}/index.m3u8` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Helper: spawn ffmpeg for given id and input url
function startFfmpeg(id, streamUrl) {
  const outDir = path.join(STREAM_DIR, id);
  try {
    fs.rmSync(outDir, { recursive: true, force: true });
  } catch (e) {}
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "index.m3u8");

  const args = [
    "-rtsp_transport",
    "tcp",
    "-fflags",
    "+genpts+igndts",
    "-avoid_negative_ts",
    "make_zero",
    "-use_wallclock_as_timestamps",
    "1",
    "-i",
    streamUrl,
    "-c:v",
    "copy",
    // normalize audio: encode to AAC LC with a common sample rate so browsers can parse ADTS
    "-c:a",
    "aac",
    "-profile:a",
    "aac_low",
    "-ar",
    "44100",
    "-ac",
    "1",
    "-b:a",
    "64k",
    "-f",
    "hls",
    "-hls_time",
    "2",
    "-hls_list_size",
    "3",
    "-hls_flags",
    "delete_segments+append_list",
    "-hls_segment_filename",
    path.join(outDir, "seg%03d.ts"),
    outPath,
  ];

  const ff = spawn("ffmpeg", args);
  const logPath = path.join(outDir, "ffmpeg.log");
  const logStream = fs.createWriteStream(logPath, { flags: "a" });

  ff.stdout.on("data", (d) => {
    console.log(`[ffmpeg:${id}] ${d.toString()}`);
    logStream.write(`[STDOUT] ${d.toString()}`);
  });
  ff.stderr.on("data", (d) => {
    console.log(`[ffmpeg:${id}] ${d.toString()}`);
    logStream.write(`[STDERR] ${d.toString()}`);
  });
  ff.on("exit", (code, signal) => {
    console.log(`ffmpeg ${id} exit ${code} ${signal}`);
    try {
      logStream.write(`ffmpeg exit ${code} ${signal}\n`);
    } catch (e) {}
    try {
      logStream.end();
    } catch (e) {}
    delete ffmpegProcesses[id];
  });
  ff.on("error", (err) => {
    console.error("ffmpeg spawn error", err);
    try {
      logStream.write(`[ERROR] ${String(err)}\n`);
    } catch (e) {}
    try {
      logStream.end();
    } catch (e) {}
  });

  ffmpegProcesses[id] = ff;
}

// POST /api/stream/start-tuya
// Body: { id, deviceId, client_id?, access_token?, sign?, t?, sign_method?, regionHost? }
// If optional headers aren't provided, environment variables TUYA_CLIENT_ID and TUYA_ACCESS_TOKEN will be used.
const https = require("https");
app.post("/api/stream/start-tuya", async (req, res) => {
  const body = req.body || {};
  const id = body.id || body.deviceId;
  const deviceId = body.deviceId || body.id;
  if (!id || !deviceId)
    return res.status(400).json({ error: "id and deviceId required" });

  try {
    const access_token = await getTuyaAccessToken();
    const t = String(Date.now());
    const sign_method = "HMAC-SHA256";
    const regionHost = process.env.TUYA_HOST || "openapi.tuyaus.com";
    const path = `/v1.0/devices/${deviceId}/stream/actions/allocate`;
    const postData = JSON.stringify({ type: "rtsp" });
    const nonce = "";

    const stringToSign = getStringToSign("POST", path, {}, postData);
    const sign = calculateSign(
      CLIENT_ID,
      t,
      access_token,
      stringToSign,
      CLIENT_SECRET,
      nonce,
    );

    const headers = {
      client_id: CLIENT_ID,
      access_token: access_token,
      sign: sign,
      t: t,
      sign_method: sign_method,
      nonce: nonce,
      stringToSign: "",
      "Content-Type": "application/json",
    };

    // Debug: log computed sign/t and headers so we can compare with Postman
    console.log(
      "[tuya] client_id=",
      CLIENT_ID,
      "access_token=",
      access_token ? "present" : "missing",
      "client_secret_present=",
      !!CLIENT_SECRET,
    );
    console.log("[tuya] t=", t, "sign=", sign);
    console.log("[tuya] postData=", postData, "stringToSign=", stringToSign);

    const opts = {
      hostname: regionHost,
      method: "POST",
      path,
      headers,
    };
    console.log("[tuya] request opts=", opts);

    const reqTuya = https.request(opts, (resp) => {
      let data = "";
      resp.on("data", (chunk) => (data += chunk));
      resp.on("end", () => {
        console.log(
          "[tuya] response status=",
          resp.statusCode,
          "headers=",
          resp.headers,
        );
        console.log("[tuya] response body=", data.toString());
        try {
          const parsed = JSON.parse(data.toString());
          // Try to locate an RTSP URL in common fields
          const result = parsed.result || parsed.data || parsed;
          let streamUrl = null;
          if (result) {
            if (typeof result === "string") streamUrl = result;
            else if (result.stream_url) streamUrl = result.stream_url;
            else if (result.streamUrl) streamUrl = result.streamUrl;
            else if (result.url) streamUrl = result.url;
            else if (result.rtmp_url) streamUrl = result.rtmp_url;
            else if (result.stream) {
              streamUrl =
                result.stream.url ||
                result.stream.stream_url ||
                result.stream.streamUrl;
            }
          }
          if (!streamUrl) {
            console.error(
              "Tuya allocate response did not contain stream URL",
              parsed,
            );
            return res
              .status(500)
              .json({ error: "Tuya response missing stream URL", raw: parsed });
          }

          try {
            startFfmpeg(id, streamUrl);
            return res.json({
              ok: true,
              hls: `/streams/${id}/index.m3u8`,
              streamUrl,
            });
          } catch (err) {
            console.error("failed to start ffmpeg for tuya stream", err);
            return res
              .status(500)
              .json({ error: "failed to start ffmpeg", detail: String(err) });
          }
        } catch (err) {
          console.error("failed to parse tuya response", err, data.toString());
          return res
            .status(500)
            .json({
              error: "invalid tuya response",
              detail: String(err),
              raw: data.toString(),
            });
        }
      });
    });

    reqTuya.on("error", (e) => {
      console.error("tuya request error", e);
      return res
        .status(500)
        .json({ error: "tuya request failed", detail: String(e) });
    });
    reqTuya.write(postData);
    reqTuya.end();
  } catch (err) {
    console.error("Tuya stream start failed:", err.message);
    return res
      .status(500)
      .json({ error: "Tuya Auth or request failed", detail: err.message });
  }
});

app.post("/api/stream/stop", (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "id required" });
  const p = ffmpegProcesses[id];
  if (p) {
    p.kill("SIGINT");
    delete ffmpegProcesses[id];
  }
  return res.json({ ok: true });
});

// Debug helper: compute Tuya sign locally and return details for comparison with Postman
app.post("/api/tuya/sign-debug", (req, res) => {
  const {
    client_id,
    access_token,
    client_secret,
    t: tIn,
    postData: pd,
    deviceId,
  } = req.body || {};
  if (!client_id || !access_token || !client_secret)
    return res
      .status(400)
      .json({ error: "client_id, access_token and client_secret required" });
  const t = tIn || String(Date.now());
  const postData = pd !== undefined ? pd : JSON.stringify({ type: "rtsp" });
  try {
    const crypto = require("crypto");
    const method = "POST";
    const bodyHash = crypto
      .createHash("sha256")
      .update(postData || "")
      .digest("hex");
    const headersStr = "";
    const devicePart = deviceId || "<deviceId>";
    const urlForSign = `/v1.0/devices/${devicePart}/stream/actions/allocate`;
    const signUrl = `${method}\n${bodyHash}\n${headersStr}\n${urlForSign}`;
    const nonce = "";
    const toSign = `${client_id}${access_token}${t}${nonce}${signUrl}`;
    const sign = crypto
      .createHmac("sha256", client_secret)
      .update(toSign)
      .digest("hex")
      .toUpperCase();
    return res.json({ ok: true, t, postData, bodyHash, signUrl, toSign, sign });
  } catch (e) {
    console.error("sign-debug failed", e);
    return res.status(500).json({ error: String(e) });
  }
});

app.get("/api/stream/status/:id", (req, res) => {
  const id = req.params.id;
  res.json({ running: !!ffmpegProcesses[id] });
});

/**
 * Bulk fetch device status and names
 */
app.get("/api/devices/status", async (req, res) => {
  const ids = Object.keys(DEVICE_MAP).join(",");
  console.log(`[gateway] GET /api/devices/status - Requesting status for: ${ids}`);
  try {
    const accessToken = await getTuyaAccessToken();
    const t = String(Date.now());
    const path = "/v1.0/devices";
    const query = { device_ids: ids };
    const stringToSign = getStringToSign("GET", path, query, "");
    const sign = calculateSign(CLIENT_ID, t, accessToken, stringToSign, CLIENT_SECRET, "");

    const opts = {
      hostname: process.env.TUYA_HOST || "openapi.tuyaus.com",
      method: "GET",
      path: `${path}?device_ids=${ids}`,
      headers: {
        client_id: CLIENT_ID,
        access_token: accessToken,
        sign: sign,
        t: t,
        sign_method: "HMAC-SHA256",
      },
    };

    const tuyaReq = https.request(opts, (tuyaRes) => {
      let data = "";
      tuyaRes.on("data", (chunk) => (data += chunk));
      tuyaRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.success) {
            const deviceList = Array.isArray(parsed.result) ? parsed.result : (parsed.result.list || parsed.result.devices || []);
            console.log(`[gateway] Tuya API Success - Retrieved ${deviceList.length} devices`);
            const devices = deviceList.map(dev => {
              const isOn = normalizeStatus(dev.status);
              const isAquarium = [
                "eb7808944838719ea1yctc", "ebef989f18f6b4123bmqix", "ebf7e89f76b6c51114f2ci", 
                "ebe9d4b02cca4e57ddhwwv", "eb4a8281458f2a33f0g2tv"
              ].includes(dev.id);
              const isLivingRoom = [
                "062025582cf432e12b55", "04348481600194f74f53", "eba76027112512d0c4yste", 
                "eba7ab5c1f6a3c9fabfaox", "ebe76b7ca03fe085c2tfum", "eb348887c8926694acl2d1"
              ].includes(dev.id);

              const statePayload = {
                devId: dev.id,
                name: dev.name,
                status: { value: isOn },
                isOn,
                isLivingRoom,
                isAquarium,
              };
              // Prime the gateway cache so SSE clients get this immediately on connect
              deviceStateCache[dev.id] = JSON.stringify(statePayload);
              return statePayload;
            });
            res.json(devices);
          } else {
            console.error(`[gateway] Tuya API Error: ${parsed.msg || 'Unknown error'}`);
            res.status(500).json({ error: parsed.msg, raw: parsed });
          }
        } catch (e) { 
          console.error(`[gateway] Failed to parse Tuya response: ${e.message}`);
          res.status(500).json({ error: "Parse error" }); 
        }
      });
    });
    tuyaReq.on("error", (err) => {
      console.error(`[gateway] Tuya Request failed: ${err.message}`);
      res.status(500).json({ error: err.message });
    });
    tuyaReq.end();
  } catch (err) { 
    console.error(`[gateway] Internal error in /api/devices/status: ${err.message}`);
    res.status(500).json({ error: err.message }); 
  }
});

/**
 * Proxy endpoint to update Tuya device status.
 * Handles signature calculation and authentication internally.
 */
app.post("/api/device/control", async (req, res) => {
  const { deviceId, code, value } = req.body;

  if (!deviceId || !code) {
    return res.status(400).json({ error: "deviceId and code (e.g., 'switch_1') are required" });
  }

  try {
    const accessToken = await getTuyaAccessToken();
    const t = String(Date.now());
    const path = `/v1.0/devices/${deviceId}/commands`;
    const query = { grant_type: "1" };
    
    // Tuya commands expect an array of code/value pairs
    const postData = JSON.stringify({
      commands: [{ code, value: value === "true" || value === true }]
    });

    const stringToSign = getStringToSign("POST", path, query, postData);
    const sign = calculateSign(CLIENT_ID, t, accessToken, stringToSign, CLIENT_SECRET, "");

    const opts = {
      hostname: process.env.TUYA_HOST || "openapi.tuyaus.com",
      method: "POST",
      path: `${path}?grant_type=1`,
      headers: {
        client_id: CLIENT_ID,
        access_token: accessToken,
        sign: sign,
        t: t,
        sign_method: "HMAC-SHA256",
        "Content-Type": "application/json",
      },
    };

    const tuyaReq = https.request(opts, (tuyaRes) => {
      let data = "";
      tuyaRes.on("data", (chunk) => (data += chunk));
      tuyaRes.on("end", () => res.status(tuyaRes.statusCode).send(data));
    });

    tuyaReq.on("error", (err) => res.status(500).json({ error: err.message }));
    tuyaReq.write(postData);
    tuyaReq.end();
  } catch (err) {
    res.status(500).json({ error: "Failed to send command", details: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`gateway listening on ${PORT}`));
