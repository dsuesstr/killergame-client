/// <reference path='../min.references.ts'/>

module Controllers {

  interface IMenuScope extends angular.IScope {
        Logout(message:string, isWarning:boolean);
  }

  class MenuController {
      static $inject = [
          $injections.Angular.$Scope,
          $injections.Services.Logger,
          $injections.Services.Navigation,
          $injections.Services.Strings,
          $injections.Services.AccountHandler
      ];

      constructor(private $scope:IMenuScope,
                  private logger:Services.ILogger,
                  private navigation:Services.INavigation,
                  private strings:Services.IStrings,
                  private accountHandler:Services.IAccountHandler) {

          if (!this.accountHandler.IsLoggedIn()) {
              this.HandleAuthenticationError();
          }

          $scope.Logout = this.Logout;
          $scope.$on($constants.Events.Kg.AuthenticationError, this.HandleAuthenticationError);
      }

      private HandleAuthenticationError = () => {
          this.Logout(this.strings("login_first"), true)
      };

      private Logout = (message:string, isWarning:boolean) => {
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