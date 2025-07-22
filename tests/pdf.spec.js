const { test, expect } = require('@playwright/test');
const fs = require('fs');
const crypto = require('crypto');

const goldenPath = __dirname + '/golden.pdf';
const goldenHash = 'eb17976537bbb06785a084c68709478012a90baefdf89284b9e6759a30caf397';

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

test('generate pdf matches golden', async ({ request }) => {
  const html = fs.readFileSync(__dirname + '/sample.html', 'utf8');
  const response = await request.post('http://localhost:3000/print', {
    data: { html }
  });
  expect(response.ok()).toBeTruthy();
  const buffer = await response.body();
  fs.writeFileSync(__dirname + '/out.pdf', buffer);
  const hash = sha256(buffer);
  expect(hash).toBe(goldenHash);
});
