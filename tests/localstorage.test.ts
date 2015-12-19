/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../app/all.references.ts" />

describe('Localstorage', () => {
    var mock = angular.mock;

    var store = {};
    var ls = () => {
        return JSON.parse(store.storage);
    };

    beforeEach(() => {
        new AngularInit();
        module($injections.Constants.AppName);
        mock.module($injections.Constants.AppName);

        spyOn(localStorage, 'getItem').and.callFake(function(key) {
            return store[key];
        });

        spyOn(localStorage, 'setItem').and.callFake(function(key, value) {
            store[key] = value;
        });

        spyOn(localStorage, 'removeItem').and.callFake(function(key, value) {
            delete store[key]
        });

        spyOn(localStorage, 'clear').and.callFake(function(key, value) {
            store = {};
        });
    });

    afterEach(function () {
        store = {};
    });


    it('Add', inject(
    [
        $injections.Services.LocalStorage,
        (localStorageService:Services.ILocalStorage) => {

            var key = "KEY";
            var value = "test";

            localStorageService.Save(key, value);
            expect(store[key]).toEqual("\"test\"");
        }
    ]));

    it('Add and save', inject(
    [
        $injections.Services.LocalStorage,
        (localStorageService:Services.ILocalStorage) => {

            var key = "KEY";
            var value = "before";
            var value2 = "after";

            localStorageService.Save(key, value);


            expect(store[key]).toEqual("\"before\"");
            localStorageService.Save(key, value2);
            expect(store[key]).toEqual("\"after\"");
        }
    ]));

    it('Get', inject(
    [
        $injections.Services.LocalStorage,
        (localStorageService:Services.ILocalStorage) => {

            var key = "KEY";
            var value = "value";

            localStorageService.Save(key, value);
            expect(store[key]).toEqual("\"value\"");
            var getValue = localStorageService.Get(key);
            expect(getValue).toEqual(value);
        }
    ]));

    it('Remove', inject(
        [
            $injections.Services.LocalStorage,
            (localStorageService:Services.ILocalStorage) => {

                var key = "KEY";
                var value = "value";

                localStorageService.Save(key, value);
                expect(store[key]).toBeDefined();

                localStorageService.Remove(key);
                expect(store[key]).toBeUndefined();
            }
        ]));

    it('ClearAll', inject(
    [
        $injections.Services.LocalStorage,
        (localStorageService:Services.ILocalStorage) => {

            var key = "KEY";
            var key2 = "KEY2";
            var value = "value";

            localStorageService.Save(key, value);
            localStorageService.Save(key2, value);
            expect(store[key]).toBeDefined();
            expect(store[key2]).toBeDefined();

            localStorageService.ClearAll();
            expect(store[key]).toBeUndefined();
            expect(store[key2]).toBeUndefined();
        }
    ]));
});