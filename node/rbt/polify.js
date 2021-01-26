const bRegister = require('babel-core/register');
const bPExport = require('babel-plugin-add-module-exports');

const bPresetEs2015 = require('babel-preset-es2015-node5');
const bPresetStatge3 = require('babel-preset-stage-3');
const fs = require('fs');

const len = process.argv.length;
if(len < 3) return;
const pfile = `${__dirname}/${process.argv[2]}.js`;
if (fs.existsSync(pfile)) {
  bRegister({
    plugins: [bPExport],
    presets: [bPresetEs2015],
    babelrc: false
  });
  module.require(pfile);
} else {
  console.error('nofile', pfile);
}
// require('./stat2');
