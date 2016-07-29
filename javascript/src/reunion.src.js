
(function(win){

	if(!win.console) console = {log:function(){}};
	if(typeof win.matchMedia == "undefined"){
		this.matchMedia = function(myvar){
			return false;
		}
	}

	var internal = {};
	win.dld = internal;

	var app = angular.module('reunion', ['ngSanitize','ngRoute']);


	app.controller('nosMarques', function($scope, $compile, $rootScope, $http, $route, $routeParams, $location, $filter) {
		$scope.marques = null;
		$scope.photos = null;
		$scope.types = null;
		$scope.currentSlide = null;
		$scope.selectedType = '';

		$scope.currentDate = new Date();
		$scope.cacheBuster = 0;

		$scope.setBackgroundThumbnailImage = function(obj){

			if($scope.cacheBuster===0){
				$scope.currentDate = new Date();
				$scope.cacheBuster = $scope.currentDate.getTime();
			}

			var images_sub_directory = "images/full/";

			if(typeof window.matchMedia != "undefined"){
				images_sub_directory = "images/" + ((window.matchMedia("(min-width: 320px)").matches && window.matchMedia("(max-width: 480px)").matches)?"mobile":"full")  + "/";
			}
			
			obj.source += ('?=' + $scope.cacheBuster);

			if(typeof obj.detail == "undefined"){
				images_sub_directory += "thumbs/";	
			}

			if(typeof obj.returnURL != "undefined"){
				return String(images_sub_directory + obj.source);	
			}
			else{
				return { 'backgroundImage':'url(' + String(images_sub_directory + obj.source) + ')' };
			}
			
		}

		$scope.changeMarques = function(val){
			$scope.selectedType = $scope.setType(val);
		}

		$scope.setType = function(index){
			$scope.cacheBuster = 0;
			return $scope.marques[$scope.types[index]];
		}

		$scope.parseResponse = function(response){
			$scope.marques = response.marques;
			$scope.photos = response.photos;
			$scope.types = new Array();

			for( k in $scope.marques){
				$scope.types.push(k);
			}

			$scope.selectedType = $scope.setType(0);
		}

		$scope.loadSlideShow = function(scope){
			for(var i in $scope.photos){

			}
		}


		$scope.getFilter = function(){
			return {"type": ($scope.selectedType || undefined || '!illustration' || '!about')};	
		}

		$scope.$watch('scrollTop', function(newVal, oldVal){
		    if(newVal!=oldVal){
		        $scope.$broadcast('scrollTop',{"scrollTop":newVal});
		    }
		});


		$scope.$watch('mobile', function(newVal, oldVal){
		    if(newVal!=oldVal){
		        $scope.$broadcast('windowResize',{"newWidth":newVal});
		    }
		});

		$scope.checkMobile = function(){
			$scope.mobile = ((window.matchMedia("(min-width: 320px)").matches && window.matchMedia("(max-width: 480px)").matches)?"mobile":"full");
		}

		$scope.mobile = "full";


		$http.get("/projects.json").success($scope.parseResponse);

		$scope.hiddenPhoto = function(index){
			if(index!=$scope.currentSlide){
				return "100%";
			}
			else{
				return "0%";
			}
		}

		$scope.loadBackground = function(scope){
			
			if(scope.imageLoading){
				scope.imageLoading = false;

				scope.backgroundImage = scope.setBackgroundThumbnailImage({source:scope.x.filename,detail:true,returnURL:true});

				$http({
					method: 'GET',
					responseType: 'arraybuffer',
					url: scope.backgroundImage
				}).then(function successCallback(response) {
						scope.imageLoaded = true;

						var blob = new Blob([response.data], {type: "image/jpeg"});
						scope.backgroundStyle = "url(" + (window.URL || window.webkitURL).createObjectURL(blob) + ")";
					}, function errorCallback(response) {
						console.log(response);
				});
			}
		};

	});

	//http://nahidulkibria.blogspot.com/2014/10/angullarjs-directive-to-watch-window.html
	app.directive('autoresize', function($window) {  
		//passes scope to anonymous function
	  	return function($scope) {  
	   			
				$scope.initializeWindowSize = function() {  
				$scope.maxHeight = Math.max(  
	 				document.body.scrollHeight, document.documentElement.scrollHeight,  
	 				document.body.offsetHeight, document.documentElement.offsetHeight,  
	 				document.body.clientHeight, document.documentElement.clientHeight,  
	 				window.innerHeight  
				);  
		    	
		    	$scope.scrollTop = $window.pageYOffset;
		    	$scope.windowHeight = $window.innerHeight;
		    	$scope.viewBottom = $scope.windowHeight;
		    	return $scope.windowWidth = $window.innerWidth;  
		   };  

	   		$scope.initializeWindowSize();  

	   		return angular.element($window).bind('resize', function() {  
	   			$scope.initializeWindowSize();  	   		
	   			$scope.cacheBuster = 0;
	   			$scope.$broadcast('scrollTop',{"scrollTop":$scope.scrollTop});
	   			$scope.checkMobile();
	    		return $scope.$apply();  
	   		});  
	  	};  
	});

	app.directive('loadInitialImage',function($http){
	      return {
	        link : function(scope, element, attrs) {
	        	if(typeof scope.x.initial != "undefined"){
	        		scope.$parent.currentSlide = scope.$index;
	        		scope.$parent.loadBackground(scope);
	        	}
	       	}
	   	};
	}); 

})(window);