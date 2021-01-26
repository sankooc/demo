const { parseString } = require('xml2js');
const fs = require('fs');
const _ = require('lodash');
const XLSX = require('xlsx');
const os = require('os');

const createXLSXstream = (sheetName, data, writeStream) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const tmpFile = `${os.tmpdir()}/${Date.now()}.xlsx`;
  XLSX.writeFileSync(wb, tmpFile);
  const clear = () => {
    if(fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  };
  const readStream = fs.createReadStream(tmpFile);
  readStream.pipe(writeStream).on('close', clear).on('error', clear).on('end', clear);
};
const xml = fs.readFileSync('./profile/source.xml');
parseString(xml, (err, result) => {
  if(err) return;
  const data = _.get(result, 'Data.YKFP[0].Row');
  const headers = Object.keys(_.get(data, '[0].$'));
  const items = data.map(d => Object.values(d.$));
  items.unshift(headers);
  const wsteam = fs.createWriteStream('./profile/target.xlsx');
  createXLSXstream('demo', items, wsteam);
});
