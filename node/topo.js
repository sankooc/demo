const topo = (datas, swaper) => {
  const inSet = new Set();
  const map = {};
  const items = datas.map((d) => {
    const { parents, node } = swaper(d);
    map[node] = d;
    return { parents, node };
  });
  const exists = (item) => {
    const { parents, node } = item;
    if(!parents || !parents.length) {
      return true;
    }
    for(const p of parents) {
      if(!inSet.has(p)) {
        return false;
      }
    }
    return true;
  };
  while(items.length) {
    const size = inSet.size;
    for(let i = 0; i < items.length;) {
      const item = items[i];
      const { node } = item;
      if(exists(item)) {
        inSet.add(node);
        items.splice(i, 1);
      } else {
        i += 1;
      }
    }
    if(size === inSet.size) {
      const errMsg = `dep_error in ${items.map(it => it.node)}`;
      return { success: false, errMsg };
    }
  }
  return { success: true, sorts: [...inSet.values()].map(n => map[n]) };
};


// const rs = topo([{ node: '0', parents: [] }, { node: '1', parents: ['0'] }, { node: '2', parents: ['3'] }, { parents: ['1'], node: '3' }], (d) => d);
const rs = topo([]);
console.log(rs);