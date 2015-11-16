/// <reference path='../min.references.ts'/>

module Services {
    export class LocalizationConfig {
        static $inject = [
            'localize',
            '$templateCache',
            $injections.Services.LocalStorage,
            $injections.Plugins.GlobalizationPlugin,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService
        ];

        constructor(private localize: any, private $templateCache: any, private localStorage: Services.ILocalStorage, private globalization: Plugins.Globalization.IGlobalization, private $http: angular.IHttpService, private $q: angular.IQService) {
            this.ExecuteLocalization();
        }

        public ExecuteLocalization(): angular.IPromise<void> {
            var deferred = this.$q.defer<void>();

            var languageFromStorage = this.localStorage.get('language');
            if (languageFromStorage) {
                this.TryToSetLanguage(languageFromStorage, deferred);
            }
            else if (this.globalization !== null) {
                this.globalization.getPreferredLanguage((language) => this.OnSuccess(language, deferred), (error) => this.OnError(error, deferred));
            }
            else {
                this.TryToSetLanguage('en-US', deferred);
                deferred.resolve();
            }

            return deferred.promise;

        }

        private OnSuccess = (language: Plugins.Globalization.ILanguage, deferred: angular.IDeferred<void>) => {
            this.TryToSetLanguage(language.value, deferred);
        };

        private OnError = (error: Plugins.IError, deferred: angular.IDeferred<void>) => {
            this.TryToSetLanguage('en-US', deferred);
        };

        private TryToSetLanguage = (language: string, deferred: angular.IDeferred<void>) => {
            var url = this.GetLanguageResourceUrl(language);
            if (!this.TrySetLanguageFromTemplateCache(language, url)) {
                if (language !== 'en-US') {
                    this.$http.get(this.GetLanguageResourceUrl(language))
                        .success(() => {
                        this.SetLanguage(language, url);
                        setTimeout(() => deferred.resolve(), 100);
                    })
                        .error(() => this.TryToSetLanguage('en-US', deferred));
                } else this.SetLanguage(language, url);
            } else {
                deferred.resolve();
            }
        };

        private SetLanguage = (language: string, url: string) => {
            this.localize.setUrl(url);
            this.localize.language = language;
        };

        private TrySetLanguageFromTemplateCache(language: string, url: string): boolean {
            var fromCache = this.$templateCache.get(url);
            if (fromCache) {
                this.localize.successCallback(JSON.parse(fromCache));
                return true;
            }

            return false;
        }

        private GetLanguageResourceUrl = (language: string): string => {
            return 'app/localizations/' + language + '.json';
        };
    }

    export class LocalizationConfigRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.LocalizationProvider, LocalizationConfig);
            //$module.run(['localize',
            //    '$templateCache',
            //    $injections.Services.LocalStorage,
            //    $injections.Plugins.GlobalizationPlugin,
            //    $injections.Angular.$HttpService,
            //    (localize, $templateCache, localStorage, globalization, $http) => new LocalizationConfig(localize, $templateCache, localStorage, globalization, $http)]);
        }
    }
}