
const Nil = 'n';

exports.serialize = function(root) {
  const arr = [];
  const stack = [root];
  let lst;
  while (stack.length) {
    const node = stack.shift();
    if (!node) {
      arr.push(Nil);
      continue;
    }
    lst = node;
    const { val } = node;
    // console.log('---', val);
    arr.push(val);
    stack.push(node.left);
    stack.push(node.right);
  }
  return arr.join(',');
};


/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
const create = (val) => ({ val: parseInt(val, 10), left: null, right: null });

var deserialize = function(data) {
  const arr = data.split(',');
  const root = create(arr[0]);
  const stack = [root];
  const toNode = (inx) => {
    const c = arr[inx];
    if(c === Nil) {
      return null;
    } else {
      const n = create(c);
      stack.push(n);
      return n;
    }
  };
  let cur = 0;
  while(stack.length) {
    const node = stack.shift();
    node.left = toNode(cur * 2 + 1);
    node.right = toNode(cur * 2 + 2);
    cur += 1;
  }
  return root;
};


const data = {
  val: 3,
  left: {
    val: 1,
    left: { val: 0 },
    right: { val: 2, right: { val: 3 } },
  },
  right: {
    val: 5,
    left: {
      val: 4,
    },
    right: {
      val: 6,
    },
  },
};
console.log(exports.serialize(data));
// console.log(deserialize('3,1,5,0,n,n,2,n,4,n,n,6,n,n,3,n,n'));
