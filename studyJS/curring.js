/**
 * 函数柯里化
 */
// 如果一个函数有多个参数，我们可以根据参数的个数 转化成n个函数， 柯里化我们认为参数是一个一个传递的

function isType(val, type){
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

// function isType(type){
//   return function(val){
//     return Object.prototype.toString.call(val) === `[object ${type}]`;
//   }
// }

let isString = curring(isType)('String');
console.log('123456');


// 实现一个通用的柯里化函数
function curring(fn){
  let args = []; // 记录参数的个数

  const inner = (arr = []) => {
    args.push(...arr);
    return args.length >= fn.length? fn(...args) : (...args) => inner(args)
  };
  return inner();
}