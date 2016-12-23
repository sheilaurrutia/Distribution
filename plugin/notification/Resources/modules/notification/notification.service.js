import angular from 'angular/index'

export default class NotificationService{

  constructor($http){
    this.$http = $http
    this._types = NotificationService._getGlobal('types')
    this._parameters = NotificationService._getGlobal('parameters')
    this._types.forEach(t => {
      t['translated_group'] = window.Translator.trans(t['group'],{},'resource')
      t['translated_group'] = window.Translator.trans(t['translated_group'],{},'notification')
    })

    this._isAdmin = NotificationService._getGlobal('roles').indexOf('ROLE_ADMIN') > 0
  }

  getTypes(){
    return this._types
  }

  isAdmin(){
    return this._isAdmin
  }


  getChildrenChecked(){
    return this._childrenChecked
  }

  getHttp(){
    return this.$http
  }

  getDisplayEnabledTypes(){
    return this._parameters['display_enabled_types']
  }

  getPhoneEnabledTypes(){
    return this._parameters['phone_enabled_types']
  }

  getMailEnabledTypes(){
    return this._parameters['mail_enabled_types']
  }

  getRssEnabledTypes(){
    return this._parameters['rss_enabled_types']
  }

  getParameters(){
    return this._parameters
  }

  saveParameters(originalParameters, newDisplay, newPhone, newMail, newRss){
    const originalDisplay = originalParameters.displayEnabledTypes
    const originalPhone = originalParameters.phoneEnabledTypes
    const originalMail = originalParameters.mailEnabledTypes
    const originalRss = originalParameters.rssEnabledTypes
    const url = window.Routing.generate('icap_notifications_user_put_parameters')
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
    const url = window.Routing.generate('icap_notification_regenerate_rss_url')
    this.$http
    .post(url)
  }

  static _getGlobal(name) {
    if (typeof window[name] === 'undefined') {
      throw new Error(
        `Expected ${name} to be exposed in a window.${name} variable`
      )
    }
    return window[name]
  }

}
