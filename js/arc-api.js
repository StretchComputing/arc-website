// Copyright © 2012 by Stretch Computing, Inc. All rights reserved.
//
// Any redistribution or reproduction of part or all of the contents in any
// form is prohibited without prior approval. You may not, except with our
// express written permission, distribute or commercially exploit the content.
//

'use strict';


//////////////////////////////////////////////////
// CreateCustomer API: used to register a new user
//////////////////////////////////////////////////
var ARC = (function(r, $) {
  var
    apiCodes = {
      103: 'User already exists.',
      104: 'User rejected terms.'
    };
	// end of var definitions

  r.createCustomer = {
    // Access to the apiCodes if the client app wants to use our messages.
    getApiCodes: function () {
      return apiCodes;
    },

    run: function(firstName, lastName, email, password, birthDate, notifications, facebook, twitter, acceptTerms) {
        //RSKYBOX.log.error("testing rskybox from ArcTest.html", "joe1");
        //RSKYBOX.log.debug("previous set cookie = " + Cookie.get('arcToken'));
        try {
            var customer = new r.Customer({
                    FirstName: firstName,
                    LastName: lastName, 
                    eMail: email,
                    Password: password,
                    //BirthDate: birthDate,
                    Notifications: notifications,
                    Facebook: facebook,
                    Twitter: twitter,
                    AcceptTerms: acceptTerms, 
										Source: "Website"
                });

            customer.setUrl('new');

            customer.save(null, {
                        success: r.interface.createCustomer.successHandler,
                        error: r.interface.createCustomer.errorHandler,
                        statusCode: r.interface.createCustomer.statusCodeHandlers
                    });
        } catch(e) {
            RSKYBOX.log.error("run exception = " + e.message, "html5.createCustomer.run");
        }
    }

	};

	return r;
})(ARC || {}, jQuery);

//////////////////////////////////////////////////
// GetToken API: used to login an existing user
//////////////////////////////////////////////////
var ARC = (function(r, $) {
  var
    apiCodes = {
      106: 'Incorrect login/password.'
    };
	// end of var definitions

  r.getToken = {
    // Access to the apiCodes if the client app wants to use our messages.
    getApiCodes: function () {
      return apiCodes;
    },

		run: function(email, password) {
			try {
				var customer = new r.Customer({
						Login: email,
						Password: password
					});
				var tokenUrl = r.arcBaseUrl + '/customers/token';
        $.ajax({
          type: 'SEARCH',
          data: JSON.stringify(customer),
					dataType: "json",
					contentType: "application/json;charset=utf-8",
          url: tokenUrl,
          error: r.interface.getToken.errorHandler,
          success: r.interface.getToken.successHandler,
          statusCode: r.interface.getToken.statusCodeHandlers
        });
			} catch(e) {
				RSKYBOX.log.error("run exception = " + e.message, "html5.getToken.run");
			}
		}

	};

	return r;
})(ARC || {}, jQuery);



//////////////////////////////////////////////////////
// Customer Update API: used to login an existing user
//////////////////////////////////////////////////////
var ARC = (function(r, $) {
  var
    apiCodes = {
      // no user displayed error codes for this API
    };
	// end of var definitions

  r.updateCustomer = {
    // Access to the apiCodes if the client app wants to use our messages.
    getApiCodes: function () {
      return apiCodes;
    },

		// NOTE:: at the moment, Arc Server does NOT support PUT so make sure this is a POST
		// TODO  change this to a PUT like it is supposed to be
    run: function(newUserStatus) {
        try {
            var customer = new r.Customer({
							//id: r.store.getItem('customerId'), // TODO add back in when this is changed to a PUT
							Status: newUserStatus 
						});

            customer.setUrl('update/current');

            customer.save(null, {
                        success: r.interface.updateCustomer.successHandler,
                        error: r.interface.updateCustomer.errorHandler,
                        statusCode: r.interface.updateCustomer.statusCodeHandlers,
                        headers: {'Authorization' : r.getAuthorizationHeader()}
                    });
        } catch(e) {
            RSKYBOX.log.error("run exception = " + e.message, "html5.updateCustomer.run");
        }
    }

	};

	return r;
})(ARC || {}, jQuery);


///////////////////
// Arc utility code
///////////////////
var ARC = (function(r, $) {

	// for now, just put token in local storage, not a cookie
	r.getAuthorizationHeader = function() {
		try {
			//return Cookie.get('arcToken');
			return r.store.getItem('arcToken');
		} catch(e) {
			RSKYBOX.log.error("run exception = " + e.message, "html5.getAuthoriationHeader");
		}
	};

	r.storeAuthorizationHeader = function(token) {
		try {
			//var encodedToken = r.encodeToken(token); // server does the encoding
			var authHeader = "Basic " + token;
			// TODO: create 'session' cookie for 24 hrs. It is a session (or will be when server implements it) because it's a temp token, not the real, persistent token.
			//Cookie.set('arcToken', encodedToken, 24, '/');
			r.store.setItem('arcToken', authHeader);
		} catch(e) {
			RSKYBOX.log.error("run exception = " + e.message, "html5.storeAuthoriationHeader");
		}
	};

	r.encodeToken = function (token) {
		try {
			var stringToEncode = "customer:" + token;
			return r.Base64.encode(stringToEncode);
		} catch(e) {
			RSKYBOX.log.error("run exception = " + e.message, "html5.encodeToken");
		}
	};

	r.Base64 = {
		// private property
		_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			
		// public method for encoding
		encode: function (input) {
			try {
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;
				
				input = r.Base64._utf8_encode(input);
				
				while (i < input.length) {
						chr1 = input.charCodeAt(i++);
						chr2 = input.charCodeAt(i++);
						chr3 = input.charCodeAt(i++);
						
						enc1 = chr1 >> 2;
						enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
						enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
						enc4 = chr3 & 63;
						
						if (isNaN(chr2)) {
								enc3 = enc4 = 64;
						} else if (isNaN(chr3)) {
								enc4 = 64;
						}
						output = output + r.Base64._keyStr.charAt(enc1) + r.Base64._keyStr.charAt(enc2) + r.Base64._keyStr.charAt(enc3) + r.Base64._keyStr.charAt(enc4);
				}
				return output;
			} catch(e) {
				RSKYBOX.log.error("run exception = " + e.message, "html5.Base64.encode");
			}
		},
			
		// public method for decoding
		decode: function (input) {
			try {
				var output = "";
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
				
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
				
				while (i < input.length) {
						enc1 = r.Base64._keyStr.indexOf(input.charAt(i++));
						enc2 = r.Base64._keyStr.indexOf(input.charAt(i++));
						enc3 = r.Base64._keyStr.indexOf(input.charAt(i++));
						enc4 = r.Base64._keyStr.indexOf(input.charAt(i++));
						
						chr1 = (enc1 << 2) | (enc2 >> 4);
						chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
						chr3 = ((enc3 & 3) << 6) | enc4;
						
						output = output + String.fromCharCode(chr1);
						
						if (enc3 != 64) {
								output = output + String.fromCharCode(chr2);
						}
						if (enc4 != 64) {
								output = output + String.fromCharCode(chr3);
						}
				}
				
				output = r.Base64._utf8_decode(output);
				return output;
			} catch(e) {
				RSKYBOX.log.error("run exception = " + e.message, "html5.Base64.decode");
			}
		},
			
		// private method for UTF-8 encoding
		_utf8_encode: function (string) {
			try {
				string = string.replace(/\r\n/g, "\n");
				var utftext = "";
				
				for (var n = 0; n < string.length; n++) {
						var c = string.charCodeAt(n);
						if (c < 128) {
								utftext += String.fromCharCode(c);
						} else if ((c > 127) && (c < 2048)) {
								utftext += String.fromCharCode((c >> 6) | 192);
								utftext += String.fromCharCode((c & 63) | 128);
						} else {
								utftext += String.fromCharCode((c >> 12) | 224);
								utftext += String.fromCharCode(((c >> 6) & 63) | 128);
								utftext += String.fromCharCode((c & 63) | 128);
						}
				}
				return utftext;
			} catch(e) {
				RSKYBOX.log.error("run exception = " + e.message, "html5.Base64._utf8_encode");
			}
		},
			
		// private method for UTF-8 decoding
		_utf8_decode: function (utftext) {
			try {
				var string = "";
				var i = 0;
				var c = c1 = c2 = 0;
				
				while (i < utftext.length) {
						c = utftext.charCodeAt(i);
						if (c < 128) {
								string += String.fromCharCode(c);
								i++;
						} else if ((c > 191) && (c < 224)) {
								c2 = utftext.charCodeAt(i + 1);
								string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
								i += 2;
						} else {
								c2 = utftext.charCodeAt(i + 1);
								c3 = utftext.charCodeAt(i + 2);
								string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
								i += 3;
						}
						
				}
				return string;
			} catch(e) {
				RSKYBOX.log.error("run exception = " + e.message, "html5.Base64._etf8_decode");
			}
		}
	}

	return r;
})(ARC || {}, jQuery);
