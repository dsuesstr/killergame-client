/// <reference path='../min.references.ts'/>

module Services {
    class PlayerProvider implements IPlayerProvider {
        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Angular.$RootScope,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsProvider,
            $injections.Services.LocalStorage
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private $rootScope:angular.IRootScopeService,
                    private logger:Services.ILogger,
                    private apiSettingsProvider:Services.IApiSettingsProvider,
                    private localStorage:Services.ILocalStorage) {
        }

        public GetPlayer = (playerId:string):angular.IPromise<Models.IPlayer> => {
            var url = this.urls.Register() + "/" + playerId;
            var defer = this.$q.defer<Models.IPlayer>();
            var params = this.apiSettingsProvider.GetApiParameters();

            this.$http.get(url, params)
                .success((response: any) => {
                    defer.resolve(response.player);
                })
                .error((data: any, status: number) => {
                    defer.reject(data.key);
                });

            return defer.promise;
        }

        public GetAllPlayers = (listParams:Models.IListParams) : angular.IPromise<Models.IPlayer[]> => {
            var url = this.urls.Register();
            url += "/limit/" + listParams.Limit + "/offset/" + listParams.Offset + "/sort/" + listParams.SortColumn + "/" + listParams.SortDirection;

            return this.GetPlayersList(url, false);
        }

        public GetAvailablePlayers = (listParams:Models.IListParams) : angular.IPromise<Models.IPlayer[]> => {

            var url = this.urls.Players();
            url += "/available/limit/" + listParams.Limit + "/offset/" + listParams.Offset + "/sort/" + listParams.SortColumn + "/" + listParams.SortDirection;
            return this.GetPlayersList(url, true);
        }

        public UpdateCurrentPlayer = (data:Models.IPlayerUpdate):angular.IPromise<Models.IPlayer> => {
            var player = this.GetCurrentPlayer();
            var url = this.urls.Register() + "/" + player.playerId;
            var params = this.apiSettingsProvider.GetSecureApiParameters();
            var defer = this.$q.defer<Models.IPlayer>();

            this.$http.put(url, data, params)
                .success((response: any) => {
                    this.SetCurrentPlayer(response.player);
                    defer.resolve(response.player);
                })
                .error((data: any, status: number) => {
                    defer.reject(null);
                });

            return defer.promise;
        }

        public SetCurrentPlayer = (player:Models.IPlayer) => {
            this.localStorage.save($constants.Keys.PlayerKey, player);
        }

        public GetCurrentPlayer = ():Models.IPlayer => {
            var player = this.localStorage.get($constants.Keys.PlayerKey);
            if(player == undefined || player == null || player == {}) {
                this.BroadcastAuthenticationError();
            }

            return player;
        }

        public RemoveCurrentPlayer = () => {
            this.localStorage.remove($constants.Keys.PlayerKey);
        }

        private GetPlayersList = (url:string, secure:boolean): angular.IPromise<Models.IPlayer[]> => {
            var defer = this.$q.defer<Models.IPlayer[]>();
            var params = secure
                ? this.apiSettingsProvider.GetSecureApiParameters()
                : this.apiSettingsProvider.GetApiParameters();

            if(params == null) {
                this.BroadcastAuthenticationError();
                defer.reject(null);
                return defer.promise;
            }
            this.$http.get(url, params)
                .success((response: Models.IPlayer[]) => {
                    defer.resolve(response);
                })
                .error((error:Models.IError, status: number) => {
                    this.logger.LogError(error.key, error, this, false);
                    if(error.key === "player_auth_0001" || error.key == "player_auth_0002") {
                        this.BroadcastAuthenticationError();
                    }

                    defer.reject(error.key);
                });

            return defer.promise;
        }

        private BroadcastAuthenticationError = () => {
            this.$rootScope.$broadcast($constants.Events.Kg.AuthenticationError)
        }
    }

    export class PlayerProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.PlayerProvider, PlayerProvider);
        }
    }
}