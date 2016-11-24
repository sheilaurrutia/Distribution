export default class NotificationCtrl {

	constructor(service){
		this.types = service.getTypes()
		this.service = service
		this.isCollapsed = false

		this.editedParameters={}
		this.editedParameters.original = service.getParameters()

		this.editedParameters.newDisplayEnabledTypes = service.getDisplayEnabledTypes()
		this.editedParameters.newPhoneEnabledTypes = service.getPhoneEnabledTypes()
		this.editedParameters.newMailEnabledTypes = service.getMailEnabledTypes()
		this.editedParameters.newRssEnabledTypes = service.getRssEnabledTypes()

		this.id = service.getId()
		this.userId = service.getUserId()

		

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