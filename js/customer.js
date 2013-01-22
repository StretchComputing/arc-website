'use strict';

var ARC = (function(r, $) {

  r.Customer = r.BaseModel.extend({
    apiUrl: '/customers',

    initialize: function() {
    },

    parse: function(response) {
      return response;
    },

    // specialized function, doesn't currently use the setUrl() method from base.js
    setUrl: function(urlParam) {
      try {
        this.url = r.arcBaseUrl + this.apiUrl;
				if(urlParam) this.url += "/" + urlParam;
        console.log("***** Customers::setUrl() this.url = " + this.url);
        return true;
      } catch(e) {
        console.log("Customers.setUrl exception = " + e.message);
      }
    },

    validate: function(attrs) {
      console.log('validate called');
      return;
    }
  });

  r.Customers = r.BaseCollection.extend({
    model: r.Customer,
    apiUrl: '/customers',

    initialize: function() {
    },

    parse: function(response) {
      try {
        console.log("Customers HTTP response = " + response);
        if (+response.apiStatus !== 100) {
          r.displayWarning('Customers: unknown API status: ' + response.apiStatus);
         // return;
        }
        return response.journals;
      } catch(e) {
        console.log("Customers.parse exception = " + e.message);
      }
    },

    // specialized function, doesn't currently use method from base.js
    setUrl: function (feedstatusId) {
      try {
        var url = this.restUrl + this.apiUrl + "/" + feedstatusId + "/" + "journals.json"
        this.url = url;
        console.log("***** Customers::setUrl() this.url = " + url);
        return true;
      } catch(e) {
        console.log("Customers.setUrl exception = " + e.message);
      }
    }

  });

  return r;
})(ARC || {}, jQuery);
