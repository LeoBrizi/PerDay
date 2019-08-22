module.exports = function(app,request,querystring){

	const { body,validationResult } = require('express-validator/check');
	const { sanitizeBody } = require('express-validator/filter');

	var listaEventi = []

	app.get('/', function(req,res) {    
		res.render('home',{eventi: listaEventi});
	});

	app.get('/nuovo_evento/', function (req, res){
		res.render('form');
    });

	app.post('/:id', [
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
					id:listaEventi.lenght
					iscritti:[]
				}
				//POST INSERITO NEL DB------------------------------
				console.log(evento)
				listaEventi.push(evento);
				console.log('inserito evento nel db');
				res.render('home', {eventi: listaEventi});
			}
		}
    ]);
}

