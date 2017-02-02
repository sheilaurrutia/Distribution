import * as GreeterModule from './greeter'

export default class User {
  constructor(name){
    this.name = name
  }

  getName() {
    let greeter = new GreeterModule(this.name)
    return 'User js file is saying ' + greeter.greet()
  }
}
