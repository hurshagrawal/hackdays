var express = require('express');

var app = express.createServer();

app.configure(function() {
	app.use(express.logger());
	app.use(express.static(__dirname + '/public'));
});

//--ROUTES--
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	res.render('root.ejs');
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});