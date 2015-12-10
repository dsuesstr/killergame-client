/// <reference path='../min.references.ts'/>

module Services {
    class AccountHandler implements IAccountHandler {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsHandler,
            $injections.Services.PlayerProvider
        ];

        constructor(private urls: Services.IUrls,
                    private $http: angular.IHttpService,
                    private $q: angular.IQService,
                    private logger: Services.ILogger,
                    private apiSettingsHandler: Services.IApiSettingsHandler,
                    private playerProvider: Services.IPlayerProvider) {
        }

        public IsLoggedIn = ():boolean => {
            return this.apiSettingsHandler.HasToken();
        }

        public Register = (model:Models.Messages.IRegister):angular.IPromise<Models.Messages.IPlayer> => {

            var url = this.urls.Register();
            return this.PostTokenRequest(url, model);
        }

        public Login = (model:Models.Messages.ILogin):angular.IPromise<Models.Messages.IPlayer> => {
            var url = this.urls.Login();
            return this.PostTokenRequest(url, model);
        }

        public Logout = () => {
            this.playerProvider.RemoveCurrentPlayer();
            this.apiSettingsHandler.RemoveToken();
        }

        private PostTokenRequest = (url:string, data:any) :angular.IPromise<Models.Messages.IPlayer> => {

            var params = this.apiSettingsHandler.GetApiParameters();
            var defer = this.$q.defer<Models.Messages.IPlayer>();

            this.$http.post(url, data, params)
                .success((response: Models.Messages.IAccountResponse) => {
                    this.apiSettingsHandler.SetToken(response.token);
                    this.playerProvider.SetCurrentPlayer(response.player);
                    defer.resolve(response.player);
                })
                .error((data:Models.Messages.IError, status: number) => {
                    this.apiSettingsHandler.RemoveToken();
                    defer.reject(data.key);
                });

            return defer.promise;
        }


    }

    export class AccountHandlerRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.AccountHandler, AccountHandler);
        }
    }
}