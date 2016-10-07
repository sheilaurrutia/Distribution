function SecondsToHmsFilter (){
  return function(d) {
    d = Number(d)
    let result = ''
    if (d > 0) {

      let hours = Math.floor(d / 3600)
      let minutes = Math.floor(d % 3600 / 60)
      let seconds = Math.floor(d % 3600 % 60)

      // get ms
      let str = d.toString()
      let substr = str.split('.')
      const ms = substr.length > 1 ? substr[1].substring(0, 2): '00'

      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      result = hours + ':' + minutes + ':' + seconds + ':' + ms
    }
    else {
      result = '00:00:00:00'
    }
    return result
  }
}

export default SecondsToHmsFilter
