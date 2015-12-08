/// <reference path='../min.references.ts'/>
module Controllers {


    class InfoController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Logger
        ];

        constructor() {
        }
    }

    export class InfoControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.InfoController, InfoController);
        }
    }
}