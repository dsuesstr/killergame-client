/// <reference path='../min.references.ts'/>

module Services
{
    class Text {
        Key:string;
        Text:string;
    }

    class Strings  {
        private format:Function = null;
        private texts:Array<Object> = null;
        //private texts:Array<Text> = null;

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

            if(this.texts === null) {
                this.LoadStrings().then(this.StringsLoaded, this.StringsLoadedFailed)
            }
        }

        private StringsLoaded = (texts:Array<Object>) => {
            console.log(texts);
            this.texts = texts
        }

        private StringsLoadedFailed = (texts:Array<Object>) => {
            this.texts = null;
        }

        public Format:IStrings = (key:string) => {
            //var texts = this.texts;
            //console.log(typeof texts)
            if(typeof this.texts === "undefined") {
                return key;
            }
            //this.logger.Log("", this.texts[0], this, false)
            //console.log(this.texts);
            //debugger;
//debugger;
            //return this.texts[key];
            return key;
        };

        private LoadStrings = ():angular.IPromise<Array<Object>> => {

            var defer = this.$q.defer<Array<Object>>();

            this.$http.get('app/data/Strings.json')
                .success((response:Array<any>) => {
                this.logger.Log("Strings.json loaded", response, this, false);
                    defer.resolve(response);
                    //debugger;
                   /* this.texts = new Array<Text>();
                    for(var i = 0;i <response.length; i++) {
                        var text = new Text();
                        text.Key = response[0].key;
                        text.Text = response[0].value;
                        this.texts.push(text);
                    }*/

                    //this.texts = response;
            })
                .error((response:any, status:number) => {
                    this.logger.LogError("Can't load Strings.json", response, this, false);
                    defer.reject(null)
                });

            return defer.promise;
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