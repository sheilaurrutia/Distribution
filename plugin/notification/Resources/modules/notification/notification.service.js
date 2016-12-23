export default class NotificationService{

  constructor($http, FormBuilderService){
    this.$http = $http
    this.FormBuilderService = FormBuilderService
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

  getAllowPhoneAndMail() {
      return NotificationService._getGlobal('allowPhoneAndMail')
  }

  getParameters(){
    return this._parameters
  }

  saveParameters(newDisplay, newPhone, newMail, newRss){
    let url = ''
    switch (this.getMode()) {
        case 'admin': url =  window.Routing.generate('icap_notifications_admin_post_parameters'); break;
        case 'user': url = window.Routing.generate('icap_notifications_user_put_parameters'); break;
    }

    this.$http
       .put(url,{display : newDisplay, phone : newPhone, mail : newMail, rss : newRss })
  }

  setAllowPhoneAndMail(boolean) {
      const url = window.Routing.generate('api_post_parameters')
      this.FormBuilderService.submit(url, {
          'notification_allow_phone_and_mail': boolean
      })
  }

  getMode() {
      return NotificationService._getGlobal('mode')
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
