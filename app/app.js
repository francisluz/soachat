var app = angular.module("ChatApp", ["ngMaterial", "firebase", "lk-google-picker"])
.config(['lkGoogleSettingsProvider', function(lkGoogleSettingsProvider) {

  lkGoogleSettingsProvider.configure({
    apiKey   : 'AIzaSyAnYxzizdvb6TMiIpDgBW_FAXXLeSgDnzU',
    clientId : '752915435201-qf5shuiaos1rks9k8bcgccadtcuvf4tt.apps.googleusercontent.com',
    scopes 	 : ['https://www.googleapis.com/auth/plus.login'],
    locale   : 'pt-br'
   })
 }]);


app.controller("ChatCtrl", function($scope, $firebase, $firebaseSimpleLogin) {

  $scope.files = [];

  var ref = new Firebase("https://fiery-fire-1483.firebaseio.com/messages");
  var sync = $firebase(ref);

  $scope.auth = $firebaseSimpleLogin(ref);

  $scope.messages = sync.$asArray();

  $scope.addMessage = function(text) {
    $scope.messages.$add({text: text});
    $scope.newMessageText = "";
  }
});