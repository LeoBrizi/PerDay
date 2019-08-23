module.exports = function(app,request,querystring){

	const { body,validationResult } = require('express-validator/check');
	const { sanitizeBody } = require('express-validator/filter');
	const fs = require("fs");

	var listaEventi = [];

	process
	.on('SIGTERM', shutdown('SIGTERM'))
	.on('SIGINT', shutdown('SIGINT'))
	.on('uncaughtException', shutdown('uncaughtException'));

	function shutdown(signal) {
		return (err) => {
			console.log(`${ signal }...`);
			if (err) console.error(err.stack || err);
			setTimeout(() => {
				console.log("scrittura database..."); 
				fs.writeFileSync('dataBase.txt', JSON.stringify(listaEventi));
				console.log("scrittura riuscita!");
				console.log('...waited 5s, exiting.');
				process.exit(err ? 1 : 0);
			}, 5000).unref();
		};
	}

	fs.readFile('dataBase.txt', function(err, data) {
		console.log("caricamento dati dal db...")
		listaEventi = JSON.parse(data);
    	console.log("ok");
    	fs.unlink('dataBase.txt', function (err) {
			if (err) 
				console.log("database già eliminato");
			else
				console.log('File deleted!');
		}); 
  	});




	app.get('/', function(req,res) {    
		res.render('home',{eventi: listaEventi});
	});

	app.get('/nuovo_evento', function (req, res){
		res.render('form');
    });

	app.post('/', [
		//verifichiamo che città e data siano state inserite correttamente
		body('password').isLength({ min: 1 }).trim().withMessage('password non inserita.')
		.isAlpha().withMessage('La password deve essere composta da sole lettere'),
		body('titolo').isLength({ min: 1 }).trim().withMessage('titolo non inserito.'),
        body('da', 'Data inizio in formato non valido').optional({ checkFalsy: true }).isISO8601(),
        sanitizeBody('*').trim(),
        body('a', 'Data fine in formato non valido').optional({ checkFalsy: true }).isISO8601(),
        sanitizeBody('*').trim(),   
        //continuiamo la richiesta        
        (req, res)=> {          
			//estraiamo gli errori della form
			const errors = validationResult(req);
			//prendiamo i dati ottenuti 
			var info = {
				titolo: req.body.titolo,
				password: req.body.password,
				da: req.body.da,
				a: req.body.a,
				dove: req.body.dove,	
			};
			if (info.dove == null || info.dove == '') delete info.dove;
			if (!errors.isEmpty()) {
			// Ci sono degli errori: restituiamo la form nuovamente con valori puliti dagli spazi-errori segnalati.
				res.render('form', { errors: errors.array() });
				return;
			}else{
				var evento = {
					titolo:info.titolo,
					password:info.password,
					da:info.da,
					a:info.a,
					dove:info.dove,
					id:listaEventi.lenght,
					iscritti:[]
				}
				//POST INSERITO NEL DB------------------------------
				console.log(evento)
				listaEventi.push(evento);
				console.log('inserito evento nel db');
				res.redirect('/');
			}
		}
    ]);
}

