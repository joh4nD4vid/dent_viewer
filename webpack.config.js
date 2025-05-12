// Configuration Webpack

const path = require('path')

module.exports = {

	// Entrée
	entry : './local/app.js',                
	watch : true,                            // Surveillance activée ou non
	output : {                
		path : path.resolve('./public/js'),    // Chemin sortie
		filename : 'app.js'                    // Sortie
	}

}