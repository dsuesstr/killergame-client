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

        }

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
            })
                .error((error:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.CheckResponse(error);

                    defer.reject(error);
                });

            return defer.promise;
        }

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
        }

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
        }

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
        }

        private  GetLastMove = (oldField:any, newField:any) => {

        }
    }

    export class GameHandlerRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.GameHandler, GameHandler);
        }
    }
}