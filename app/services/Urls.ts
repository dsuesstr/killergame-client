/// <reference path='../min.references.ts'/>

module Services
{
    class Urls implements IUrls {
        static $inject = [
            $injections.Constants.ApiHost
        ];

        constructor(private apiHost: string) {

        }

        public Register = () :string => {
            return this.apiHost + "Register";
        }

        public Login = () :string => {
            return this.apiHost + "Login";
        }

        public Players = () :string => {
            return this.apiHost + "Players";
        }
    }

    export class UrlsRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Urls, Urls);
        }
    }
}