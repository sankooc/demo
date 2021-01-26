const util = require('util');
const vm = require('vm');

const sandbox = { data: () => {
  console.log('rm');
} };
vm.createContext(sandbox);


const code = `
  const abc = 'aka';
  abc
`;
const a = vm.runInContext(code, sandbox);
console.dir(a);
