/**
 * 发布订阅模式
 */
class myEventEmiter {
  constructor(){
    // eventMap 用于存储事件和监听函数之间的关系
    this.eventMap = {};
  }
  /**
   * 订阅
   * @param {string} type 事件名称
   * @param {function} handler 执行函数
   */
  onEvent(type,handler){
    if(typeof handler !== 'function'){
      throw new Error('handler not a function!');
    }
    // 判断 type 事件的队列是否已经存在
    if(type in this.eventMap){
      this.eventMap[type].push(handler);
    }
    // 不存在type 事件队列则新建队列
    this.eventMap[type] = [];
  }
  // 发布
  emitEvent(type, params){
    if(type in this.eventMap){
      // 将type事件队列中的handler执行出队列
      this.eventMap[type].forEach(handler => {
        handler(params);
      });
    }
  }
  // 取消订阅
  offEvent(type,handler){
    if(this.eventMap[type]){
      // 无符号位移是为了防止传入一个不存在的函数 引起误删
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler) >>> 0, 1);
    }
  }
}