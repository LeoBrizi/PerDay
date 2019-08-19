module.exports = function(app,request,querystring){
	
	// Initial page --------------------------------------------------
	app.get('/', function(req,res) {    
		res.render('index');
	});


	// Sign up page --------------------------------------------------
	app.get('/signup',function(req,res) {
		res.render('signup');
	});

	// Sign up info --------------------------------------------------
	app.post('/signup',function(req,res){

	});

	// Day choice ----------------------------------------------------
	app.get('/calendar',function(req,res) {
		res.render('calendar');
	});

}

