
// const mongoose = require('mongoose');
// const statistic = require('../libs/services/statisticService').create();

// (async () => {
//   await statistic.fetch();
//   mongoose.disconnect();
// })();



// const Linter = require("eslint").Linter;
// const linter = new Linter();


// const fs = require('fs');


// // const CLIEngine = require("eslint").CLIEngine;

// // const cli = new CLIEngine({
// //     baseConfig: '.eslintrc',
// //     envs: ["es6", "mocha"],
// //     useEslintrc: true,
// // });

// const content = fs.readFileSync('routes/pages/roles.js').toString();
// const results = linter.verify(content, { envs: ['es6'] });
// console.log(results);
// const messages = linter.verifyAndFix(`
// const a = "d":
// console.log(a);

// `, {

//   fix: true, // difference from last example
//   useEslintrc: true,
//   configFile: __dirname + '../.eslintrc',
// });

// console.log(messages);

// const _ = require('lodash');

// const a = '$item.cast.pan | currency';



const moment = require('moment');



const r = moment('2020-01-09').startOf('day').toDate().getTime();
console.log(r);