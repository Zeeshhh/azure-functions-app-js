const { exec } = require('../shared/sqlUtil');
const { requireAuth } = require('../shared/jwtUtil');
const cors = { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers: cors }; return; }
  const id = context.bindingData.id;
  if (req.method === 'GET') {
    try {
      const res = await exec('SELECT id, videoId, author, text, createdAt FROM Comments WHERE videoId = ? ORDER BY createdAt DESC', [id]);
      context.res = { status: 200, headers: {...cors, 'Content-Type': 'application/json'}, body: JSON.stringify(res.recordset) };
    } catch (e) {
      context.log.error(e);
      context.res = { status: 500, headers: cors, body: 'Failed to load comments.' };
    }
    return;
  }
  if (req.method === 'POST') {
    const user = requireAuth(req);
    if (!user) { context.res = { status: 401, headers: cors, body: 'Unauthorized' }; return; }
    const { text } = req.body || {};
    if (!text) { context.res = { status: 400, headers: cors, body: 'text required' }; return; }
    try {
      await exec('INSERT INTO Comments (videoId, author, text, createdAt) VALUES (?, ?, ?, GETDATE())', [id, user.sub, text]);
      context.res = { status: 201, headers: cors, body: 'Created' };
    } catch (e) {
      context.log.error(e);
      context.res = { status: 500, headers: cors, body: 'Failed to add comment.' };
    }
    return;
  }
  context.res = { status: 405, headers: cors, body: 'Method not allowed' };
};
