import Greeter from './greeter'

var toto = 'tototototo'

export default class User {
  constructor(name){
    this.name = name
  }

  getName() {
    let greeter = new Greeter(this.name)
    return 'User js file is saying ' + greeter.greet() + ' ' + toto
  }
}
