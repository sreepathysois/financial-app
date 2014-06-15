/// <reference path="../../typings/angularjs/angular.d.ts" /> 
/// <reference path="../../typings/moment/moment.d.ts" />

module ng.Moment {
    'use strict';

    angular.module('ngMoment', [])
        .filter("moment", () => function(input: any, format: string) {
            return moment(input).format(format);
        });
}