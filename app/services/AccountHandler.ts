/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class AccountHandler implements IAccountHandler {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.ApiSettingsHandler,
            $injections.Services.PlayerProvider
        ];

        constructor(private urls: Services.IUrls,
                    private $http: angular.IHttpService,
                    private $q: angular.IQService,
                    private apiSettingsHandler: Services.IApiSettingsHandler,
                    private playerProvider: Services.IPlayerProvider) {
        }

        /**
         * Gets whether the current user has a token present or not (it token is present, KG assumes the player is logged in)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {boolean}
         */
        public IsLoggedIn = ():boolean => {
            return this.apiSettingsHandler.HasToken();
        };

        /**
         * Register a user via API
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IRegister} model
         * @returns {angular.IPromise<Models.Messages.IPlayer>}
         */
        public Register = (model:Models.Messages.IRegister):angular.IPromise<Models.Messages.IPlayer> => {

            var url = this.urls.Register();
            return this.PostTokenRequest(url, model);
        };

        /**
         * Logges a user in via the API
         *
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.ILogin} model
         * @returns {angular.IPromise<Models.Messages.IPlayer>}
         */
        public Login = (model:Models.Messages.ILogin):angular.IPromise<Models.Messages.IPlayer> => {
            var url = this.urls.Login();
            return this.PostTokenRequest(url, model);
        };

        /**
         *  Logs a user out from the Game (Deletes the token)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        public Logout = () => {
            this.playerProvider.RemoveCurrentPlayer();
            this.apiSettingsHandler.RemoveToken();
        };

        /**
         * Posts a request for a token (Login or Register)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} url
         * @param {any} data
         * @returns {IPromise<Models.Messages.IPlayer>}
         */
        private PostTokenRequest = (url:string, data:any) :angular.IPromise<Models.Messages.IPlayer> => {

            var params = this.apiSettingsHandler.GetApiParameters();
            var defer = this.$q.defer<Models.Messages.IPlayer>();

            this.$http.post(url, data, params)
                .success((response: Models.Messages.IAccountResponse) => {
                    this.apiSettingsHandler.SetToken(response.token);
                    this.playerProvider.SetCurrentPlayer(response.player);
                    defer.resolve(response.player);
                })
                .error((data:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.RemoveToken();
                    defer.reject(data);
                });

            return defer.promise;
        }
    }

    /**
     * Registers the AccountHandler as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class AccountHandlerRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.AccountHandler, AccountHandler);
        }
    }
}