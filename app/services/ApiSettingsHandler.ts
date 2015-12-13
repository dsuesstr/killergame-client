/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class ApiSettingsHandler implements IApiSettingsHandler {

        static $inject = [
            $injections.Angular.$RootScope,
            $injections.Services.LocalStorage
        ];

        constructor(private $rootScope: angular.IRootScopeService,
                    private localStorage: Services.ILocalStorage) {
        }

        /**
         * Remove the token from localStorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @constructor
         */
        public RemoveToken = () => {
            this.localStorage.Remove($constants.Keys.Token);
        };

        /**
         * Save the token to the local storage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string}token
         * @constructor
         */
        public SetToken = (token:string) => {
            this.localStorage.Save($constants.Keys.Token, token);
        };

        /**
         * Get the token from the localStorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {any}
         */
        private GetToken = ():string => {
            var token = this.localStorage.Get($constants.Keys.Token);
            if(token == undefined || token == "") { return null; }

            return token;
        };

        /**
         * Checks if a token is present in the localstorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {boolean}
         */
        public HasToken = () => {
            return this.GetToken() != null;
        };

        /**
         * Gets API Parameters for non-secure requests
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {{timeout: number}}
         */
        public GetApiParameters = ():any => {
            return{ timeout: $constants.Timeouts.RequestTimeout };
        };

        /**
         * Gets API Parameters for secure requests. Adds the "x-access-token" with the token to the parameters
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {any}
         */
        public GetSecureApiParameters = ():any => {
            var token = this.GetToken();
            var params = this.GetApiParameters();

            if(token == null) {
                return null;
            }

            params.headers = {
                "x-access-token": token
            };

            return params;
        };

        /**
         * Verify whether parameters are set or not
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {any} params
         * @returns {boolean}
         */
        public VerifyParams = (params):boolean => {
            if(params != null) {
                return true;
            }

            this.BroadcastAuthenticationError();
            return false;
        };

        /**
         *  Check the error for authentication errors
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IError} error
         * @returns {boolean}
         */
        public CheckResponse = (error:Models.Messages.IError):boolean => {
            if(error == null) {
                return true;
            }

            if(error.key === $constants.Keys.PlayerAuth1 || error.key == $constants.Keys.PlayerAuth2) {
                this.BroadcastAuthenticationError();
                return false;
            }

            return true;
        };

        /**
         * Broadcast the authentication errors for all subscribers
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private BroadcastAuthenticationError = () => {
            this.$rootScope.$broadcast($constants.Events.Kg.AuthenticationError)
        }
    }

    /**
     * Registers the ApiSettingsHandler as a module
     *
     */
    export class ApiSettingsHandlerRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.ApiSettingsHandler, ApiSettingsHandler);
        }
    }
}