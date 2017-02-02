import Greeter from './greeter'
import User from './user'
import * as Utils from './myUtils'
import MySupaTemplate from './template.jsx'

let greet = new Greeter('Youplaboum')
console.log(greet.greet())

let user = new User('toto')
console.log(user.getName())

console.log(Utils.utils.sum(1, 1))
