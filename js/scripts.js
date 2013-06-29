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
	var icon = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/micons/blue.png", 
			   new google.maps.Size(32, 32), new google.maps.Point(0, 0), 
			   new google.maps.Point(16, 32));
	var center = null;
	var map = null;
	var currentPopup;
	var bounds = new google.maps.LatLngBounds();
	function addMarker(lat, lng, info) {
		var pt = new google.maps.LatLng(lat, lng);
		bounds.extend(pt);
		var marker = new google.maps.Marker({
			position: pt,
			icon: icon,
			map: map
		});
		var popup = new google.maps.InfoWindow({
			content: info,
			maxWidth: 300
		});
		google.maps.event.addListener(marker, "click", function() {
			if (currentPopup != null) {
				currentPopup.close();
				currentPopup = null;
			}
			popup.open(map, marker);
			currentPopup = popup;
		});
		google.maps.event.addListener(popup, "closeclick", function() {
			map.panTo(center);
			currentPopup = null;
		});
	}            
	function initMap() {
		map = new google.maps.Map(document.getElementById("map"), {
			center: new google.maps.LatLng(41.889081,-87.631653),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		//Add Stores Here
		addMarker(41.889081,-87.631653,
				  '<b><a href="http://www.untitledchicago.com" target="_blank" style="color:#000;">Untitled</a></b><br/>111 W Kinzie St');
		addMarker(41.894076,-87.635429,
				  '<b><a href="http://www.eatatunion.com/‎" target="_blank"  style="color:#000;">Union Sushi</a></b><br/>230 W Erie St');						  
		center = bounds.getCenter();
		map.fitBounds(bounds);
	}
	

	//Init Map on Map button Click
	$('#c2').click(function (){
		initMap();				
	});
});	
