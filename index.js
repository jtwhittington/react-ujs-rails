(function(document, window) {
  var React = require('react');
  var ReactDOM = require('react-dom');

  // jQuery is optional. Use it to support legacy browsers.
  var $ = (typeof window.jQuery !== 'undefined') && window.jQuery;

  window.ReactRailsUJS = ReactRailsUJS = {
    // This attribute holds the name of component which should be mounted
    // example: `data-react-class="MyApp.Items.EditForm"`
    CLASS_NAME_ATTR: 'data-react-class',

    // This attribute holds JSON stringified props for initializing the component
    // example: `data-react-props="{\"item\": { \"id\": 1, \"name\": \"My Item\"} }"`
    PROPS_ATTR: 'data-react-props',

    // helper method for the mount and unmount methods to find the
    // `data-react-class` DOM elements
    findDOMNodes: function(searchSelector) {
      // we will use fully qualified paths as we do not bind the callbacks
      var selector, parent;

      switch (typeof searchSelector) {
        case 'undefined':
          selector = '[' + ReactRailsUJS.CLASS_NAME_ATTR + ']';
          parent = document;
          break;
        case 'object':
          selector = '[' + ReactRailsUJS.CLASS_NAME_ATTR + ']';
          parent = searchSelector;
          break;
        case 'string':
          selector = searchSelector + '[' + ReactRailsUJS.CLASS_NAME_ATTR + '], ' +
                     searchSelector + ' [' + ReactRailsUJS.CLASS_NAME_ATTR + ']';
          parent = document;
          break
        default:
          break;
      }

      if ($) {
        return $(selector, parent);
      } else {
        return parent.querySelectorAll(selector);
      }
    },

    // Within `searchSelector`, find nodes which should have React components
    // inside them, and mount them with their props.
    mountComponents: function(searchSelector) {
      var nodes = ReactRailsUJS.findDOMNodes(searchSelector);

      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];
        var className = node.getAttribute(ReactRailsUJS.CLASS_NAME_ATTR);

        // Assume className is simple and can be found at top-level (window).
        // Fallback to eval to handle cases like 'My.React.ComponentName'.
        var constructor = window[className] || eval.call(window, className);
        var propsJson = node.getAttribute(ReactRailsUJS.PROPS_ATTR);
        var props = propsJson && JSON.parse(propsJson);

        // Prefer ReactDOM if defined (introduced in 0.14)
        var renderer = (typeof ReactDOM == "object") ? ReactDOM : React;

        renderer.render(React.createElement(constructor, props), node);
      }
    },

    // Within `searchSelector`, find nodes which have React components
    // inside them, and unmount those components.
    unmountComponents: function(searchSelector) {
      var nodes = ReactRailsUJS.findDOMNodes(searchSelector);

      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];

        // Prefer ReactDOM if defined (introduced in 0.14)
        var renderer = (typeof ReactDOM == "object") ? ReactDOM : React;
        renderer.unmountComponentAtNode(node);
      }
    },

    Turbolinks: {
      // Turbolinks 5+ got rid of named events (?!)
      setup: function() {
        ReactRailsUJS.handleEvent('turbolinks:load', function() {ReactRailsUJS.mountComponents()});
        ReactRailsUJS.handleEvent('turbolinks:before-cache', function() {ReactRailsUJS.unmountComponents()});
      }
    },

    TurbolinksClassic: {
      // Attach handlers to Turbolinks-Classic events
      // for mounting and unmounting components
      setup: function() {
        ReactRailsUJS.handleEvent(Turbolinks.EVENTS.CHANGE, function() {ReactRailsUJS.mountComponents()});
        ReactRailsUJS.handleEvent(Turbolinks.EVENTS.BEFORE_UNLOAD, function() {ReactRailsUJS.unmountComponents()});
      }
    },

    TurbolinksClassicDeprecated: {
      // Before Turbolinks 2.4.0, Turbolinks didn't
      // have named events and didn't have a before-unload event.
      // Also, it didn't work with the Turbolinks cache, see
      // https://github.com/reactjs/react-rails/issues/87
      setup: function() {
        Turbolinks.pagesCached(0)
        ReactRailsUJS.handleEvent('page:change', function() {ReactRailsUJS.mountComponents()});
        ReactRailsUJS.handleEvent('page:receive', function() {ReactRailsUJS.unmountComponents()});
      }
    },

    Native: {
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
    }
  };

  // Event Setup
  if ($) {
    ReactRailsUJS.handleEvent = function(eventName, callback) {
      $(document).on(eventName, callback);
    };
  } else {
    ReactRailsUJS.handleEvent = function(eventName, callback) {
      document.addEventListener(eventName, callback);
    };
  }
  // Detect which kind of events to set up:
  if (typeof Turbolinks !== 'undefined' && Turbolinks.supported) {
    if (typeof Turbolinks.EVENTS !== 'undefined') {
      // Turbolinks.EVENTS is in classic version 2.4.0+
      ReactRailsUJS.TurbolinksClassic.setup();
    } else if (typeof Turbolinks.controller !== "undefined") {
      // Turbolinks.controller is in version 5+
      ReactRailsUJS.Turbolinks.setup();
    } else {
      ReactRailsUJS.TurbolinksClassicDeprecated.setup();
    }
  } else {
    ReactRailsUJS.Native.setup();
  };

})(document, window);
