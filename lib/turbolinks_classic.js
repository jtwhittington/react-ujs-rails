;(function(document, window) {
  ReactRailsUJS.TurbolinksClassic = {
    // Attach handlers to Turbolinks-Classic events
    // for mounting and unmounting components
    setup: function() {
      ReactRailsUJS.handleEvent(Turbolinks.EVENTS.CHANGE, function() {ReactRailsUJS.mountComponents()});
      ReactRailsUJS.handleEvent(Turbolinks.EVENTS.BEFORE_UNLOAD, function() {ReactRailsUJS.unmountComponents()});
    }
  };
})(document, window);
