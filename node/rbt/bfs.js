/* eslint-disable no-underscore-dangle */
const userid = ['A', 'B', 'C', 'D', 'E', 'F'];
const connection = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'E'], ['E', 'F'], ['D', 'F']];

const map = {};
const put = (k, v) => {
  map[k] = map[k] || new Set();
  map[k].add(v);
}

for (const c of connection) {
  put(c[0], c[1]);
  put(c[1], c[0]);
}
const compute = (from, to) => {
  const visited = new Set();
  let next = new Set(from);
  let count = 1;
  while(next.size) {
    const _next = next;
    next = new Set();
    for(const c of _next.values()) {
      visited.add(c);
      const s = map[c];
      if(s.has(to)) return count;
      for(const v of s.values()) {
        if(!visited.has(v)) next.add(v);
      }
    }
    count += 1;
  }
  return 0;
};

console.log(compute('A', 'B'));
