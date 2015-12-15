/// <reference path='../min.references.ts'/>

/**
 * directive for external links (extended with an extra icon) replaces
 *     <externallink href="https://example.com" title="example title">example text</externallink>
 * with
 *     <a href="https://example.com" title="example title">
 *         <ng-transclude><span>example text</span></ng-transclude>
 *         <i class="icon ion-android-open"></i>
 *     </a>
 *
 * @author Julian Mollik <jule@creative-coding.net>
 */
module Directives {
    'use strict';

    interface IExternallinkScope extends angular.IScope {
        href:string;
        title:string;
    }

    class Externallink implements angular.IDirective {

        restrict:string = "E";
        replace:boolean = true;
        transclude:boolean = true;
        templateUrl:string = "app/views/directives/links/external.html";
        $scope:IExternallinkScope;

        constructor() {
        }

        link = ($scope:IExternallinkScope) => {
            this.$scope = $scope;
        };
    }

    var ExternallinkDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(Externallink);
    }];

    export class ExternallinkDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.ExternallinkDirective, ExternallinkDirectiveProvider);
        }
    }
}