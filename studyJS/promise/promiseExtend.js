const Promise = require("./promise");

Promise.all = function(promises){
  return new Promise((resolve,reject) => {
    // 将数组中的promises依次执行
    let result = [];
    let index = 0;
    function process(v,k){
      result[k] = v;
      if(++index === promises.length){
        resolve(result);
      }
    }
    for (let i = 0; i < promises.length; i++) {
      const el = promises[i];
      if(el && typeof el.then === 'function'){
        el.then(data => { // 异步
          process(data,i);
        },reject);
      }else{ // 同步
        process(el,i);
      }
    }
  })
}

/**
 * finally  无论成功或者失败都会执行
 */
Promise.prototype.finally = function(cb){
  return this.then(y => {
    return Promise.resolve(cb()).then((d) => y);
  },(r) => {
    return Promise.resolve(cb()).then(() => {throw r});
  })
}