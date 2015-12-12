/// <reference path='../min.references.ts'/>

module Services
{
    class Strings  {
        private format:Function = null;

        static $inject = [
            $injections.Angular.$filter,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Constants.$Enumerable,
            $injections.Services.LocalStorage,
            $injections.Services.Logger,
        ];

        constructor(private $filter:angular.IFilterService,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private $enumerable: linqjs.EnumerableStatic,
                    private localStorage:Services.ILocalStorage,
                    private logger:Services.ILogger) {

            this.format = $filter($injections.Filters.FormatFilter);

            this.LoadStrings().then(this.StringsLoaded, this.StringsLoadedFailed)
        }

        public Format:IStrings = (key:string, ...args:any[]) => {
            var texts = this.localStorage.Get($constants.Keys.Strings)
            if(!angular.isDefined(texts)) {
                return key;
            }
            var result = this.$enumerable.from(texts).firstOrDefault(x => x.key == key);

            if(result !== null) {
                return result.value.replace(/{(\d+)}/g, function(match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match
                        ;
                });
            }

            return key;
        };

        private LoadStrings = ():angular.IPromise<Array<Object>> => {

            var defer = this.$q.defer<Array<Object>>();

            this.$http.get('app/data/Strings.json')
                .success((response:Array<any>) => {
                    defer.resolve(response);
                })
                .error((response:any, status:number) => {
                    defer.reject(response)
                });

            return defer.promise;
        }

        private StringsLoaded = (texts:Array<string>) => {
            this.logger.Log("Strings loaded", texts, this, false);
            this.localStorage.Save($constants.Keys.Strings, texts);
        };

        private StringsLoadedFailed = (error:any) => {
            this.logger.LogError("Can't load strings", error, this, false);
        };
    }

    export function StringsRegister ($module:angular.IModule) {
        $module.factory($injections.Services.Strings,
            [
                $injections.Angular.$injector,
                ($injector:angular.auto.IInjectorService):IStrings => $injector.instantiate(Strings).Format
            ]);
    }
}