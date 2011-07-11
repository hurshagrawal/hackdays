function ContactFormJiggyWut() {
	
	// set up the contact form dialog
	$('#contact_dialog').dialog({
		title: "Send a message to the Hursh!",
		autoOpen: false,
		modal: true,
		height: 'auto',
		width: 400,
		resizable: false,
		show: 'fade',
		hide: 'fade',
		close: function(event, ui) {
			$('#contact_form').get(0).reset();
			$('#contact_status').hide();
			$('#contact_form').show();
		},
	});
	
	// validate and submit the contact form
	$('#contact_form').validate({
		submitHandler: function(form) {
			
			// get the form fields
			var form_data = {};
			$(form.elements).each(function(index) {
				if ($(this).attr('name') != undefined) {
					if ($(this).attr('value') !== undefined) {
						form_data[$(this).attr('name')] = $(this).attr('value');
					}
				}
			});
			
			// hide the form
			$(form).fadeOut(200, function() {
				
				// show status
				var pac = new Image();
				pac.src = '/images/pac.gif';
				pac.onload = function() {
					$('#contact_status').html(pac).append('<br />Green Pac-Man is sending your message through the internets...').fadeIn(400);
				};
				
				// send it
				$.ajax({
					url: $(form).attr('action'),
					type: $(form).attr('method'),
					dataType: 'json',
					data: form_data,
					success: function(data, textStatus, jqXHR) {
						if (data.status == 'success') {
							var ch = new Image();
							ch.src = '/images/check.png';
							ch.onload = function() {
								$('#contact_status').fadeOut(200, function() {
									$('#contact_status').html(ch).append('<br />Thanks! Your message has been sent!').fadeIn(400);
								});
							};
							setTimeout("$('#contact_dialog').dialog('close');", 3000);
						} else {
							var yo = new Image();
							yo.src = '/images/yo.png';
							yo.onload = function() {
								$('#contact_status').fadeOut(200, function() {
									$('#contact_status').html(yo).append('<br />'+data.message).fadeIn(400);
								});
							};
						}
						// console.log(data);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						var yo = new Image();
						yo.src = '/images/yo.png';
						yo.onload = function() {
							$('#contact_status').fadeOut(200, function() {
								$('#contact_status').html(yo).append("Oh snap! Something's gone awry somewhere in the internets. Your message probably did not go through.").fadeIn(400);
							});
						};
						// console.log(textStatus+': '+errorThrown);
					},
				});
			});
			
			return false;
		},
	});
}
