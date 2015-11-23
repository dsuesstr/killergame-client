module $constants
{
    export module Events{
        export var Destroy:string = '$destroy';
        export var StateChangeSuccess:string = '$stateChangeSuccess';

        export module Scroll {
            export var refreshComplete:string = "scroll.refreshComplete"
        }

        export module IonicView {
            export var beforeEnter: string = '$ionicView.beforeEnter';

        }
    }

    export module Keys {
        export var TokenKey:string = "kgToken";
    }
}
