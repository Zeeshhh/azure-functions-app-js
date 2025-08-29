const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'dev-secret';
const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '3600', 10);

function sign(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

function verify(token) {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
}

function requireAuth(req) {
  const h = req.headers['authorization'] || req.headers['Authorization'];
  if (!h) return null;
  const parts = h.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return verify(parts[1]);
  }
  return null;
}

module.exports = { sign, verify, requireAuth };
