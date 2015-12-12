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

    class LoginData implements Models.Messages.ILogin {
        username:string;
        password:string;
    }

    class RegisterData implements Models.Messages.IRegister {
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
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger,
            $injections.Services.AccountHandler,
            $injections.Services.Strings
        ];

        constructor(private $scope: IAccountScope,
                    private navigation: Services.INavigation,
                    private $ionicLoading: any,
                    private logger: Services.ILogger,
                    private accountHandler: Services.IAccountHandler,
                    private strings: Services.IStrings) {

            if(this.accountHandler.IsLoggedIn()) {
                this.logger.LogSuccess(this.strings("login_already"), null, this, true);
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

        /**
         *
         * @constructor
         */
        private Login = () => {

            var login = new LoginData();
            login.username = this.$scope.Model.Username;
            login.password = this.$scope.Model.Password;

            this.$ionicLoading.show({
                template: this.strings("login_wait")
            });

            this.accountHandler.Login(login).then(this.OnLoginSuccessful, this.OnError);
        };

        private Register = () => {

            var register = new RegisterData();
            register.username = this.$scope.Model.Username;
            register.password_1 = this.$scope.Model.Password;
            register.password_2 = this.$scope.Model.Password2;
            register.name = this.$scope.Model.Name;
            register.email = this.$scope.Model.Email;

            this.$ionicLoading.show({
                template: this.strings("login_wait")
            });

            this.accountHandler.Register(register).then(this.OnRegisterSuccessful, this.OnError);
        };

        private IsFormValid = () => {
            if(!this.$scope.Model.AccountForm.$valid)
                return false;

            if(this.$scope.Model.IsRegister)
                return this.$scope.Model.Password === this.$scope.Model.Password2;

            return true;
        };

        private OnRegisterSuccessful = (player:Models.Messages.IPlayer) => {
            this.$ionicLoading.hide();
            this.logger.LogSuccess(this.strings("register_successful", player.username), null, this, true);
            this.navigation.Lobby();
        };

        private OnLoginSuccessful = (player:Models.Messages.IPlayer) => {
            this.$ionicLoading.hide();
            this.logger.LogSuccess(this.strings("login_successful", player.username), null, this, true);
            this.navigation.Lobby();
        };

        private OnError = (error:Models.Messages.IError) => {
            this.logger.LogApiError(error, this, true);
            this.$scope.Model.Password = "";
            this.$scope.Model.Password2 = "";
            this.$ionicLoading.hide();
        };
    }

    export class AccountControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.AccountController, AccountController);
        }
    }
}