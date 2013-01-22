$(function() {
	//make sure error messages are hidden
	$('.error').hide();
	
	//now, let's set logic for input feild styles
	$('.text').focus(function(){
		$(this).addClass("onfocus");
		$(this).removeClass("onfail");
	});
	$('.text').blur(function(){
		$(this).removeClass("onfocus");
	});
	
	$(".submit_btn").click(function() {
		// validate and process the form
		// first hide any error messages
		$('.error').hide();
		
		//next, let's set our required feild variables
		var name = $("input#name").val();
		var email = $("input#email").val();
		var comments = $("textarea#comments").val();
		var subject = $('input#subject').val();		
				
		//we need some extra variables for email validation
		var at = "@";
		var dot = ".";
		if (name == "") {
			$("input#name").addClass("onfail");
		}
		if (email == "" || email.indexOf(at)==-1 || email.indexOf(dot)==-1) {
			$("input#email").addClass("onfail");
		}
		if (comments == "") {
			$("textarea#comments").addClass("onfail");
		}
		//if something is missing, don't process the form
		if (name == "" || email == "" || email.indexOf(at)==-1 || email.indexOf(dot)==-1 || comments == "") {
			return false;
		}
		//if all is good, then create a datastring with the values
		var dataString = 
		'name='+ name +
		'&email=' + email + 
		'&subject=' + subject + 		
		'&comments=' + comments;		
		
		alert (dataString);

		$.ajax({
			type: "POST",
			url: "http://makeyourselfstudios.com/arc/new_contact.php",
			data: dataString,
			success: function() {
				$('#contact').html('<p>Thank you for your inquiry!</p>').hide().fadeIn(800, function() {
					$('#contact');
				});
			}
			
		});

		return false;
		});
});