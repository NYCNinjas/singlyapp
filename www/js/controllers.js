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


.controller('profileCtrl', function($scope, $state) {

	$scope.users = [{
		'name':Parse.User.current().attributes.name,
		'time': new Date(Parse.User.current().createdAt),
		'appName':'SingSong'
	}];

	$scope.usernames = Parse.User.current().attributes.username;

	var querys = new Parse.Query("Song");
	querys.equalTo("user", Parse.User.current());
	querys.find({
		success: function(songs){
			$scope.mySongs = songs
		}
	});

	$scope.voteAndComment = function(data){
		$state.go('vote_comment',{obj: data});
	}

	$scope.logout = function(){
		Parse.User.logOut();
		$state.go("login");
	}

})

.controller('mainCtrl', function($scope, $state) {

	var query = new Parse.Query("Song");
	query.find({
  		success: function(results) {
			$scope.songs = results;
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

	$scope.voteAndComment = function(data){
		$state.go('vote_comment',{obj: data});
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

.controller('votecomCtrl', function($scope, $stateParams, $state){

	$scope.user = {
		comment : ""
	};

	var displayComment = new Parse.Query("Comments");
	displayComment.equalTo("song",$stateParams.obj);
	displayComment.include("user");
	displayComment.find({
		success: function(results){
			console.log(results),
			$scope.allComments = results
		}
	});

	//querying the songs from the DB
	var querys = new Parse.Query("Song");
	querys.equalTo("objectId",$stateParams.obj.id);
	querys.find({
		success: function(results){
			console.log(results[0].attributes.songFile._url),
			$scope.linking = results[0].attributes.songFile._url,
			$scope.urls = results
		}
	});

	//querying the votes for the given song from the DB
	var vot = new Parse.Query("Song_Votes");
	vot.equalTo("song",$stateParams.obj);
	vot.find({
		success: function(voteData){
			$scope.calculate(voteData),
			$scope.voted = voteData.length
		}
	});

	//querying the signed in user who has voted for the selected list of songs
	vot.equalTo("users",Parse.User.current());
	vot.find({
		success: function(results){
			$scope.ui_refactor(results)
		}
	});

	//function called with the information of the user and the song s/he voted
	$scope.ui_refactor = function(results){
		console.log(results[0]);
		if(results[0] !== undefined){
			if(results[0].attributes.up_down === 1){
				$scope.upVoted = true;
				$scope.downVoted = false;
			}else if(results[0].attributes.up_down === -1){
				$scope.downVoted = true;
				$scope.upVoted = false;
			}
		}
	}

	$scope.calculate = function(data){
		$scope.sum = 0;
		for(var i=0; i<data.length; i++){
			$scope.sum = $scope.sum + data[i].attributes.up_down;
		}
	}

	$scope.vote = function(vote){
		//writing query to cast vote for a selected song
		if($("#down_"+$stateParams.obj.id).hasClass("disabled") === false && $("#up_"+$stateParams.obj.id).hasClass("disabled") === false){
			console.log("It comes here");
			var Voting = Parse.Object.extend("Song_Votes");
			votes = new Voting();
			votes.set("users",Parse.User.current());
			votes.set("up_down",vote);
			votes.set("song",$stateParams.obj);
			votes.save(null,[]);
		}else if(($("#down_"+$stateParams.obj.id).hasClass("disabled") === true && $("#up_"+$stateParams.obj.id).hasClass("disabled") === false) 
			|| ($("#down_"+$stateParams.obj.id).hasClass("disabled") === false && $("#up_"+$stateParams.obj.id).hasClass("disabled") === true)){
			var Voting = Parse.Object.extend("Song_Votes");
			votes = new Parse.Query(Voting);
			votes.equalTo("users",Parse.User.current());
			votes.equalTo("song",$stateParams.obj);
			votes.first({
				success: function(object){
					object.set("up_down",vote);
					object.save();
				}
			});
		}
		if(vote === 1){
			$scope.upVoted = true;
			$scope.downVoted = false;
		}else if(vote === -1){
			$scope.downVoted = true;
			$scope.upVoted = false;
		}
	}

	$scope.submitComment = function(){
		if($scope.user.comment.trim().length === 0){
			alert("You cannot submit empty comment");
		}else{
			var songComment = Parse.Object.extend("Comments");
			var commentObj = new songComment();
			commentObj.set("user",Parse.User.current());
			commentObj.set("song",$stateParams.obj);
			commentObj.set("body",$scope.user.comment.trim());
			commentObj.save(null,[]);
			$scope.user.comment = "";
		}
	}

	$scope.goBack = function(){
		$state.go('main');
	}

})
 