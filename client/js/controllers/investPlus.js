var app = angular.module('investPlusApp', ['ngRoute', 'nvd3']);

app.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'HomeController'
	})
	.when('/strategies', {
		templateUrl: 'templates/strategies.html',
		controller: 'StrategyController'
	})
	.when('/portifolio', {
		templateUrl: 'templates/portifolio.html',
		controller: 'PortifolioController'
	})
	.otherwise({redirectTo: '/'});
});

app.controller('HomeController', function($scope){

});

app.controller('PortifolioController', function($scope){

});

app.controller('StrategyController', function($scope) {
	var strategy = this;
	var SELL = 1, BUY = -1;
	var minRangeRatio = 0.9, maxRangeRatio = 1.2;

	$scope.optionsChart = {
        chart: {
            type: 'lineChart',
            height: 350,
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
                axisLabel: 'Stock Price Range(%)',
                tickFormat: function(d){
                    return d3.format('.0%')(d);
                }
            },
            yAxis: {
                axisLabel: 'Strategy Result (%)',
                tickFormat: function(d){
                    return d3.format('.0%')(d);
                },
                axisLabelDistance: 30
            },
            callback: function(chart){
                console.log("!!! lineChart callback !!!");
            }
        },
        title: {
            enable: true,
            text: 'Strategies Comparison'
        }
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
		var data = [ {x: minVal/stockValue-1, y: (minVal - stockValue)/stockValue}, 
					 {x: maxVal/stockValue-1, y: (maxVal - stockValue)/stockValue} ];
		$scope.strategyChartData.push({key: "Reference curve", values: data, color: '#000000'});
		//reference curve -> ZERO LINE
		data = [ {x: minVal/stockValue-1, y: 0}, {x: maxVal/stockValue-1, y: 0}];
		$scope.strategyChartData.push({key: "ZERO", values: data, color: '#000000'});
		//reference curve -> Vertical @ ZERO
		data = [ {x: 0, y: (minVal - stockValue)/stockValue}, {x: 0, y: (maxVal - stockValue)/stockValue}];
		$scope.strategyChartData.push({key: "Vertical", values: data, color: '#000000'});
		//reference curve -> Valor Simulado
		
		data = [ {x: ($scope.stockValueSimulated - stockValue)/stockValue, y: (minVal - stockValue)/stockValue}, 
				 {x: ($scope.stockValueSimulated - stockValue)/stockValue, y: (maxVal - stockValue)/stockValue}];
		$scope.strategyChartData.push({key: "Stock Price Simulated", values: data, color: '#aa3333'});

		//strategies curves
		var stockHoldingValue = stockValue * $scope.stockSelected.quantity;
		for (var i = 0; i < $scope.strategies.length; i++) {
			if ($scope.strategies[i].visibility == 'show') {
				var dados = createCurveData(minVal, maxVal, stockHoldingValue, $scope.strategies[i].operations);
				$scope.strategyChartData.push({key: "strategy " + $scope.strategyChartData.length, values: dados, color: '#FF0000'});
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
			data.push({x: x/$scope.stockSelected.price-1, y: y / referenceGain});
		};
		return data;
	}

});