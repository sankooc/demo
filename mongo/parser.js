const readline = require('readline');
const fs = require('fs');

const stream = fs.createReadStream(__dirname +'/connet.cap');

const rl = readline.createInterface({
  input: stream,
  output: process.stdout
});
