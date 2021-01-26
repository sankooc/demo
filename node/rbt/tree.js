const root = {
  val: 0,
  left: {
    val: 1,
    left: { val: 8, left: { val: 9 } },
    right: { val: 10 },
  },
  right: {
    val: 2,
    left: {
      val: 4,
      left: { val: 5 },
      right: { val: 6 },
    },
    right: { val: 7 },
  },
};


const forward = (node) => {
  const ss = [];
  const { val } = node;
  if (node.left) ss.push(forward(node.left));
  if (node.right) ss.push(forward(node.right));
  ss.push(val);
  return ss.join(',');
};


console.log(forward(root));


const looptree = (node) => {
  const stack = [node];
  const ss = [];
  while (stack.length) {
    const cur = stack[0];
    if (!cur.left && !cur.right) {
      ss.push(cur.val);
      stack.shift();
      continue;
    }
    if (cur.visit) {
      ss.push(cur.val);
      stack.shift();
      continue;
    }

    if (cur.right) {
      stack.unshift(cur.right);
      cur.visit = true;
    }
    if (cur.left) {
      stack.unshift(cur.left);
      cur.visit = true;
    }
  }
  return ss.join(',');
};

console.log(looptree(root));
