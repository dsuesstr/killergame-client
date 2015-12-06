/// <reference path='../min.references.ts'/>

module Services {
    class GameProvider implements IGameProvider {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Angular.$RootScope,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsProvider
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private $rootScope:angular.IRootScopeService,
                    private logger:Services.ILogger,
                    private apiSettingsProvider:Services.IApiSettingsProvider) {
        }

        public GetGame = (gameId:string):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games + "/" + gameId;
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsProvider.GetSecureApiParameters()

            //TODO: check in a central way (no duplicates por favor)
            if(params == null) {
                this.BroadcastAuthenticationError();
                defer.reject(null);
                return defer.promise;
            }

            this.$http.get(url, params)
                .success((response:any) => {
                    defer.resolve(response.game);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    //TODO: check in a central way (no duplicates por favor)
                    this.logger.LogError(error.key, error, this, false);
                    if(error.key === "player_auth_0001" || error.key == "player_auth_0002") {
                        this.BroadcastAuthenticationError();
                    }

                    defer.reject(error);
                });

            return defer.promise;
        }

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
        }

        public GetChallengeeGames = ():angular.IPromise<Models.Messages.IGame[]> => {
            return this.GetGameList(this.urls.GamesChallengee());
        }

        public GetChallengerGames = ():angular.IPromise<Models.Messages.IGame[]> => {
            return this.GetGameList(this.urls.GamesChallenger());
        }

        public GetAcceptedGames = ():angular.IPromise<Models.Messages.IGame[]> => {
            return this.GetGameList(this.urls.GamesAccepted());
        }

        private GetGameList = (url:string):angular.IPromise<Models.Messages.IGame[]> => {
            var defer = this.$q.defer<Models.Messages.IGame[]>();
            var params = this.apiSettingsProvider.GetSecureApiParameters()

            //TODO: check in a central way (no duplicates por favor)
            if(params == null) {
                this.BroadcastAuthenticationError();
                defer.reject(null);
                return defer.promise;
            }

            this.$http.get(url, params)
                .success((response: any) => {
                    defer.resolve(response.games);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    //TODO: check in a central way (no duplicates por favor)
                    this.logger.LogError(error.key, error, this, false);
                    if(error.key === "player_auth_0001" || error.key == "player_auth_0002") {
                        this.BroadcastAuthenticationError();
                    }

                    defer.reject(error);
                });

            return defer.promise;
        }

        private BroadcastAuthenticationError = () => {
            this.$rootScope.$broadcast($constants.Events.Kg.AuthenticationError)
        }
    }

    export class GameProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.GameProvider, GameProvider);
        }
    }
}