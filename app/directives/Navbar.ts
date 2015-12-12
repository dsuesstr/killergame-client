/// <reference path='../min.references.ts'/>

module Directives {

    interface INavbarScope extends angular.IScope {
        CurrentPlayer:Models.Messages.IPlayer;
    }

    class Navbar implements angular.IDirective {

        restrict:string = "E";
        templateUrl:string = "app/views/directives/navbar.html";

        static $inject = [
            $injections.Services.PlayerProvider
        ];

        constructor(private playerProvider: Services.IPlayerProvider) {
        }

        link = ($scope:INavbarScope) => {
            $scope.CurrentPlayer = this.playerProvider.GetCurrentPlayer();
            console.log($scope.CurrentPlayer.username)
        };
    }

    var NavbarDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(Navbar);
    }];

    export class NavbarDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.NavbarDirective, NavbarDirectiveProvider);
        }
    }
}