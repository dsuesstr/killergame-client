/// <reference path='../min.references.ts'/>
class AngularInit {
    constructor() {
        angular.module($injections.Constants.AppName)
            .constant($injections.Constants.ApiHost, "https://killergame-rest.herokuapp.com/") //
            .constant($injections.Constants.$Enumerable, (<any>window).Enumerable)
            .constant($injections.Plugins.NetworkConnectionPlugin, this.getNetworkConnectionPlugin())
            .constant($injections.Constants.$JQuery, $)
            .constant($injections.Constants.$Navigator, navigator)
            .constant($injections.Constants.$Angular, angular);

    }

    private isDefined(value) {
        return value !== null && value !== undefined;
    }


    private getNetworkConnectionPlugin() {
        if (this.isDefined(navigator) && this.isDefined((<any>navigator).connection))
            return (<any>navigator).connection;
        return null;
    }
} 