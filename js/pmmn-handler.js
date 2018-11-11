;(function ($, Drupal, drupalSettings) {

  "use strict";

  Drupal.Nodejs.callbacks.pmnThreadUpdated = {
    callback: function (message) {
      if (message.callback == 'pmnThreadUpdated') {
        // Tell any listeners, they should poll for updates.
        $(window).trigger('pm:threads:poll', [message.data]);

        // Send a notification.
        var notify = new Drupal.pmmn.Notification();
        notify.showNotification(message.data);
      }
    }
  };

})(jQuery, Drupal, drupalSettings);
