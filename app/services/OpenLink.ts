/// <reference path='../min.references.ts'/>
module Services {

    class OpenLink {
        static $inject = [$injections.Angular.$Window];

        constructor(private $window:any) {
        }

        action:Services.IOpenLink = (url:string) => {
            this.$window.open(url, '_blank');
        };
    }

    class OpenLinkFactory {

        $get = [$injections.Angular.$injector, ($injector:angular.auto.IInjectorService):IOpenLink => {
            var provider = $injector.instantiate(OpenLink);
            return provider.action;
        }]
    }

    export class OpenLinkServiceRegister {
        constructor($module:angular.IModule) {
            $module.provider($injections.Services.OpenLink, OpenLinkFactory);
        }
    }
}