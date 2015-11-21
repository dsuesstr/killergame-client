/// <reference path='../min.references.ts'/>

module Services {
    class PlayerProvider implements IPlayerProvider {
        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.Converter
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private logger:Services.Logger,
                    private converter:Services.IConverter) {
        }

        public GetPlayer = (playerId:string):angular.IPromise<Models.IPlayer> => {
            var url = this.urls.Register() + "/" + playerId;
            var defer = this.$q.defer<Models.IPlayer>();
            var config = { timeout: 1000 };

            this.$http.get(url, config)
                .success((response: any) => {
                    var player = this.converter.ConvertApiPlayer(response.player);
                    defer.resolve(player);
                })
                .error((data: any, status: number) => {
                    defer.reject(data.key);
                });

            return defer.promise;
        }

        public GetPlayers = (startIndex:number = 0, limit:number = 10, sortColumn:string = "score", sortDirection:string = "desc") : angular.IPromise<Models.IPlayer[]> => {

            var url = this.urls.Register();

            url += "/limit/" + limit + "/offset/" + startIndex + "/sort/" + sortColumn + "/" + sortDirection;

            var defer = this.$q.defer<Models.IPlayer[]>();
            var config = { timeout: 1000 };

            this.$http.get(url, config)
                .success((response: any) => {

                    var players: Models.IPlayer[] = new Array();
                    var convert = this.converter.ConvertApiPlayer;

                    angular.forEach(response.players, function(value, key) {
                        var player = convert(value);
                        player.Rank = key + 1;
                        this.push(player);

                    }, players);

                    defer.resolve(players);
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