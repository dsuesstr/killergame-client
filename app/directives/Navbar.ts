/// <reference path='../min.references.ts'/>

module Directives {
    'use strict';

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

        /**
         * Register DOM listeners and update the DOM
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param $scope
         */
        public link = ($scope:INavbarScope) => {
            $scope.CurrentPlayer = this.playerProvider.GetCurrentPlayer();
        };
    }

    /**
     * injects the NavbarDirectiv
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     * @type {any[]}
     */
    var NavbarDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(Navbar);
    }];


    /**
     * Registers the NavbarDirectiveProvider as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class NavbarDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.NavbarDirective, NavbarDirectiveProvider);
        }
    }
}