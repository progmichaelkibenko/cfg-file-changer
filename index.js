const fs = require("fs");
var Iconv = require('iconv').Iconv;


const FILE_PATH = process.env.FILE_PATH || "BellPark/ICgraph.cfg";

const ENCODING = process.env.FILE_PATH || 'utf-8';

function decode(content) {
    var iconv = new Iconv('CP1255', 'UTF-8//TRANSLIT//IGNORE');
    var buffer = iconv.convert(content);
    return buffer.toString('utf8');
  };

fs.readFile(FILE_PATH, (err, data) => {
    const formattedData = decode(data);
    fs.writeFileSync('BellPark/ICgraph2.cfg', formattedData)
  
});
