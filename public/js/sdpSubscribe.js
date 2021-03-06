angular.module('sdpSubscribe', ['ngSanitize', 'ui.select'])

.factory('Subscribe', function ($http) {
  return {
    get: function() {
      return $http.get('/tools/subscribemember/all');
    },
    startWatch: function(id, data) {
      return $http.put('/tools/subscribemember/watch/' + id, data);
    },
    unsubscribe: function(id, subId) {
      return $http.put('/tools/subscribemember/unsubscribe/' + id, subId);
    },
    subscribe: function(id, subId) {
      return $http.put('/tools/subscribemember/subscribe/' + id, subId)
    },
    update: function(id, data) {
      return $http.put('/tools/subscribemember/' + id, data);
    }
  }
})

.factory('Members', function($http) {
    return {
      get: function() {
        return $http.get('/tools/sbcMember/getall');
      }
    };
})

.filter('propertyFilter', function($log) {
 return function(items, props) {
    var out = [];
    if (angular.isArray(items)) {
    items.forEach(function(item) {
        var itemMatches = false;
        var keys = Object.keys(props);
        var optionValue = '';
        for (var i = 0; i < keys.length; i++) {
             optionValue = item[keys[i]] ? optionValue + item[keys[i]].toString().toLowerCase().replace(/ /g, '') : '';
        }
        for (var j = 0; j < keys.length; j++) {
            var text = props[keys[j]].toLowerCase().replace(/ /g, '');
            if (optionValue.indexOf(text) !== -1) {
               itemMatches = true;
               break;
            }
        }
        if (itemMatches) {
            out.push(item);
        }
        });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
})

.controller('subscribe', function($scope, Subscribe, Members) {
  function sortName(a, b) {
    // test localeCompate
    if (a.name === undefined || b.name === undefined) return 0
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    return 0;
  }
  $scope.data = {};
  $scope.subList = [];
  $scope.endOfWatch = false;
  $scope.newAppSubId = {};

  Subscribe.get()
  .success(function(data) {
    $scope.data = data;

    $scope.watching = data.filter(function(s) {
      return s.watch === true;
    });

    $scope.notWatching = data.filter(function(s) {
      return (s.watch === false) || (s.watch === undefined);
    });

    $scope.notWatching = $scope.notWatching.sort(sortName);
    $scope.watching = $scope.watching.sort(sortName);
  });

  Members.get()
  .success(function(data) {
    $scope.subscribers = data;
    $scope.subscribers = $scope.subscribers.sort(sortName);
    $scope.form = {
      applications: $scope.watching,
      issue: "",
      story: "",
      subscribers: [],
      subList: [],
      subId: []
    }
    Object.assign($scope.form.subscribers, $scope.subscribers);

  });

  $scope.$watch('newAppSubId.select', function(n) {
    console.log(n);
  });

  $scope.submit = function() {
    console.dir({
      id: $scope.newAppSubId.select._id,
      story: $scope.form.story,
      issue: $scope.form.issue,
      subscribers: $scope.form.subId,
    });

    var response = {subs: $scope.form.subId, jira: {story: $scope.form.story, issue: $scope.form.issue}};

    if($scope.form.subId.length === 0) {
      // alert("PLEASE ADD SUBSCRIBERS");
      $('#hidden-msg').show().css({'color': 'red'}).animate({opacity:0}, 1000, "linear",function(){
        $(this).animate({opacity:1}, 1000);
      });
    } else {
      Subscribe.startWatch($scope.newAppSubId.select._id, response)
      .success(function() {
        $scope.newAppSubId = {};

        $('.modal').modal('hide')

      });

        for(var i = 0; i < $scope.notWatching.length; i++) {
          if($scope.notWatching[i]._id == $scope.newAppSubId.select._id) {
            $scope.notWatching[i].subscribers = $scope.notWatching[i].subscribers.concat($scope.form.subId);
            $scope.notWatching[i].story = $scope.form.story;
            $scope.notWatching[i].issue = $scope.form.issue;
            $scope.watching.push($scope.notWatching[i]);
            $scope.notWatching.splice(i, 1);
          }
        }

    }

  }

  $scope.addSubscribe = function(data) {
    for (var i = 0; i < $scope.form.subscribers.length; i++) {
      if($scope.form.subscribers[i] && $scope.form.subscribers[i].name == data)  {
        $scope.form.subId.push($scope.form.subscribers[i]);
        $scope.form.subList.push(data);
        $scope.form.subscribers.splice(i, 1);
        $scope.newSub = null;
      }
    }
  }

  $scope.clearForm = function() {
    $scope.form = {
      applications: $scope.watching,
      subList: [],
      subId: [],
      subscribers: []
    };
    Object.assign($scope.form.subscribers, $scope.subscribers);
    $scope.newAppSubId = {};
    $('#hidden-msg').hide();
  }


  $scope.unsubscribe = function(appId, sub) {
      Subscribe.unsubscribe(appId, {
        sub: sub
      })
        .success(function() {
          var index = findInCollection($scope.watching, "_id", appId);
          var subIndex = findInCollection($scope.watching[index].subscribers, "_id", sub);
          $scope.watching[index].subscribers.splice(subIndex, 1);

          // move on from watching if sub length = 0;
          if($scope.watching[index].subscribers.length === 0) {
            $scope.watching[index].watch = false;
            $scope.notWatching.push($scope.watching[index]);
            $scope.watching.splice(index, 1);
          }
        });
  }

  function findInCollection(collection, elem, val) {
    for(var i = 0; i <= collection.length; i++) {
      if(collection[i][elem] === val) {
        return i;
      }
    }
  }

  $scope.addSub = function(appId, subArray) {
    // $('.modal').modal('show')
    $scope.currentAppId = appId;
    $scope.unsubs = [];
    // $scope.subs = $scope.subscribers.slice();
    for(var i = 0; i < $scope.subscribers.length; i++) {
      var check = true;
      for(var j = 0; j < subArray.length; j++) {
        if($scope.subscribers[i]._id === subArray[j]._id) {
          check = false;
        }
      }
      if(check) $scope.unsubs.push($scope.subscribers[i]);
      check = true;
    }
  }
  $scope.subSubmit = function(appId, subId) {
    Subscribe.subscribe(appId, {
      subId: subId
    })
    .success(function() {
      var index = findInCollection($scope.watching, "_id", appId);
      var subIndex = findInCollection($scope.subscribers, "_id", subId);
      $scope.watching[index].subscribers.push($scope.subscribers[subIndex]);
      $scope.newSubscriber = null;
      $('.modal').modal('hide');
    });
  };

  $scope.editJiraTickets = function(appId, story, issue) {
    if(!$scope.edit) {
      $scope.edit = {};
    }
    $scope.currentAppId = appId;
    $scope.edit.issue = issue;
    $scope.edit.story = story;
  };

  $scope.editJira = function(appId, jira) {
    Subscribe.update(appId, {
      story: $scope.edit.story,
      issue: $scope.edit.issue,
    })
    .success(function() {
      for(var i = 0; i < $scope.watching.length; i++) {
        if($scope.watching[i]._id == $scope.currentAppId) {
          $scope.watching[i].story = $scope.edit.story;
          $scope.watching[i].issue = $scope.edit.issue;
        }
      }
      $scope.currentAppId = null;
      $scope.edit = {};
      $('.modal').modal('hide');
    });
  };
});
