
const _strCode = () => {
  const MASK = 0xfffffffff;
  const OFFSET = 0x1f;
  let code = 0;
  const ll = str.length
  for (let i = 0 ; i< ll ;i += 1) {
    const c = str.charCodeAt(i);
    code = (OFFSET * code + c) & MASK
  }
  return code;
}
const javahash = (str) => {
  const type = typeof str;
  switch (type) {
    case 'string':
      return _strCode(str);
    case 'boolean':
      return +str
    case 'number':
        return _strCode(str+'');
    case 'undefined':
    case 'object':
  }
  return 0;
}

