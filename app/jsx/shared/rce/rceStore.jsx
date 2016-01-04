define([
  'jquery',
  'underscore'
], function($, _){

  let RCEStore = {
    classKeyword: "from-react-tinymce",

    addToStore: function (targetId, RCEInstance) {
      window.tinyrce.editorsListing[targetId] = RCEInstance;
    },

    matchingClass: function ($nodes) {
      return _.select($nodes, (dn) => $(dn).hasClass(this.classKeyword) )
    },

    sendFunctionToCorrespondingEditor: function(args, domNode) {
      let rce = window.tinyrce.editorsListing[domNode.id]
      if (!rce) { return null }

      let fnString = args[0]

      // since exists? has a ? and cant be a regular function (yet
      // we want the same signature as editorbox) just return true
      // rather than calling as a fn on rceWrapper
      if (fnString === "exists?") {return true}

      let fnArgs = _.rest(args)
      return rce[fnString](...fnArgs)
    },

    callOnRCE: function ($nodes, ...args) {
      return _.chain( this.matchingClass($nodes) )
        .map(this.sendFunctionToCorrespondingEditor.bind(this, args))
        .compact()
        .value()[0]
    }
  };

  return RCEStore;
});
