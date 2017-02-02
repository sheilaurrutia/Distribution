/*export const utils = {}

utils.sum = (a, b) => {
  return a + b
}
*/


import MySupaTemplate from './template.jsx'
import Greeter from './greeter'

export const utils = {
  sum(a:number, b){
    return a + b
  },

  say(name) {
    let greeter = new Greeter(name)
    greeter.greet()
  }
}
