/// <reference path='../min.references.ts'/>

module Services {
    class PlayerProvider implements IPlayerProvider {
        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private logger:Services.Logger) {
        }


        public GetPlayers = (startIndex:number = 0, limit:number = 10, sortColumn:string = "score", sortDirection:string = "desc") : angular.IPromise<Models.IPlayer[]> => {

            var url = this.urls.Register();

            url += "/limit/" + limit + "/offset/" + startIndex + "/sort/" + sortColumn + "/" + sortDirection;

            console.log(url);

            var defer = this.$q.defer<Models.IPlayer[]>();
            var config = { timeout: 1000 };

            this.$http.get(url, config)
                .success((response: any) => {
                    this.logger.log("request successfull", response, this, false);

                    var players: Models.IPlayer[] = new Array();

                    angular.forEach(response.players, function(value, key) {
                        var player = new Models.Player();
                        player.Username = value.username;
                        player.Score = value.score;
                        player.PlayerId = value.PlayerId;
                        player.Rank = key;
                        this.push(player);

                    }, players);

                    defer.resolve(players);
                })
                .error((data: any, status: number) => {
                    this.logger.logError("request failed", status, this, false);
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