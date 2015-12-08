module $constants
{
    export module Events{
        export var Destroy:string = '$destroy';
        export var StateChangeSuccess:string = '$stateChangeSuccess';


        export module Kg {
            export var AuthenticationError:string = 'kg.authenticationError';
            export var RankingRefresh:string = 'kg.rankingRefresh';
            export var RankingRefreshComplete:string = 'kg.RankingRefreshComplete';
            export var RankingLoadMore:string = 'kg.RankingLoadMore';
            export var RankingLoadMoreComplete:string = 'kg.RankingLoadMoreComplete';
        }

        export module Scroll {
            export var RefreshComplete:string = "scroll.refreshComplete"
            export var InfiniteScrollComplete:string = "scroll.infiniteScrollComplete"
        }

        export module IonicView {
            export var BeforeEnter: string = '$ionicView.beforeEnter';

        }
    }

    export module Intervals {
        export var LobbyRefreshInterval = 5000;
        export var GameRefreshInterval = 5000;
    }

    export module Keys {
        export var TokenKey:string = "kgToken";
        export var PlayerKey:string = "kgPlayer";
    }
}
