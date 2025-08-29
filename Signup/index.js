const crypto = require('crypto');
const { exec } = require('../shared/sqlUtil');
const { sign } = require('../shared/jwtUtil');
const cors = { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers: cors }; return; }
  const { username, password, roles = ['user'] } = req.body || {};
  if (!username || !password) {
    context.res = { status: 400, headers: cors, body: 'username and password required' }; return;
  }
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  try {
    await exec('INSERT INTO Users (username, passwordHash, roles, createdAt) VALUES (?, ?, ?, GETDATE())', [username, hash, JSON.stringify(roles)]);
    const token = sign({ sub: username, roles });
    context.res = { status: 201, headers: {...cors, 'Content-Type': 'application/json'}, body: JSON.stringify({ token }) };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, headers: cors, body: 'Signup failed.' };
  }
};
