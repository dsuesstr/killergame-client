/// <reference path='../min.references.ts'/>

module Services {
    class LoginProvider implements ILoginProvider {

        static $inject = [
            $injections.Services.Urls,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger
        ];

        constructor(private urls: Services.IUrls,
                    private $http: angular.IHttpService,
                    private $q: angular.IQService,
                    private logger: Services.Logger) {
        }

        public Register = (model:Models.IRegister):angular.IPromise<string> => {
            debugger;
            console.log(model);
            var url = this.urls.Register();
            return this.GetTokenFromApi(url, model);
        }

        public Login = (model:Models.ILogin):angular.IPromise<string> => {
            var url = this.urls.Login();
            return this.GetTokenFromApi(url, model);
        }

        private GetTokenFromApi = (url:string, data:any) :angular.IPromise<string> => {

            var config = { timeout: 1000 };

            var defer = this.$q.defer<string>();

            this.logger.log("starting request", null, this, false);
console.log(data);
            this.$http.post(url, JSON.stringify(data), config)
                .success((response: any) => {
                    this.logger.log("request successfull", response, this, false);
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