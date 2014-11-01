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
    templateUrl: "views/login.html"
	}).
  when("/users", {
    templateUrl: "views/users.html",
    controller: "UsersCtrl",
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

app.controller("LoginCtrl", function($scope, $rootScope, $location, $firebase, simpleLogin, fbURL) {
	
  var authRef = fbURL.child('users');
  var authClient = new FirebaseSimpleLogin(authRef, function(error, user) {
	  if (error) {
	    // an error occurred while attempting login
	    console.log(error);
	  } else if (user) {
	  	// save new user's profile into Firebase so we can
      	authRef.child(user.uid).set({user: user});
	    // user authenticated with Firebase
	    console.log("User ID: " + user.uid + ", Provider: " + user.provider);
	    $location.path('/users');
    	$location.replace();
	  } else {
	    // user is logged out
	  }
   });

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
    $rootScope.auth = simpleLogin;
    $rootScope.auth.$login('google',{preferRedirect:true});
  }
});


app.controller("UsersCtrl", function($scope, $rootScope, $routeParams, $firebase, $location, $filter, fbURL, currentUser, simpleLogin) {
  
  var authRef = fbURL.child('users');
  //authRef.auth(currentUser.firebaseAuthToken);
  var sync = $firebase(authRef);

  $scope.auth = new FirebaseSimpleLogin(authRef, function(error, user) {
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

  //$scope.auth = currentUser;
  console.log(currentUser);

  var usersResult = sync.$asArray();
  console.log(usersResult);

  //var usersResult2 = $filter('filter')(usersResult, { $id: currentUser.uid }, function (obj, test) { 
  //                                      return obj === test; });
  //console.log(usersResult2);

  //var usersResult3 = usersResult.filter(function(item) {
  //  return item.id == currentUser.uid;
  //});
  
  //console.log(usersResult3);

  $scope.users = usersResult;
  console.log($scope.users);

  $scope.userFilter = function (item) { 
    return item.$id != $scope.auth.uid; 
  };

  $scope.clickLogout = function() {
    simpleLogin.$logout();
  }
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