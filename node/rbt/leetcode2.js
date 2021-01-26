

// const sum = (n) => {
//   let r = 0;
//   let num = n;
//   do {
//     const mod = num % 10;
//     r += mod;
//     num = Math.floor(num / 10);
//   } while (num > 0);
//   return r;
// };

// const movingCount = function movingCount(m, n, k) {
//   const flags = {};
//   let count = 0;
//   const queue = [];
//   const validate = (x, y) => {
//     if (x >= m) return false;
//     if (y >= n) return false;
//     // console.log(x, y);
//     // queue.push({ i: x, j: y });
//     if ((sum(x) + sum(y)) <= k) {
//       queue.push({ i: x, j: y });
//       return true;
//     }
//     return false;
//   };
//   queue.push({ i: 0, j: 0 });
//   while (queue.length > 0) {
//     const { i, j } = queue.pop();
//     if (flags[`${i}-${j}`]) {
//       //
//     } else {
//       flags[`${i}-${j}`] = true;
//       count += 1;
//       validate(i + 1, j);
//       validate(i, j + 1);
//     }
//   }
//   return count;
// };

// console.log(movingCount(40, 30, 9));

// const generateParenthesis = function t(n) {
//   const map = {
//     0: [],
//     1: ['()'],
//     2: ['()()', '(())'],
//   };
//   const dp = (m) => {
//     for (let x = 3; m >= x; x += 1) {
//       const set = new Set();
//       for (let i = 1; i < x; i += 1) {
//         const lefts = map[i];
//         const rights = map[x - i];
//         for (const l of lefts) {
//           for (const r of rights) {
//             set.add(`${l}${r}`);
//           }
//         }
//       }
//       const sub = map[x - 1];
//       for (const s of sub) {
//         set.add(`(${s})`);
//       }
//       map[x] = set;
//     }
//   };
//   dp(n);
//   return [...map[n]];
// };

// console.log(generateParenthesis(4));



// [,,,,,,,,,,]
// [,,,,,"(())(())",,,,,,]

// const reverseWords = (s) => {
//   const len = s.length;
//   let chs = '';
//   let str = '';
//   for (let i = len - 1; i >= 0; i -= 1) {
//     const ch = s.charAt(i);
//     if (ch === ' ') {
//       if (chs.length) {
//         if (str.length) {
//           str += (' ' + chs);
//         } else {
//           str += chs;
//         }
//       }
//       chs = '';
//       continue;
//     }
//     chs = ch + chs;
//   }

//   if (chs.length) {
//     if (str.length) {
//       str += (' ' + chs);
//     } else {
//       str += chs;
//     }
//   }
//   return str;
// };


// console.dir(reverseWords('  hello world!  '));

// var longestValidParentheses = function(s) {
//   let count = 0;
//   let str = s;
//   do{
//     const inx = str.indexOf('()')
//   }while()
// };
// var longestValidParentheses = function(s) {
//   let stack = [-1], ans = 0;
//   for (let i = 0; i < s.length; i++) {
//       if (s[i] === '(') {
//           stack.push(i)
//       } else {
//           stack.pop();
//           if (stack.length === 0) {
//               stack.push(i)
//           } else {
//               ans = Math.max(ans, i - stack[stack.length - 1])
//           }
//       }
//   }
//   return ans;
// };

// console.log(longestValidParentheses('(())())))((())(((()'));

// const arr = new Array(10);
// arr.fill([]);


// console.dir(arr);
// // Array.fill(arr, []);
// console.log(arr.length);


// var Twitter = function() {
//   this.ralation = {};
//   this.posts = [];
// };

// /**
// * Compose a new tweet. 
// * @param {number} userId 
// * @param {number} tweetId
// * @return {void}
// */
// Twitter.prototype.postTweet = function(userId, tweetId) {
//   this.posts.unshift({ userId, tweetId });
// };

// /**
// * Retrieve the 10 most recent tweet ids in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user herself. Tweets must be ordered from most recent to least recent. 
// * @param {number} userId
// * @return {number[]}
// */
// Twitter.prototype.getNewsFeed = function(userId) {
//   const set = this.ralation[userId];
//   const rs = [];
//   for(const post of this.posts) {
//       const { tweetId } = post;
//       if(post.userId === userId) {
//           rs.push(tweetId);
//           continue;
//       }
//       if(set && set.has(post.userId)){
//           rs.push(tweetId);
//       }
//   }
//   return rs;
// };

// /**
// * Follower follows a followee. If the operation is invalid, it should be a no-op. 
// * @param {number} followerId 
// * @param {number} followeeId
// * @return {void}
// */
// Twitter.prototype.follow = function(followerId, followeeId) {
//   const d = this.ralation[followerId] || new Set();
//   d.add(followeeId);
//   this.ralation[followerId] = d;
// };

// /**
// * Follower unfollows a followee. If the operation is invalid, it should be a no-op. 
// * @param {number} followerId 
// * @param {number} followeeId
// * @return {void}
// */
// Twitter.prototype.unfollow = function(followerId, followeeId) {
//   const d = this.ralation[followerId];
//   if(d) {
//       d.delete(followeeId);
//   }
// };


// const twitter = new Twitter();

// // 用户1发送了一条新推文 (用户id = 1, 推文id = 5).
// twitter.postTweet(1, 5);

// // 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
// console.log(twitter.getNewsFeed(1));

// // 用户1关注了用户2.
// twitter.follow(1, 2);

// // 用户2发送了一个新推文 (推文id = 6).
// twitter.postTweet(2, 6);

// // 用户1的获取推文应当返回一个列表，其中包含两个推文，id分别为 -> [6, 5].
// // 推文id6应当在推文id5之前，因为它是在5之后发送的.
// console.log(twitter.getNewsFeed(1));

// // 用户1取消关注了用户2.
// twitter.unfollow(1, 2);

// // 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
// // 因为用户1已经不再关注用户2.
// twitter.getNewsFeed(1);

// const reset = (val, list, from, to) => {
//   const d = to - from;
//   if (d <= 0) {
//     // console.log('reset1 ', val[0], from, to);
//     return from;
//   }
//   if (d === 1) {
//     // console.log('reset2 ', val[0], from, to);
//     return val.val() > list[to].val() ? to : from;
//   }
//   const h = Math.ceil(d / 2);
//   // console.log('com',h, list[h][0], val[0]);
//   if (list[h].val() > val.val()) {
//     return reset(val, list, from, h);
//   } else {
//     return reset(val, list, h+1, to);
//   }
// };

// // const convert = (ll) => {
// //   let n = ll;
// //   return {
// //     val: () => n.val,
// //     next: () => {
// //       n = n.next;
// //     },
// //   };
// // };
// const convert2 = (ll) => {
//   let inx = 0;
//   return {
//     val: () => ll[inx],
//     next: () => {
//       inx += 1;
//     },
//   };
// };
// const mergeKLists = (lps) => {
//   const lists = lps.map(convert2);
//   lists.sort((a, b) => a.val() - b.val());
//   const rs = [];
//   let second = lists[1].val();
//   // console.log('second:', second);
//   while (true) {
//     if (lists.length === 0) {
//       break;
//     }
//     if (lists.length === 1) {
//       const lll = lists[0];
//       do {
//         rs.push(lll.val());
//         lll.next();
//       } while (lll.val());
//       break;
//     }
//     const head = lists[0];
//     const d = head.val();
//     rs.push(d);
//     head.next();
//     if (!head.val()) {
//       lists.splice(0, 1);
//       if (lists.length > 1) {
//         second = lists[1].val();
//       }
//       continue;
//     }
//     if (head.val() < second) {
//       continue;
//     } else {
//       lists.splice(0, 1);
//       const index = reset(head, lists, 0, lists.length - 1);
//       lists.splice(index + 1, 0, head);
//       second = lists[1].val();
//     }
//   }
//   return rs;
// };


// console.log(mergeKLists([[3,4,5],[1,3,4],[2,6]]));





const reset = (val, list, from, to) => {
  const d = to - from;
  if (d <= 0) {
    // console.log('reset1 ', val[0], from, to);
    return from;
  }
  if (d === 1) {
    // console.log('reset2 ', val[0], from, to);
    return val.val() > list[to].val() ? to : from;
  }
  const h = Math.ceil(d / 2);
  // console.log('com',h, list[h][0], val[0]);
  if (list[h].val() > val.val()) {
    return reset(val, list, from, h);
  } else {
    return reset(val, list, h+1, to);
  }
};
const convert = (ll) => {
  let n = ll;
  return {
    val: () => n.val,
    next: () => {
      n = n.next;
    },
    empty: () => !n, 
  };
};





const ref = () => {
  let head;
  let cur;
  return {
    append: (d) => {
      const dt = {
        val: d.val(),
        next: null,
      };
      if (!head) {
        head = dt;
        cur = dt;
      } else {
        cur.next = dt;
        cur = dt;
      }
    },
    head: () => head,
  };
};

// const convert = (ll) => {
//   let inx = 0;
//   return {
//     val: () => ll[inx],
//     next: () => {
//       inx += 1;
//     },
//     empty: () => !ll[inx],
//   };
// };
// const mergeKLists = function s(lps) {
//   const lists = lps.map(convert);
//   lists.sort((a, b) => a.val() - b.val());
//   const rs = ref();
//   let second;
//   // console.log('second:', second);
//   while (true) {
//     if (lists.length === 0) {
//       break;
//     }
//     if (lists.length === 1) {
//       const lll = lists[0];
//       do {
//         rs.append(lll);
//         lll.next();
//       } while (!lll.empty());
//       break;
//     }
//     second = lists[1].val();
//     const head = lists[0];
//     rs.append(head);
//     head.next();
//     if (head.empty()) {
//       lists.splice(0, 1);
//       continue;
//     }
//     if (head.val() < second) {
//       continue;
//     } else {
//       lists.splice(0, 1);
//       const index = reset(head, lists, 0, lists.length - 1);
//       lists.splice(index + 1, 0, head);
//     }
//   }
//   return rs.head() || null;
// };
// const data = [
//   {
//     val: 3,
//     next: {
//       val: 4,
//       next: {
//         val: 5,
//         next: null,
//       },
//     },
//   },
//   {
//     val: 2,
//     next: null,
//   },
// ]

// const ss = mergeKLists(data);
// let nn = ss;
// console.log(nn);
// do {
//   console.log(nn.val);
//   nn = nn.next;
// }while(!!nn);


// function partition(lists) {
//   switch(lists.length) {
//       case 0:
//           return null;
//       case 1:
//           return lists[0];
//       case 2:
//           return merge2Lists(lists[0], lists[1]);
//       default: 
//           let mid = lists.length >> 1;
//           return merge2Lists(partition(lists.slice(0, mid)), 
//                           partition(lists.slice(mid, lists.length))); 
//   }
// }

// function merge2Lists(l0, l1) {
//   let p0 = l0, 
//       p1 = l1, 
//       c = new ListNode(null),
//       pc = c;
//   while(p0 || p1) {
//       if (p0 && p1) {
//           if(p0.val < p1.val) {
//               pc.next = p0;
//               p0 = p0.next;
//           } else {
//               pc.next = p1;
//               p1 = p1.next;
//           }
//       } else if (p0) {
//           pc.next = p0;
//           break;
//       } else if (p1) {
//           pc.next = p1;
//           break;
//       }
//       pc = pc.next;
//   }
//   return c.next;
// }

// var mergeKLists = function(lists) {
//   return partition(lists);
// };
// console.log(mergeKLists([]))