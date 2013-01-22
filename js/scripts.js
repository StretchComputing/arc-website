$(document).ready(function() {
	
	$('a.custom').click(function (){
		$('article').hide();
		$('.slider').hide();
		var showContent = $(this).attr('id');
		$('.'+showContent).show();
	});
	
	$('.hideBox').click(function (){
		$('article').hide();
	});
	
	
	$('.go_to_login').click(function (){
		$('#login_screen').trigger('click');		
	});
	

	$(function() {
        $( "#dob" ).datepicker({
            dateFormat : 'yy/mm/dd',
            changeMonth : true,
            changeYear : true,
            yearRange: '-100y:c+nn',
            maxDate: '-1d'
        });
    });
	
	
	//Google Maps
	/*
	var myLatlng = new google.maps.LatLng(41.889081,-87.631653);
	var mapOptions = {
		center: myLatlng,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title:"Arc Friendly Locations"
	});
	
	var infowindow = new google.maps.InfoWindow({
		content: "<div class='infoWindow'>Untitled<br>111 W Kinzie St<br><a href='http://www.untitledchicago.com' target='_blank'>www.untitledchicago.com</a></div>"
	});
	
	google.maps.event.addListener(marker, 'click', function() {
	  infowindow.open(map,marker);
	});			
	google.maps.event.trigger(map, 'resize');
	*/	

});


$(window).load(function() {
	/*		
	$('#c2').click(function (){
		//google.maps.event.trigger(map, 'resize');			
		setTimeout(function() {
			google.maps.event.trigger(map, 'resize');			
		}, 2000); //needed to delay one second for map to load in order to resize	
	});
	*/
	$('.home').fadeIn("slow");
	
			
});


