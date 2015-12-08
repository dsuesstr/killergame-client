module $injections{

    export module Directives {
        export var RankingDirective: string = 'ranking';
        export var FieldDirective: string = 'field';
    }

    export module Constants{
        export var ApiHost: string = 'ApiHost';
        export var AppName:string = 'Killergame';
        export var HostConstant:string = 'host';
        export var $Angular:string = '$angular';
        export var $Navigator:string = '$navigator';
        export var $JQuery:string = '$jquery';
        export var $Enumerable:string = '$Enumerable';
        export var PedestrianRouteHost:string = 'PedestrianRouteHost';
    }

    export module Filters{
        export var DurationFilter:string = 'duration';
        export var FormatFilter:string = 'format';
    }

    export module Routes{
        export var AccountState:string = 'account';
        export var LobbyState:string = 'menu.lobby';
        export var InfoState:string = 'menu.info';
        export var PlayerState:string = 'menu.player';
        export var GameState:string = 'menu.game';
        export var RankingState:string = 'menu.ranking';
        export var SettingsState:string = 'menu.settings';
    }

    export module Controllers{
        export var LobbyController:string = 'LobbyController';
        export var InfoController:string = 'InfoController';
        export var PlayerController:string = 'PlayerController';
        export var LoadingController: string = 'LoadingController';
        export var RankingController: string = 'RankingController';
        export var SettingsController: string = 'SettingsController';
        export var AccountController: string = 'AccountController';
        export var MenuController: string = 'MenuController';
        export var GameController: string = 'GameController';
    }

    export module Services{
        export var OpenLink:string = 'OpenLink';
        export var LocalStorage:string = 'LocalStorage';
        export var Navigation: string = 'Navigation';
        export var Logger: string = 'Logger';
        export var Urls: string = 'Urls';
        export var AccountHandler: string = 'LoginHandler';
        export var PlayerProvider: string = 'PlayerProvider';
        export var GameProvider: string = 'GameProvider';
        export var GameHandler: string = 'GameHandler';
        export var ApiSettingsHandler: string = 'ApiSettingsHandler';
        export var ApiSettingsProvider: string = 'ApiSettingsProvider';
        export var Converter: string = 'Converter';
        export var Strings: string = 'Strings';
    }

    export module Ionic{
        export var $ionicLoading:string = '$ionicLoading';
        export var $ionicPopup:string = '$ionicPopup';
        export var $ionicHistory: string = '$ionicHistory';
        export var $ionicConfig: string = '$ionicConfig';
        export var $ionicScrollDelegate: string = '$ionicScrollDelegate';
        export var $ionicBackdrop: string = '$ionicBackdrop';
    }

    export module Angular{
        export var $templateCache:string = '$templateCache';
        export var $interpolate:string = '$interpolate';
        export var $injector:string = '$injector';
        export var $Scope:string = '$scope';
        export var $RootScope:string = '$rootScope';
        export var $filter:string = '$filter';
        export var $controller:string = '$controller';
        export var $HttpService:string = '$http';
        export var $HttpProvider:string = '$httpProvider';
        export var $QService:string = '$q';
        export var $TimeoutService:string = '$timeout';
        export var $IntervalService:string = '$interval';
        export var $Window:string = '$window';
        export var $SCEDelegateProvider:string = '$sceDelegateProvider';
    }

    export module Plugins {
        export var NetworkConnectionPlugin:string = 'NetworkConnectionPlugin';
        export var GlobalizationPlugin:string = 'GlobalizationPlugin';
    }

    export module UIRouter{
        export var $StateProvider:string = '$stateProvider';
        export var $UrlRouterProvider:string = '$urlRouterProvider';
        export var $StateService:string = '$state';
        export var $StateParams:string = '$stateParams';
    }
}