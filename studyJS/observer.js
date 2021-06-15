/**
 * 观察者模式  两个类 1. 观察者 2. 被观察者
 */

// 被观察者
class Subject{
  constructor(name){
    this.name = name;
    this.observers = [];
    this.state = '开心';
  }
  attach(o){
    this.observers.push(o); // 订阅模式
  }
  setState(newState){
    this.state = newState;
    this.observers.forEach(o => o.update(newState))
  }
}

// 观察者
class Observer{
  constructor(name){
    this.name = name;
  }
  update(state){
    console.log(this.name + ':' + '当前状态是' + state);
  }
}

let s = new Subject('宝宝');
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');
s.attach(o1);
s.attach(o2);
s.setState('不开心');
s.setState('开心');
