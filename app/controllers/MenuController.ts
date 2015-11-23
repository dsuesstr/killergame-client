/// <reference path='../min.references.ts'/>

module Controllers {

  interface IMenuScope extends angular.IScope {
        Logout();
  }

  class MenuController {
    static $inject = [
      $injections.Angular.$Scope,
      $injections.Services.Logger,
      $injections.Services.Navigation,
      $injections.Services.LoginProvider
    ];

      constructor(private $scope: IMenuScope,
                  private logger: Services.Logger,
                  private navigation: Services.INavigation,
                  private loginProvider: Services.ILoginProvider) {


          console.log("check");
          if(!this.loginProvider.IsLoggedIn()) {
              this.logger.logWarning("Please login first", null, this, true);
              this.navigation.Login();

          }

          $scope.Logout = this.Logout;
    }

    Logout = () => {
        this.loginProvider.Logout();
        this.logger.log("Byebye :(", null, this, true);
        this.navigation.Login();
    }
  }

  export class MenuControllerRegister {
    constructor($module: angular.IModule) {
      $module.controller($injections.Controllers.MenuController, MenuController);
    }
  }
} 