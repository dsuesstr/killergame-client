/// <reference path='../min.references.ts'/>

module Services {
    class Navigation implements Services.INavigation {
        static $inject = [
            $injections.UIRouter.$StateService,
            $injections.Ionic.$ionicHistory
        ];

        constructor(
            private $state: angular.ui.IStateService,
            private $ionicHistory:any) {

        }

        public Back = () => {
            this.$ionicHistory.goBack();
        };

        public Login = () => {
            this.$state.go($injections.Routes.AccountState);
        };

        public Lobby = () => {
            this.$state.go($injections.Routes.LobbyState);
        };

        public Game = (game:Models.Messages.IGame) => {
            this.$state.go($injections.Routes.GameState, {gameId: game.gameId});
        };

        public Player = (player:Models.Messages.IPlayer) => {
            this.$state.go($injections.Routes.PlayerState, {playerId:player.playerId});
        };
    }

    export class NavigationRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Navigation, Navigation);
        }
    }
}