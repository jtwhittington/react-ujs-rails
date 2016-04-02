;(function(document, window) {
  ReactRailsUJS.Turbolinks = {
    // Turbolinks 5+ got rid of named events (?!)
    setup: function() {
      ReactRailsUJS.handleEvent('turbolinks:load', function() {ReactRailsUJS.mountComponents()});
      ReactRailsUJS.handleEvent('turbolinks:before-cache', function() {ReactRailsUJS.unmountComponents()});
    }
  };
})(document, window);
