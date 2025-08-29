const sql = require('mssql');

const config = {
  server: process.env.SQL_SERVER,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  options: { encrypt: process.env.SQL_ENCRYPT === 'true' }
};

let poolPromise;

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

async function exec(queryText, params = []) {
  const pool = await getPool();
  const request = pool.request();
  params.forEach((val, i) => request.input('p' + i, val));
  const text = queryText.replace(/\?/g, (_, idx, s) => {
    // replace sequential ? with @p0, @p1, ...
    let count = (s.slice(0, _).match(/\?/g) || []).length; // not used
    return '@p' + (request.parameters ? Object.keys(request.parameters).length - 1 : 0);
  });
  // Simpler: build progressive replacement
  let i = -1;
  const patched = queryText.replace(/\?/g, () => { i += 1; return '@p' + i; });
  return request.query(patched);
}

module.exports = { getPool, exec };
