const { exec } = require('../shared/sqlUtil');
const { requireAuth } = require('../shared/jwtUtil');
const cors = { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: cors };
    return;
  }
  if (req.method === 'GET') {
    try {
      const result = await exec('SELECT id, title, description, thumbnailUrl, createdAt FROM Videos ORDER BY createdAt DESC');
      context.res = { status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(result.recordset) };
    } catch (e) {
      context.log.error(e);
      context.res = { status: 500, body: 'Database error while fetching videos.' };
    }
    return;
  }
  if (req.method === 'POST') {
    const user = requireAuth(req);
    if (!user) {
      context.res = { status: 401, headers: cors, body: 'Unauthorized' };
      return;
    }
    const { title, description, videoUrl, thumbnailUrl } = req.body || {};
    if (!title || !videoUrl) {
      context.res = { status: 400, headers: cors, body: 'title and videoUrl required' };
      return;
    }
    try {
      await exec('INSERT INTO Videos (title, description, videoUrl, thumbnailUrl, owner, createdAt) VALUES (?, ?, ?, ?, ?, GETDATE())', [title, description || '', videoUrl, thumbnailUrl || '', user.sub]);
      context.res = { status: 201, headers: cors, body: 'Registered' };
    } catch (e) {
      context.log.error(e);
      context.res = { status: 500, headers: cors, body: 'Failed to register video.' };
    }
    return;
  }
  context.res = { status: 405, headers: cors, body: 'Method Not Allowed' };
};
