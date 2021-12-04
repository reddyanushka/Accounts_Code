angular.module('library').controller('Dashboard',function($scope,$http,$filter, $localStorage,$window,$route,$rootScope,apiurl){

 
 	if(!$window.localStorage.getItem('logindata')){
			window.location.href = 'login.html';
		}
		 $scope.userdata = JSON.parse($window.localStorage.getItem('logindata'));
		
		//console.log($scope.userdata);
		
		 $scope.logountnow =  function(){
		 	window.localStorage.removeItem('logindata');
		    window.location.href = 'login.html';
	 
	 		}
			
			 
			var apiurl = apiurl.getUrl();
			
			//var apiurl = "http://10.60.1.19:3000/api/";

			
		
	

 

 });
