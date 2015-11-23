/// <reference path='../min.references.ts'/>
module Controllers {

    class LoginModel {
        Name:string;
        Username:string;
        Password:string;
        Password2:string;
        Email:string;
        IsRegister:boolean;
        AccountForm: angular.IFormController;
    }

    class LoginData implements Models.ILogin {
        username:string;
        password:string;
    }

    class RegisterData implements Models.IRegister {
        username:string;
        password_1:string;
        password_2:string;
        name:string;
        email:string;
    }

    interface IAccountScope extends angular.IScope {
        Login();
        Register();
        IsRegisterChanged();
        IsFormValid();
        Model: LoginModel;
    }

    class AccountController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.Navigation,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger,
            $injections.Services.LoginProvider
        ];

        constructor(private $scope: IAccountScope,
                    private navigation: Services.INavigation,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger,
                    private loginProvider: Services.ILoginProvider) {


            if(this.loginProvider.IsLoggedIn()) {
                this.logger.logSuccess("Hei, you're already logged in", null, this, true);
                this.navigation.Lobby();
            }


            $scope.Login = this.Login;
            $scope.Register = this.Register;
            $scope.Model = new LoginModel();
            $scope.Model.Name = "";
            $scope.Model.Username = "";
            $scope.Model.Password = "";
            $scope.Model.Password2 = "";
            $scope.Model.Email = "";
            $scope.Model.IsRegister = false;
            $scope.IsFormValid = this.IsFormValid;
        }

        private Login = () => {

            var login = new LoginData();
            login.username = this.$scope.Model.Username;
            login.password = this.$scope.Model.Password;

            this.loginProvider.Login(login).then(this.OnLoginSuccessful, this.OnError);
        };

        private Register = () => {

            var register = new RegisterData();
            register.username = this.$scope.Model.Username;
            register.password_1 = this.$scope.Model.Password;
            register.password_2 = this.$scope.Model.Password2;
            register.name = this.$scope.Model.Name;
            register.email = this.$scope.Model.Email;

            this.loginProvider.Register(register).then(this.OnRegisterSuccessful, this.OnError);
        };

        private IsFormValid = () => {
            if(!this.$scope.Model.AccountForm.$valid)
                return false

            if(this.$scope.Model.IsRegister)
                return this.$scope.Model.Password === this.$scope.Model.Password2;

            return true;
        }

        private OnRegisterSuccessful = (token:string) => {

            this.logger.logSuccess("Hello " + this.$scope.Model.Username, null, this, true);
            this.navigation.Lobby();
        };

        private OnLoginSuccessful = (token:string) => {


            this.logger.logSuccess("Hello " + this.$scope.Model.Username, null, this, true);
            this.navigation.Lobby();
        };

        private OnError = (message:string) => {
            this.logger.logError(message, null, this, true);
            this.$scope.Model.Password = "";
        };
    }

    export class AccountControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.AccountController, AccountController);
        }
    }
}