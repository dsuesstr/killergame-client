/// <reference path='../min.references.ts'/>

module Directives {
    'use strict';

    interface IRankingDirectiveScope extends angular.IScope {
        Players:Models.Messages.IPlayer[];
        CurrentPlayer:Models.Messages.IPlayer;
        IsLoaded:boolean;
        HasData:boolean;
        HasMore:boolean;
        LoadMore();
        ShowPlayer(player:Models.Messages.IPlayer);
        IsCurrentPlayer(player:Models.Messages.IPlayer):boolean;
    }

    class RankingDirective implements angular.IDirective {

        restrict:string = "E";
        templateUrl:string = "app/views/directives/ranking.html";
        $scope:IRankingDirectiveScope;

        static $inject = [
            $injections.Services.Navigation,
            $injections.Services.PlayerProvider,
            $injections.Services.Logger
        ];

        constructor(private navigation: Services.INavigation,
                    private playerProvider: Services.IPlayerProvider,
                    private logger: Services.ILogger) {
        }

        /**
         * Register DOM listeners and update the DOM
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param $scope
         */
        public link = ($scope:IRankingDirectiveScope) => {
            this.$scope = $scope;
            this.$scope.CurrentPlayer = this.playerProvider.GetCurrentPlayer();
            this.$scope.ShowPlayer = this.ShowPlayer;
            this.$scope.LoadMore = this.LoadMore;
            this.$scope.$on($constants.Events.Kg.RankingRefresh, this.Refresh);
            this.Refresh();
        };

        /**
         * Refresh the Ranking (Get data from API)
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private Refresh = () => {
            this.$scope.IsLoaded = false;
            this.$scope.HasData = false;
            this.$scope.Players = [];

           this.GetPlayers(0);
        };

        /**
         * Get Players from the provider
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {number} offset
         * @constructor
         */
        private GetPlayers = (offset:number) => {
            var params = new Models.ListParams();
            params.Limit = 5;
            params.Offset = offset;
            this.playerProvider.GetAllPlayers(params).then(this.GetPlayersSuccessful, this.OnError);
        }

        /**
         * Show the playerView for a specific player
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer} player
         */
        private ShowPlayer = (player:Models.Messages.IPlayer) => {
            this.navigation.Player(player);
        };

        /**
         * Handles the successcase for refresh
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IPlayer[]} players
         */
        private GetPlayersSuccessful = (players:Models.Messages.IPlayer[]) => {

            this.$scope.Players = this.$scope.Players.concat(players);
            this.$scope.HasData = this.$scope.Players.length > 0;
            this.$scope.IsLoaded = true;
            this.$scope.HasMore = players.length === $constants.Params.DefaultLimit;
            this.$scope.$emit($constants.Events.Kg.RankingRefreshComplete);
        };

        /**
         * Handles the failed case for refresh
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         * @param {Models.Messages.IError} error
         */
        private OnError = (error:Models.Messages.IError) => {
            this.$scope.HasData = this.$scope.Players.length > 0;
            this.$scope.IsLoaded = true;
            this.$scope.$emit($constants.Events.Kg.RankingRefreshComplete);
            this.logger.LogApiError(error, this, true);
        }

        /**
         * LoadMore Players
         *
         * @author Dominik Süsstrunk <the.domi@gmail.com>
         */
        private LoadMore = () => {
            this.GetPlayers(this.$scope.Players.length);
        }
    }

    /**
     * injects the RankingDirective
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     * @type {any[]}
     */
    var RankingDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(RankingDirective);
    }];

    /**
     * Registers the RankingDirectiveRegister as a module
     *
     * @author Dominik Süsstrunk <the.domi@gmail.com>
     */
    export class RankingDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.RankingDirective, RankingDirectiveProvider);
        }
    }
}