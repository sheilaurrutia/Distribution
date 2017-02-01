import * as toto from './utils'

class Greeter {
    public greeting: string
    constructor(message: string) {
        this.greeting = message
    }
    greet() {
        return 'Hello,' + toto.utils.your + ' ' + this.greeting + ' understood you fucker?!?'
    }
}


export {Greeter}
