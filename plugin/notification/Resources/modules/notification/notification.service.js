export default class NotificationService{

	constructor($http){
		this.$http = $http
		this._types = NotificationService._getGlobal('types')
		this._types.forEach(t => {
			t['translated_group'] = Translator.trans(t['group'],{},'resource')
			t['translated_group'] = Translator.trans(t['translated_group'],{},'notification')
			
		})

	}

	getTypes(){
		return this._types
	}


	static _getGlobal (name) {
    if (typeof window[name] === 'undefined') {
      throw new Error(
        `Expected ${name} to be exposed in a window.${name} variable`
      )
    }
    return window[name]
  }

}