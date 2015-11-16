/// <reference path='../min.references.ts'/>
module Controllers {

    class LoginModel{
        Username:string;
        Password:string;
    }

    interface IAccountScope extends angular.IScope {
        Login();
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
            $scope.Model = new LoginModel();

        }

        private Login = () => {

            //TODO: Login with Model.Username, Model.Password
            //this.logger.logWarning(this.$scope.Model.Password, null, this, true);

            this.navigation.Home();
        };

    }

    export class AccountControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.AccountController, AccountController);
        }
    }
}