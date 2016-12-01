export default class NotificationService{

	constructor($http){
		this.$http = $http
		this._types = NotificationService._getGlobal('types')
		this._displayEnabledTypes = NotificationService._getGlobal('displayEnabledTypes')
		this._phoneEnabledTypes = NotificationService._getGlobal('phoneEnabledTypes')
		this._mailEnabledTypes = NotificationService._getGlobal('mailEnabledTypes')
		this._rssEnabledTypes = NotificationService._getGlobal('rssEnabledTypes')

		this._parameters = {}
		this._parameters["displayEnabledTypes"] = this._displayEnabledTypes
		this._parameters["phoneEnabledTypes"] = this._phoneEnabledTypes
		this._parameters["mailEnabledTypes"] = this._mailEnabledTypes
		this._parameters["rssEnabledTypes"] = this._rssEnabledTypes


		this._types.forEach(t => {
			t['translated_group'] = Translator.trans(t['group'],{},'resource')
			t['translated_group'] = Translator.trans(t['translated_group'],{},'notification')	
		})

		this._success = false




	}

	getTypes(){
		return this._types
	}

	isEditable(){
		return this._isEditable
	}

	getHttp(){
		return this.$http
	}

	getDisplayEnabledTypes(){
		return this._parameters["displayEnabledTypes"]
	}

	getPhoneEnabledTypes(){
		return this._parameters["phoneEnabledTypes"]
	}

	getMailEnabledTypes(){
		return this._parameters["mailEnabledTypes"]
	}

	getRssEnabledTypes(){
		return this._parameters["rssEnabledTypes"]
	}


	getParameters(){
		return this._parameters
	}

	isSuccess(){
		return this._success
	}

	
	

	saveParameters(originalParameters, newDisplay, newPhone, newMail, newRss){
		

		const originalDisplay = originalParameters.displayEnabledTypes
		const originalPhone = originalParameters.phoneEnabledTypes
		const originalMail = originalParameters.mailEnabledTypes
		const originalRss = originalParameters.rssEnabledTypes


		const url = Routing.generate('icap_notification_save_user_parameters')



		originalParameters.displayEnabledTypes = newDisplay
		originalParameters.phoneEnabledTypes = newPhone
		originalParameters.mailEnabledTypes = newMail
		originalParameters.rssEnabledTypes = newRss

		
		
		this.$http
		.put(url,{display : newDisplay, phone : newPhone, mail : newMail, rss : newRss })
		.then(()=>{

				originalParameters.displayEnabledTypes = originalDisplay
				originalParameters.phoneEnabledTypes = originalPhone
				originalParameters.mailEnabledTypes = originalMail
				originalParameters.rssEnabledTypes = originalRss
			
			
		})

	}

	createRssFeed(){
		const url = Routing.generate('icap_notification_regenerate_rss_url')
		this.$http
		.post(url)
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