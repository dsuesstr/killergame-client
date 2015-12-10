/// <reference path='../min.references.ts'/>

module Directives {

    interface IRankingDirectiveScope extends angular.IScope {
        Players:Models.Messages.IPlayer[];
        IsLoaded:boolean;
        HasData:boolean;
        ShowPlayer(player:Models.Messages.IPlayer);
    }

    class RankingDirective implements angular.IDirective {

        restrict:string = "E";
        templateUrl:string = "app/views/directives/ranking.html";
        $scope:IRankingDirectiveScope;

        static $inject = [
            $injections.Services.Navigation,
            $injections.Services.PlayerProvider,
        ];


        constructor(private navigation: Services.INavigation,
                    private playerProvider: Services.IPlayerProvider
            ) {
        }

        link = ($scope:IRankingDirectiveScope, $element, $attr) => {
            this.$scope = $scope;
            this.$scope.ShowPlayer = this.ShowPlayer;
            this.$scope.$on($constants.Events.Kg.RankingRefresh, this.Refresh);
            this.Refresh();
        };

        private Refresh = () => {
            this.$scope.IsLoaded = false;
            this.$scope.HasData = false;
            this.playerProvider.GetAllPlayers(new Models.ListParams()).then(this.GetPlayersSuccessful, this.GetPlayersFailed);
        };

        private ShowPlayer = (player:Models.Messages.IPlayer) => {
            this.navigation.Player(player);
        };

        private GetPlayersSuccessful = (players:Models.Messages.IPlayer[]) => {
            this.$scope.Players = players;
            this.$scope.HasData = players.length > 0;
            this.$scope.IsLoaded = true;
            this.$scope.$emit($constants.Events.Kg.RankingRefreshComplete);
        };

        private GetPlayersFailed = (players:Models.Messages.IPlayer[]) => {
            this.$scope.Players = null;
            this.$scope.HasData = false;
            this.$scope.IsLoaded = true;
            this.$scope.$emit($constants.Events.Kg.RankingRefreshComplete);
        }
    }

    var RankingDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(RankingDirective);
    }];

    export class RankingDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.RankingDirective, RankingDirectiveProvider);
        }
    }
}