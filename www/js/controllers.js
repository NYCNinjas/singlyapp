angular.module('app.controllers', [])
  
.controller('singSongCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope, $state) {
	$scope.user = {};

 	$scope.signupEmail = function(){  
 	  //Create a new user on Parse

 	  //TODO check that confirmation password match!
	  var user = new Parse.User();
	  user.set("username", $scope.user.username);
	  user.set("password", $scope.user.password);
	  user.set("email", $scope.user.email);
	 
	  user.signUp(null, {
	    success: function(user) {
	      // Hooray! Let them use the app now.
	      alert("success!");
	    },
	    error: function(user, error) {
	      // Show the error message somewhere and let the user try again.
	      alert("Error: " + error.code + " " + error.message);
	    }
	  });
	};
 
  	$scope.loginEmail = function(){
 
  	};
})
   
.controller('mainCtrl', function($scope) {

})
 