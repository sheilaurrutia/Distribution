export default class NotificationCtrl {
	constructor(service, $http){
		this._service = service
		this.types = service.getTypes()
		this.visibleChecked={}
		this.phoneChecked={}
		this.mailChecked={}
		this.rssChecked = {}
		this.isCollapsed = false

		this.types.forEach(t=>{

			if (t.children.length>0){
				t.children.forEach(child=>{

					this.visibleChecked[child] = true
					this.phoneChecked[child] = false
					this.mailChecked[child] = false
					this.rssChecked[child] = false
				})
			}
			
			this.visibleChecked[t.name] = true
			this.phoneChecked[t.name] = false
			this.mailChecked[t.name] = false
			this.rssChecked[t.name] = false
		})



	}



	isRssEnabled(){
		for (let index in this.rssChecked){
			if (this.rssChecked[index]){
				return true
			}
		}
		return false
	}

	toggleAll(type){
		let toggleVisibleStatus = this.visibleChecked[type.name] 
		type.children.forEach(c=>{
			this.visibleChecked[c] = toggleVisibleStatus

		})
		let togglePhoneStatus = this.phoneChecked[type.name] 
		type.children.forEach(c=>{
			this.phoneChecked[c] = togglePhoneStatus

		})
		let toggleMailStatus = this.mailChecked[type.name] 
		type.children.forEach(c=>{
			this.mailChecked[c] = toggleMailStatus

		})
		let toggleRssStatus = this.rssChecked[type.name] 
		type.children.forEach(c=>{
			this.rssChecked[c] = toggleRssStatus

		})
	}

	optionToggled(type){
		this.visibleChecked[type.name] = type.children.every(c=>{
			return this.visibleChecked[c]
		})

		this.phoneChecked[type.name] = type.children.every(c=>{
			return this.phoneChecked[c]
		})

		this.mailChecked[type.name] = type.children.every(c=>{
			return this.mailChecked[c]
		})

		this.rssChecked[type.name] = type.children.every(c=>{
			return this.rssChecked[c]
		})

	}

	



	







	

	




	
}