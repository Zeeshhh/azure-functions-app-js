const { exec } = require('../shared/sqlUtil');
const cors = { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers: cors }; return; }
  const id = context.bindingData.id;
  try {
    const result = await exec('SELECT id, title, description, videoUrl, thumbnailUrl, createdAt FROM Videos WHERE id = ?', [id]);
    const rows = result.recordset;
    if (!rows || rows.length === 0) {
      context.res = { status: 404, headers: cors, body: 'Not found' }; return;
    }
    context.res = { status: 200, headers: {...cors, 'Content-Type': 'application/json'}, body: JSON.stringify(rows[0]) };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, headers: cors, body: 'Database error.' };
  }
};
