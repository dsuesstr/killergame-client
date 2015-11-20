/// <reference path='../min.references.ts'/>
module Controllers {

    class LoginModel{
        Username:string;
        Password:string;
        Password2:string;
        Email:string;
        IsRegister:boolean;
        IsLogin:boolean;
        AccountForm: angular.IFormController;
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
            $scope.Model.Email = "";
            $scope.Model.IsRegister = false;
            $scope.IsFormValid = this.IsFormValid;
        }

        private IsFormValid = () => {
            if(!this.$scope.Model.AccountForm.$valid)
                return false

            if(this.$scope.Model.IsRegister)
                return this.$scope.Model.Password === this.$scope.Model.Password2;

            return true;
        }

        private Login = () => {

            this.OnLoginSuccessFull();
        };

        private Register = () => {

            this.OnRegisterSuccessFull();
        };


        private OnLoginSuccessFull = () => {
            this.logger.logSuccess("Hello " + this.$scope.Model.Username, null, this, true);
            this.navigation.Lobby();
        };

        private OnRegisterSuccessFull = () => {
            this.logger.logSuccess("A new player is born", null, this, true);
            this.navigation.Lobby();
        };
    }

    export class AccountControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.AccountController, AccountController);
        }
    }
}