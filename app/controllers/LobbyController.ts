/// <reference path='../min.references.ts'/>
module Controllers {

    class LobbyModel {
        AvailablePlayers:Models.IPlayer[]
    }

    interface ILobbyScope extends angular.IScope {
        Model:LobbyModel;
        Refresh();
    }

    class LobbyController {
        static $inject = [
            $injections.Angular.$Scope,
            $injections.Services.PlayerProvider,
            $injections.Services.Logger
        ];

        private retryCount: number = 0;

        constructor(private $scope: ILobbyScope,
                    private playerProvider: Services.IPlayerProvider,
                    private logger: Services.ILogger) {


            $scope.Model = new LobbyModel();
            $scope.Refresh = this.Refresh;

            this.Refresh();
        }

        private Refresh = () => {
            this.playerProvider.GetAvailablePlayers(new Models.ListParams()).then(this.GetAvailablePlayersSuccessful, this.GetAvailablePlayersFailed);
        }


        private GetAvailablePlayersSuccessful = (players:Models.IPlayer[]) => {
            this.$scope.Model.AvailablePlayers = players;

            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        }

        private GetAvailablePlayersFailed = (players:Models.IPlayer[]) => {

            this.$scope.Model.AvailablePlayers = undefined;
            this.$scope.$broadcast($constants.Events.Scroll.RefreshComplete);
        }

    }

    export class LobbyControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.LobbyController, LobbyController);
        }
    }
}