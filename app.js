var data = [
    { linea: 'LAC', minEntrada: 2, maxEntrada: 4, minSalida: 1, maxSalida: 2 },
    { linea: 'LAC', minEntrada: 7, maxEntrada: 8, minSalida: 6, maxSalida: 8 },
    { linea: 'LAC', minEntrada: 10, maxEntrada: 12, minSalida: 17, maxSalida: 20 },
    { linea: 'DEC', minEntrada: 1, maxEntrada: 3, minSalida: 1, maxSalida: 2 },
    { linea: 'DEC', minEntrada: 6, maxEntrada: 7, minSalida: 6, maxSalida: 6.5 },
    { linea: 'DECO', minEntrada: 2, maxEntrada: 5, minSalida: 7, maxSalida: 9 },
    // { linea: 'DECO', minEntrada: 2, maxEntrada: 5, minSalida: 7, maxSalida: 9 },
];
var lineas = [{ linea: "CGL_PSQ", minEntrada: 15, maxEntrada: 30 },
    { linea: "CGL_PSQ", minEntrada: 25, maxEntrada: 30 },
    { linea: "CGL_PSQ", minEntrada: 13, maxEntrada: 24 },
    { linea: "CGL_PSQ", minEntrada: 20, maxEntrada: 30 },
    { linea: "CGL_PSQ", minEntrada: 10, maxEntrada: 12 },
    { linea: "LAB_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "LAB_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "LAB_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "LAB_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "LAB_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "EMB1_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "EMB1_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "EMB1_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "EMB1_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "EMB1_PSQ", minEntrada: 5, maxEntrada: 12 },
    { linea: "PT", minEntrada: 5, maxEntrada: 12 }
]

var lin = '[{"linea":"PT","secuencia":"","grupo":"","relacion":"","pesoIntEntradaDesde":"10","pesoIntEntradaHasta":"17","PesoIntSalidaDesde":"10","pesoIntSalidaHasta":"17"}]'
var dataPesoEntrada = JSON.parse(lin).map(function(item) {
    return {
        linea: item.linea,
        minEntrada: parseFloat(item.pesoIntEntradaDesde),
        maxEntrada: parseFloat(item.pesoIntEntradaHasta),
        grupo: item.grupo,
        relacion: item.relacion
    };
});

var Grafico = Grafico || {
    matriz: [],
    mTooltip: [],
    idxMatriz: 0,
    COLORES: {
        espacio: "rgba(0,0,0,0)", //#
        azul: "#252850"
    },
    idGrafica: '',
    width: 0,

    init: function(data, idGrafica) {
        var self = this;
        self.idGrafica = idGrafica;

        var dLineas = this.listarLineas(data);
        this.createSeries(dLineas);
    },
    createSeries: function(dLineas) {
        var self = this;
        var categorias = [];

        self.width = 0;
        // crear variables matrix y matrixToltip
        eval(self.obtenerMatriz(dLineas));

        self.matriz = _matriz;
        self.mTooltip = _mTooltip;


        // recorrer lineas
        var cont = 0;
        for (var key in dLineas) {
            console.log(dLineas[key]);

            categorias.push(key);
            this.recorrerLineas(dLineas[key], cont);
            self.width += 100;
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
                width: 200
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: dataCategorias,
                labels: {
                    formatter: function() {

                        return '<i class="fa fa-plus"></i>' + this.value;
                    },
                    useHTML: true,
                    align: 'center'
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                tickInterval: 1,
                min: 1
            },
            tooltip: {
                enabled: true,
                formatter: function(tooltip) {
                    var categorias = this.series.xAxis.categories;

                    var i = this.series.index;
                    var j = categorias.indexOf(this.key);

                    var linea = self.mTooltip[i][j];

                    var html = '<p><span style="font-size:11px;">LÍNEA: <b>' + linea.linea + '<b></span><br/>' +
                        '<span style="font-size:11px;">PESOS ENTRADA DESDE: <b>' + linea.minEntrada + '</b></span><br/>' +
                        '<span style="font-size:11px;">PESOS ENTRADA HASTA: <b>' + linea.maxEntrada + '</b></span><br/>' +
                        '<span style="font-size:11px;">RELACIÓN: <b>1:3</b></span><br/>' +
                        '</p>';
                    return html;

                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    borderWidth: 1
                },
                series: {
                    pointWidth: 15, // Grosor de barras                    
                }
            },
            series: dataSeries,

        });



    },
    recorrerLineas: function(arrLinea, matrizIndex) {
        var self = this;

        var espacio = 0; // Barra espacios
        var barra = 0; // Barra Valor visible
        var maxAnterior = 0;
        var sumatoriaBarra = 0;

        var contAux = 0;
        arrLinea.forEach(function(item, i) {
            if (i == 0) {
                espacio = item.minEntrada;
                barra = item.maxEntrada - item.minEntrada;
                maxAnterior = item.maxEntrada;
            } else {
                if (maxAnterior >= item.maxEntrada) {
                    espacio = 0;
                    barra = 0;
                } else {
                    espacio = (sumatoriaBarra >= item.minEntrada) ? 0 : item.minEntrada - maxAnterior;
                    barra = item.maxEntrada - item.minEntrada;
                    console.log("PSs", sumatoriaBarra);

                    barra = ((barra + sumatoriaBarra) >= item.maxEntrada) ? (item.maxEntrada - sumatoriaBarra) : barra;
                }
                maxAnterior = item.maxEntrada;
            }

            self.matriz[contAux][matrizIndex] = espacio;
            self.mTooltip[contAux][matrizIndex] = item;
            sumatoriaBarra += espacio;
            console.log(espacio, item, maxAnterior);

            contAux++;

            self.matriz[contAux][matrizIndex] = barra;
            self.mTooltip[contAux][matrizIndex] = item;
            sumatoriaBarra += barra;
            contAux++;
        });
    },
    // Crear series 
    crearSeriesEntrada: function(matriz) {
        var self = this;
        var series = [];
        console.log(matriz);

        matriz.forEach(function(item, id) {
            var color = '';
            var enableMouseTracking = false;
            if (id == 0) {
                color = self.COLORES.espacio;
            } else if (id % 2 == 1) {
                // Si es impar barra
                color = self.COLORES.azul;
                enableMouseTracking = true;
            } else {
                // Si es par espacio
                color = self.COLORES.espacio;
                enableMouseTracking = false;
            }

            series.unshift({
                name: '',
                data: item, // [1,2,3]
                stack: '1',
                color: color,
                enableMouseTracking: enableMouseTracking
            });

        });
        self.mTooltip.reverse();
        console.log(series);

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
            // Ordenar de menor a mayor
            json[key] = json[key].sort(function(a, b) {
                return a.minEntrada - b.minEntrada;
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
        var _matriz = "var _matriz = [";
        var _mTooltip = "var _mTooltip = ["
        for (var i = 0; i < totalRenglones * 2; i++) {
            _matriz += '[';
            _mTooltip += '[';
            for (var j = 0; j < totalLineas; j++) {
                _matriz += '0';
                _mTooltip += 'null';
                if (j < totalLineas - 1) {
                    _matriz += ',';
                    _mTooltip += ','
                }
            }
            _matriz += '],';
            _mTooltip += '],';
        }
        _matriz += '];';
        _mTooltip += '];';

        return _matriz + ' ' + _mTooltip;
    }
}

Grafico.init(lineas, 'container');