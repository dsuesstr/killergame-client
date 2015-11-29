/// <reference path='../min.references.ts'/>

module Services {
    class ApiSettingsProvider implements IApiSettingsProvider {

        static $inject = [
            $injections.Services.LocalStorage,
            $injections.Services.Logger
        ];

        constructor(private localStorage: Services.ILocalStorage,
                    private logger: Services.ILogger) {

        }

        RemoveToken = () => {
            this.localStorage.remove($constants.Keys.TokenKey);
        }

        SetToken = (token:string) => {
            this.localStorage.save($constants.Keys.TokenKey, token);
        }

        HasToken = () => {
            return this.GetToken() != null;
        }

        GetApiParameters = ():any => {
            return{ timeout: 1000 };
        };

        GetSecureApiParameters = ():any => {
            var token = this.GetToken();
            var params = this.GetApiParameters();

            if(token == null) {
                return null;
            }

            params.headers = {
                "x-access-token": token
            };

            return params;
        }

        private GetToken = ():string => {
            var token = this.localStorage.get($constants.Keys.TokenKey);
            if(token == undefined || token == "") { return null; }

            return token;
        }
    }

    export class ApiSettingsProviderRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.ApiSettingsProvider, ApiSettingsProvider);
        }
    }
}