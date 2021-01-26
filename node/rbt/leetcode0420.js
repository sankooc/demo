/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable operator-assignment */
// const numIslands = (grid) => {
//   const h = grid.length;
//   if (!h) {
//     return 0;
//   }
//   const w = grid[0].length;
//   const arr = new Array(h);
//   for (let i = 0; i < h; i += 1) {
//     arr[i] = new Array(w);
//   }

//   let cc = 0;
//   const roll = (x, y) => {
//     if (x < 0 || x >= h) {
//       return 0;
//     }
//     if (y < 0 || y >= w) {
//       return 0;
//     }
//     const r = grid[x][y];
//     if (r === '0') {
//       arr[x][y] = 0;
//     } else if (r === '1') {
//       if (arr[x][y] === undefined) {
//         arr[x][y] = 1;
//         roll(x + 1, y);
//         roll(x, y + 1);
//         roll(x - 1, y);
//         roll(x, y - 1);
//         return 1;
//       }
//     }
//     return 0;
//   };
//   for (let x = 0; x < h; x += 1) {
//     for (let y = 0; y < w; y += 1) {
//       if (arr[x][y] === undefined) {
//         const p = roll(x, y);
//         cc += p;
//       }
//     }
//   }
//   return cc;
// };
// // const data = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","1"]];
// const data = [];
// console.log(numIslands(data));

// const maxValue = function adc(grid) {
//   const h = grid.length;
//   if (!h) {
//     return 0;
//   }
//   const w = grid[0].length;
//   if (!w) {
//     return 0;
//   }
//   const dps = [];
//   for (let i = 0; i < h; i += 1) {
//     dps[i] = new Array(w);
//   }
//   dps[0][0] = grid[0][0];
//   const find = (x, y) => {
//     if (x < 0 || y < 0) {
//       return 0;
//     }
//     const v = grid[x][y];
//     const r = dps[x][y];
//     if (r === undefined) {
//       dps[x][y] = Math.max(v + find(x - 1, y), v + find(x, y - 1));
//       return dps[x][y];
//     }
//     return r;
//   };
//   return find(h - 1, w - 1);
// };
// const data = [[1, 3, 1], [1, 5, 1], [4, 2, 1]];
// console.log(maxValue(data));


// const code = (str, inx) => {
//   const c = str.charCodeAt(inx);
//   return c - 97;
// };
// const createMap = () => {
//   const map = new Map();
//   return map;
// };
// const createDigitMap = () => {
//   const map = createMap();
//   const fl = createMap();
//   return {
//     append: (index) => {
//       const v = fl.get(index) || 0;
//       fl.set(index, v + 1);
//     },
//     flush: () => {
//       for (const key of fl.keys()) {
//         const v = map.get(key) || 0;
//         map.set(key, Math.max(v, fl.get(key)));
//       }
//       fl.clear();
//     },
//     create: () => map,
//   };
// };
// const merge = (sts) => {
//   const dpm = createDigitMap();
//   for (const str of sts) {
//     const len = str.length;
//     for (let i = 0; i < len; i += 1) {
//       const c = code(str, i);
//       dpm.append(c);
//     }
//     dpm.flush();
//   }
//   const bmap = dpm.create();
//   console.log(bmap);
// };
// console.log(merge(['loo', 'aco']));

// const fn = (n) => {
//   switch(n) {
//     case 0:
//       return -2;
//     case 1:
//       return 0;
//     case 2:
//     case 3:
//       return 1;
//   }
// };

// var clumsy = function(N) {
//   const mm = [-2, 0, 1, 1];
//   switch(N) {
//     case 1:
//       return 1;
//     case 2:
//       return 2;
//     case 3:
//       return 6;
//     case 4:
//       return 7;
//     default:
//       const e = (N - 3) % 4;
//       return N + 1 + mm[e];
//   }
// };




// const oneEditAway = (first, second) => {
//   if (first === second) {
//     return true;
//   }
//   const len1 = first.length;
//   const len2 = second.length;
//   if (len1 === len2) {
//     let d = 1;
//     for (let i = 0; i < len1; i += 1) {
//       if (first.charCodeAt(i) !== second.charCodeAt(i)) {
//         d -= 1;
//         if (d < 0) return false;
//       }
//     }
//     return true;
//   }
//   if (Math.abs(len1 - len2) > 1) {
//     return false;
//   }
//   let h, l, len;
//   if (len2 > len1) {
//     h = second;
//     l = first;
//     len = len1;
//   } else {
//     h = first;
//     l = second;
//     len = len2;
//   }
//   let d = 0;
//   for (let i = 0; i < len;) {
//     if (h.charCodeAt(i + d) !== l.charCodeAt(i)) {
//       d += 1;
//       if (d > 1) return false;
//     } else {
//       i += 1;
//     }
//   }
//   return true;
// };


// console.log(oneEditAway('abcd', 'abcee'));
// console.log(oneEditAway('abcde', 'bcde'));
// const merge = (dir, file) => {
//   return dir + '/' + file;
// };
// const key = (content) => content;

// const scaner = (dir, file) => {
//   const inx = file.indexOf('(');
//   if (inx >= 0) {
//     const content = file.substring(inx + 1, file.length - 1);
//     const dp = merge(dir, file.substring(0, inx));
//     return { dp, content: key(content) };
//   }
//   const dp = merge(dir, file);
//   return { dp };
// };
// const findDuplicate = function dd(paths) {
//   const map = new Map();
//   for (const path of paths) {
//     const ps = path.split(' ');
//     const dir = ps[0];
//     for (let i = 1; i < ps.length; i += 1) {
//       const file = ps[i];
//       const { dp, content } = scaner(dir, file);
//       if (!map.has(content)) {
//         map.set(content, new Set());
//       }
//       const set = map.get(content);
//       set.add(dp);
//     }
//   }
//   const arry = [];
//   for (const s of map.values()) {
//     if (s.size > 1) {
//       arry.push(Array.from(s));
//     }
//   }
//   return arry;
//   // return Array.from(map.values()).map((ar) => Array.from(ar));
//   // return Array.from(set);
// };

// // const data = ["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd)","root/c/d 4.txt(efgh)","root 4.txt(efgh)"];

// const data = ["root/a 1.txt(abcd) 2.txt(efsfgh)","root/c 3.txt(abdfcd)","root/c/d 4.txt(efggdfh)"];
// console.log(findDuplicate(data));


// nums[left] * nums[i] * nums[right]
// var maxCoins = function(nums) {
//   const ns = Array.from(nums);
//   ns.sort();
//   console.log(nums);
//   console.log(ns);
// };
// const data = [3, 1, 5, 8];
// console.log(maxCoins(data));


// const minimalSteps = function(maze) {

// };

// const data = ["S#O", "M..", "M.T"];

const sampleStats = function ad(count) {
  let min = -1;
  let max = -1;
  let mid = -1;
  let feq = -1;
  let hit = 0;
  let cur = 0;
  let dep = 0;
  let total = 0;
  for (let i = 0; i < count.length; i += 1) {
    if (count[i] > 0) {
      total += count[i];
      if (min < 0) min = i;
      if (i > max) max = i;
      if (count[i] > hit) {
        feq = i;
        hit = count[i];
      }
      
    }
  }
};

const data = [0, 1, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

console.log(sampleStats(data));
