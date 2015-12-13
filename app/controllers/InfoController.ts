/// <reference path='../min.references.ts'/>
module Controllers {
    'use strict';

    class InfoController {
        static $inject = [
        ];

        constructor() {
        }
    }

    /**
     * Registers the InfoController as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class InfoControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.InfoController, InfoController);
        }
    }
}