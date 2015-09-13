
var app = angular.module('investPlusApp', ['nvd3']);

app.controller('StrategyController', function($scope) {
	var strategy = this;
	var SELL = 1, BUY = -1;
	var minRangeRatio = 0.9, maxRangeRatio = 1.2;

	$scope.optionsChart = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {
                stateChange: function(e){ console.log("stateChange"); },
                changeState: function(e){ console.log("changeState"); },
                tooltipShow: function(e){ console.log("tooltipShow"); },
                tooltipHide: function(e){ console.log("tooltipHide"); }
            },
            xAxis: {
                axisLabel: 'Time (ms)'
            },
            yAxis: {
                axisLabel: 'Voltage (v)',
                tickFormat: function(d){
                    return d3.format('.02f')(d);
                },
                axisLabelDistance: 30
            },
            callback: function(chart){
                console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Title for Line Chart'
        },
        subtitle: {
            enable: true,
            text: 'Subtitle for simple line chart. This is the most basic form of Bootstrap: precompiled files for quick drop-in usage in nearly any web project.',
            css: {
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        caption: {
            enable: true,
            html: '<b>Figure 1.</b> The Bootstrap source code download includes the precompiled CSS, JavaScript, and font assets, along with source Less, JavaScript, and documentation.',
            css: {
                'text-align': 'justify',
                'margin': '10px 13px 0px 7px'
            }
        }
    };

    $scope.dataChart = sinAndCos();

    /*Random Data Generator */
    function sinAndCos() {
        var sin = [],sin2 = [],
            cos = [];

        //Data is represented as an array of {x,y} pairs.
        for (var i = 0; i < 100; i++) {
            sin.push({x: i, y: Math.sin(i/10)});
            sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
            cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
        }

        //Line chart data should be sent as an array of series objects.
        return [
            {
                values: sin,      //values - represents the array of {x,y} data points
                key: 'Sine Wave', //key  - the name of the series.
                color: '#ff7f0e'  //color - optional: choose your own line color.
            },
            {
                values: cos,
                key: 'Cosine Wave',
                color: '#2ca02c'
            },
            {
                values: sin2,
                key: 'Another sine wave',
                color: '#7777ff',
                area: true      //area - set to true if you want this line to turn into a filled area chart.
            }
        ];
    };





	$scope.operationsList = [
		{operation:'Buy', value: -1},
		{operation:'Sell', value: 1}];

	$scope.combineResultWithStock = false;

	$scope.strategyChartData = [ ];
	$scope.strategyChartOptions = { /* JSON data */ };

	$scope.portfolio = [
		{id:1, name:'VALE5', price: 15.37, type: 'S', quantity: 1800, selected: true},
		{id:1, name:'BOVA11', price: 42.58, type: 'S', quantity: 20, selected: false}
	];

	$scope.stockSelected = {name:'VALE5', price: 15.37, quantity: 1800};

	$scope.options = [
		{id:2, name:'VALEJ15', premium: 1.61, type: 'O', priceExec: 14.49, selected: false},
		{id:3, name:'VALEJ16', premium: 1.04, type: 'O', priceExec: 15.49, selected: false},
		{id:4, name:'VALEJ17', premium: 0.57, type: 'O', priceExec: 16.49, selected: false},
		{id:5, name:'VALEJ18', premium: 0.32, type: 'O', priceExec: 17.49, selected: false}
	];

	$scope.strategies = [ {"id":1, "visibility":'show',"operations":
		[
			{"id":4,"option":"VALEJ17","premium":0.57,"priceExec":16.49,"quantity":2800,"operation":1},
			{"id":5,"option":"VALEJ18","premium":0.32,"priceExec":17.49,"quantity":2300,"operation":-1}
		]
	}];

	strategy.toggleOptionOperation = function(id) {//$scope.toggleOptionOperation = function(id){
		for (var i = 0; i < $scope.options.length; i++) {
			if (id == $scope.options[i].id) {
				$scope.options[i].estrategyOperation++;
				if ($scope.options[i].estrategyOperation > 1) {
					$scope.options[i].estrategyOperation = -1;
				}
			}
		}
	}

	strategy.toggleStrategy = function(strategy) {
		if (strategy.visibility != 'hidden') {
			strategy.visibility = 'hidden';
		} else {
			strategy.visibility = 'show';
		}
		this.updateChart();
	}

	strategy.createStrategy = function() {//$scope.toggleOptionOperation = function(id){
		var newStrategy = {id: $scope.strategies.length+1, visibility:'show', operations: []};
		var op = 1;
		for (var i = 0; i < $scope.options.length; i++) {
			if ($scope.options[i].selected) {
				newStrategy.operations.push(
					{id: $scope.options[i].id, option: $scope.options[i].name, premium: $scope.options[i].premium,
						priceExec: $scope.options[i].priceExec, quantity: $scope.stockSelected.quantity, operation: op});
				op *= -1;
			}
		}
		$scope.strategies.push(newStrategy);
		this.updateChart();
	}

	$scope.stockValueSimulated = 16.35; 

	strategy.updateChart = function() {
		//$scope.stockSelected = {name:'VALE5', price: 15.37, quantity: 1800};
		$scope.strategyChartData = []; 
		var minVal = Math.round($scope.stockSelected.price * minRangeRatio);
		var maxVal = Math.round($scope.stockSelected.price * maxRangeRatio);
		//Define chart range
		for (var i = 0; i < $scope.strategies.length; i++) {
			for (var j = 0; j < $scope.strategies[i].operations.length; j++) {
				var priceExec = $scope.strategies[i].operations[j].priceExec;
				if (priceExec * minRangeRatio < minVal){
					minVal = Math.round(priceExec * minRangeRatio);
				}
				if (priceExec * maxRangeRatio > maxVal){
					maxVal = Math.round(priceExec * maxRangeRatio);
				}
			}
		}
		var stockValue = $scope.stockSelected.price;
		//create curves
		//reference curve -> Result without no option strategy operation
		var data = [ [minVal/stockValue-1, (minVal - stockValue)/stockValue], 
					 [maxVal/stockValue-1, (maxVal - stockValue)/stockValue]];
		$scope.strategyChartData.push({key: "Reference curve", values: data});
		//reference curve -> ZERO LINE
		data = [ [minVal/stockValue-1, 0], [maxVal/stockValue-1, 0]];
		$scope.strategyChartData.push({key: "ZERO", values: data});
		//reference curve -> Vertical @ ZERO
		data = [ [0, (minVal - stockValue)/stockValue], [0, (maxVal - stockValue)/stockValue]];
		$scope.strategyChartData.push({key: "Vertical", values: data});
		//reference curve -> Valor Simulado
		
		data = [ [($scope.stockValueSimulated - stockValue)/stockValue, (minVal - stockValue)/stockValue], 
			[($scope.stockValueSimulated - stockValue)/stockValue, (maxVal - stockValue)/stockValue]];
		$scope.strategyChartData.push({key: "Stock Price Simulated", values: data});

		//strategies curves
		var stockHoldingValue = stockValue * $scope.stockSelected.quantity;
		for (var i = 0; i < $scope.strategies.length; i++) {
			if ($scope.strategies[i].visibility == 'show') {
				var dados = createCurveData(minVal, maxVal, stockHoldingValue, $scope.strategies[i].operations);
				$scope.strategyChartData.push({key: "strategy " + $scope.strategyChartData.length, values: dados});
			}
		}
	}

	var createCurveData = function(minVal, maxVal, referenceGain, operations) {
		var points = [minVal];
		var data = [];
		//var pointsRef = [(minVal - refPrice)/refPrice];

		//define curve points
		for (var i = 0; i < operations.length; i++) {
			points.push(operations[i].priceExec);
		}
		points.push(maxVal);
		//define x,y values for each point
		for (var i = 0; i < points.length; i++) {
			var x = points[i];
			var y = 0;
			for (var j = 0; j < operations.length; j++) {
				var x_oper = operations[j].priceExec;
				//Gain from option premium 
				y += operations[j].premium * operations[j].quantity * operations[j].operation;
				//add result of execution if occured
				if (x > x_oper){
					y += (operations[j].priceExec - x) * operations[j].quantity * operations[j].operation;
				}
			}
			if ($scope.combineResultWithStock){
				y += (x - $scope.stockSelected.price) * $scope.stockSelected.quantity;
			}
			data.push([x/$scope.stockSelected.price-1, y / referenceGain]);
		};
		return data;
	}

});


// angular.module('investPlusApp', [])
//   .controller('StrategyController', function() {
//     var todoList = this;
//     todoList.todos = [
//       {text:'learn angular', done:true},
//       {text:'build an angular app', done:false}];
 
//     todoList.addTodo = function() {
//       todoList.todos.push({text:todoList.todoText, done:false});
//       todoList.todoText = '';
//     };
 
//     todoList.remaining = function() {
//       var count = 0;
//       angular.forEach(todoList.todos, function(todo) {
//         count += todo.done ? 0 : 1;
//       });
//       return count;
//     };
 
//     todoList.archive = function() {
//       var oldTodos = todoList.todos;
//       todoList.todos = [];
//       angular.forEach(oldTodos, function(todo) {
//         if (!todo.done) todoList.todos.push(todo);
//       });
//     };
//   });