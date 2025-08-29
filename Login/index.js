const crypto = require('crypto');
const { exec } = require('../shared/sqlUtil');
const { sign } = require('../shared/jwtUtil');
const cors = { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers: cors }; return; }
  const { username, password } = req.body || {};
  if (!username || !password) { context.res = { status: 400, headers: cors, body: 'username and password required' }; return; }
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  try {
    const res = await exec('SELECT username, roles FROM Users WHERE username = ? AND passwordHash = ?', [username, hash]);
    if (!res.recordset.length) { context.res = { status: 401, headers: cors, body: 'Invalid credentials' }; return; }
    const roles = JSON.parse(res.recordset[0].roles || '[]');
    const token = sign({ sub: username, roles });
    context.res = { status: 200, headers: {...cors, 'Content-Type': 'application/json'}, body: JSON.stringify({ token }) };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, headers: cors, body: 'Login failed.' };
  }
};
