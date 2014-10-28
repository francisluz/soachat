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
  $routeProvider.when("/chat", {
    controller: "ChatCtrl",
    templateUrl: "../views/chat.html"
	}).
  	otherwise({
        redirectTo: '/chat'
      });
}]);




app.controller("ChatCtrl", function($scope, $routeParams, $firebase, $firebaseSimpleLogin) {

  $scope.files = [];

  var ref = new Firebase("https://fiery-fire-1483.firebaseio.com/messages");
  var sync = $firebase(ref);

  $scope.auth = $firebaseSimpleLogin(ref);

  //console.write($scope.auth);

  //ref.child($scope.auth.user);

  $scope.messages = sync.$asArray();

  $scope.addMessage = function(text, user) {
    $scope.messages.$add({text: text, user: user});
    $scope.newMessageText = "";
  }
});