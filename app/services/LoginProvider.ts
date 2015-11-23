/// <reference path='../min.references.ts'/>

module Services {
    class LoginProvider implements ILoginProvider {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger,
            $injections.Services.ApiSettingsProvider
        ];

        constructor(private urls: Services.IUrls,
                    private $http: angular.IHttpService,
                    private $q: angular.IQService,
                    private logger: Services.Logger,
                    private apiSettingsProvider: Services.ApiSettingsProvider) {
        }

        public IsLoggedIn = ():boolean => {
            return this.apiSettingsProvider.HasToken();
        }

        public Register = (model:Models.IRegister):angular.IPromise<string> => {

            var url = this.urls.Register();
            return this.GetTokenFromApi(url, model);
        }

        public Login = (model:Models.ILogin):angular.IPromise<string> => {
            var url = this.urls.Login();
            return this.GetTokenFromApi(url, model);
        }

        public Logout = () => {
            this.apiSettingsProvider.RemoveToken();
        }

        private GetTokenFromApi = (url:string, data:any) :angular.IPromise<string> => {

            var config = { timeout: 1000 };

            var defer = this.$q.defer<string>();

            this.logger.log("starting request", null, this, false);

            this.$http.post(url, data, config)
                .success((response: any) => {
                    this.apiSettingsProvider.SetToken(response.token);
                    defer.resolve(response.token);
                })
                .error((data: any, status: number) => {
                    this.logger.logError("request failed", status, this, false);
                    defer.reject(data.key);
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