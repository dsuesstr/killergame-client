/// <reference path='../min.references.ts'/>

module Services {

    class ConnectionWatcherService {
        static $inject = [
            $injections.Angular.$RootScope,
            $injections.Angular.$Window,
            $injections.Plugins.NetworkConnectionPlugin,
            $injections.Constants.$Navigator,
            $injections.Ionic.$ionicPopup,
        ];

        constructor(private $rootScope:angular.IRootScopeService,
                    $window:angular.IWindowService,
                    networkConnectionPlugin:Plugins.NetworkConnection.INetworkConnection,
                    $navigator:any,
                    private $ionicPopup:any) {

            $rootScope.online = networkConnectionPlugin !== null ? networkConnectionPlugin.type !== 'none' : $navigator.onLine;
            $window.addEventListener("offline", this.offline, false);
            $window.addEventListener("online", this.online, false);
        }

        private online = () => {
            this.$rootScope.$apply(() => {
                this.$rootScope.online = true;
            });
        };

        private offline = () => {
            this.$rootScope.$apply(() => {
                this.$rootScope.online = false;
                this.$ionicPopup.alert({
                    title: "Connection",
                    template: "Oh no! You're not connected to the internet!"
                });
            });
        };
    }

    export class ConnectionWatcherServiceRegister {
        constructor($module:angular.IModule) {
            $module.run(ConnectionWatcherService);
        }
    }
}