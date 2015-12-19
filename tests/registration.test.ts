/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../app/injections.ts" />

describe('Registrations', () => {
    var mock = angular.mock;

    beforeEach(() => {
        new AngularInit();
        module($injections.Constants.AppName);
        mock.module($injections.Constants.AppName);
    });

    var CheckInjection = (service) => {
        expect(service).not.toBeNull();
        expect(service).not.toBeUndefined();
    };

    describe('Services', () => {

        it('Strings', inject(($injector:angular.auto.IInjectorService) => {

            CheckInjection($injector.get($injections.Services.Strings));
        }));

        it('Accounthandler', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.AccountHandler));
        }));

        it('ApiSettingsHandler', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.ApiSettingsHandler));
        }));

        it('GameHandler', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.GameHandler));
        }));

        it('GameProvider', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.GameProvider));
        }));

        it('LocalStorage', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.LocalStorage));
        }));

        it('Logger', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.Logger));
        }));

        it('Navigation', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.Navigation));
        }));

        it('OpenLink', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.OpenLink));
        }));

        it('PlayerProvider', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.PlayerProvider));
        }));

        it('Urls', inject(($injector:angular.auto.IInjectorService) => {
            CheckInjection($injector.get($injections.Services.Urls));
        }));
    });
});