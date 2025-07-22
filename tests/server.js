const http = require('http');
const {handler} = require('../packages/api/print/print');

function lambdaEvent(data) {
  return {
    body: Buffer.from(JSON.stringify(data)).toString('base64'),
    isBase64Encoded: true
  };
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/print') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const event = lambdaEvent(data);
      handler(event, {}, (err, response) => {
        if (err) {
          res.statusCode = 500;
          res.end(String(err));
        } else {
          res.writeHead(response.statusCode || 200, response.headers || {});
          const buf = response.isBase64Encoded ? Buffer.from(response.body, 'base64') : Buffer.from(response.body);
          res.end(buf);
        }
      });
    });
  } else {
    res.statusCode = 404;
    res.end('not found');
  }
});

if (require.main === module) {
  server.listen(3000, () => console.log('Server listening on 3000'));
}

module.exports = server;
