var app = angular.module("ChatApp", ["ngMaterial", "ngRoute", "firebase", "lk-google-picker"])
.config(['lkGoogleSettingsProvider', function(lkGoogleSettingsProvider) {

  lkGoogleSettingsProvider.configure({
    apiKey   : 'AIzaSyAnYxzizdvb6TMiIpDgBW_FAXXLeSgDnzU',
    clientId : '752915435201-8ufbg59v14uc69fv6egfn23accvdrk92.apps.googleusercontent.com',
    scopes 	 : ['https://www.googleapis.com/auth/plus.login'],
    locale   : 'pt-br'
   })
 }]);

//Router
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.
  when("/login", {
    controller: "LoginCtrl",
    templateUrl: "views/login.html"
	}).
  when("/users", {
    controller: "UsersCtrl",
    templateUrl: "views/users.html",
        resolve: {
      // controller will not be loaded until $getCurrentUser resolves
      // simpleLogin refers to our $firebaseSimpleLogin wrapper in the example above
      "currentUser": ["simpleLogin", function(simpleLogin) {
        // $getCurrentUser returns a promise so the resolve waits for it to complete
        return simpleLogin.$getCurrentUser();
      }]
    }
  }).
  when("/chat", {
    controller: "ChatCtrl",
    templateUrl: "views/chat.html"
  }).
  	otherwise({
        redirectTo: '/login'
      });
}]);

app.factory("fbURL",["$firebase",function($firebase) {
  var ref = new Firebase("https://fiery-fire-1483.firebaseio.com");
  return ref;
}]);

app.factory("simpleLogin", ["$firebaseSimpleLogin", "fbURL", function($firebaseSimpleLogin, fbURL) {
  return $firebaseSimpleLogin(fbURL);
}]);

app.controller("LoginCtrl", function($scope, $rootScope, $location, $firebase, simpleLogin) {
  
  
  /*var isNewUser = true;
  var authClient = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      if( isNewUser ) {
      // save new user's profile into Firebase so we can
      ref.child('users').child(user.uid).set({
        user: user});
    }
      $location.path('/users');
      $location.replace();
    }
  });*/

  $scope.clickLogin = function() {
    
    //var sync = $firebase(ref);
    $rootScope.auth = simpleLogin;
    $rootScope.auth.$login('google',{preferRedirect:true});
    //$scope.users = sync.$asArray();
    //$scope.users.$add({user:$rootScope.auth.user});
    $location.path('/users');
    $location.replace();
  }
});


app.controller("UsersCtrl", function($scope, $rootScope, $routeParams, $firebase, $location, fbURL, currentUser) {

  var ref = fbURL.child('users');
  var sync = $firebase(ref);

  /*$scope.auth = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      $scope.auth = user;
      console.log(user);
    } else{
      $location.path('/login');
      $location.replace();
    }
  });*/
  $scope.auth = currentUser;

  $scope.users = sync.$asArray();
  console.log($scope.users);
});


app.controller("ChatCtrl", function($scope, $rootScope, $routeParams, $firebase, $firebaseSimpleLogin, $location) {

  $scope.files = [];

  var ref = new Firebase("https://fiery-fire-1483.firebaseio.com/messages");
  var sync = $firebase(ref);

  $scope.auth = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      console.log(error);
    } else if (user) {
      $scope.auth = user;
      console.log(user);
    } else{
      $location.path('/login');
      $location.replace();
    }
  });

  //console.write($scope.auth);

  //ref.child($scope.auth.user);

  $scope.messages = sync.$asArray();

  $scope.addMessage = function(text, user) {
    $scope.messages.$add({text: text, user: user});
    $scope.newMessageText = "";
  }

  $scope.clickLogout = function() {
    $scope.auth = $firebaseSimpleLogin(ref);
    $scope.auth.$logout();
  }
});