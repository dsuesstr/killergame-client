/// <reference path='injections.ts'/>
/// <reference path='registrations.ts'/>
'use strict';

declare var cordova: any;
declare var StatusBar: any;
declare var ionic: any;


ionic.Platform.isIE = function () {
    return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
}
//Fix ionic issue on windows phone with executing click handler twice
if (ionic.Platform.isIE()) {
    angular.module('ionic')
        .factory('$ionicNgClick', ['$parse', '$timeout', function ($parse, $timeout) {
        return function (scope, element, clickExpr) {
            var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);
            element.on('click', function (event) {
                scope.$apply(function () {
                    if (scope.clicktimer) return; // Second call
                    clickHandler(scope, { $event: (event) });
                    scope.clicktimer = $timeout(function () { delete scope.clicktimer; }, 10, false);
                });
            });

            // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
            // something else nearby.
            element.onclick = function (event) { };
        };
    }]);
}

var application = angular.module($injections.Constants.AppName, [
    'ionic'
])
    .run(function ($ionicPlatform) {

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if ((<any>window).cordova && (<any>window).cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if ((<any>window).StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        ionic.Platform.fullScreen();
    });
});

