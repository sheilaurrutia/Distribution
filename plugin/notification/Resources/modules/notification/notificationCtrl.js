export default class NotificationCtrl {

	constructor(service, modal){
		this.types = service.getTypes()
		this.http = service.getHttp()
		this.service = service
		this.isCollapsed = false

		this.editedParameters={}
		this.editedParameters.original = service.getParameters()

		this.editedParameters.newDisplayEnabledTypes = service.getDisplayEnabledTypes()
		console.log('Récupération')
		console.log(this.editedParameters.newDisplayEnabledTypes)
		this.editedParameters.newPhoneEnabledTypes = service.getPhoneEnabledTypes()
		this.editedParameters.newMailEnabledTypes = service.getMailEnabledTypes()
		this.editedParameters.newRssEnabledTypes = service.getRssEnabledTypes()

		this.id = service.getId()
		this.userId = service.getUserId()

		this.errorMessage = null
		this.errors = []
		this._modalFactory = modal
		this._modalInstance = null

	}

	_modal(template, errorMessage, errors){
		if (errorMessage){
			this.errorMessage = errorMessage
		}

		if(errors){
			this.errors = errors
		}

		this._modalInstance = this._modalFactory.open(template)
	}

	_closeModal(){
		this._modalInstance.close()
	}

	isChildrenChecked(type){
		type.children.forEach(c=>{
			if (this.editedParameters.newDisplayEnabledTypes[c] || this.editedParameters.newPhoneEnabledTypes[c] || this.editedParameters.newMailEnabledTypes[c] || this.editedParameters.newRssEnabledTypes[c] ) {
				return true
			}
		})
		return false
	}



	isRssEnabled(){
		for (let index in this.editedParameters.newRssEnabledTypes){
			if (this.editedParameters.newRssEnabledTypes[index]){
				return true
			}
		}
		return false
	}

	toggleAll(type){
		let toggleVisibleStatus = this.editedParameters.newDisplayEnabledTypes[type.name] 
		type.children.forEach(c=>{
			this.editedParameters.newDisplayEnabledTypes[c] = toggleVisibleStatus

		})
		let togglePhoneStatus = this.editedParameters.newPhoneEnabledTypes[type.name] 
		type.children.forEach(c=>{
			this.editedParameters.newPhoneEnabledTypes[c] = togglePhoneStatus

		})
		let toggleMailStatus = this.editedParameters.newMailEnabledTypes[type.name] 
		type.children.forEach(c=>{
			this.editedParameters.newMailEnabledTypes[c] = toggleMailStatus

		})
		let toggleRssStatus = this.editedParameters.newRssEnabledTypes[type.name] 
		type.children.forEach(c=>{
			this.editedParameters.newRssEnabledTypes[c] = toggleRssStatus

		})
	}

	optionToggled(type){
		this.editedParameters.newDisplayEnabledTypes[type.name] = type.children.every(c=>{
			return this.editedParameters.newDisplayEnabledTypes[c]
		})

		this.editedParameters.newPhoneEnabledTypes[type.name] = type.children.every(c=>{
			return this.editedParameters.newPhoneEnabledTypes[c]
		})

		this.editedParameters.newMailEnabledTypes[type.name] = type.children.every(c=>{
			return this.editedParameters.newMailEnabledTypes[c]
		})

		this.editedParameters.newRssEnabledTypes[type.name] = type.children.every(c=>{
			return this.editedParameters.newRssEnabledTypes[c]
		})

	}

	save(){
		this.service.saveParameters(this.editedParameters.original, this.editedParameters.newDisplayEnabledTypes, this.editedParameters.newPhoneEnabledTypes, this.editedParameters.newMailEnabledType, this.editedParameters.newRssEnabledTypes)
	}






	
}