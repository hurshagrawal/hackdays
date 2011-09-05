/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res){
  res.render('index', {
		stylesheet: 'index',
		nextMeeting: "Saturday, Sept. 9th at 2pm",
		nextTopic: "Amazon AWS and setting up your own web server"
	});
});
app.post('/mailer', function(req, res){
	if (req.body == undefined) {
		console.log('MAILER ERROR: No data.')
		res.send(JSON.stringify({status:'error', message:"Um, I think your message was nommed by the ether. Try again later."}));
	} else if (req.body.email == undefined || req.body.message == undefined) {
		console.log('MAILER ERROR: Missing required fields.')
		res.send(JSON.stringify({status:'error', message:"Yo, it looks like some fields are missing... no sendy."}));
	} else {
		var nodemailer = require("nodemailer");
		nodemailer.SMTP = {
			host: "smtp.gmail.com",
			port: 465,
			ssl: true,
			use_authentication: true,
			user: "sender@wyatt.co",
			pass: "tvY37F4m",
		};
		nodemailer.send_mail({
			sender: "sender@wyatt.co",
			reply_to: req.body.email,
			to: "h@hurshagrawal.com",
			subject: "Message via nyhackdays.com ["+(new Buffer(req.body.email)).toString("base64")+"]",
			body: req.body.message,
		}, function(error, success) {
			if (success) {
				res.send(JSON.stringify({
					status: 'success',
					message: 'Message successfully sent.',
				}));
			} else {
				console.log('(nodemailer) '+error);
				res.send(JSON.stringify({
					status: 'error',
					message: 'There appears to be a temporary influx of tom foolery on this server. Please try again later.',
				}));
			}
		});
	}
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});
