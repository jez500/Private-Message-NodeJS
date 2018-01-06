;(function ($, Drupal, drupalSettings) {

  "use strict";

  Drupal.Nodejs.callbacks.pmnThreadUpdated = {
    callback: function (message) {
      if (message.callback == 'pmnThreadUpdated') {
        // Tell any listeners, they should poll for updates.
        $(window).trigger('pm:threads:poll', [message.data]);

        // Send a growl notification if not you and lib available.
        if (message.data.notifyTime > 0 && !message.data.isYou && typeof $.fn.jGrowl === 'function') {
          $.jGrowl(message.data.body, {life: (message.data.notifyTime * 1000)});
        }
      }
    }
  };

})(jQuery, Drupal, drupalSettings);