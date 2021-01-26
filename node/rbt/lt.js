const nums = [2, 2, 1, 1, 5, 3, 3, 5];
const s = new Set(nums);
// for(const n of nums){
//   s.add(n);
// }
console.log(...s);
// console.log(nums.toString());



class Solution {
  const int maxn = 1e5 +100;
  map<int,int>m;
  int ans = 0;
public:
  int maxEqualFreq(vector<int>& nums) {
      int number[maxn], cnt = 0;
      memset(number, 0, sizeof number);
      for (auto n : nums)
      {
          cnt++;
          int x = number[n];
          if (m.count(x))
          {
              if (m[x])m[x]--;
              if (!m[x]) m.erase(x);
          }
          number[n]++;
          m[number[n]]++;

          if (m.size() > 2)continue;
          vector<int> v;
          for (auto it : m) v.push_back(it.first);
          for (auto x : v)
          {
              auto m1 = m;
              m1[x]--; m1[x - 1]++;
              if (m1[x] == 0)m1.erase(x);
              if (m1.size() == 1 || m1.size() == 2 && m1.count(0))
                  ans = max(ans, cnt);
          }
      }
      return ans;
  }
};