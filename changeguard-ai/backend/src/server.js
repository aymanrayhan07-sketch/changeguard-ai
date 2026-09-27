/**
 * ChangeGuard AI – Express Server
 *
 * Starts the API server and mounts all routes.
 * CORS is enabled so the Vite dev server (port 5173) can reach this.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const analyzeRoutes = require('./routes/analyze');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────────────────────────
app.use('/api', analyzeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'changeguard-ai-backend' });
});

// ── Serve Frontend Static Files (Unified Full-Stack Deployment) ───────────────
const possibleDistPaths = [
  path.join(__dirname, '../public'),
  path.join(__dirname, '../../frontend/dist'),
];
const frontendDist = possibleDistPaths.find((p) => fs.existsSync(p));

if (frontendDist) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    // If request was meant for an unknown API endpoint, return 404 JSON
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // 404 fallback
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}

// Start
app.listen(PORT, () => {
  console.log(`ChangeGuard AI backend running on http://localhost:${PORT}`);
});

module.exports = app;
