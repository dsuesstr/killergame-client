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

    export module Game {
        export var Player1 = "player1";
        export var Player2 = "player2";

        export module Stones {
            export var Player1 = "x";
            export var Player2 = "o";
            export var Free = "";
        }

        export module States {
            export var Prestart = "prestart";
            export var Ready = "ready";
            export var InProgress = "inprogress";
            export var Finished = "finished";
        }

        export module Results {
            export var ForfeitPlayer1 = "forfeit_player1";
            export var ForfeitPlayer2 = "forfeit_player2";
            export var WinPlayer1 = "win_player1";
            export var WinPlayer2 = "win_player2";
            export var Draw = "draw";
        }
    }

    export module Params {
        export var PlayerId = "playerId";
        export var GameId = "gameId";
    }

    export module Timeouts {
        export var GameTimeout = 30000;
    }

    export module Intervals {
        export var LobbyRefreshInterval = 1000;
        export var GameRefreshInterval = 1000;
    }

    export module Keys {
        export var Token:string = "kgToken";
        export var Player:string = "kgPlayer";
        export var Strings:string = "kgStrings";
    }
}
