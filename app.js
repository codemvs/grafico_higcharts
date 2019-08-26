var data = [
    { linea: 'LAC', minEntrada: 2, maxEntrada: 4, minSalida: 1, maxSalida: 2 },
    { linea: 'LAC', minEntrada: 7, maxEntrada: 8, minSalida: 6, maxSalida: 8 },
    { linea: 'LAC', minEntrada: 10, maxEntrada: 12, minSalida: 17, maxSalida: 20 },
    { linea: 'DEC', minEntrada: 1, maxEntrada: 3, minSalida: 1, maxSalida: 2 },
    { linea: 'DEC', minEntrada: 6, maxEntrada: 7, minSalida: 6, maxSalida: 6.5 },
    { linea: 'DECO', minEntrada: 2, maxEntrada: 5, minSalida: 7, maxSalida: 9 },
    // { linea: 'DECO', minEntrada: 2, maxEntrada: 5, minSalida: 7, maxSalida: 9 },
];

var ps = [{ lin: 'DES', entrada: 2, maxEntrada: 4 }]
ps = ps.map(function(item) {
    return { linea: item.lin, minEntrada: item.entrada, maxEntrada: item.maxEntrada }
})

var Grafico = Grafico || {
    matriz: [],
    idxMatriz: 0,
    COLORES: {
        espacio: "rgba(0,0,0,0)", //#
        azul: "blue"
    },
    idGrafica: '',

    init: function(data, idGrafica) {
        var self = this;
        self.idGrafica = idGrafica;

        var dLineas = this.listarLineas(data);
        this.createSeries(dLineas);
    },
    createSeries: function(dLineas) {
        var self = this;
        var categorias = [];

        self.matriz = eval(self.obtenerMatriz(dLineas));

        // recorrer lineas
        var cont = 0;
        for (var key in dLineas) {
            console.log(dLineas[key]);

            categorias.push(key);
            this.recorrerLineas(dLineas[key], cont);
            cont++;
        }
        var series = self.crearSeriesEntrada(self.matriz);
        self.renderizarGrafica(series, categorias);

    },
    renderizarGrafica: function(dataSeries, dataCategorias) {
        var self = this;
        Highcharts.chart(self.idGrafica, {
            chart: {
                type: 'column',
            },
            credits: {
                enabled: true
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: dataCategorias,
            },
            yAxis: {
                title: {
                    text: ''
                },
                tickInterval: 1,
                min: 1,
                //max: valorMaximo
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                },
            },
            series: dataSeries
        });



    },
    recorrerLineas: function(arrLinea, matrizIndex) {
        var self = this;

        var espacio = 0; // Barra espacios
        var barra = 0; // Barra Valor visible
        var maxAnterior = 0;

        var contAux = 0;
        arrLinea.forEach(function(item, i) {
            if (i == 0) {
                espacio = item.minEntrada;
                barra = item.maxEntrada - item.minEntrada;
                maxAnterior = item.maxEntrada;
            } else {
                espacio = item.minEntrada - maxAnterior;
                barra = item.maxEntrada - item.minEntrada;
                maxAnterior = item.maxEntrada;
            }

            self.matriz[contAux][matrizIndex] = espacio;
            contAux++;
            self.matriz[contAux][matrizIndex] = barra;
            contAux++;
        });
    },
    // Crear series 
    crearSeriesEntrada: function(matriz) {
        var self = this;
        var series = [];

        matriz.forEach(function(item, id) {
            var color = '';
            if (id == 0) {
                color = self.COLORES.espacio;
            } else if (id % 2 == 1) {
                // Si es impar barra
                color = self.COLORES.azul;
            } else {
                // Si es par espacio
                color = self.COLORES.espacio
            }

            series.unshift({
                name: '',
                data: item,
                stack: 'male',
                color: color
            });

        });
        return series;
    },
    /**
     * Seccionar y ordenar valor de lineas
     * @param {*} objeto 
     */
    listarLineas: function(objeto) {
        var json = {};
        if (objeto.length == 0) return [];

        var json = {};
        objeto.forEach(function(item) {
            var linea = item.linea;

            var jsn = JSON.parse('{"' + linea + '":[]}');

            objeto.forEach(function(element) {
                if (element.linea == linea) {
                    jsn[linea].push(element);
                }
            });
            json = $.extend(json, jsn);
        });

        for (var key in json) {
            json[key] = json[key].sort(function(a, b) {
                return a.maxEntrada - b.maxEntrada;
            })
        }
        return json;
    },
    /**
     * Construir arreglo bidimiensional
     * @param {*} dataObject 
     */
    obtenerMatriz: function(dataObject) {
        // Obtener tamaño matriz
        var totalRenglones = -1;
        var totalLineas = 0;
        for (var key in dataObject) {
            if (dataObject[key].length > totalRenglones) {
                totalRenglones = dataObject[key].length;
            }
            totalLineas++;
        }

        // Crear matriz de arreglo vacio
        var codigo = "[";
        for (var i = 0; i < totalRenglones * 2; i++) {
            codigo += '[';
            for (var j = 0; j < totalLineas; j++) {
                codigo += '0';
                if (j < totalLineas - 1) {
                    codigo += ',';
                }
            }
            codigo += '],';
        }
        codigo += ']';

        return codigo;
    }
}

Grafico.init(data, 'container');