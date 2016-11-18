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

		this._id = NotificationService._getGlobal('id')
		this._userId = NotificationService._getGlobal('userId')
	
		this._types.forEach(t => {
			t['translated_group'] = Translator.trans(t['group'],{},'resource')
			t['translated_group'] = Translator.trans(t['translated_group'],{},'notification')	
		})


	}

	getTypes(){
		return this._types
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

	getId(){
		return this._id
	}

	getUserId(){
		return this._userId
	}

	getParameters(){
		return this._parameters
	}

	saveParameters(originalParameters, newDisplay, newPhone, newMail, newRss){
		
		//if there are no edits
		if (angular.equals(originalParameters.displayEnabledTypes, newDisplay) && angular.equals(originalParameters.phoneEnabledTypes, newPhone) && angular.equals(originalParameters.mailEnabledTypes, newMail) && angular.equals(originalParameters.rssEnabledTypes, newRss)){
			return
		}

		const originalDisplay = originalParameters.displayEnabledTypes
		const originalPhone = originalParameters.phoneEnabledTypes
		const originalMail = originalParameters.mailEnabledTypes
		const originalRss = originalParameters.rssEnabledTypes


		const url = Routing.generate('icap_notification_save_user_parameters')



		originalParameters.displayEnabledTypes = newDisplay
		originalParameters.phoneEnabledTypes = newPhone
		originalParameters.mailEnabledTypes = newMail
		originalParameters.rssEnabledTypes = newRss

		//console.log(newDisplay)
		
		this.$http
		.put(url,{display : newDisplay, phone : newPhone, mail : newMail, rss : newRss })
		.then(()=>{
			originalParameters.displayEnabledTypes = originalDisplay
			originalParameters.phoneEnabledTypes = originalPhone
			originalParameters.mailEnabledTypes = originalMail
			originalParameters.rssEnabledTypes = originalRss
		})
		console.log("OK")



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