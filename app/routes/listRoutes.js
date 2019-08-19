module.exports = function(app,request,querystring){
	
	// PAGINA INIZIALE--------------------------------------------------
	app.get('/', function(req,res) {    
		res.render('index');
	});

}

