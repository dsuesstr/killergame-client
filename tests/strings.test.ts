/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../app/all.references.ts" />

describe('Strings', () => {
    var mock = angular.mock;

    beforeEach(() => {
        new AngularInit();
        module($injections.Constants.AppName);
        mock.module($injections.Constants.AppName);
    });

    it('Unresolved key', inject(
        [
            $injections.Services.Strings,
            (strings:Services.IStrings) => {
                var key = "challenge_confirm";
                var parameters = "EXAMPLE";

                var actual = strings(key, parameters);
                expect(actual).toBe(key);
            }
        ]));
});