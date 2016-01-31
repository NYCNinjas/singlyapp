angular.module('app.controllers', [])

.controller('singSongCtrl', function($scope) {

})

.controller('signupCtrl', function($scope, $state, $ionicHistory) {

	$ionicHistory.viewHistory().currentView.canSwipeBack = false;
	$ionicHistory.clearHistory();
	console.log($ionicHistory.viewHistory());

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

  	$scope.backToLogin = function(){
  		$state.go("login");
  	};

  	$scope.signUpPage = function(){
  		$state.go("signup");
  	}
})


.controller('profileCtrl', function($scope, $state, $ionicHistory) {

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
		$state.go('vote_comment',{obj: data,past:'profile'});
	}

	$scope.backToMain = function(){
		$state.go('main');
	}

	$scope.logout = function(){
		Parse.User.logOut();
		$state.go('login');
	}

})

.controller('mainCtrl', function($scope, $state, $ionicHistory) {

	function getSongs(){
		var query = new Parse.Query("Song");
		query.find({
	  		success: function(results) {
	  			console.log("Successfully retrieved " + results.length + " item");
				$scope.songs = results;
        		$scope.$apply();
				// console.log($scope.songs[0]);
	  		},
  			error: function(error) {
  			    // error is an instance of Parse.Error.
  			 }

	   });
       	// Stop the ion-refresher from spinning
   		$scope.$broadcast('scroll.refreshComplete');
  	}

  	getSongs();


	$scope.upload = function(){
		$state.go('uploads');
	}

	$scope.logout = function(){
		Parse.User.logOut();
		$state.go("login");
	}

	$scope.profilePage = function(){
		$state.go('profile');
	}

	$scope.voteAndComment = function(data){
		$state.go('vote_comment',{obj: data, past:'main'});
	}


  $ionicHistory.viewHistory().currentView.canSwipeBack = false;
  $ionicHistory.clearHistory();

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
				//TODO check the filetype! hardcoded for android
                var parseFile = new Parse.File(name + ".m4a", file, "audio/x-m4a");
                // on android system file is not instance of File
                // that's why Parse.File constructor don't read file content
                if (parseFile._source == null)
                	parseFile._source = readAsync1(file);
                console.log(parseFile);

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

	var readAsync1 = function(file, type) {
	    var promise = new Parse.Promise();

	    if (typeof(FileReader) === "undefined") {
	      return Parse.Promise.error(new Parse.Error(
	          Parse.Error.FILE_READ_ERROR,
	          "Attempted to use a FileReader on an unsupported browser."));
	    }

	    var reader = new FileReader();
	    reader.onloadend = function() {
	      if (reader.readyState !== 2) {
	        promise.reject(new Parse.Error(
	            Parse.Error.FILE_READ_ERROR,
	            "Error reading file."));
	        return;
	      }

	      var dataURL = reader.result;
	      var matches = /^data:([^;]*);base64,(.*)$/.exec(dataURL);
	      if (!matches) {
	        promise.reject(new Parse.Error(
	            Parse.Error.FILE_READ_ERROR,
	            "Unable to interpret data URL: " + dataURL));
	        return;
	      }

	      promise.resolve(matches[2], type || matches[1]);
	    };
	    reader.readAsDataURL(file);
	return promise;
  };

	$scope.goBack = function(){
		$("#vidAud").val("");
		$scope.song.names = "";
		$state.go('main');
	}

	$scope.timer = function(){
	 	var time = 5;
		var initialOffset = '440';
		var i = 1
		var interval = setInterval(function() {
    		$('.circle_animation').css('stroke-dashoffset', initialOffset-(i*(initialOffset/time)));
    		$('h2').text(i);
    		if (i == time) {
        		clearInterval(interval);
    		}
    		i++;  
		}, 1000);
    }

$scope.songFile = null;

$scope.recordd = function() {
    /*navigator.device.capture.captureAudio(
        captureSuccess,captureError,{duration:10});*/
	var src = "trial.amr";
	var mediaRec = new Media(src,
      // success callback
      function() {
          console.log("recordAudio():Audio Success");
      },

      // error callback
      function(err) {
          console.log("recordAudio():Audio Error: "+ err.code);
      }
      );
	alert(mediaRec);
	mediaRec.startRecord();
	$scope.timer();
	setTimeout(function() {
    	mediaRec.stopRecord();
    	alert($scope.songFile);
    	$scope.songFile = mediaRec;
    	alert(mediaRec+" "+275);
    	mediaRec.play();
    }, 5000);
}
$scope.playy = function() {
    if($scope.songFile === null) {
        navigator.notification.alert("Record a sound first.", null, "Error");
        return;
    }else{
    	$scope.songFile.play();
    }
}
$scope.uploadVoice = function(){
	if($scope.songFile === null) {
        alert("The song selection is empty")
        return;
    }else{
    	var Songs = Parse.Object.extend("Song");
		var singsong = new Songs();
		var parseFile = new Parse.File("trial.amr", $scope.songFile);
		alert(parseFile);
		singsong.set("songFile",parseFile);
		alert(parseFile);
		singsong.set("title",$scope.song.names);
		alert(parseFile);
		singsong.set("user", Parse.User.current());
		alert(parseFile);
		singsong.save(null,{});
		alert(parseFile);
		alert($scope.songFile);
		$scope.songFile = null;
		alert($scope.songFile);
    }
}
//----------------------------------------------------------------------------------
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

	var my_media;
	// Playing the audio with Cordova Media plugin
	$scope.playSong = function(song){
		if (my_media== null) {
    		my_media = new Media(song._url, onSuccess, onError);
    	}
    	// Play audio
    	my_media.play();
	}

	$scope.pauseSong = function(){
    	// Pause audio
    	my_media.pause();
	}
	// onSuccess Callback
	function onSuccess() {
    	console.log("playAudio():Audio Success");
	}

	// onError Callback
	function onError(error) {
    	alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
	}

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
			var Voting = Parse.Object.extend("Song_Votes");
			votes = new Voting();
			votes.set("users",Parse.User.current());
			votes.set("up_down",vote);
			votes.set("song",$stateParams.obj);
			votes.save(null,[]);
			$scope.voted += 1;
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
			$scope.sum += 1;
		}else if(vote === -1){
			$scope.downVoted = true;
			$scope.upVoted = false;
			$scope.sum -= 1;
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
			$scope.allComments.push(commentObj);
		}
	}

	$scope.goBack = function(){
		$state.go($stateParams.past);
	}

})
