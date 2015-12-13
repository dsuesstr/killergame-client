module $constants {
    'use strict';

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
            export var RefreshComplete:string = "scroll.refreshComplete";
            export var InfiniteScrollComplete:string = "scroll.infiniteScrollComplete";
        }

        export module IonicView {
            export var BeforeEnter: string = '$ionicView.beforeEnter';

        }
    }

    export module Game {
        export var Player1:string = "player1";
        export var Player2:string = "player2";

        export module Stones {
            export var Player1:string = "x";
            export var Player2:string = "o";
            export var Free:string = "";
        }

        export module States {
            export var Prestart:string = "prestart";
            export var Ready:string = "ready";
            export var InProgress:string = "inprogress";
            export var Finished:string = "finished";
        }

        export module Results {
            export var ForfeitPlayer1:string = "forfeit_player1";
            export var ForfeitPlayer2:string = "forfeit_player2";
            export var WinPlayer1:string = "win_player1";
            export var WinPlayer2:string = "win_player2";
            export var Draw:string = "draw";
        }
    }

    export module Params {
        export var PlayerId:string = "playerId";
        export var GameId:string = "gameId";
        export var DefaultLimit:number = 10;
    }

    export module Timeouts {
        export var GameTimeout:number = 30000;
        export var RequestTimeout:number = 1000;
    }

    export module Intervals {
        export var LobbyRefreshInterval:number = 1000;
        export var GameRefreshInterval:number = 1000;
    }

    export module Keys {
        export var Token:string = "kgToken";
        export var Player:string = "kgPlayer";
        export var Strings:string = "kgStrings";
        export var PlayerAuth1:string = "player_auth_0001";
        export var PlayerAuth2:string = "player_auth_0002";
    }
}
