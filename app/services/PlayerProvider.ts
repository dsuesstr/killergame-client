/// <reference path='../min.references.ts'/>

module Services {
    class PlayerProvider implements IPlayerProvider {
        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsHandler,
            $injections.Services.LocalStorage
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private logger:Services.ILogger,
                    private apiSettingsHandler:Services.IApiSettingsHandler,
                    private localStorage:Services.ILocalStorage) {
        }

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
        }

        public GetAllPlayers = (listParams:Models.IListParams) : angular.IPromise<Models.Messages.IPlayer[]> => {
            var url = this.urls.Register();
            url += "/limit/" + listParams.Limit + "/offset/" + listParams.Offset + "/sort/" + listParams.SortColumn + "/" + listParams.SortDirection;

            return this.GetPlayersList(url, false);
        }

        public GetAvailablePlayers = (listParams:Models.IListParams) : angular.IPromise<Models.Messages.IPlayer[]> => {

            var url = this.urls.Players();
            url += "/available/limit/" + listParams.Limit + "/offset/" + listParams.Offset + "/sort/" + listParams.SortColumn + "/" + listParams.SortDirection;
            return this.GetPlayersList(url, true);
        }

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
        }

        public SetCurrentPlayer = (player:Models.Messages.IPlayer) => {
            this.localStorage.Save($constants.Keys.PlayerKey, player);
        }

        public GetCurrentPlayer = ():Models.Messages.IPlayer => {
            var player = this.localStorage.Get($constants.Keys.PlayerKey);
            if(player == undefined || player == null || player == {}) {
                //TODO: what then
            }

            return player;
        }

        public RemoveCurrentPlayer = () => {
            this.localStorage.Remove($constants.Keys.PlayerKey);
        }

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

    export class PlayerProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.PlayerProvider, PlayerProvider);
        }
    }
}