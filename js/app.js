angular.module("shopalystApp",['ngProgress'])
.factory("shopFactory",["$http",function($http){
	var shopFactory = {};
	shopFactory.getData = function(url){
		return $http.get(url);
	};
	shopFactory.getLocalData = function(){
		if(window.localStorage && localStorage.getItem('likes')){
			return JSON.parse(localStorage.getItem('likes'));
		};
	};
	shopFactory.setLocalData = function(product,flag){
		if(window.localStorage){
			var likedProducts = [];
			if(localStorage.getItem('likes')){
				likedProducts = JSON.parse(localStorage.getItem('likes'));
			}
			if(!flag){
				likedProducts.splice(likedProducts.indexOf(product),1);
			}else{
				likedProducts.push(product);								
			}
			localStorage.setItem('likes',JSON.stringify(likedProducts));
		}
	}
	return shopFactory;
}])
.controller("shopController",["$scope","shopFactory","$filter",'ngProgressFactory',function($scope,shopFactory,$filter,ngProgressFactory){
	var url = "http://dev.shopalyst.com/shopalyst-service/hackerearth002/1.0/products";
	var newUrl = '';
	var likedProductsList = shopFactory.getLocalData();
	$scope.progressBar = ngProgressFactory.createInstance();
	$scope.progressBar.start();
	$scope.totalLikes = 0;
	$scope.showAllProducts = function(){
		$scope.showLiked = false;
		$scope.totalLikes = likedProductsList.length;		
		shopFactory.getData(url).success(function(response){
			$scope.productList = response.productList;
			$scope.facets = response.facets;
			$scope.progressBar.complete();
		});
	};
	
	$scope.divisionModel = {
		tops : false,
		dresses : false,
		footwears : false,
		bottoms : false,
		ethnics : false
	};
	$scope.merchantFilter = {
		flipkart : false,
		amazon : false,
		jabong : false,
		trendin : false,
		yepme : false,
		fashionara : false,
		snapdeal : false,
		stevemadden : false,
		koovs : false,
		paytm : false,
		adidas : false,
		craftsvilla : false
	}

	$scope.filterProduct = function(){
		$scope.progressBar.start();
		newUrl = url+"?divisionFilter=";
		for(division in $scope.divisionModel){
			if($scope.divisionModel[division])
				newUrl = newUrl+division+","
		}
		newUrl = newUrl + "&merchantFilter=";
		for(merchant in $scope.merchantFilter){
			if($scope.merchantFilter[merchant])
				newUrl = newUrl+merchant+","
		}
		console.log(newUrl);
		shopFactory.getData(newUrl).success(function(response){
			$scope.productList = response.productList;
			$scope.progressBar.complete();
		})
	};

	$scope.likeProduct = function(product){
		product.like = !product.like;
		$scope.totalLikes++;
		shopFactory.setLocalData(product,product.like);
		if($scope.showLiked){
			likedProductsList = shopFactory.getLocalData();
			$scope.showLikedProducts();
		}
	};

	$scope.showLikedProducts = function(){
		$scope.showLiked=true;
		$scope.productList = likedProductsList;
	};

	$scope.showAllProducts();
}])