/**
 * then 方法中返回一个promise，promise会采用返回的promise的成功的值或失败的原因，传递到外层下一次的then中
 * 1. then方法中 成功的回调或者失败的回调返回的是一个promise，那么会采用返回的promise的状态，走外层下一次的成功或者失败，同时将promise处理之后的结果向下传递
 * 2.then方法中 成功的回调或者失败的回调返回的是一个普通值，这里会将返回的结果传递到下一次的then成功中
 * 3.如果在then方法中  成功的回调或者失败的回调 执行时出错会走到外层下一个then中的失败中去
 */

const PENDING = "PENDING"; // 默认等待状态
const FULFILLED = "FULFILLED"; // 成功状态
const REJECTED = "REJECTED"; // 失败状态

function resolvePromise(x, promise2, resolve, reject) {
  // 1. 如果x是普通值  直接resolve
  // 2. 如果x是 promise那么应该采用这个promise的状态 决定调用的是resolve还是reject
  if (x === promise2) {
    return reject(new TypeError("循环引用"));
  }

  // 连续判断 x 是不是一个promise   promise需要有then方法
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called = false;
    try {
      let x = x.then; // 尝试取then方法
      if (typeof then === "function") {
        // 认为是promise
        then.call(
          x,
          (y) => {
            // y 有可能还是一个promise 所以需要再次执行解析流程
            // resolve(y);
            if (called) return;
            called = true;
            resolvePromise(y, promise2, resolve, reject);
          },
          (r) => {
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  }else{
    // x是普通值
    resolve(x);
  }
}

class Promise {
  constructor(exector) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;

    this.onRejectedCallbacks = [];
    this.onResolveCallbacks = [];

    const resolve = (value) => {
      if(value instanceof Promise){ // 不属于规范，只是为了保证和原生的promise表现形式一样
        return value.then(resolve, reject); 
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        // 调用成功逻辑
        this.onResolveCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      exector(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 参数可选
    onFulfilled = typeof onFulfilled === 'function'? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function'? onRejected : e => { throw e };
    // 每次调用then方法 都会返回一个全新的promise
    let promise2 = new Promise((resolve, reject) => {
      // x 就是上一个then成功或者失败的返回值，这个x决定promise2 走成功还是失败
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            // resolve(x);
            resolvePromise(x, promise2, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if ((this.status = PENDING)) {
        // 发布订阅
        this.onResolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });

        this.onRejectedCallback.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolve(x);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });

    return promise2;
  }

  catch(errFn){
    return this.then(null, errFn);
  }
  
  static resolve(value){
    return new Promise((resolve,reject) => {
      resolve(value);
    });
  }

  static reject(err){
    return new Promise((resolve, reject) => {
      reject(err);
    });
  }
}

Promise.defered = function(){
  let dfd = {};
  dfd.promise = new Promise((resolve,reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;
