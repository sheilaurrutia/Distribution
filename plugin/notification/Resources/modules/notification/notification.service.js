export default class NotificationService{

  constructor($http){
    this.$http = $http
    this._types = NotificationService._getGlobal('types')
    this._parameters = NotificationService._getGlobal('parameters')
    this._types.forEach(t => {
      t['translated_group'] = window.Translator.trans(t['group'],{},'resource')
      t['translated_group'] = window.Translator.trans(t['translated_group'],{},'notification')
    })
  }

  getTypes(){
    return this._types
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

  saveParameters(newDisplay, newPhone, newMail, newRss){
    const url = window.Routing.generate('icap_notifications_user_put_parameters')
    this.$http
    .put(url,{display : newDisplay, phone : newPhone, mail : newMail, rss : newRss })
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
