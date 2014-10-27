var app = angular.module("ChatApp", ["ngMaterial", "firebase"]);

app.controller("ChatCtrl", function($scope, $firebase, $firebaseSimpleLogin) {
  var ref = new Firebase("https://fiery-fire-1483.firebaseio.com/messages");
  var sync = $firebase(ref);

  $scope.auth = $firebaseSimpleLogin(ref);

  $scope.messages = sync.$asArray();

  $scope.addMessage = function(text) {
    $scope.messages.$add({text: text});
    $scope.newMessageText = "";
  }
});