
angular.module('investPlusApp', ['nvd3ChartDirectives'])
	.controller('StrategyController', function($scope) {
		var strategy = this;
		var SELL = 1, BUY = -1;
		$scope.operationsList = [
			{operation:'Buy', value: -1},
			{operation:'Sell', value: 1}];

		$scope.exampleData = 
			[ 
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
		

		var stockValue = 15.32;
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

		$scope.teste = 4;
		$scope.stocks = [
			{id:1, name:'VALE5', price:'15.32'},
			{id:2, name:'VALEJ15', price:'3.13'},
			{id:3, name:'VALEJ16', price:'2.47'},
			{id:4, name:'VALEJ17', price:'0.61'},
			{id:5, name:'VALEJ18', price:'0.27'},
			{id:6, name:'VALEJ19', price:'0.03'}];

		$scope.strategies = [
			{ id: 1, operations: [
				{id:4, option:'VALEJ16',price:'2.47',amount:500,operation:SELL},
				{id:5, option:'VALEJ17',price:'0.61',amount:500,operation:BUY}]
			},
			{ id: 2, operations: [
				{id:4, option:'VALEJ17',price:'0.61',amount:800,operation:SELL},
				{id:5, option:'VALEJ18',price:'0.27',amount:800,operation:BUY}]
			}];
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