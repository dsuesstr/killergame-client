/// <reference path='min.references.ts'/>

module Routes {

    interface IStateProvider extends angular.ui.IStateProvider {
        state(config: any): IStateProvider;
        state(name: string, config: any): IStateProvider;
    }

    class UIRoutesConfig {
        static $inject = [
            $injections.UIRouter.$StateProvider,
            $injections.UIRouter.$UrlRouterProvider
        ];

        constructor($stateProvider: IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {

            $stateProvider
                .state('account', {
                    url: "/account",
                    templateUrl: "app/views/account.html",
                    controller: $injections.Controllers.AccountController,
                    resolve: {
                        loadLocalization: [$injections.Services.LocalizationProvider, (localizationProvider: Services.LocalizationConfig) => {
                            return localizationProvider.ExecuteLocalization();
                        }]
                    }
                })
                .state('menu', {
                url: "/menu",
                abstract: true,
                templateUrl: "app/views/menu.html",
                controller: $injections.Controllers.MenuController,
                resolve: {
                    loadLocalization: [$injections.Services.LocalizationProvider, (localizationProvider: Services.LocalizationConfig) => {
                        return localizationProvider.ExecuteLocalization();
                    }]
                }
            })
                .state($injections.Routes.HomeState, {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "app/views/lobby.html",
                        controller: $injections.Controllers.HomeController
                    }
                },
                clearHistory: true
            }).state($injections.Routes.GameState, {
                url: "/game/:id",
                views: {
                    'menuContent': {
                        templateUrl: "app/views/game.html",
                        controller: $injections.Controllers.GameController
                    }
                },
                clearHistory: true
            }).state($injections.Routes.RankingState, {
                url: "/ranking",
                views: {
                    'menuContent': {
                        templateUrl: "app/views/ranking.html",
                        controller: $injections.Controllers.RankingController
                    }
                },
                clearHistory: true
            }).state($injections.Routes.SettingsState, {
                url: "/settings",
                views: {
                    'menuContent': {
                        templateUrl: "app/views/settings.html",
                        controller: $injections.Controllers.SettingsController
                    }
                },
                clearHistory: true
            });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/account');
        }
    }


    export class UIRoutesRegister {
        constructor($module: angular.IModule) {
            $module.config(UIRoutesConfig);
        }
    }
}