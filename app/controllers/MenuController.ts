/// <reference path='../min.references.ts'/>

module Controllers {

  interface IMenuScope extends angular.IScope {
        Logout();
  }

  class MenuController {
    static $inject = [
      $injections.Angular.$Scope,
      $injections.Services.Logger,
      $injections.Services.Navigation
    ];

      constructor(private $scope: IMenuScope,
                  private logger: Services.Logger,
                  private navigation: Services.INavigation) {
         $scope.Logout = this.Logout;
    }

    Logout = () => {
      this.OnLogoutSuccessfull();
    }

    OnLogoutSuccessfull = () => {
      this.logger.log("Byebye :(", null, this, true);
      this.navigation.Login();
    };
  }

  export class MenuControllerRegister {
    constructor($module: angular.IModule) {
      $module.controller($injections.Controllers.MenuController, MenuController);
    }
  }
} 