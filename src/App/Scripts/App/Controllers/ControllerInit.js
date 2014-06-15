﻿
//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

var FinancialApp;
(function(FinancialApp) {

    var controllerInitializer = {

        registerControllers: function($app) {
                    $app.controller('ArchiveController', FinancialApp.ArchiveController);
                    $app.controller('CategoryCreateController', FinancialApp.CategoryCreateController);
                    $app.controller('CategoryEditController', FinancialApp.CategoryEditController);
                    $app.controller('CategoryListController', FinancialApp.CategoryListController);
                    $app.controller('DefaultController', FinancialApp.DefaultController);
                    $app.controller('MasterController', FinancialApp.MasterController);
                    $app.controller('MenuController', FinancialApp.MenuController);
                    $app.controller('SheetController', FinancialApp.SheetController);
            },

        registerControllerRoutes: function($routeProvider) {
                $routeProvider.when('/archive', 
                {
                    controller: 'ArchiveController',
                    templateUrl: '/Angular/Archive.html'
                });
                $routeProvider.when('/manage/category/add', 
                {
                    controller: 'CategoryCreateController',
                    templateUrl: '/Angular/CategoryEdit.html'
                });
                $routeProvider.when('/manage/category/edit/:id', 
                {
                    controller: 'CategoryEditController',
                    templateUrl: '/Angular/CategoryEdit.html'
                });
                $routeProvider.when('/manage/category', 
                {
                    controller: 'CategoryListController',
                    templateUrl: '/Angular/CategoryList.html'
                });
                $routeProvider.when('/', 
                {
                    controller: 'DefaultController',
                    templateUrl: '/Angular/Default.html'
                });
                $routeProvider.when('/sheet/:year/:month', 
                {
                    controller: 'SheetController',
                    templateUrl: '/Angular/Sheet.html'
                });
            },
    };

    FinancialApp.ControllerInitializer = controllerInitializer;

})(FinancialApp || (FinancialApp = {}));


