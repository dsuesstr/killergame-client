/// <reference path='all.references.ts'/>

class RegisterComponents {
    constructor(application: angular.IModule) {

        new Routes.UIRoutesRegister(application);

        new Controllers.MenuControllerRegister(application);
        new Controllers.LobbyControllerRegister(application);
        new Controllers.PlayerControllerRegister(application);
        new Controllers.RankingControllerRegister(application);
        new Controllers.SettingsControllerRegister(application);
        new Controllers.AccountControllerRegister(application);
        new Controllers.GameControllerRegister(application);

        new Services.OpenLinkServiceRegister(application);
        new Services.StringsRegister(application);
        new Services.LocalStorageRegister(application);
        new Services.ConnectionWatcherServiceRegister(application);
        new Services.LocalizationConfigRegister(application);
        new Services.NavigationRegister(application);
        new Services.ClearHistoryServicesRegister(application);
        new Services.IonicConfigServicesRegister(application);
        new Services.LoginProviderRegister(application);
        new Services.PlayerProviderRegister(application);

        new Services.UrlsRegister(application);

        new Framework.EventFactoryRegister(application);

        new Filters.FormatFilterRegister(application);
        new Filters.DurationFilterRegister(application);

        new Directives.RankingDirectiveRegister(application);
        new Directives.FieldDirectiveRegister(application);
    }
}

new RegisterComponents(angular.module($injections.Constants.AppName));