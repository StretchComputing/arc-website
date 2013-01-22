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
	
	$(".register_btn").click(function() {
		// validate and process the form
		// first hide any error messages
		$('.error').hide();
		
		//next, let's set our required feild variables
		var firstname = $("input#firstname").val();
		var lastname = $("input#lastname").val();
		var email = $("input#email").val();
		var dob = $("input#dob").val();
		var password = $("input#password").val();
				
		//we need some extra variables for email validation
		var at = "@";
		var dot = ".";
		if (email == "" || email.indexOf(at)==-1 || email.indexOf(dot)==-1) {
			$("input#email").addClass("onfail");
		}
		//if all is good, then create a datastring with the values
		var dataString = 
		'firstname='+ firstname +
		'&lastname='+ lastname +
		'&email=' + email + 
		'&dob=' + dob + 		
		'&password=' + password;		
		
		alert (dataString);

		$.ajax({
			type: "POST",
			url: "http://makeyourselfstudios.com/arc/new_register.php",
			data: dataString,
			success: function() {
				$('#signup').html('<p>Thank You For Joining The Arc Network!<br/>Check Your Inbox For More Information!</p><a href="http://itunes.com/apps/ARC"><button>Download the App</button></a>').hide().fadeIn(800, function() {
					$('#signup');
				});
			}
			
		});

		return false;
		});
});