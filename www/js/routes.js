angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
        
    // .state('singSong', {
    //   url: '/page1',
    //   templateUrl: 'templates/singSong.html',
    //   controller: 'singSongCtrl'
    // })
        
    .state('login', {
      cache: false,
      url: '/page1',
      templateUrl: 'templates/login.html',
      controller: 'signupCtrl'
    }) 
     
    .state('signup', {
      url: '/page2',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })
        
    .state('main', {
      url: '/page3',
      templateUrl: 'templates/main.html',
      controller: 'mainCtrl'
    })
        
    .state('profile', {
      url: '/page4',
      templateUrl: 'templates/profile.html',
      controller: 'profileCtrl'
    })

    .state('uploads',{
      url: '/page4',
      templateUrl: 'templates/upload.html',
      controller: 'uploadCtrl'
    })

    .state('vote_comment',{
      url: '/page5',
      templateUrl: 'templates/vote_comment.html',
      controller: 'votecomCtrl',
      params:{
        obj: null,
        past: ''
      }
    })  
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page1');

});