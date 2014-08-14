angular.module('project', ['ngRoute', 'ngGrid'])
//restful 
.factory('Apps', function ($http) {
  return {
    get: function () {
      return $http.get('/api/gk/outdated');
    },
    create: function (appData) {
      return $http.post('/api/gk', appData);
    },
    update: function (id, appData) {
      return $http.put('/api/gk/' + id, appData);
    },
    delete: function (id) {
      return $http.delete('api/gk/' + id);
    }
  }
})

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ListCtrl',
      templateUrl: 'list.html'
    })
    .when('/edit/:appId', {
      controller: 'EditCtrl',
      templateUrl: 'detail.html'
    })
    .when('/new', {
      controller: 'CreateCtrl',
      templateUrl: 'detail.html'
    })
    .when('/calendar', {
      controller: 'ListCtrl',
      templateUrl: 'calendar.html'
    })
    .when('/test', {
      templateUrl: 'test.html'
    })

})

.controller('ListCtrl', function ($scope, $http, Apps) {

  $scope.Options = {
    countryProp: {
      "type": "select",
      "name": "Country",
      "value": "COL_FIELD",
      "values": ["Russia", "Ukraine", "Belarus", "Latvia", "Kazakhstan", "Lithuania", "Estonia", "Uzbekistan"]
    },
    categoryProp: {
      "type": "select",
      "name": "Category",
      "value": "COL_FIELD",
      "values": ["OTT", "Pay TV", "Broadcast", "OTT + Pay TV", "Others"]
    },
    sdpStatusProp: {
      "type": "select",
      "name": "Category",
      "value": "COL_FIELD",
      "values": ["Gk review request", "GK review", "GK Review Reject", "Verification Request", "Pre-test", "Function Testing", "Content Testing", "Final review", "App QA Approved", "App QA Rejected"]
    },
    tvProp: {
      "type": "select",
      "name": "Tv",
      "value": "COL_FIELD",
      "values": ["Approve", "Reject", "Partial"]
    },
    respProp: {
      "type": "select",
      "name": "Resp",
      "value": "COL_FIELD",
      "values": ["AS", "DP", "VE", "YK"]
    },

  };

  $scope.cellSelectEditableTemplateCountry = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.countryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateCategory = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.categoryProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateSdpStatus = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.sdpStatusProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateTv = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.tvProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateResp = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options=" v for v in Options.respProp.values" ng-blur="updateEntity(row)" />';
  $scope.cellSelectEditableTemplateUpdateTime = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD"  type="date" />';

  $scope.edit = false;
  Apps.get()

  .success(function (data) {
    $scope.apps = data;
  });

  $scope.getRowIndex = function () {
    var index = this.row.rowIndex;
    // $scope.gridOptions.selectItem(index, false);
    return index + 1;
  };

  $scope.$on('ngGridEventEndCellEdit', function (evt) {
    var currentObj = evt.targetScope.row.entity;
    console.log(currentObj); //debug
    // the underlying data bound to the row
    // Detect changes and send entity to server 
    console.log(currentObj._id); //debug 

    //update database value
    var projectUrl = currentObj._id;
    Apps.update(projectUrl, currentObj)
      .success(function (data) {
        $scope.formData = data;
      });
  });



  $scope.gridOptions = {
    data: 'apps',
    columnDefs: [{
      displayName: 'No',
      cellTemplate: '<div ><div >{{getRowIndex()}}</div></div>'
    }, {
      field: 'country',
      displayName: 'Country',
      enableCellEdit: true,
      editableCellTemplate: $scope.cellSelectEditableTemplateCountry,
    }, {
      field: 'appName',
      displayName: 'Application name',
      enableCellEdit: true
    }, {
      field: 'category',
      displayName: 'Category',
      enableCellEdit: true,
      editableCellTemplate: $scope.cellSelectEditableTemplateCategory
    }, {
      field: 'sdpStatus',
      displayName: 'SDP Status',
      enableCellEdit: true,
      editableCellTemplate: $scope.cellSelectEditableTemplateSdpStatus
    }, {
      field: 'updateTime',
      displayName: 'Update date',
      cellFilter: 'date:"yyyy-MM-dd"',
      enableCellEdit: true,
      editableCellTemplate: $scope.cellSelectEditableTemplateUpdateTime
    }, {
      field: 'seller',
      displayName: 'Seller',
      enableCellEdit: true
    }, {
      field: 'tv',
      displayName: 'Tv',
      enableCellEdit: true,
      editableCellTemplate: $scope.cellSelectEditableTemplateTv
    }, {
      field: 'currentStatus',
      displayName: 'Current status',
      cellTemplate: '<div ng-class="{green: row.getProperty(col.field)}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>',
      enableCellEdit: true
    }, {
      field: 'testCycles',
      displayName: 'Test Cycles',
      enableCellEdit: false
    }, {
      field: 'replyTime',
      displayName: 'Reply Time',
      enableCellEdit: false
    }, {
      field: 'resp',
      displayName: 'Resp',
      enableCellEdit: true,
      editableCellTemplate: $scope.cellSelectEditableTemplateResp
    }, ],
    showGroupPanel: true,
    enableColumnResize: true,
    showFilter: true,
    showFooter: true,
    filterOptions: {
      filterText: "",
      useExternalFilter: false
    }
  };


})

.controller('CreateCtrl', function ($scope, $http, Apps) {
  $scope.formData = {};
  $scope.createApp = function () {
    Apps.create($scope.formData)

    .success(function (data) {
      $scope.apps = data;
      $scope.formData = {};
    });
  };
})

.controller('EditCtrl', function ($scope, $routeParams, $location, $http, Apps) {

  $scope.edit = true;
  var projectUrl = $routeParams.appId;
  Apps.update(projectUrl, $scope.formData)
    .success(function (data) {
      $scope.formData = data;

    })

  $scope.deleteApp = function (id) {
    Apps.delete(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data; //get new list
        $location.path('/');
      });
  };

  $scope.updateApp = function (id) {
    Apps.update(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data;
        $location.path('/');
      });
  };

})

.controller('mainController', function ($scope, $http, Apps) {
  //get formData clear
  $scope.formData = {};
  //get  all apps and show them
  Apps.get()
    .success(function (data) {
      $scope.apps = data;
    });

  $scope.createApp = function () {
    Apps.create($scope.formData)
      .success(function (data) {
        $scope.apps = data;
        $scope.formData = {};
      });
  };

  $scope.deleteApp = function (id) {
    Apps.delete(id)
      .success(function (data) {
        $scope.apps = data; //get new list
      });
  };

  $scope.updateApp = function (id) {
    Apps.update(id, $scope.formData)
      .success(function (data) {
        $scope.apps = data;
      });
  };

});