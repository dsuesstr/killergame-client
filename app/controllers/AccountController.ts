/// <reference path='../min.references.ts'/>
module Controllers {

    class LoginModel{
        Username:string;
        Password:string;
        Password2:string;
        IsRegister:boolean;
        IsLogin:boolean;
    }

    interface IAccountScope extends angular.IScope {
        Login();
        Register();
        IsRegisterChanged();
        Model: LoginModel;
    }

    class AccountController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        constructor(private $scope: IAccountScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {

            $scope.Login = this.Login;
            $scope.Register = this.Register;
            $scope.Model = new LoginModel();
            $scope.Model.Username = "";
            $scope.Model.Password = "";
            $scope.Model.Password2 = "";
            $scope.Model.IsRegister = false;
            $scope.Model.IsLogin = true;
            $scope.IsRegisterChanged = this.IsRegisterChanged;
        }

        private Login = () => {
            if(!this.CheckEmptyUsernamePassword()) {
                return;
            }

            this.OnLoginSuccessFull();
        };

        private Register = () => {
            if(!this.CheckEmptyUsernamePassword()) {
                return;
            }

            if(this.$scope.Model.Password !== this.$scope.Model.Password2) {
                this.ResetPassword();
                this.logger.logError("Passwords don't match", null, this, true);
                return;
            }

            this.OnRegisterSuccessFull();
        };

        private IsRegisterChanged = () => {
            this.$scope.Model.IsLogin = !this.$scope.Model.IsRegister;
        };


        private OnLoginSuccessFull = () => {
            this.logger.logSuccess("Hello " + this.$scope.Model.Username, null, this, true);
            this.navigation.Lobby();
        };

        private OnRegisterSuccessFull = () => {
            this.logger.logSuccess("A new player is born", null, this, true);
            this.navigation.Lobby();
        };

        private CheckEmptyUsernamePassword = () =>  {
            if(this.$scope.Model.Username === "" || this.$scope.Model.Password === "") {
                this.ResetPassword();
                this.logger.logError("You need to enter an username and a password", null, this, true);
                return false;
            }
            return true;
        }

        private ResetPassword = () => {
            this.$scope.Model.Password = "";
            this.$scope.Model.Password2 = "";
        }
    }

    export class AccountControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.AccountController, AccountController);
        }
    }
}