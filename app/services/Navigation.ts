/// <reference path='../min.references.ts'/>

module Services {
    class Navigation implements Services.INavigation {
        static $inject = [
            $injections.UIRouter.$StateService
        ];

        constructor(private $state: angular.ui.IStateService) {

        }

        Home = () => {
            this.$state.go($injections.Routes.HomeState, {});
        };

        Player = (userId:string) => {
            this.$state.go($injections.Routes.PlayerState, {id:userId});
        };
    }

    export class NavigationRegister {
        constructor($module: angular.IModule) {
            $module.service($injections.Services.Navigation, Navigation);
        }
    }
}