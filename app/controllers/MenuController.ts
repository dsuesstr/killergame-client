﻿/// <reference path='../min.references.ts'/>

module Controllers {

  interface IMenuScope extends angular.IScope {
        Logout(message:string, isWarning:boolean);
  }

  class MenuController {
      static $inject = [
          $injections.Angular.$Scope,
          $injections.Angular.$Window,
          $injections.Services.Logger,
          $injections.Services.Navigation,
          $injections.Services.AccountHandler
      ];

      constructor(private $scope:IMenuScope,
                  private $window:angular.IWindowService,
                  private logger:Services.ILogger,
                  private navigation:Services.INavigation,
                  private accountHandler:Services.IAccountHandler) {

          if (!this.accountHandler.IsLoggedIn()) {
              this.HandleAuthenticationError();
          }

          $scope.Logout = this.Logout;
          $scope.$on($constants.Events.Kg.AuthenticationError, this.HandleAuthenticationError);
          $scope.$on($constants.Events.Destroy, this.DestroyMenu);
      }

      private DestroyMenu = () => {
          console.log("Destroymenu");
      }

      private HandleAuthenticationError = () => {
          this.Logout("Please login first", true)
      }

      private     Logout = (message:string, isWarning:boolean) => {
          if (isWarning) {
              this.logger.LogWarning(message, null, this, true);
          } else {
              this.logger.Log(message, null, this, true);
          }

          this.accountHandler.Logout();
          this.navigation.Login();
      }
  }

  export class MenuControllerRegister {
    constructor($module: angular.IModule) {
      $module.controller($injections.Controllers.MenuController, MenuController);
    }
  }
} 