/// <reference path='../min.references.ts'/>

module Services {
    class ApiSettingsHandler implements IApiSettingsHandler {

        static $inject = [
            $injections.Angular.$RootScope,
            $injections.Services.LocalStorage
        ];

        constructor(private $rootScope: angular.IRootScopeService,
                    private localStorage: Services.ILocalStorage) {
        }

        public RemoveToken = () => {
            this.localStorage.Remove($constants.Keys.Token);
        };

        public SetToken = (token:string) => {
            this.localStorage.Save($constants.Keys.Token, token);
        };

        public HasToken = () => {
            return this.GetToken() != null;
        };

        public GetApiParameters = ():any => {
            return{ timeout: 1000 };
        };

        public GetSecureApiParameters = ():any => {
            var token = this.GetToken();
            var params = this.GetApiParameters();

            if(token == null) {
                return null;
            }

            params.headers = {
                "x-access-token": token
            };

            return params;
        };

        public VerifyParams = (params):boolean => {
            if(params != null) {
                return true;
            }

            this.BroadcastAuthenticationError();
            return false;
        };

        public CheckResponse = (error:Models.Messages.IError):boolean => {
            if(error == null) {
                return true;
            }

            if(error.key === "player_auth_0001" || error.key == "player_auth_0002") {
                this.BroadcastAuthenticationError();
                return false;
            }

            return true;
        };

        private GetToken = ():string => {
            var token = this.localStorage.Get($constants.Keys.Token);
            if(token == undefined || token == "") { return null; }

            return token;
        };

        private BroadcastAuthenticationError = () => {
            this.$rootScope.$broadcast($constants.Events.Kg.AuthenticationError)
        }
    }

    export class ApiSettingsHandlerRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.ApiSettingsHandler, ApiSettingsHandler);
        }
    }
}