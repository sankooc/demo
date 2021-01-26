/* eslint-disable func-names */
/* eslint-disable no-var */

var isValidBST = function (root) {
  if (!root) return true;
  const MAX = Number.MAX_VALUE;
  const MIN = -Number.MAX_VALUE;
  const queue = [];
  queue.push({ max: MAX, min: MIN, node: root });
  while (queue.length > 0) {
    const { max, min, node } = queue.shift();
    const { val, left, right } = node;
    if (val <= min || val >= max) {
      return false;
    }
    if (left) {
      if (left.val < val) {
        queue.push({ node: left, min, max: val });
      } else {
        return false;
      }
    }
    if (right) {
      if (right.val > val) {
        queue.push({ node: right, min: val, max });
      } else {
        return false;
      }
    }
  }
  return true;
};

// const data = {
//   val: 10,
//   left: {
//     val: 5,
//   },
//   right: {
//     val: 15,
//     left: {
//       val: 14,
//     },
//     right: {
//       val: 20,
//     },
//   },
// };
// const data = {
//   val: 3,
//   left: {
//     val: 1,
//     left: { val: 0 },
//     right: { val: 2, right: { val: 3 } },
//   },
//   right: {
//     val: 5,
//     left: {
//       val: 4,
//     },
//     right: {
//       val: 6,
//     },
//   },
// };
// console.log(isValidBST(data));

//[10,5,15,null,null,6,20]
//[3,1,5,0,2,4,6,null,null,null,3]

// var inorderSuccessor = function(root, p) {
//   if (!root) return null;
//   const stack = [root];

//   const mimi = (node) => {
//     let cur = node;
//     while (true) {
//       if (!cur.left) return cur;
//       cur = cur.left;
//     }
//   };
//   const prev = () => {
//     const node = stack.shift();
//     // if (node.right) return mimi(node.right);
//     if (!stack.length) return null;
//     const parent = stack[0];
//     if (parent.left === node) {
//       return parent;
//     }
//     return prev();
//   };
//   while (true) {
//     const cur = stack[0];
//     const { val } = cur;
//     if (p.val === val) {
//       if (cur.right) return mimi(node.right);
//       return prev(cur);
//     }
//     if (p.val > val) {
//       if (!cur.right) return null;
//       stack.unshift(cur.right);
//       continue;
//     }
//     if (p.val < val) {
//       if (!cur.left) return null;
//       stack.unshift(cur.left);
//       continue;
//     }
//   }
// };

// // [5,3,6,2,4,null,null,1]
// // 
// const data = {
//   val: 5,
//   left:
//     {
//      val: 3,
//      left:  { val: 2, left: { val: 1 }, right: null },
//      right:  { val: 4, left: null, right: null } },
//   right:  { val: 6, left: null, right: null } };

// const p = { val: 6, left: null, right: null }
// // console.log(inorderSuccessor(data, p));

// var lowestCommonAncestor = function(root, p, q) {
//   let n;
//   const dpf = (node) => {
//     let t = 0;
//     if (node.val === p.val) t |= 1;
//     if (node.val === q.val) t |= 2;
//     if (node.left) {
//       const v = dpf(node.left);
//       t |= v;
//       if (t === 3) {
//         if (n) return 3;
//         n = node;
//         return 3;
//       }
//     }
//     if (node.right) {
//       const v = dpf(node.right);
//       t |= v;
//       if (t === 3) {
//         if (n) return 3;
//         n = node;
//         return 3;
//       }
//     }
//     return t;
//   };

//   dpf(root);
//   return n;
// };

var recoverFromPreorder = function(S) {
  let list = [];
  const append = (v) => {
    const lst = list[list.length - 1];
    if (!lst.left) {
      lst.left = v;
    } else if (!lst.right) {
      lst.right = v;
    }
    list.push(v);
  };
  for (let i = 0; i < S.length;) {
    let val = '';
    let count = 0;
    for (;i < S.length;) {
      const c = S.charAt(i);
      i += 1;
      if (c === '-') {
        count += 1;
      } else {
        val += c;
        if (S.charAt(i) === '-') {
          break;
        }
      }
    }
    val = parseInt(val, 10);

    // console.log(val, count, list.length);
    if (!count) {
      list.push({ val, left: null, right: null });
      continue;
    }
    // const rt = list[0];
    if (count === list.length) {
      append({ val, left: null, right: null });
      continue;
    }
    if (count < list.length) {
      list = list.slice(0, count);
      append({ val, left: null, right: null });
      continue;
    }
  }
  return list[0];
};


// console.dir(recoverFromPreorder("1-2--3---4-5--6---7"));


// var isValidBST = function(root) {
//   const rc = (node, min, max) => {
//     if (!node) return true;
//     const { val } = node;
//     if (val >= max || val <= min) return false;
//     return rc(node.left, min, val) && rc(node.right, val, max);
//   };
//   return rc(root, -Number.MAX_VALUE, Number.MAX_VALUE);
// };


var minJump = function(jump) {
  const dp = new Array(jump.length);
  dp.fill(Number.MAX_VALUE);
  const len = jump.length;
  const rev = (pos, weight, out) => {
    if (pos === 0) return;
    for (let i = len - 1; i >= 0; i -= 1) {
      if (dp[i] <= weight) continue;
      if (i === pos) continue;
      const v = jump[i];
      if (out) {
        if ((i + v) >= pos) {
          dp[i] = Math.min(dp[i], weight);
          rev(i, weight + 1, false);
        }
      } else if ((i + v) === pos) {
        dp[i] = Math.min(dp[i], weight);
        rev(i, weight + 1, false);
      } else if ((i - v) === pos) {
        dp[i] = Math.min(dp[i], weight);
        rev(i, weight + 1, false);
      }
    }
  };
  rev(len, 1, true);
  // console.log(jump);
  // console.log(dp);
  return dp[0];
};
console.log(minJump([3,7,6,1,4,3,7,8,1,2,8,5,9,8,3,2,7,5,1,1]));

// console.log(Number.MAX_VALUE === Number.MAX_VALUE);
