var data = [
	{linea:'LAC',minEntrada:2, maxEntrada:4,minSalida:1, maxSalida:2},
	{linea:'LAC',minEntrada:7, maxEntrada:8,minSalida:6, maxSalida:8},		
	// {linea:'LAC',minEntrada:10, maxEntrada:15,minSalida:17, maxSalida:20},		
	{linea:'DEC',minEntrada:1, maxEntrada:3,minSalida:1, maxSalida:2},
	{linea:'DEC',minEntrada:6, maxEntrada:7,minSalida:6, maxSalida:6.5},			
	];


var Grafico = Grafico || {

	// minEntradaAnterior: -1,
	// maxEntradaAnterior: -1,
	matriz: [],
	idxMatriz: 0,
	
	init:function(data){
		var dLineas = this.listarLineas(data);
		this.createSeries(dLineas);		
	},
	createSeries: function(dLineas) {
		var self = this;

		self.matriz =  eval( self.obtenerMatriz( dLineas ) );
		
		// recorrer lineas
		var cont = 0;
		for (var key in dLineas) {
			console.log(dLineas[key]);
			this.recorrerLineas( dLineas[key], cont);	
			cont++;
		}
		console.log(self.matriz);	
	},
	recorrerLineas: function( arrLinea, matrizIndex ){	
		var self = this;	

		var espacio = 0; // Barra espacios
		var barra = 0; // Barra Valor visible
		var maxAnterior = 0;
		
		var contAux = 0;
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
				espacio = item.minEntrada;
				barra = item.maxEntrada - item.minEntrada;
				maxAnterior = item.maxEntrada;
			} else {
				espacio = item.minEntrada - maxAnterior;
				barra = item.maxEntrada - item.minEntrada;
				maxAnterior = item.maxEntrada;
			}
			// console.log( matrizIndex, espacio );
			// console.log(matrizIndex, barra);
			
			
			// console.log('c',contAux);
			self.matriz[contAux][matrizIndex] = espacio;
			contAux++;
			// console.log('c+1',contAux);
			self.matriz[contAux][matrizIndex] = barra;
			contAux++;
			// self.idxMatriz ++;
			// console.log(self.idxMatriz);
			
			
		});
		// self.minEntradaAnterior = -1;
		
		
	},
	/**
	 * Seccionar y ordenar valor de lineas
	 * @param {*} objeto 
	 */
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
	/**
	 * Construir arreglo bidimiensional
	 * @param {*} dataObject 
	 */
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