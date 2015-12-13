/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class GameProvider implements IGameProvider {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Angular.$RootScope,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsHandler
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private $rootScope:angular.IRootScopeService,
                    private logger:Services.ILogger,
                    private apiSettingsHandler:Services.IApiSettingsHandler) {
        }

        /**
         * Get a specific game from the api
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param gameId
         * @returns {IPromise<Models.Messages.IGame>}
         */
        public GetGame = (gameId:string):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games() + "/" + gameId;
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.get(url, params)
                .success((response:any) => {
                    defer.resolve(response.game);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);
                    defer.reject(error);
                });

            return defer.promise;
        };

        /**
         * Get Games from the API (unaccepted, accepted games. Not Finished)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {IPromise<Models.Messages.IGame[]>}
         */
        public GetGames = ():angular.IPromise<Models.Messages.IGame[]> => {
            var defer = this.$q.defer<Models.Messages.IGame[]>();

            this.$q.all([
                this.GetAcceptedGames(),
                this.GetChallengerGames(),
                this.GetChallengeeGames(),
            ]).then((response:any) => {

                var acceptedGames = response[0];
                var challengerGames = response[1];
                var challengeeGames = response[2];

                var allGames = acceptedGames;
                allGames.push.apply(allGames, challengerGames);
                allGames.push.apply(allGames, challengeeGames);
                defer.resolve(allGames);
            });

            return defer.promise;
        };

        /**
         * Get games where currentplayer is challengee
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {angular.IPromise<Models.Messages.IGame[]>}
         */
        public GetChallengeeGames = ():angular.IPromise<Models.Messages.IGame[]> => {
            return this.GetGameList(this.urls.GamesChallengee());
        };

        /**
         * Get games where currentplayer is challenger
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {angular.IPromise<Models.Messages.IGame[]>}
         */
        public GetChallengerGames = ():angular.IPromise<Models.Messages.IGame[]> => {
            return this.GetGameList(this.urls.GamesChallenger());
        };

        /**
         * Get accepted games for currentplayer (games which currentplayer can start)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @returns {angular.IPromise<Models.Messages.IGame[]>}
         */
        public GetAcceptedGames = ():angular.IPromise<Models.Messages.IGame[]> => {
            return this.GetGameList(this.urls.GamesAccepted());
        };

        /**
         * Get finished games for a specicif player
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {palyerId} playerId
         * @returns {angular.IPromise<Models.Messages.IGame[]>}
         */
        public GetFinishedGames = (playerId:string) => {
            return this.GetGameList(this.urls.GamesFinished() + "/" + playerId);
        };

        /**
         * Get a gameslist from the the API
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {string} url
         * @returns {IPromise<Models.Messages.IGame[]>}
         */
        private GetGameList = (url:string):angular.IPromise<Models.Messages.IGame[]> => {
            var defer = this.$q.defer<Models.Messages.IGame[]>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.get(url, params)
                .success((response: any) => {
                    defer.resolve(response.games);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject(error);
                });

            return defer.promise;
        }
    }

    export class GameProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.GameProvider, GameProvider);
        }
    }
}