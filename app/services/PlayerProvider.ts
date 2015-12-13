/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class PlayerProvider implements IPlayerProvider {
        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.ApiSettingsHandler,
            $injections.Services.LocalStorage
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private apiSettingsHandler:Services.IApiSettingsHandler,
                    private localStorage:Services.ILocalStorage) {
        }

        /**
         * Get the player from the API by it's playerId
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} playerId
         * @returns {IPromise<Models.Messages.IPlayer>}
         */
        public GetPlayer = (playerId:string):angular.IPromise<Models.Messages.IPlayer> => {
            var url = this.urls.Register() + "/" + playerId;
            var defer = this.$q.defer<Models.Messages.IPlayer>();
            var params = this.apiSettingsHandler.GetApiParameters();

            this.$http.get(url, params)
                .success((response: any) => {
                    defer.resolve(response.player);
                })
                .error((data: any, status: number) => {
                    defer.reject(data.key);
                });

            return defer.promise;
        };

        /**
         * Get all players from the API
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.ListParams} listParams
         * @returns {angular.IPromise<Models.Messages.IPlayer[]>}
         */
        public GetAllPlayers = (listParams:Models.ListParams) : angular.IPromise<Models.Messages.IPlayer[]> => {
            var url = this.urls.Register();
            url += "/limit/" + listParams.Limit + "/offset/" + listParams.Offset + "/sort/" + listParams.SortColumn + "/" + listParams.SortDirection;

            return this.GetPlayersList(url, false);
        };

        /**
         * Get all availableplayers for a game from the API
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.ListParams} listParams
         * @returns {angular.IPromise<Models.Messages.IPlayer[]>}
         */
        public GetAvailablePlayers = (listParams:Models.ListParams) : angular.IPromise<Models.Messages.IPlayer[]> => {

            var url = this.urls.Players();
            url += "/available/limit/" + listParams.Limit + "/offset/" + listParams.Offset + "/sort/" + listParams.SortColumn + "/" + listParams.SortDirection;
            return this.GetPlayersList(url, true);
        };

        /**
         * Update the current player on the api
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Message.IPlayerUpdate} data
         * @returns {IPromise<Models.Messages.IPlayer>}
         */
        public UpdateCurrentPlayer = (data:Models.Messages.IPlayerUpdate):angular.IPromise<Models.Messages.IPlayer> => {
            var player = this.GetCurrentPlayer();
            var url = this.urls.Register() + "/" + player.playerId;
            var params = this.apiSettingsHandler.GetSecureApiParameters();
            var defer = this.$q.defer<Models.Messages.IPlayer>();

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.put(url, data, params)
                .success((response: any) => {
                    this.SetCurrentPlayer(response.player);
                    defer.resolve(response.player);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);
                    defer.reject(null);
                });

            return defer.promise;
        };

        /**
         *  Set the currentplayer in the localstorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         */
        public SetCurrentPlayer = (player:Models.Messages.IPlayer) => {
            this.localStorage.Save($constants.Keys.Player, player);
        };

        public GetCurrentPlayer = ():Models.Messages.IPlayer => {
            var player = this.localStorage.Get($constants.Keys.Player);
            if(player == undefined || player == null || player == {}) {
                //TODO: what then
            }

            return player;
        };

        /**
         * Remove the currentPlayer from the localstorage
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        public RemoveCurrentPlayer = () => {
            this.localStorage.Remove($constants.Keys.Player);
        };

        /**
         * Makes a Get-request for players to the api (secure = true: with tokenheader)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} url
         * @param {boolean} secure
         * @returns {IPromise<Models.Messages.IPlayer[]>}
         */
        private GetPlayersList = (url:string, secure:boolean): angular.IPromise<Models.Messages.IPlayer[]> => {
            var defer = this.$q.defer<Models.Messages.IPlayer[]>();
            var params = secure
                ? this.apiSettingsHandler.GetSecureApiParameters()
                : this.apiSettingsHandler.GetApiParameters();

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.get(url, params)
                .success((response: Models.Messages.IPlayer[]) => {
                    defer.resolve(response);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject(error.key);
                });

            return defer.promise;
        }
    }

    /**
     * Register the PlayerProvider as module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class PlayerProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.PlayerProvider, PlayerProvider);
        }
    }
}