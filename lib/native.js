;(function(document, window) {
  // jQuery is optional. Use it to support legacy browsers.
  var $ = (typeof window.jQuery !== 'undefined') && window.jQuery;

  ReactRailsUJS.Native = {
    // Attach handlers to browser events to mount & unmount components
    setup: function() {
      if ($) {
        $(function() {ReactRailsUJS.mountComponents()});
      } else if ('addEventListener' in window) {
        document.addEventListener('DOMContentLoaded', function() {ReactRailsUJS.mountComponents()});
      } else {
        // add support to IE8 without jQuery
        window.attachEvent('onload', function() {ReactRailsUJS.mountComponents()});
      }
    }
  };
})(document, window);
