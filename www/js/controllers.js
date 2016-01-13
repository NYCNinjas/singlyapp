angular.module('app.controllers', [])
  
.controller('singSongCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope, $state) {
	$scope.user = {};

 	$scope.signupEmail = function(){  
 	  //Create a new user on Parse

 	  //TODO check that confirmation password match!
	  var user = new Parse.User();
	  user.set("name", $scope.user.username);
	  user.set("password", $scope.user.password);
	  user.set("username", $scope.user.email);
	  var email_check = $scope.user.email.split("@");
	  if(email_check.length !== 2){
	  	alert("Please enter valid email address");
	  }else{
	  	var left_side = email_check[0].split(".");
	  	var right_side = email_check[1].split(".");
	  	if(right_side.length === 2 && (left_side.length === 2 || left_side.length === 1)){
	  		user.signUp(null, {
	    		success: function(user) {
	      			// Hooray! Let them use the app now.
	      			alert("success!");
	      			$state.go("main");
	    		},
	    		error: function(user, error) {
	      			// Show the error message somewhere and let the user try again.
	      			alert("Error: " + error.code + " " + error.message);
	    		}
	  		});
	  	}else{
	  		alert("Please enter valid email address"); 
	  	}

	  }
	};
 
  	$scope.loginEmail = function(){
 		Parse.User.logIn($scope.user.email, $scope.user.password, {
    		success: function(user) {
      		// Do stuff after successful login.
      		console.log(user);
      		alert("success!");
      		$state.go("main");
    	},
    	error: function(user, error) {
      	// The login failed. Check error to see why.
      	alert("Error: " + error.code + " " + error.message);
    	}
  	  });
  	};
})
   
.controller('mainCtrl', function($scope) {

})
 