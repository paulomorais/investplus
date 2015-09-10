var express 				= require('express'),
	app 					= express();

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static('client/dist'));
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
//app.use('/js', express.static(__dirname + '/client/js'));

//REST API
// app.get('/api/meetups', meetupsController.list);
// app.post('/api/meetups', meetupsController.create);
// app.get('/api/importTournaments', tournamentsController.importTournaments);
// app.get('/api/tournaments', tournamentsController.list);

app.listen(3000, function() {
	console.log('I\'m listening...');
})