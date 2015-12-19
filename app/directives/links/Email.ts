/// <reference path='../../min.references.ts'/>
/**
 * directive for mailto links (extended with an extra icon) replaces
 *     <emaillink href="mailto:someone@example.com" title="example title">example text</emaillink>
 * with
 *     <a href="mailto:someone@example.com" title="example title">
 *         <ng-transclude><span>example text</span></ng-transclude>
 *         <i class="icon ion-email"></i>
 *     </a>
 *
 * @author Julian Mollik <jule@creative-coding.net>
 */
module Directives {
    'use strict';

    interface IEmaillinkScope extends angular.IScope {
        href:string;
        title:string;
    }

    class Emaillink implements angular.IDirective {

        restrict:string = "E";
        replace:boolean = true;
        transclude:boolean = true;
        templateUrl:string = "app/views/directives/links/email.html";
        $scope:IEmaillinkScope;

        constructor() {
        }

        link = ($scope:IEmaillinkScope) => {
            this.$scope = $scope;
        };
    }

    var EmaillinkDirectiveProvider = [$injections.Angular.$injector, function ($injector: angular.auto.IInjectorService) {
        return $injector.instantiate(Emaillink);
    }];

    export class EmaillinkDirectiveRegister {
        constructor($module: angular.IModule) {
            $module.directive($injections.Directives.EmaillinkDirective, EmaillinkDirectiveProvider);
        }
    }
}