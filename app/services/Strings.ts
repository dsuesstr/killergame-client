/// <reference path='../min.references.ts'/>

module Services
{
    class Strings  {
        private format:Function = null;
        private texts:any = null;

        static $inject = [
            $injections.Angular.$filter,
            $injections.Angular.$HttpService,
            $injections.Angular.$QService,
            $injections.Services.Logger
        ];

        constructor(private $filter:angular.IFilterService,
                    private $http:angular.IHttpService,
                    private $q:angular.IQService,
                    private logger:Services.ILogger) {

            this.format = $filter($injections.Filters.FormatFilter);

            if (this.texts == null) {
                this.LoadStrings();
            }
        }

        public Format:IStrings = (key:string) => {
            if(this.texts ==null) {
                return key;
            }

            return "asdas";
        };

        private LoadStrings = () => {

            this.$http.get('app/data/Strings.json')
                .success((response:any) => {
                    this.logger.Log("Strings.json loaded", response, this, false);
                    this.texts = response;
                })
                .error((response:any, status:number) => {
                    this.logger.LogError("Can't load Strings.json", response, this, false);
                });
        }
    }

    export function StringsRegister ($module:angular.IModule) {
        $module.factory($injections.Services.Strings,
            [
                $injections.Angular.$injector,
                ($injector:angular.auto.IInjectorService):IStrings => $injector.instantiate(Strings).Format
            ]);
    }
}