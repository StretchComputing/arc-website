// Copyright © 2012 by Stretch Computing, Inc. All rights reserved.
//
// Any redistribution or reproduction of part or all of the contents in any
// form is prohibited without prior approval. You may not, except with our
// express written permission, distribute or commercially exploit the content.
//


var ARC = (function(r, $) {
	//::HOOK:: toggle which line below is commented out to switch between test and production environments
	//r.arcServerUrl = 'http://arc-dev.dagher.mobi';	// USE FOR TESTING
	r.arcServerUrl = 'https://arc.dagher.mobi';	  		// USE FOR PRODUCTION
	r.arcBaseUrl = r.arcServerUrl + '/rest/v1';

	return r;
})(ARC || {}, jQuery);

var ARC = (function (r, $) {
  'use strict';

	r.serverError = "Arc server error - try again later.";

	// Define an object of event handlers for each Arc API
	r.interface = {
	
		// *************************************************************************
		// *************************************************************************
		// Create Customer API response handlers
		// *************************************************************************
		// *************************************************************************
    createCustomer: {
      // A callback function to respond to success returned by the REST/Ajax call.
			// ----------------------
			// Interface Instructions
			// ----------------------
			// 1. called if the create customer API was successful
			// 2. returned values
			//    * status.Results.ArcNumber:		the unique customer ID number assigned by Arc. Suitable for display.
			//    * status.Results.DateCreated:	date the account was created. Not terribly relevant.
			// 3. returned values handled internally by this API module.
			//    * status.Results.Id: ID of customer model. Used by backbone to update model on other pages. Stored in local storage.
			//    * status.Results.Status: "A" indicates normal status. "I" indicates phone logout is or has been forced. Stays in this state until next phone login.
			//      Stored in local storage. Can be retrieved on another page via:  var status = ARC.store.getItem('customerStatus');
			//    * status.Results.Token: stored in a cookie. Sent to the server for any API requiring authentication. 
      successHandler: function (data, status, jqXHR) {
        try {
					var results = status.Results; 
          RSKYBOX.log.debug('entering', 'RSKYBOX.config.createCusotmer.successHandler');
					// ************************************************
					// Cookie/token handling and storage of Status. Do NOT delete this code!
					r.storeAuthorizationHeader(results.Token);
					r.store.setItem('customerStatus', status.Results.Status);
					r.store.setItem('customerId', status.Results.Id);
					// ************************************************

					// ===> ::HOOK::  <client calling API can insert code here to take appropriate action>
					alert("createCustomer successful: customerId=" + status.Results.Id + " customerStatus=" + status.Results.Status);
					$('#signup').html('<p>Thank you for registering! You are now ready to use Arc Mobile.</p><p>You may login in below to check the status of your account</p>');
					$('.go_to_login').show();


        } catch (e) {
					RSKYBOX.log.error("exception = " + e.message, "createCustomer.successHandler");
        }
      },

      // A callback function to respond to errors returned by the REST/Ajax call.
			// ** Ignore this callback for now **
      errorHandler: function (jqXHR, textStatus, errorThrown) {
        try {
					// TODO not sure how to differentiate between a 422 and other types of errors. Code below did NOT work
          //RSKYBOX.log.debug('entering', 'getToken.errorHandler');
          //if (jqXHR.responseText) { return; }  // This is an apiError which is handled by statusCodeHandlers below.
					//alert(r.serverError);
					RSKYBOX.log.error("server error", "createCustomer.errorHandler");
        } catch (e) {
					RSKYBOX.log.error("exception = " + e.message, "createCustomer.errorHandler");
        }
      },

      // An object compatible with jQuery's Ajax statusCode option.
      // This is an object of key/value pairs where the key is the status code to
      // respond to, and the value is the callback function that responds.
      // rSkybox API errors are returned in HTTP code 422.

      statusCodeHandlers: {
        422: function (jqXHR) {
          try {
            var apiCodes = r.createCustomer.getApiCodes();
						var errorCodes = JSON.parse(jqXHR.responseText).ErrorCodes; 
						var code = "not found";
						if(errorCodes.length > 0) {
							code = errorCodes[0].Code;
						}
						RSKYBOX.log.debug('code = ' + code, 'createCustomer.statusCodeHandlers');

            if (code === 103) {
							// ===> ::HOOK:: <put client code here to handle 'User already exists' error>
							alert("User already exists");
						} else if(code === 104) {
							// ===> ::HOOK:: <put client code here to handle 'User rejected terms' error>
							alert("User rejected terms");
            } else {
							// ===> ::HOOK:: <server error -- display string in 'r.serverError' somewhere on the screen>
							alert(r.serverError);
              RSKYBOX.log.debug('Undefined apiStatus: ' + code, 'createCustomer.statusCodeHandlers');
						}
          } catch (e) {
						RSKYBOX.log.error("exception = " + e.message, "createCustomer.statusCodeHandlers");
          }
        }
      }

    }, // end of 'createCustomer' object


	
		// *************************************************************************
		// *************************************************************************
		// Get Token  API response handlers
		// *************************************************************************
		// *************************************************************************
    getToken: {
      // A callback function to respond to success returned by the REST/Ajax call.
			// ----------------------
			// Interface Instructions
			// ----------------------
			// 1. called if the API call was successful
			// 2. returned values
			//    * status.Results.ArcNumber:		the unique customer ID number assigned by Arc. Suitable for display.
			//    * status.Results.DateCreated:	date the account was created. Not terribly relevant.
			// 3. returned values handled internally by this API module.
			//    * status.Results.Id: ID of customer model. Used by backbone to update model on other pages. Stored in local storage.
			//    * status.Results.Status: "A" indicates normal status. "I" indicates phone logout is or has been forced. Stays in this state until next phone login.
			//      Stored in local storage. Can be retrieved on another page via:  var status = ARC.store.getItem('customerStatus');
			//    * status.Results.Token: stored in a cookie. Sent to the server for any API requiring authentication. 
      successHandler: function (data, status, jqXHR) {
        try {
					var results = data.Results; 
          RSKYBOX.log.debug('entering', 'RSKYBOX.config.getToken.successHandler');
					// ************************************************
					// Token handling and storage of Status. Do NOT delete this code!
					r.storeAuthorizationHeader(results.Token);
					r.store.setItem('customerStatus', results.Status);
					r.store.setItem('customerId', results.Id);
					// ************************************************

					// ===> ::HOOK::  <client calling API can insert code here to take appropriate action>
					//alert("getToken successful: customerId=" + results.Id + " customerStatus=" + results.Status);
					$('.login_screen h2').html("Weclome Back");
					$('#login').html("<p>You are logged in.</p><p>If you lost your phone, click the following link.</p>");
					$('.logout_client_btn').show(); 

        } catch (e) {
					RSKYBOX.log.error("exception = " + e.message, "getToken.successHandler");
        }
      },

      // A callback function to respond to errors returned by the REST/Ajax call.
			// ** Ignore this callback for now **
      errorHandler: function (jqXHR, textStatus, errorThrown) {
        try {
					// TODO not sure how to differentiate between a 422 and other types of errors. Code below did NOT work
          //RSKYBOX.log.debug('entering', 'getToken.errorHandler');
          //if (jqXHR.responseText) { return; }  // This is an apiError which is handled by statusCodeHandlers below.
					//alert(r.serverError);
					RSKYBOX.log.error("server error", "getToken.errorHandler");
        } catch (e) {
					RSKYBOX.log.error("exception = " + e.message, "getToken.errorHandler");
        }
      },

      // An object compatible with jQuery's Ajax statusCode option.
      // This is an object of key/value pairs where the key is the status code to
      // respond to, and the value is the callback function that responds.
      // rSkybox API errors are returned in HTTP code 422.

      statusCodeHandlers: {
        422: function (jqXHR) {
          try {
            var apiCodes = r.createCustomer.getApiCodes();
						var errorCodes = JSON.parse(jqXHR.responseText).ErrorCodes; 
						var code = "not found";
						if(errorCodes.length > 0) {
							code = errorCodes[0].Code;
						}
						RSKYBOX.log.debug('code = ' + code, 'getToken.statusCodeHandlers');

            if (code === 106) {
							// ===> ::HOOK:: <put client code here to handle 'Incorrect login/password' error>
							alert("Incorrect login/password");
						} else {
							// ===> ::HOOK:: <server error -- display string in 'r.serverError' somewhere on the screen>
							alert(r.serverError);
              RSKYBOX.log.debug('Undefined apiStatus: ' + code, 'getToken.statusCodeHandlers');
						}
          } catch (e) {
						RSKYBOX.log.error("exception = " + e.message, "getToken.statusCodeHandlers");
          }
        }
      }

    }, // end of 'getToken' object


	
		// *************************************************************************
		// *************************************************************************
		// Update Customer API response handlers
		// *************************************************************************
		// *************************************************************************
    updateCustomer: {
      // A callback function to respond to success returned by the REST/Ajax call.
			// ----------------------
			// Interface Instructions
			// ----------------------
			// 1. called if the API call was successful
			// 2. returned values
			//    * status.Results.ArcNumber:		the unique customer ID number assigned by Arc. Suitable for display.
			//    * status.Results.DateCreated:	date the account was created. Not terribly relevant.
      successHandler: function (data, status, jqXHR) {
        try {
					var results = status.Results; 

					// ===> ::HOOK::  <client calling API can insert code here to take appropriate action>
					alert("updated");

        } catch (e) {
					RSKYBOX.log.error("exception = " + e.message, "updateCustomer.successHandler");
        }
      },

      // A callback function to respond to errors returned by the REST/Ajax call.
			// ** Ignore this callback for now **
      errorHandler: function (jqXHR, textStatus, errorThrown) {
        try {
					// TODO not sure how to differentiate between a 422 and other types of errors. Code below did NOT work
          //RSKYBOX.log.debug('entering', 'updateCustomer.errorHandler');
          //if (jqXHR.responseText) { return; }  // This is an apiError which is handled by statusCodeHandlers below.
					//alert(r.serverError);
					RSKYBOX.log.error("serverl error", "updateCustomer.errorHandler");
        } catch (e) {
					RSKYBOX.log.error("exception = " + e.message, "updateCustomer.errorHandler");
        }
      },

      // An object compatible with jQuery's Ajax statusCode option.
      // This is an object of key/value pairs where the key is the status code to
      // respond to, and the value is the callback function that responds.
      // rSkybox API errors are returned in HTTP code 422.

      statusCodeHandlers: {
        422: function (jqXHR) {
          try {
            var apiCodes = r.createCustomer.getApiCodes();
						var errorCodes = JSON.parse(jqXHR.responseText).ErrorCodes; 
						var code = "not found";
						if(errorCodes.length > 0) {
							code = errorCodes[0].Code;
						}
						RSKYBOX.log.debug('code = ' + code, 'updateCustomer.statusCodeHandlers');

						// ===> ::HOOK::  <server error -- display string in 'r.serverError' somewhere on the screen>


          } catch (e) {
						RSKYBOX.log.error("exception = " + e.message, "getToken.statusCodeHandlers");
          }
        }
      }

    } // end of 'updateCustomer' object

  }; // end of 'interface' object

  return r;
}(ARC || {}, jQuery));
