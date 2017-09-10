var myApp =angular.module("quizApp", ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html'
  })
  .state('quize', {
      url: '/quize',
      templateUrl: 'templates/quize.html',
      controller:'MainCtrl'
  })
  .state('result', {
      url: '/result',
      templateUrl: 'templates/result.html',
      controller:'resultCtrl',
      params: {
        paramOne: { objectProperty: "defaultValueOne" },  //default value
        paramTwo: "defaultValueTwo"
    }
  });
    $urlRouterProvider.otherwise('/home');
})

.controller('MainCtrl', function($scope, $http, $state) {
  $scope.quizModel = {
    userAnsers: []
  };
  $scope.loadQuizeData = function() {
    $http.get('http://10.222.111.152:3000/v1/quiz/questions')
    .success(function(data) {
      $scope.formData = data;
    })
    .error(function(err, data) {
      console.log(err);
    });
  }

  $scope.submitForm = function() {
    var resData = [];
    for(var i=0; i<$scope.quizModel.userAnsers.length; i++) {
      resData.push({
        questionID: i + 1,
        answer: $scope.quizModel.userAnsers[i]
      })
    }
    $http.post('http://10.222.111.152:3000/v1/quiz/form/submit', {userData : resData})
    .success(function(data) {
      $state.go("result", {
        user_id: 1,
        paramOne: { result: data.success.message }
      });
      $scope.quizeResult = data.success.message;
    })
    .error(function(err, status) {
      console.log(err);
    });
   }
})

.controller('resultCtrl', function($stateParams, $scope) {
    $scope.result = $stateParams.paramOne.result;
})
