/// <reference path='../min.references.ts'/>

module Services {
    class LoginProvider implements ILoginProvider {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsProvider,
            $injections.Services.PlayerProvider
        ];

        constructor(private urls: Services.IUrls,
                    private $http: angular.IHttpService,
                    private $q: angular.IQService,
                    private logger: Services.ILogger,
                    private apiSettingsProvider: Services.IApiSettingsProvider,
                    private playerProvider: Services.IPlayerProvider) {
        }

        public IsLoggedIn = ():boolean => {
            return this.apiSettingsProvider.HasToken();
        }

        public Register = (model:Models.IRegister):angular.IPromise<Models.IPlayer> => {

            var url = this.urls.Register();
            return this.PostTokenRequest(url, model);
        }

        public Login = (model:Models.ILogin):angular.IPromise<Models.IPlayer> => {
            var url = this.urls.Login();
            return this.PostTokenRequest(url, model);
        }

        public Logout = () => {
            this.playerProvider.RemoveCurrentPlayer();
            this.apiSettingsProvider.RemoveToken();
        }

        private PostTokenRequest = (url:string, data:any) :angular.IPromise<Models.IPlayer> => {

            var params = this.apiSettingsProvider.GetApiParameters();

            var defer = this.$q.defer<Models.IPlayer>();

            this.$http.post(url, data, params)
                .success((response: Models.IAccountResponse) => {
                    this.apiSettingsProvider.SetToken(response.token);
                    this.playerProvider.SetCurrentPlayer(response.player);
                    defer.resolve(response.player);
                })
                .error((data:Models.IError, status: number) => {
                    this.apiSettingsProvider.RemoveToken();
                    defer.reject(data.text);
                });

            return defer.promise;
        }
    }

    export class LoginProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.LoginProvider, LoginProvider);
        }
    }
}