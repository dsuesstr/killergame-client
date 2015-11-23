/// <reference path='../min.references.ts'/>

module Directives {

    interface IRankingDirectiveScope extends angular.IScope {
        Players:Models.IPlayer[];
        IsLoaded:boolean;
        HasData:boolean;
        ShowPlayer(player:Models.IPlayer);
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

        ShowPlayer = (player:Models.IPlayer) => {
            this.navigation.Player(player);
        }

        link = ($scope:IRankingDirectiveScope, $element, $attr) => {
            this.$scope = $scope;
            this.$scope.ShowPlayer = this.ShowPlayer;
            this.$scope.IsLoaded = false;
            this.$scope.HasData = false;
            this.playerProvider.GetAllPlayers().then(this.GetPlayersSuccessful, this.GetPlayersFailed);
        }

        private GetPlayersSuccessful = (players:Models.IPlayer[]) => {
            this.$scope.Players = players;
            this.$scope.HasData = players.length > 0;
            this.$scope.IsLoaded = true;
        }

        private GetPlayersFailed = (players:Models.IPlayer[]) => {
            this.$scope.HasData = true;
            this.$scope.IsLoaded = false;
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