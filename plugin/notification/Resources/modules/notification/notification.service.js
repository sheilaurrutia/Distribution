export default class NotificationService{

  constructor($http, FormBuilderService){
    this.$http = $http
    this.FormBuilderService = FormBuilderService
    this._types = NotificationService._getGlobal('types')
    this._parameters = NotificationService._getGlobal('parameters')
    this._mode = NotificationService._getGlobal('mode')

    if (this._mode === 'admin'){
      this._lockedDisplay = NotificationService._getGlobal('lockedDisplay')
      this._lockedPhone = NotificationService._getGlobal('lockedPhone')
      this._lockedMail = NotificationService._getGlobal('lockedMail')
      this._lockedRss = NotificationService._getGlobal('lockedRss')
    }

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

  getLockedDisplay(){
    return this._lockedDisplay
  }

  getLockedPhone(){
    return this._lockedPhone
  }

  getLockedMail(){
    return this._lockedMail
  }

  getLockedRss(){
    return this._lockedRss
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

  saveParameters(originalParameters, newDisplay, newPhone, newMail, newRss){
    const originalDisplay = originalParameters.displayEnabledTypes
    const originalPhone = originalParameters.phoneEnabledTypes
    const originalMail = originalParameters.mailEnabledTypes
    const originalRss = originalParameters.rssEnabledTypes

    originalParameters.displayEnabledTypes = newDisplay
    originalParameters.phoneEnabledTypes = newPhone
    originalParameters.mailEnabledTypes = newMail
    originalParameters.rssEnabledTypes = newRss

    let url = ''
    switch (this.getMode()) {
      case 'admin': url =  window.Routing.generate('icap_notifications_admin_put_parameters'); break
      case 'user': url = window.Routing.generate('icap_notifications_user_put_parameters'); break
    }

    this.$http
    .put(url, {
      display : newDisplay,
      phone : newPhone,
      mail : newMail,
      rss : newRss,
      lock_display: this.getLockedDisplay(),
      lock_phone: this.getLockedPhone(),
      lock_mail: this.getLockedMail(),
      lock_rss: this.getLockedRss()
    }
    )
    .then(()=>{
      originalParameters.displayEnabledTypes = originalDisplay
      originalParameters.phoneEnabledTypes = originalPhone
      originalParameters.mailEnabledTypes = originalMail
      originalParameters.rssEnabledTypes = originalRss
    })
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

  //incomplete method
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
