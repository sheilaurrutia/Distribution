import confirmTemplate from './confirmed.partial.html'

export default class NotificationCtrl {

	constructor(service, modal){
		this.types = service.getTypes()
		this.service = service
		this.isCollapsed = false


		this.editedParameters={}
		this.editedParameters.original = service.getParameters()

		this.editedParameters.newDisplayEnabledTypes = service.getDisplayEnabledTypes()
		this.editedParameters.newPhoneEnabledTypes = service.getPhoneEnabledTypes()
		this.editedParameters.newMailEnabledTypes = service.getMailEnabledTypes()
		this.editedParameters.newRssEnabledTypes = service.getRssEnabledTypes()

		this.nbDisplayChecked = this.getNbDisplayChecked()
		this.nbPhoneChecked = this.getNbPhoneChecked()
		this.nbMailChecked = this.getNbMailChecked()
		this.nbRssChecked = this.getNbRssChecked()

		this._modalFactory = modal
		this._modalInstance = null

		

	}

	 _closeModal () {
    	this._modalInstance.close()
  	}

  	_modal (template, errorMessage, errors) {
	    if (errorMessage) {
	      this.errorMessage = errorMessage
	    }

	    if (errors) {
	      this.errors = errors
	    }

	    this._modalInstance = this._modalFactory.open(template)
  	}



	getNbRssChecked(){
		let cpt = 0
		for (let index in this.editedParameters.newRssEnabledTypes){
			if (this.editedParameters.newRssEnabledTypes[index]){
				cpt++
			}
		}
		return cpt
	}

	getNbDisplayChecked(){
		let cpt = 0
		for (let index in this.editedParameters.newDisplayEnabledTypes){
			if (this.editedParameters.newDisplayEnabledTypes[index]){
				cpt++
			}
		}
		return cpt
	}

	getNbPhoneChecked(){
		let cpt = 0
		for (let index in this.editedParameters.newPhoneEnabledTypes){
			if (this.editedParameters.newPhoneEnabledTypes[index]){
				cpt++
			}
		}
		return cpt
	}

	getNbMailChecked(){
		let cpt = 0
		for (let index in this.editedParameters.newMailEnabledTypes){
			if (this.editedParameters.newMailEnabledTypes[index]){
				cpt++
			}
		}
		return cpt
	}

	isEditable(){
		let cptDisplay = this.getNbDisplayChecked()
		let cptPhone = this.getNbPhoneChecked()
		let cptMail = this.getNbMailChecked()
		let cptRss = this.getNbRssChecked()

		return this.nbDisplayChecked != cptDisplay || this.nbPhoneChecked != cptPhone || this.nbMailChecked != cptMail || this.nbRssChecked != cptRss
	}

	isRssEnabled(){

		let cpt = this.getNbRssChecked()
		return this.nbRssChecked != cpt
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
		
		this._modal(confirmTemplate)
		

	}






	
}