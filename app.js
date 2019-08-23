var data = [
	{linea:'LAC',minEntrada:2, maxEntrada:4,minSalida:1, maxSalida:2},
	{linea:'LAC',minEntrada:7, maxEntrada:8,minSalida:6, maxSalida:8},		
	// {linea:'LAC',minEntrada:10, maxEntrada:15,minSalida:17, maxSalida:20},		
	{linea:'DEC',minEntrada:1, maxEntrada:3,minSalida:1, maxSalida:2},
	{linea:'DEC',minEntrada:6, maxEntrada:7,minSalida:6, maxSalida:6.5},			
	];


var Grafico = Grafico || {

	minEntradaAnterior: -1,
	maxEntradaAnterior: -1,
	matriz: [],
	
	init:function(data){
		var dLineas = this.listarLineas(data);
		this.createSeries(dLineas);		
	},
	createSeries: function(dLineas) {
		var self = this;

		self.matriz =  eval( self.obtenerMatriz( dLineas ) );
		
		console.log(self.matriz);
		
		// recorrer lineas
		var i = 0;
		for (var key in dLineas) {
			console.log(dLineas[key]);
			this.recorrerLineas( dLineas[key], i);	
			i++;
		}
		
	},
	recorrerLineas: function( arrLinea, matrizIndex ){	
		var self = this;	

		var espacio = 0;
		var barra = 0;
		var maxAnterior = 0;
		
		arrLinea.forEach(function(item, i) {
			// console.log(i, matrizIndex);
			// if( self.minEntradaAnterior != -1 ) {
			// 	espacioEntrada = self.minEntradaAnterior - item.minEntrada;
			// }else{
			// 	//console.log('val ent', item.maxEntrada - item.minEntrada);
			// 	// console.log('val ent', item.maxEntrada - item.minEntrada);
			// 	self.minEntradaAnterior = item.minEntrada;
				

			// 	//console.log('val en',self.minEntradaAnterior)
			// }


			if( i == 0 ) {
				espacio = item.minEntrada

			}

		});
		self.minEntradaAnterior = -1;
	},

	listarLineas: function (objeto){		
		var json = {};
		if (objeto.length == 0) return [];

	    var json = {};
	    objeto.forEach(function (item) {
	        var linea = item.linea;

	        var jsn = JSON.parse('{"' + linea + '":[]}');

	        objeto.reverse().forEach(function(element){
	            if (element.linea == linea) {
	                jsn[linea].push(element);
	            }
	        });
	        json = $.extend(json, jsn);
	    });
	    
	    for (var key in json) {
	        json[key] = json[key].sort(function(a,b){                	
	        	return a.maxEntrada - b.maxEntrada;
	        })
	    }
	    return json;			
	},
	obtenerMatriz:function( dataObject ){
		// Obtener tamaño matriz
		var totalRenglones = -1;
		var totalLineas = 0;		
		for(var key in dataObject) {			
			if( dataObject[key].length > totalRenglones ){
				totalRenglones = dataObject[key].length;
			}
			totalLineas ++;
		}

		// Crear matriz de arreglo vacio
		var codigo = "[";
		for (var i = 0; i < totalRenglones*2; i++) {
			codigo += '[';
			for (var j = 0; j < totalLineas; j++) {
				codigo+='0';
				if(j < totalLineas-1){
					codigo+=',';
				}
			}
			codigo+='],';
		}
		codigo+=']';

		return codigo;
	}
}

Grafico.init(data);