/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class Urls implements IUrls {

        static $inject = [
            $injections.Constants.ApiHost
        ];

        /**
         * Gets API Finished Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         * @constructor
         */
        constructor(private apiHost: string) {

        }

        /**
         * Gets API Register Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public Register = () :string => {
            return this.apiHost + "register";
        }

        /**
         * Gets API Login Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public Login = () :string => {
            return this.apiHost + "login";
        }

        /**
         * Gets API Players Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public Players = () :string => {
            return this.apiHost + "player";
        }

        /**
         * Gets API Games Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public Games = ():string => {
            return this.apiHost + "game";
        }

        /**
         * Gets API GamesChallengee Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public GamesChallengee = ():string => {
            return this.Games() + "/challengee";
        }

        /**
         * Gets API GamesChallenger Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public GamesChallenger = ():string => {
            return this.Games() + "/challenger";
        }

        /**
         * Gets API GamesAccepted Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public GamesAccepted = ():string => {
            return this.Games() + "/accepted";
        }

        /**
         * Gets API GamesFinished Route
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {string}
         */
        public GamesFinished = ():string => {
            return this.Games() + "/finished";
        }
    }

    /**
     * Registers the Urls as a module
     *
     *  @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class UrlsRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Urls, Urls);
        }
    }
}