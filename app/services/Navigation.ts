/// <reference path='../min.references.ts'/>

module Services {
    class Navigation implements Services.INavigation {
        static $inject = [
            $injections.UIRouter.$StateService,
            $injections.Ionic.$ionicHistory
        ];

        constructor(
            private $state: angular.ui.IStateService,
            private $ionicHistory:any
        ) {

        }

        Back = () => {
            this.$ionicHistory.goBack();
        }

        Login = () => {
            this.$state.go($injections.Routes.AccountState);
        }

        Lobby = () => {
            this.$state.go($injections.Routes.LobbyState);
        };

        Player = (playerId:string) => {
            this.$state.go($injections.Routes.PlayerState, {playerId:playerId});
        };
    }

    export class NavigationRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Navigation, Navigation);
        }
    }
}