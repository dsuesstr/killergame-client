/// <reference path='../min.references.ts'/>

module Controllers {

  interface IMenuScope extends angular.IScope {
        
  }

  class MenuController {
    static $inject = [
      $injections.Angular.$Scope   
    ];

      constructor(private $scope: IMenuScope) {
         
    }    
  }

  export class MenuControllerRegister {
    constructor($module: angular.IModule) {
      $module.controller($injections.Controllers.MenuController, MenuController);
    }
  }
} 