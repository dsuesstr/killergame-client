/// <reference path='../min.references.ts'/>

module Services {
    class PlayerProvider implements IPlayerProvider {
        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.Converter,
            $injections.Services.ApiSettingsProvider
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private logger:Services.Logger,
                    private converter:Services.IConverter,
                    private apiSettingsProvider:Services.IApiSettingsProvider) {
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

        public GetAllPlayers = (startIndex:number = 0, limit:number = 10, sortColumn:string = "score", sortDirection:string = "desc") : angular.IPromise<Models.IPlayer[]> => {
            var url = this.urls.Register();
            url += "/limit/" + limit + "/offset/" + startIndex + "/sort/" + sortColumn + "/" + sortDirection;

            return this.GetPlayersList(url, false);
        }

        public GetAvailablePlayers = (startIndex:number = 0, limit:number = 10, sortColumn:string = "score", sortDirection:string = "desc") : angular.IPromise<Models.IPlayer[]> => {
            var url = this.urls.Players();
            url += "/available/limit/" + limit + "/offset/" + startIndex + "/sort/" + sortColumn + "/" + sortDirection;
            return this.GetPlayersList(url, true);
        }

        private GetPlayersList = (url:string, secure:boolean): angular.IPromise<Models.IPlayer[]> => {
            var defer = this.$q.defer<Models.IPlayer[]>();
            var params = secure ? this.apiSettingsProvider.GetSecureApiParameters() : this.apiSettingsProvider.GetApiParameters();

            if(params == null) {
                defer.reject(null);
                return defer.promise;
            }
            debugger;
            this.$http.get(url, params)
                .success((response: any) => {
                    if(secure) {
                        debugger;
                        defer.resolve(response.result);
                    } else {
                        defer.resolve(response.players);
                    }
                })
                .error((data: any, status: number) => {
                    defer.reject(data.key);
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