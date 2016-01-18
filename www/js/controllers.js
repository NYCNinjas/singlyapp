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
      		$scope.user.email = "";
      		$scope.user.password = "";
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


   .controller('profileCtrl', function($scope) {

})

.controller('mainCtrl', function($scope, $state) {

	var query = new Parse.Query("Song");
	query.find({
  		success: function(results) {
  		console.log("Successfully retrieved " + results.length + " item");
			$scope.songs = results;
			console.log($scope.songs[0]);
  		},
		error: function(error) {
		    // error is an instance of Parse.Error.
		 }
	});
	
	$scope.upload = function(){
		$state.go('uploads');
	}
	
	$scope.logout = function(){
		Parse.User.logOut();
		$state.go("login");
	}

})

.controller('uploadCtrl', function($scope, $state) {

	$scope.song = {};

	$scope.upload = function(){

			//create a new object to be saved as Parse Song 
			var Songs = Parse.Object.extend("Song");
			var singsong = new Songs();

			//get uploaded file
			var fileUploadControl = $("#vidAud")[0];
			//check that file was uploaded successfully 
			if (fileUploadControl.files.length > 0) {
				var file = fileUploadControl.files[0];
				var name = "s_" + $("#vidAud").val().split("\\").pop();
				//create a Parse file object
				var parseFile = new Parse.File(name, file);

				singsong.set("songFile",parseFile);
				singsong.set("title",$scope.song.names);
				singsong.set("user", Parse.User.current());
				singsong.save(null,[]);
			
			//clean the variables and redirect to main page
			$("#vidAud").val("");
			$scope.song.names = "";
			$state.go('main');
		}else{
			alert("Please select a file to upload");
		}
	}

	$scope.goBack = function(){
		$("#vidAud").val("");
		$scope.song.names = "";
		$state.go('main');
	}

})
 