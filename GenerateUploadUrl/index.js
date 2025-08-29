const { generateUploadUrl } = require('../shared/sasUtil');
const { requireAuth } = require('../shared/jwtUtil');
const { v4: uuidv4 } = require('uuid');
const cors = { 'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') { context.res = { status: 204, headers: cors }; return; }
  const user = requireAuth(req) || { sub: 'anon' };
  const filename = (req.body && req.body.filename) || (uuidv4() + '.mp4');
  try {
    const url = await generateUploadUrl(filename);
    context.res = { status: 200, headers: {...cors, 'Content-Type': 'application/json'}, body: JSON.stringify({ uploadUrl: url, filename }) };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 500, headers: cors, body: 'Could not generate SAS URL.' };
  }
};
