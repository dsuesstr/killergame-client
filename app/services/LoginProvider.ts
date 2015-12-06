/// <reference path='../min.references.ts'/>

module Services {
    //TODO: Rename to AccountHandler
    class LoginProvider implements ILoginProvider {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$RootScope,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsProvider,
            $injections.Services.PlayerProvider
        ];

        constructor(private urls: Services.IUrls,
                    private $rootScope: angular.IRootScopeService,
                    private $http: angular.IHttpService,
                    private $q: angular.IQService,
                    private logger: Services.ILogger,
                    private apiSettingsProvider: Services.IApiSettingsProvider,
                    private playerProvider: Services.IPlayerProvider) {
        }

        public IsLoggedIn = ():boolean => {
            return this.apiSettingsProvider.HasToken();
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
            this.apiSettingsProvider.RemoveToken();
        }

        private PostTokenRequest = (url:string, data:any) :angular.IPromise<Models.Messages.IPlayer> => {

            var params = this.apiSettingsProvider.GetApiParameters();

            var defer = this.$q.defer<Models.Messages.IPlayer>();

            this.$http.post(url, data, params)
                .success((response: Models.Messages.IAccountResponse) => {
                    this.apiSettingsProvider.SetToken(response.token);
                    this.playerProvider.SetCurrentPlayer(response.player);
                    defer.resolve(response.player);
                })
                .error((data:Models.Messages.IError, status: number) => {
                    this.apiSettingsProvider.RemoveToken();
                    defer.reject(data.text);
                });

            return defer.promise;
        }

        private BroadcastAuthenticationError = () => {
            this.$rootScope.$broadcast($constants.Events.Kg.AuthenticationError)
        }
    }

    export class LoginProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.LoginProvider, LoginProvider);
        }
    }
}