/// <reference path='../min.references.ts'/>

module Services {
    class GameHandler implements IGameHandler {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsHandler
        ];

        constructor(private urls:Services.IUrls,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private logger:Services.ILogger,
                    private apiSettingsHandler:Services.IApiSettingsHandler) {
        }

        public MakeMove = (gameId:string, x:number, y:number):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games() + "/" + gameId;
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            var model = {
                x: x,
                y: y
            };

            this.$http.put(url, model, params).success((response:any) => {
                defer.resolve(response.game);
            })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject(error);
                });

            return defer.promise;
        };

        public Forfeit = (gameId:string):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games() + "/" + gameId + "/forfeit";
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.put(url, {}, params).success((response:any) => {
                defer.resolve(response.game);
            }).error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject(error);
                });

            return defer.promise;
        };

        public CreateGame = (model:Models.Messages.ICreateGame):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games();
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.post(url, model, params)
                .success((response:any) => {
                    defer.resolve(response.game);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject(error);
                });

            return defer.promise;
        };

        public DeleteGame = (gameId:string):angular.IPromise<void> => {
            //TODO: handle this

            var url = this.urls.Games() + "/" + gameId;
            var defer = this.$q.defer<void>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.delete(url, params)
                .success((response: any) => {
                    defer.resolve();
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject();
                });

            return defer.promise;
        };

        public AcceptGame = (gameId:string):angular.IPromise<Models.Messages.IGame> => {
            var url = this.urls.Games() + "/" + gameId + "/accept";
            var defer = this.$q.defer<Models.Messages.IGame>();
            var params = this.apiSettingsHandler.GetSecureApiParameters()

            if(!this.apiSettingsHandler.VerifyParams(params)) {
                defer.reject(null);
                return defer.promise;
            }

            this.$http.put(url, {}, params)
                .success((response: any) => {
                    defer.resolve(response.game);
                })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject(error);
                });

            return defer.promise;
        };

        public GetField = (fieldString:string):Array<Array<Models.Stone>> => {
            var fieldArray = JSON.parse(fieldString);
            var field = [];

            for(var x = 0; x < fieldArray.length; x++) {

                var row = [];

                for(var y = 0; y < fieldArray[x].length; y++) {
                    var stone = new Models.Stone();
                    stone.IsPlayer1 = fieldArray[x][y] == $constants.Game.Stones.Player1;
                    stone.IsPlayer2 = fieldArray[x][y] == $constants.Game.Stones.Player2;
                    stone.X = x;
                    stone.Y = y;
                    row.push(stone);
                }

                field.push(row);
            }
            return field;
        };

        public GetLastMove = (oldField:Array<Array<Models.Stone>>, newField:Array<Array<Models.Stone>>):Models.Stone => {

            for(var x = 0; x < newField.length; x++) {
                for (var y = 0; y < newField[x].length; y++) {
                    if (angular.isDefined(oldField)) {
                        if (newField[x][y] === oldField[x][y]) {
                            continue;
                        }

                        return newField[x][y];
                    }
                    else {
                        if(newField[x][y].IsPlayer1 || newField[x][y].IsPlayer2) {

                            return newField[x][y];
                        }
                    }
                }
            }
            return null;
        }
    }

    export class GameHandlerRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.GameHandler, GameHandler);
        }
    }
}