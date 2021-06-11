/**
 * Some common methods for arrays
 */

/**
 *
 * @param {Array} arr
 * @param {String} key  filter key
 * @returns  new array
 */
const uniqueArray = (arr, key) => {
  if (arr.length < 2) return;
  // sort array by key
  const tempArr = mergeSort(arr, key);
  // 快慢指针
  let [left, right] = [0, 1];
  while (right < tempArr.length) {
    if (tempArr[left][key] === tempArr[right][key]) {
      right++;
    } else {
      tempArr[left + 1] = tempArr[right];
      left++;
      right++;
    }
  }
  return tempArr.slice(0, left + 1);
};

/**
 *
 * @param {Array} arr target array
 * @param {String} key sort for key
 * @returns new array
 */
const mergeSort = (arr, key) => {
  // 递归分治
  const len = arr.length;
  if (len <= 1) return arr;
  const num = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, num), key);
  const right = mergeSort(arr.slice(num, arr.length), key);
  return merge(left, right, key);
  // 合并子数组
  function merge(left, right, key) {
    let [l, r, result] = [0, 0, []];
    while (l < left.length && r < right.length) {
      if (left[l][key] < right[r][key]) {
        result.push(left[l]);
        l++;
      } else {
        result.push(right[r]);
        r++;
      }
    }
    result = result.concat(left.slice(l, left.length));
    result = result.concat(right.slice(r, right.length));
    return result;
  }
};

// console.log(mergeSort([1,8,9,12,13,2,10,16]));

const arr = [
  {
    name: "张三",
    age: 12,
  },
  {
    name: "王三",
    age: 13,
  },
  {
    name: "李三",
    age: 12,
  },
  {
    name: "唐三",
    age: 18,
  },
];
// console.log(mergeSort(arr, "age"));
console.log(uniqueArray(arr, "age"));
