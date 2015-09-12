
angular.module('investPlusApp', ['nvd3ChartDirectives'])
	.controller('StrategyController', function($scope) {
		var strategy = this;
		var SELL = 1, BUY = -1;

		$scope.operationsList = [
			{operation:'Buy', value: -1},
			{operation:'Sell', value: 1}];

		$scope.combineResultWithStock = false;

		$scope.exampleData = [ 
			{ "key": "Series 1", "values": 
	  			[ 
  					[11,-1.6200000000000003],[14.5,1.8799999999999997],[16.5,1.8799999999999997],[21,6.38]
				]
			},
			{ "key": "Series 2", "values": 
	  			[ 
  					[11,11-13.32],[14.5,14.5-13.32],[16.5,16.5-13.32],[21,21-13.32]
				]
			},
		];

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

		strategy.createStrategy = function() {//$scope.toggleOptionOperation = function(id){
			var newStrategy = {id: $scope.strategies.length+1, operations: []};
			var op = 1;
			for (var i = 0; i < $scope.options.length; i++) {
				if ($scope.options[i].selected) {
					newStrategy.operations.push(
						{id: $scope.options[i].id, option: $scope.options[i].name, price: $scope.options[i].price,
							priceExec: $scope.options[i].priceExec, quantity: $scope.stockSelected.quantity, operation: op});
					op *= -1;
				}
			}
			$scope.strategies.push(newStrategy);
		}

		strategy.updateChart = function() {
			//$scope.stockSelected = {name:'VALE5', price: 15.37, quantity: 1800};
			$scope.exampleData = []; 
			var minVal = Math.round($scope.stockSelected.price * 0.85);
			var maxVal = Math.round($scope.stockSelected.price * 1.30);
			//Define chart range
			for (var i = 0; i < $scope.strategies.length; i++) {
				for (var j = 0; j < $scope.strategies[i].operations.length; j++) {
					var priceExec = $scope.strategies[i].operations[j].priceExec;
					if (priceExec * 0.85 < minVal){
						minVal = Math.round(priceExec * 0.85);
					}
					if (priceExec * 1.30 > maxVal){
						maxVal = Math.round(priceExec * 1.30);
					}
				}
			}
			//create curve data
			//reference curve -> Result without no option strategy operation
			var stockValue = $scope.stockSelected.price;
			var data = [ [minVal/stockValue-1, (minVal - stockValue)/stockValue], 
						 [maxVal/stockValue-1, (maxVal - stockValue)/stockValue]];
			$scope.exampleData.push({key: "Reference curve", values: data});
			//strategies curves
			var stockHoldingValue = stockValue * $scope.stockSelected.quantity;
			for (var i = 0; i < $scope.strategies.length; i++) {
				var dados = createCurveData(minVal, maxVal, stockHoldingValue, $scope.strategies[i].operations);
				$scope.exampleData.push({key: "strategy " + $scope.exampleData.length, values: dados});
			}

// { "key": "Series 1", "values": 
// 	[ 
// 		[11,-1.6200000000000003],[14.5,1.8799999999999997],[16.5,1.8799999999999997],[21,6.38]
// 	]
// },
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
					y += operations[j].price * operations[j].quantity * operations[j].operation;
					//add result of execution if occured
					if (x > x_oper){
						y += (operations[j].priceExec - x) * operations[j].quantity * operations[j].operation;
					}
					if ($scope.combineResultWithStock){
						y += (x - $scope.stockSelected.price) * $scope.stockSelected.quantity;
					}
				}
				data.push([x/$scope.stockSelected.price-1, y / referenceGain]);
			};
			return data;
		}

		// [ { "id": 1, "operations": [
		//       { "id": 2, "option": "VALEJ15", "price": 1.61, "quantity": 0, "operation": 0 },
		//       { "id": 4, "option": "VALEJ17", "price": 0.57, "quantity": 0, "operation": 0 }
		//     ] }, 
		//   { "id": 2, "operations": [
		//       { "id": 4, "option": "VALEJ17", "price": 0.57, "quantity": 0, "operation": 0 },
		//       { "id": 5, "option": "VALEJ18", "price": 0.32, "quantity": 0, "operation": 0 }
		//     ]
		//   }
		// ];

		strategy.createValues = function() {
			var data = [];
			var stockPrice = 13.32;
			var optionExecPriceSell = 14.50;
			var optionExecPriceBuy = 16.50;
			var optionPrice1 = 0.90;
			var optionPrice2 = 0.20;
			var minVal = Math.round(stockPrice * 0.85);
			var maxVal = Math.round(optionExecPriceBuy * 1.30);
			//x0 = minVal, x1 = optionExecPriceSell, x2 = optionExecPriceBuy, x3 = maxVal
			//f(x) -> x < optionExecPriceSell: optionPrice1 - optionPrice2 - (stockPrice - x)
			data.push([minVal, optionPrice1 - optionPrice2 - (stockPrice - minVal)]);
			data.push([optionExecPriceSell, optionPrice1 - optionPrice2 - (stockPrice - optionExecPriceSell)]);
			//f(x) -> x > optionExecPriceSell &
			//		  x < optionExecPriceBuy: optionPrice1 - (x - optionExecPriceSell) - optionPrice2 - (stockPrice - x)
			data.push([optionExecPriceBuy, optionPrice1 - (optionExecPriceBuy - optionExecPriceSell) - optionPrice2 - (stockPrice - optionExecPriceBuy)]);
			//f(x) -> x > optionExecPriceBuy: optionPrice1 - (x - optionExecPriceSell) - optionPrice2 + (x - optionExecPriceBuy) - (stockPrice - x)
			data.push([maxVal, optionPrice1 - (maxVal - optionExecPriceSell) - optionPrice2 + (maxVal - optionExecPriceBuy) - (stockPrice - maxVal)]);
			$scope.dados = data;
		}
		
		var n_points = 7;

		var strategyChart = {
    		labels: [1, 2, 3, 4, 5, 6, 9],
    		datasets: [
		        {
		            label: "My First dataset",
		            fillColor: "rgba(220,220,220,0.2)",
		            strokeColor: "rgba(220,220,220,1)",
		            pointColor: "rgba(220,220,220,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: [65, 59, 80, 81, 56, 55, 40]
		        },
		        {
		            label: "My Second dataset",
		            fillColor: "rgba(151,187,205,0.2)",
		            strokeColor: "rgba(151,187,205,1)",
		            pointColor: "rgba(151,187,205,1)",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: [28, 48, 40, 19, 86, 27, 90]
		        }
    		]
		};

		//Chart.defaults.global.scaleBeginAtZero = true;
		//Chart.defaults.global.animation = false;
		//Chart.defaults.global.scaleOverride = true;
		//Chart.defaults.global.scaleSteps = 7;
		//var ctx = $("#myChart").get(0).getContext("2d");
		//$scope.myLineChart = new Chart(ctx).Line(strategyChart);

		$scope.portfolio = [
			{id:1, name:'VALE5', price: 15.37, type: 'S', quantity: 1800, selected: true},
			{id:1, name:'BOVA11', price: 42.58, type: 'S', quantity: 20, selected: false}
		];

		$scope.stockSelected = {name:'VALE5', price: 15.37, quantity: 1800};

		$scope.options = [
			{id:2, name:'VALEJ15', price: 1.61, type: 'O', priceExec: 14.49, selected: false},
			{id:3, name:'VALEJ16', price: 1.04, type: 'O', priceExec: 15.49, selected: false},
			{id:4, name:'VALEJ17', price: 0.57, type: 'O', priceExec: 16.49, selected: false},
			{id:5, name:'VALEJ18', price: 0.32, type: 'O', priceExec: 17.49, selected: false}
		];

		$scope.strategies = [];

		$scope.config = {
			title: 'sdasdasd',
			tooltips: true,
			labels: false,
			mouseover: function() {},
			mouseout: function() {},
			click: function() {},
			legend: {
				display: true,
				//could be 'left, right'
				position: 'left'
			},
			innerRadius: 0, // applicable on pieCharts, can be a percentage like '50%'
			lineLegend: 'lineEnd' // can be also 'traditional'
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