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
            return this.apiHost + "register";
        }

        public Login = () :string => {
            return this.apiHost + "login";
        }

        public Players = () :string => {
            return this.apiHost + "player";
        }

        public Games = ():string => {
            return this.apiHost + "game";
        }

        public GamesChallengee = ():string => {
            return this.Games() + "/challengee";
        }

        public GamesChallenger = ():string => {
            return this.Games() + "/challenger";
        }

        public GamesAccepted = ():string => {
            return this.Games() + "/accepted";
        }
    }

    export class UrlsRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Urls, Urls);
        }
    }
}