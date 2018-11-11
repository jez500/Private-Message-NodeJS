;(function ($, Drupal, drupalSettings, Notification, window) {

  "use strict";

  Drupal.pmmn = Drupal.pmmn || {};

  /**
   * Wrapper for sending a notification.
   */
  Drupal.pmmn.Notification = function() {

    this.class = null;

    this.showNotification = function(messageData) {
      // Need a duration, type and not you.
      if (!messageData.notifyTime || !messageData.notifyType || messageData.isYou) {
        return;
      }

      var duration = (messageData.notifyTime * 1000);

      if (messageData.notifyType === 'native') {
        this.class = new Drupal.pmmn.NativeNotification();
        this.class.showNotification(messageData.ownerName, messageData.snippet, messageData.image, messageData.url, duration);
      }

      if (messageData.notifyType === 'jgrowl') {
        this.class = new Drupal.pmmn.BrowserNotification();
        this.class.showNotification(messageData.body, duration);
      }
    }
  };

  /**
   * Native notification class.
   */
  Drupal.pmmn.NativeNotification = function() {

    /**
     * Check we are allowed to show notifications.
     */
    this.checkPermission = function() {
      if (window.hasOwnProperty("Notification")) {
        var permission = Notification.permission;
        if (permission === "granted") {
          return true;
        }
      }

      if (permission !== "denied") {
        Notification.requestPermission().then(function () {
          return true;
        })
      }
    };

    /**
     * Native notifications require data passed separately.
     */
    this.showNotification = function(title, body, icon, link, duration) {
      if (this.checkPermission()) {
        var options = {
          body: body,
          icon: icon
        };
        var n = new Notification(title, options);
        if (link) {
          n.onclick = function () {
            window.open(link);
          };
        }
        setTimeout(n.close.bind(n), duration);
      }
    };

    return this;
  };

  /**
   * Browser notification class.
   */
  Drupal.pmmn.BrowserNotification = function() {

    /**
     * In browser notifications get the message pre-rendered so only requires body and duration.
     */
    this.showNotification = function(body, duration) {
      if (typeof $.fn.jGrowl === 'function') {
        $.jGrowl(body, {life: (duration)});
      } else {
        window.console.log('jGrowl library is not installed and configured, unable to show notification.')
      }
    };

    return this;
  }

})(jQuery, Drupal, drupalSettings, Notification, window);
