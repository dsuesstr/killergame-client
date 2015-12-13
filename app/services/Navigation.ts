/// <reference path='../min.references.ts'/>

module Services {
    'use strict';

    class Navigation implements Services.INavigation {
        static $inject = [
            $injections.UIRouter.$StateService,
            $injections.Ionic.$ionicHistory
        ];

        constructor(
            private $state: angular.ui.IStateService,
            private $ionicHistory:any) {

        }

        /**
         * History.Back()
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        public Back = () => {
            this.$ionicHistory.goBack();
        };

        /**
         * Login
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        public Login = () => {
            this.$state.go($injections.Routes.AccountState);
        };

        /**
         * Lobby
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        public Lobby = () => {
            this.$state.go($injections.Routes.LobbyState);
        };

        /**
         * Game
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IGame} game
         */
        public Game = (game:Models.Messages.IGame) => {
            this.$state.go($injections.Routes.GameState, {gameId: game.gameId});
        };

        /**
         * Player
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         * @constructor
         */
        public Player = (player:Models.Messages.IPlayer) => {
            this.$state.go($injections.Routes.PlayerState, {playerId:player.playerId});
        };
    }

    /**
     * Register the Navigation as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class NavigationRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Navigation, Navigation);
        }
    }
}