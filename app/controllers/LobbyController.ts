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
            $injections.Services.Navigation,
            $injections.Services.PlayerProvider,
            $injections.Ionic.$ionicPopup,
            $injections.Services.Strings,
            $injections.Ionic.$ionicLoading,
            $injections.Services.Logger
        ];

        private retryCount: number = 0;

        constructor(private $scope: ILobbyScope,
                    private navigation: Services.INavigation,
                    private playerProvider: Services.IPlayerProvider,
                    private $ionicPopup: any,
                    private strings: Services.IStrings,
                    private $ionicLoading: any,
                    private logger: Services.Logger) {


            $scope.Model = new LobbyModel();
            $scope.Refresh = this.Refresh;

            this.Refresh();
        }

        private Refresh = () => {
            this.playerProvider.GetAvailablePlayers().then(this.GetAvailablePlayersSuccessful, this.GetAvailablePlayersFailed);
        }


        private GetAvailablePlayersSuccessful = (players:Models.IPlayer[]) => {

            this.$scope.Model.AvailablePlayers = players;

            this.$scope.$broadcast($constants.Events.Scroll.refreshComplete);
        }

        private GetAvailablePlayersFailed = (players:Models.IPlayer[]) => {
            this.$scope.Model.AvailablePlayers = undefined;
            this.$scope.$broadcast($constants.Events.Scroll.refreshComplete);
        }

        private OnError = () => {
            if (this.retryCount < 3) {
                this.retryCount++;
                //this.Start();
                return;
            }

            this.hidePopupWithDealy(() => this.$ionicPopup.alert({
                title: this.strings('home:nearest station resolving:title'),
                template: this.strings('home:nearest station resolving:message')
            }));
        };


        private hidePopupWithDealy(after: () => void): void {
            //Delay is necessary because a race condition might occure
            window.setTimeout(() => {
                this.$ionicLoading.hide();
                after();
            }, 500);
        }
    }

    export class LobbyControllerRegister {
        constructor($module: angular.IModule) {
            $module.controller($injections.Controllers.LobbyController, LobbyController);
        }
    }
}