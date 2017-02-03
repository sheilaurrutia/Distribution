import {utils} from './myUtils'

class Greeter {
    public greeting:string
    constructor(message:string) {
        this.greeting = message
    }
    greet() {
        // if
        return 'Hello,' + this.greeting + ' do sum ' + utils.sum(1, 4)
    }
}


export default Greeter
