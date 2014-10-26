var app = angular.module("ChatApp", ["firebase"]);

app.controller("ChatCtrl", function($scope, $firebase) {
  var ref = new Firebase("https://fiery-fire-1483.firebaseio.com/messages");
  var sync = $firebase(ref);
  $scope.messages = sync.$asArray();

  $scope.addMessage = function(text) {
    $scope.messages.$add({text: text});
  }
});