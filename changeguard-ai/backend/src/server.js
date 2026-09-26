/**
 * ChangeGuard AI – Express Server
 *
 * Starts the API server and mounts all routes.
 * CORS is enabled so the Vite dev server (port 5173) can reach this.
 */

const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyze');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'changeguard-ai-backend' });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start
app.listen(PORT, () => {
  console.log(`ChangeGuard AI backend running on http://localhost:${PORT}`);
});

module.exports = app;
