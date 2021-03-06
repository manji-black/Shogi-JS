﻿
$(function() {
	"use asm";
	/************************************************************/
	/*	Classes                                                 */
	/************************************************************/
	/**
	 *	駒のクラス
	 */
	function Piece(symbol, owner, promoted, point, array) {
		this.symbol = symbol;
		this.owner = owner;
		this.promoted = promoted;
		this.point = point;
		this.area = null;
	
		if ((array != undefined) && (array != null)) {
			this.area = new Int8Array(array);
		}
	};
	
	/**
	 * 将棋盤のマスのクラス
	 */
	function Cell(row, column) {
		this.row = row | 0;
		this.column = column | 0;
	};
	
	/**
	 * 将棋盤のクラス
	 */
	function Board() {
		this.map = new Uint8Array(81);
		
		this.pieceInHand = new Array(2);
		this.pieceInHand[PLAYER] = new Array();
		this.pieceInHand[OPPONENT] = new Array();
		
		this.pieceNum = {};
		this.pieceNum['PLAYER'] = 0;
		this.pieceNum['OPPONENT'] = 0;
		
		this.winner = BLANK;
	};
	
	/** 将棋盤のクローンの作成 */
	Board.prototype.clone = function() {
		var b = new Board();
		for (var i=0; i<9; i++) {
			for (var j=0; j<9; j++) {
				b.map[i*9+j] = this.map[i*9+j];
			};
		};
		
		for (var i=0, len=this.pieceInHand[PLAYER].length; i<len; i++) {
			b.pieceInHand[PLAYER][i] = this.pieceInHand[PLAYER][i];
		}
		for (var i=0, len=this.pieceInHand[OPPONENT].length; i<len; i++) {
			b.pieceInHand[OPPONENT][i] = this.pieceInHand[OPPONENT][i];
		}
		
		b.pieceNum['PLAYER'] = this.pieceNum['PLAYER'];
		b.pieceNum['OPPONENT'] = this.pieceNum['OPPONENT'];
		
		b.winner = this.winner;
		
		return b;
	}; 
	
	/** 現在の局面の評価 */
	Board.prototype.eval = function(turn) {
		var playerPoint, opponentPoint;
		var symbol, piece;
		var src, dst;
		
		playerPoint = 0;
		opponentPoint = 0;
		src = new Cell(0, 0);
		dst = new Cell(0, 0);
		
		// 盤上の駒の評価
		for (var i=0; i<9; i++) {
			for (var j=0; j<9; j++) {
				symbol = this.map[i*9+j];
				piece = pieceInfo[symbol];
				
				// 駒の持ち点を単純に加算
				if (piece.owner == PLAYER) {
					playerPoint += piece.point;
				} else if (piece.owner == OPPONENT) {
					opponentPoint += piece.point;
				};
				
				// 王に利いているかを評価
				if (piece.area != null) {
					for (var k=0, len=piece.area.length; k<len; k+=2) {
						src.row = i;
						src.column = j;
						dst.row = src.row + piece.area[k];
						dst.column = src.column + piece.area[k+1];
						if (isMovable(this, piece, src, dst)) {
							if ((piece.owner == PLAYER) && 
									(this.map[dst.row*9+dst.column] == OPP_OU_SYMBOL)) {
									playerPoint += OU_POINT/2;
							} else if ((piece.owner == OPPONENT) && 
									   (this.map[dst.row*9+dst.column] == MY_OU_SYMBOL)) {
								opponentPoint += OU_POINT/2;
							}
						}
					}
				}
			};
		};

		// 持ち駒の評価
		for (var i=0, len=this.pieceInHand[PLAYER].length; i<len; i++) {
			symbol = this.pieceInHand[PLAYER][i];
			piece = pieceInfo[symbol];
			playerPoint += piece.point;
		}
		
		for (var i=0, len=this.pieceInHand[OPPONENT].length; i<len; i++) {
			symbol = this.pieceInHand[OPPONENT][i];
			piece = pieceInfo[symbol];
			opponentPoint += piece.point;
		}
		
		if (this.winner == PLAYER) {
			playerPoint += 1000000;
		} else if (this.winner == OPPONENT) {
			opponentPoint += 1000000;
		}
			
		if (turn == PLAYER) {
			opponentPoint *= -1;
		} else if (turn == OPPONENT) {
			playerPoint *= -1;
		};
		
		return playerPoint + opponentPoint;
	};
	
	/************************************************************/
	/* Constant Value */
	/************************************************************/
	const LEFT = 37 | 0;
	const UP = 38 | 0;
	const RIGHT = 39 | 0;
	const DOWN = 40 | 0;
	
	// 将棋盤の行・列
	const TOP_EDGE = 0 | 0;
	const BOTTOM_EDGE = 8 | 0;
	const LEFT_EDGE = 0 | 0;
	const RIGHT_EDGE = 8 | 0;
	
	const ROW = 0 | 0;
	const COLUMN = 1 | 0;
	
	const ROW_NUM = 9 | 0;
	const COLUMN_NUM = 9 | 0;
	
	// 手番・駒の所有者を表す情報
	const PLAYER = -1 | 0;
	const OPPONENT = 1 | 0;
	const BLANK = 0 | 0;
	
	// 将棋盤のクリック状態
	const UNSELECTED = 0 | 0;
	const ON_BOARD = 1 | 0;
	const ON_PLAYER_AREA = 2 | 0;
	const ON_OPP_AREA = 3 | 0;
	
	// クリック位置
	const IS_BLANK_AREA = 0 | 0;
	const IS_BOARD_AREA = 1 | 0;
	const IS_PLAYER_AREA = 2 | 0;
	const IS_OPP_AREA = 3 | 0;
	
	// 基準座標
	const X0 = 17 | 0;
	const Y0 = 75 | 0;
	
	const OPP_AREA_X0 = 43 | 0;
	const OPP_AREA_Y0 = 60 | 0;
	
	const PLAYER_AREA_X0 = 11 | 0;
	const PLAYER_AREA_Y0 = 194 | 0;
	
	const X_SIZE = 30 | 0;
	const Y_SIZE = 34 | 0;
	
	const PLAYER_AREA_X_SIZE = 32 | 0;
	const PLAYER_AREA_Y_SIZE = 36 | 0;
	
	//駒のポイント
	const FU_POINT = 1 | 0;
	const KYO_POINT = 10 | 0;
	const KEI_POINT = 20 | 0;
	const GIN_POINT = 30 | 0;
	const KIN_POINT = 80 | 0;
	const KAKU_POINT = 300 | 0;
	const HISHA_POINT = 400 | 0;
	const OU_POINT = 10000 | 0;
	
	const TO_POINT = 40 | 0;
	const NARIKYO_POINT = 50 | 0;
	const NARIKEI_POINT = 60 | 0;
	const NARIGIN_POINT = 70 | 0;
	const UMA_POINT = 500 | 0;
	const RYU_POINT = 600 | 0;
	
	/* 駒のシンボル。8bitで表す。
	 * 
	 * 0b 0 0 0 0 0 0 0 0
	 *    ^ ^ ^ ^ ^ ^ ^ ^
	 *    | | | | | | | |
	 *    | | | | 駒の種類（4ビット） 
	 *    | | | （未使用）
	 *    | | 成っているか否か（0:成ってない、1:成っている）
	 *    |　駒のオーナー（0：プレイヤー、1:コンピュータ）
	 *    駒か空白か（0:空白、1:駒）
	 */
	const OPP_FU_SYMBOL = 0xC0 | 0;		// 0b 1100 0000:"敵-歩"
	const OPP_KYO_SYMBOL = 0xC1 | 0;	// 0b 1100 0001:"敵-香車"
	const OPP_KEI_SYMBOL = 0xC2 | 0;	// 0b 1100 0010:"敵-桂馬"
	const OPP_GIN_SYMBOL = 0xC3 | 0;	// 0b 1100 0011:"敵-銀"
	const OPP_KIN_SYMBOL = 0xC4 | 0;	// 0b 1100 0100:"敵-金"
	const OPP_HISHA_SYMBOL = 0xC5 | 0;	// 0b 1100 0101:"敵-飛車"
	const OPP_KAKU_SYMBOL = 0xC6 | 0;	// 0b 1100 0110:"敵-角行"
	const OPP_OU_SYMBOL = 0xC7 | 0;		// 0b 1100 0111:"敵-王"
	const OPP_TO_SYMBOL = 0xE0 | 0;		// 0b 1110 0000:"敵-と"
	const OPP_NARIKYO_SYMBOL = 0xE1 | 0;	// 0b 1110 0001:"敵-成香"
	const OPP_NARIKEI_SYMBOL = 0xE2 | 0;	// 0b 1110 0010:"敵-成桂"
	const OPP_NARIGIN_SYMBOL = 0xE3 | 0;	// 0b 1110 0011:"敵-成銀"
	const OPP_RYU_SYMBOL = 0xE4 | 0;	// 0b 1110 0100:"敵-竜王"
	const OPP_UMA_SYMBOL = 0xE5 | 0;	// 0b 1110 0101:"敵-竜馬"
	
	const MY_FU_SYMBOL = 0x80 | 0;		// 0b 1000 0000:"自-歩"
	const MY_KYO_SYMBOL = 0x81 | 0;		// 0b 1000 0001:"自-香車"
	const MY_KEI_SYMBOL = 0x82 | 0;		// 0b 1000 0010:"自-桂馬"
	const MY_GIN_SYMBOL = 0x83 | 0;		// 0b 1000 0011:"自-銀"
	const MY_KIN_SYMBOL = 0x84 | 0;		// 0b 1000 0100:"自-金"
	const MY_HISHA_SYMBOL = 0x85 | 0;	// 0b 1000 0101:"自-飛車"
	const MY_KAKU_SYMBOL = 0x86 | 0;	// 0b 1000 0110:"自-角行"
	const MY_OU_SYMBOL = 0x87 | 0;		// 0b 1000 0111:"自-王"
	const MY_TO_SYMBOL = 0xA0 | 0;		// 0b 1010 0000:"自-と"
	const MY_NARIKYO_SYMBOL = 0xA1 | 0;	// 0b 1010 0001:"自-成香"
	const MY_NARIKEI_SYMBOL = 0xA2 | 0;	// 0b 1010 0010:"自-成桂"
	const MY_NARIGIN_SYMBOL = 0xA3 | 0;	// 0b 1010 0011:"自-成銀"
	const MY_RYU_SYMBOL = 0xA4 | 0;		// 0b 1010 0100:"自-竜王"
	const MY_UMA_SYMBOL = 0xA5 | 0;		// 0b 1010 0101:"自-竜馬"
	
	// 駒の移動範囲
	const OPP_FU_AREA = 
			new Array(1, 0);
	const OPP_KYO_AREA = 
			new Array(1, 0,	2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0);
	const OPP_KEI_AREA = 
			new Array(2, -1, 
					  2, 1);
	const OPP_GIN_AREA = 
			new Array(1, 0,	
					  1, -1, 
					  1, 1, 
					  -1, -1, 
					  -1, 1);
	const OPP_KIN_AREA = 
			new Array(1, 0,	
					  1, -1, 
					  1, 1, 
					  0, -1, 
					  0, 1, 
					  -1, 0);
	const OPP_HISHA_AREA = 
			new Array(// 前
					  1, 0,	2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 
					  // 後ろ
					  -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8, 0, 
					  // 右
					  0, 1,	0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 
					  // 左
					  0, -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8);
	const OPP_KAKU_AREA = 
			new Array(// 右前
					  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8,
					  // 左後ろ
					  -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7, -7, -8, -8, 
					  // 左前
					  1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 
					  // 右後ろ
					  -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6, -7, 7, -8, 8);
	const OPP_RYU_AREA = 
			new Array(// 斜め
					  1, 1, 1, -1, -1, 1, -1, -1,
					  // 前
					  1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 
					  // 後ろ
					  -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8, 0, 
					  // 左
					  0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 
					  // 右
					  0, -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8);
	const OPP_UMA_AREA = 
			new Array(// 前後左右
					  1, 0, -1, 0, 0, 1, 0, -1, 
					  // 右前
					  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 
					  // 左後ろ
					  -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7, -7, -8, -8, 
					  // 左前
					  1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 
					  // 右後ろ
					  -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6, -7, 7, -8, 8);
	const OPP_OU_AREA = 
			new Array(1, 0, 1, -1, 1, 1, 0, -1, 0, 1, -1, 0, -1, 1, -1, -1);
	
	const MY_FU_AREA = 
			new Array(-1, 0);
	const MY_KYO_AREA = 
			new Array(-1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8, 0);
	const MY_KEI_AREA = 
			new Array(-2, -1, -2, 1);
	const MY_GIN_AREA = 
			new Array(-1, 0, -1, -1, -1, 1, 1, -1, 1, 1);
	const MY_KIN_AREA = 
			new Array(-1, 0, -1, -1, -1, 1, 0, -1, 0, 1, 1, 0);
	const MY_HISHA_AREA = 
			new Array(// 後ろ
					  1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 
					  // 前
					  -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8, 0, 
					  // 右
					  0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 
					  // 左
					  0, -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8);
	const MY_KAKU_AREA = 
			new Array(// 右後ろ
					  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 
					  // 左前
					  -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7, -7, -8, -8, 
					  // 左後ろ
					  1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 
					  // 右前
					  -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6, -7, 7, -8, 8);
	const MY_RYU_AREA = 
			new Array(// 斜め
					  1, 1, 1, -1, -1, 1, -1, -1,
					  // 後ろ
					  1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 
					  // 前
					  -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8, 0, 
					  // 右
					  0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 
					  // 左
					  0, -1, 0, -2, 0, -3, 0, -4, 0, -5, 0, -6, 0, -7, 0, -8);
	const MY_UMA_AREA = 
			new Array(// 前後左右
					  1, 0, -1, 0, 0, 1, 0, -1, 
					  // 右後ろ
					  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 
					  // 左前
					  -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7, -7, -8, -8, 
					  // 左後ろ
					  1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 
					  // 右前
					  -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6, -7, 7, -8, 8);
	const MY_OU_AREA = 
			new Array(-1, 0, -1, -1, -1, 1, 0, -1, 0, 1, 1, 0, 1, 1, 1, -1);
		
	const BLANK_SYMBOL = 0x00;
	
	//駒の情報
	//敵の駒
	const OPP_FU = 
		new Piece(OPP_FU_SYMBOL, OPPONENT, false, FU_POINT, OPP_FU_AREA);
	const OPP_KYO = 
		new Piece(OPP_KYO_SYMBOL, OPPONENT, false, KYO_POINT, OPP_KYO_AREA);
	const OPP_KEI = 
		new Piece(OPP_KEI_SYMBOL, OPPONENT, false, KEI_POINT, OPP_KEI_AREA);
	const OPP_GIN = 
		new Piece(OPP_GIN_SYMBOL, OPPONENT, false, GIN_POINT, OPP_GIN_AREA);
	const OPP_KIN = 
		new Piece(OPP_KIN_SYMBOL, OPPONENT, false, KIN_POINT, OPP_KIN_AREA);
	const OPP_OU = 
		new Piece(OPP_OU_SYMBOL, OPPONENT, false, OU_POINT, OPP_OU_AREA);
	const OPP_HISHA = 
		new Piece(OPP_HISHA_SYMBOL, OPPONENT, false, HISHA_POINT, OPP_HISHA_AREA);
	const OPP_KAKU = 
		new Piece(OPP_KAKU_SYMBOL, OPPONENT, false, KAKU_POINT, OPP_KAKU_AREA);
	const OPP_TO = 
		new Piece(OPP_TO_SYMBOL, OPPONENT, true, TO_POINT, OPP_KIN_AREA);
	const OPP_NARIKYO = 	
		new Piece(OPP_NARIKYO_SYMBOL, OPPONENT, true, NARIKYO_POINT, OPP_KIN_AREA);
	const OPP_NARIKEI = 
		new Piece(OPP_NARIKEI_SYMBOL, OPPONENT, true, NARIKEI_POINT, OPP_KIN_AREA);
	const OPP_NARIGIN = 
		new Piece(OPP_NARIGIN_SYMBOL, OPPONENT, true, NARIGIN_POINT, OPP_KIN_AREA);
	const OPP_RYU = 
		new Piece(OPP_RYU_SYMBOL, OPPONENT, true, RYU_POINT, OPP_RYU_AREA);
	const OPP_UMA = 
		new Piece(OPP_UMA_SYMBOL, OPPONENT, true, KAKU_POINT, OPP_UMA_AREA);
	
	//プレイヤーの駒
	const MY_FU = 
		new Piece(MY_FU_SYMBOL, PLAYER, false, FU_POINT, MY_FU_AREA);
	const MY_KYO = 
		new Piece(MY_KYO_SYMBOL, PLAYER, false, KYO_POINT, MY_KYO_AREA);
	const MY_KEI = 
		new Piece(MY_KEI_SYMBOL, PLAYER, false, KEI_POINT, MY_KEI_AREA);
	const MY_GIN = 
		new Piece(MY_GIN_SYMBOL, PLAYER, false, GIN_POINT, MY_GIN_AREA);
	const MY_KIN = 
		new Piece(MY_KIN_SYMBOL, PLAYER, false, KIN_POINT, MY_KIN_AREA);
	const MY_OU = 
		new Piece(MY_OU_SYMBOL, PLAYER, false, OU_POINT, MY_OU_AREA);
	const MY_HISHA = 
		new Piece(MY_HISHA_SYMBOL, PLAYER, false, HISHA_POINT, MY_HISHA_AREA);
	const MY_KAKU = 
		new Piece(MY_KAKU_SYMBOL, PLAYER, false, KAKU_POINT, MY_KAKU_AREA);
	const MY_TO = 
		new Piece(MY_TO_SYMBOL, PLAYER, true, TO_POINT, MY_KIN_AREA);
	const MY_NARIKYO = 
		new Piece(MY_NARIKYO_SYMBOL, PLAYER, true, NARIKYO_POINT, MY_KIN_AREA);
	const MY_NARIKEI = 
		new Piece(MY_NARIKEI_SYMBOL, PLAYER, true, NARIKEI_POINT, MY_KIN_AREA);
	const MY_NARIGIN = 
		new Piece(MY_NARIGIN_SYMBOL, PLAYER, true, NARIGIN_POINT, MY_KIN_AREA);
	const MY_RYU = 
		new Piece(MY_RYU_SYMBOL, PLAYER, true, RYU_POINT, MY_RYU_AREA);
	const MY_UMA = 
		new Piece(MY_UMA_SYMBOL, PLAYER, true, UMA_POINT, MY_UMA_AREA);
	
	const BLANK_PIECE = new Piece(BLANK_SYMBOL, BLANK, false, 0);
	
	
	/************************************************************/
	// Variables
	/************************************************************/
	
	var board = new Board();
	var selectState = UNSELECTED;
	
	var clickedCell = new Cell(0, 0);
	var selectedCell = new Cell(null, null);
	var clickedPlayerAreaIdx = undefined;
	var selectedPlayerAreaIdx = undefined;
	var clickedOppAreaCell = new Cell(0, 0);
	
	var pieceInfo = new Array();
	
	// ターン。そのうちランダムに。
	var currentTurn = PLAYER;
	
	var haveMoved = false;
	
	/************************************************************/
	/* Operation code                                           */
	/************************************************************/
	initGame();
	
	
	/************************************************************/
	/* Functions                                                */
	/************************************************************/
	
	/**
	 * 対局の初期化
	 */
	function initGame()
	{
		// 駒情報の初期化
		initPieceInfo();
		
		// 将棋盤の初期化
		initMap();
		printMap(board);
	
		// ターンの決定
		currentTurn = PLAYER;
		n = Math.floor(Math.random() * 91) % 2;
		if (n == 1) {
			currentTurn = PLAYER;
		} else {
			currentTurn = OPPONENT;
		}
		printTurn();
	
		if (currentTurn == OPPONENT) {
			makeOpponentMove();
		}
	}
	
	/**
	 * 駒情報の初期化
	 */
	function initPieceInfo()
	{
		
		// 敵駒の情報を追加
		pieceInfo[OPP_FU_SYMBOL] = OPP_FU;
		pieceInfo[OPP_KYO_SYMBOL] = OPP_KYO;
		pieceInfo[OPP_KEI_SYMBOL] = OPP_KEI;
		pieceInfo[OPP_GIN_SYMBOL] = OPP_GIN;
		pieceInfo[OPP_KIN_SYMBOL] = OPP_KIN;
		pieceInfo[OPP_OU_SYMBOL] = OPP_OU;
		pieceInfo[OPP_HISHA_SYMBOL] = OPP_HISHA;
		pieceInfo[OPP_KAKU_SYMBOL] = OPP_KAKU;
		pieceInfo[OPP_TO_SYMBOL] = OPP_TO;
		pieceInfo[OPP_NARIKYO_SYMBOL] = OPP_NARIKYO;
		pieceInfo[OPP_NARIKEI_SYMBOL] = OPP_NARIKEI;
		pieceInfo[OPP_NARIGIN_SYMBOL] = OPP_NARIGIN;
		pieceInfo[OPP_RYU_SYMBOL] = OPP_RYU;
		pieceInfo[OPP_UMA_SYMBOL] = OPP_UMA;
	
		// 自駒の情報を追加
		pieceInfo[MY_FU_SYMBOL] = MY_FU;
		pieceInfo[MY_KYO_SYMBOL] = MY_KYO;
		pieceInfo[MY_KEI_SYMBOL] = MY_KEI;
		pieceInfo[MY_GIN_SYMBOL] = MY_GIN;
		pieceInfo[MY_KIN_SYMBOL] = MY_KIN;
		pieceInfo[MY_OU_SYMBOL] = MY_OU;
		pieceInfo[MY_HISHA_SYMBOL] = MY_HISHA;
		pieceInfo[MY_KAKU_SYMBOL] = MY_KAKU;
		pieceInfo[MY_TO_SYMBOL] = MY_TO;
		pieceInfo[MY_NARIKYO_SYMBOL] = MY_NARIKYO;
		pieceInfo[MY_NARIKEI_SYMBOL] = MY_NARIKEI;
		pieceInfo[MY_NARIGIN_SYMBOL] = MY_NARIGIN;
		pieceInfo[MY_RYU_SYMBOL] = MY_RYU;
		pieceInfo[MY_UMA_SYMBOL] = MY_UMA;
		
		// 空のマスの情報を追加
		pieceInfo[BLANK_SYMBOL] = BLANK_PIECE;
	}
	
	/**
	 * 将棋盤画像の初期化
	 */
	function initMap()
	{
		var i, j;
		
		// 一行目
		board.map[0] = OPP_KYO_SYMBOL;	// 香車
		board.map[1] = OPP_KEI_SYMBOL;	// 桂馬
		board.map[2] = OPP_GIN_SYMBOL;	// 銀将
		board.map[3] = OPP_KIN_SYMBOL;	// 金将
		board.map[4] = OPP_OU_SYMBOL;	// 王将
		board.map[5] = OPP_KIN_SYMBOL;	// 金将
		board.map[6] = OPP_GIN_SYMBOL;	// 銀将
		board.map[7] = OPP_KEI_SYMBOL;	// 桂馬
		board.map[8] = OPP_KYO_SYMBOL;	// 香車
	
		// 二行目
		board.map[9] = BLANK_SYMBOL;
		board.map[10] = OPP_HISHA_SYMBOL;
		for (j=2;j<7;j++) {
			board.map[9+j] = BLANK_SYMBOL;
		}
		board.map[16] = OPP_KAKU_SYMBOL;
		board.map[17] = BLANK_SYMBOL;
	
		// 三行目
		for (j=0;j<9;j++) {
			board.map[18+j] = OPP_FU_SYMBOL;
		}
		
		// 四～六行目
		for (i=3;i<6;i++) { 
			for (j=0;j<9;j++) {
				board.map[i*9+j] = BLANK_SYMBOL;
			};
		}
		
		// 七行目
		for (j=0;j<9;j++) {
			board.map[54+j] = MY_FU_SYMBOL;
		}
	
		// 八行目
		board.map[63] = BLANK_SYMBOL;
		board.map[64] = MY_KAKU_SYMBOL;
		for (j=2;j<7;j++) {
			board.map[63+j] = BLANK_SYMBOL;
		}
		board.map[70] = MY_HISHA_SYMBOL;
		board.map[71] = BLANK_SYMBOL;
	
		// 九行目
		board.map[72] = MY_KYO_SYMBOL;	// 香車
		board.map[73] = MY_KEI_SYMBOL;	// 桂馬
		board.map[74] = MY_GIN_SYMBOL;	// 銀将
		board.map[75] = MY_KIN_SYMBOL;	// 金将
		board.map[76] = MY_OU_SYMBOL;		// 王将
		board.map[77] = MY_KIN_SYMBOL;	// 金将
		board.map[78] = MY_GIN_SYMBOL;	// 銀将
		board.map[79] = MY_KEI_SYMBOL;	// 桂馬
		board.map[80] = MY_KYO_SYMBOL;	// 香車
		
		board.pieceInHand[PLAYER] = [];
		board.pieceInHand[OPPONENT] = [];
		
		board.pieceNum['PLAYER'] = 20;
		board.pieceNum['OPPONENT'] = 20;
		
		board.winner = BLANK;
	}
	
	
	/**
	 * 将棋盤画像の更新
	 */
	function printMap(brd)
	{
		
		var i, j, k;
		var pieceObj;
		var len;
	
		// 将棋盤の描画
		for (i=0|0;i<9;i++) {
			var mapStr = "";
			for (j=0|0;j<9;j++) {
				pieceObj = brd.map[i*9+j];
				var id = "piece"+i+"-"+j;
				var cell = document.getElementById(id);
				cell.src = getPieceImage(pieceObj);
			}
		}
	
		// プレイヤーの持ち駒の描画
		len = brd.pieceInHand[PLAYER].length;
		for (k=0|0; k<len; k++) {
			document.getElementById("my_piece_in_hand_"+k).src = 
										getPieceImage(brd.pieceInHand[PLAYER][k]);
		}
		for (;k<21;k++) {
			document.getElementById("my_piece_in_hand_"+k).src = 
												"img/piece/blank.png";
		}
		
		// コンピュータの持ち駒の描画
		len = brd.pieceInHand[OPPONENT].length;
		for (k=0|0; k<len; k++) {
			document.getElementById("opp_piece_in_hand_"+k).src = 
										getPieceImage(brd.pieceInHand[OPPONENT][k]);
		}
		for (;k<21;k++) {
			document.getElementById("opp_piece_in_hand_"+k).src = 
												"img/piece/blank.png";
		}
	}
	
	/**
	 * 駒画像のパスの取得
	 */
	function getPieceImage(symbol)
	{
		imgPath = "img/piece/blank.png";
		
		// 自駒の画像の取得
		if (MY_FU_SYMBOL == symbol) {
			imgPath = "img/piece/S/Sfu.png";
		} else if (MY_KYO_SYMBOL == symbol) {
			imgPath = "img/piece/S/Skyo.png";
		} else if (MY_KEI_SYMBOL == symbol) {
			imgPath = "img/piece/S/Skei.png";
		} else if (MY_GIN_SYMBOL == symbol) {
			imgPath = "img/piece/S/Sgin.png";
		} else if (MY_KIN_SYMBOL == symbol) {
			imgPath = "img/piece/S/Skin.png";
		} else if (MY_HISHA_SYMBOL == symbol) {
			imgPath = "img/piece/S/Shi.png";
		} else if (MY_KAKU_SYMBOL == symbol) {
			imgPath = "img/piece/S/Skaku.png";
		} else if (MY_TO_SYMBOL == symbol) {
			imgPath = "img/piece/S/Sto.png";
		} else if (MY_NARIKYO_SYMBOL == symbol) {
			imgPath = "img/piece/S/Snkyo.png";
		} else if (MY_NARIKEI_SYMBOL == symbol) {
			imgPath = "img/piece/S/Snkei.png";
		} else if (MY_NARIGIN_SYMBOL == symbol) {
			imgPath = "img/piece/S/Sngin.png";
		} else if (MY_RYU_SYMBOL == symbol) {
			imgPath = "img/piece/S/Sryu.png";
		} else if (MY_UMA_SYMBOL == symbol) {
			imgPath = "img/piece/S/Suma.png";
		} else if (MY_OU_SYMBOL == symbol) {
			imgPath = "img/piece/S/Sou.png";
		}
		// 敵駒の画像の取得
		else if (OPP_FU_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gfu.png";
		} else if (OPP_KYO_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gkyo.png";
		} else if (OPP_KEI_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gkei.png";
		} else if (OPP_GIN_SYMBOL == symbol) {
			imgPath = "img/piece/G/Ggin.png";
		} else if (OPP_KIN_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gkin.png";
		} else if (OPP_HISHA_SYMBOL == symbol) {
			imgPath = "img/piece/G/Ghi.png";
		} else if (OPP_KAKU_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gkaku.png";
		} else if (OPP_TO_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gto.png";
		} else if (OPP_NARIKYO_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gnkyo.png";
		} else if (OPP_NARIKEI_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gnkei.png";
		} else if (OPP_NARIGIN_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gngin.png";
		} else if (OPP_RYU_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gryu.png";
		} else if (OPP_UMA_SYMBOL == symbol) {
			imgPath = "img/piece/G/Guma.png";
		} else if (OPP_OU_SYMBOL == symbol) {
			imgPath = "img/piece/G/Gou.png";
		}
	
		return imgPath;
	}
	
	/**
	 * 将棋盤をクリックした時の処理
	 */
	$("#board_area").click(function(event){
		detectCellOnBoard(event);
		onBoardAction();
		if (haveMoved == true) {
			haveMoved = false;
			makeOpponentMove();
		}
	});
	
	/**
	 * クリックされた将棋盤上のマスの特定
	 */
	function detectCellOnBoard(event)
	{
		var hx, hy;
		
		hx = event.pageX|0;
		hy = event.pageY|0;
		
		if (((X0 < hx) && (hx < X0 + X_SIZE * 9)) && 
		    ((Y0 < hy) && (hy < Y0 + Y_SIZE * 9))) {
			/* 将棋盤上 */
			var x, y;
			var i;
		
			x = (hx - X0)/X_SIZE;
			for (i=0;i<9;i++) {
				if (x < i+1) {
					clickedCell.column = i|0;
					break;
				};
			}
			y = (hy - Y0)/Y_SIZE;
			for (i=0;i<9;i++) {
				if (y < i+1) {
					clickedCell.row = i|0;
					break;
				};
			};
		};
	}
	
	
	/**
	 * 将棋盤クリック時のアクション
	 */
	function onBoardAction()
	{
		var symbol = board.map[clickedCell.row*9+clickedCell.column];
		var piece = pieceInfo[symbol];
		
		if (piece.owner == currentTurn) {
			if (selectState == ON_PLAYER_AREA) {
				document.getElementById("my_cell_in_hand_"+selectedPlayerAreaIdx).
							style.backgroundImage = '';
				selectedPlayerAreaIdx = undefined;
			}
			selectPiece(clickedCell.row, clickedCell.column);
		} else {
			if ((selectState == ON_BOARD) && 
				(selectedCell.row != null) && (selectedCell.column != null)) {
				var selectedSymbol = board.map[selectedCell.row*9+selectedCell.column];
				var selectedPiece = pieceInfo[selectedSymbol];
				if (selectedPiece.owner == currentTurn) {
					if (isMovable(board, selectedPiece, selectedCell, clickedCell)) {
						board = movePiece(board, selectedCell, clickedCell, currentTurn);
						printMap(board);
						haveMoved = true;
						changeTurn();
					} else {
						alert("そこには動かせません！");
					}
				}
			} else if (selectState == ON_PLAYER_AREA) {
				if (isPutable(board, selectedPlayerAreaIdx, clickedCell, currentTurn)) {
					board = putPiece(board, currentTurn, selectedPlayerAreaIdx, clickedCell);

					haveMoved = true;
					changeTurn();
				} else {
					alert("そこには打てません！");
				}
			}
		}
	
		judgeWinner(board);
		return;
	}
	
	/**
	 * 移動可能か判定する
	 */
	function isMovable(brd, piece, src, dest) {
		var i;
		var symbol;
		var p;
		var len;
		
		// alert("Src: (" + src.row + ", " + src.column + "), " + 
		//		"Dest: (" + dest.row + ", " + dest.column + ") ");
		
		// 移動先が将棋盤の範囲外なら、移動不可
		if (((dest.row < 0) || (8 < dest.row)) || 
			((dest.column < 0) || (8 < dest.column))) {
			return false;
		}
		
		len=piece.area.length;
		for (i=0; i<len; i+=2) {
			// 移動先のマスが、その駒の移動範囲内
			if ((src.row + piece.area[i] == dest.row) &&
				(src.column + piece.area[i+1] == dest.column)) {
				// 移動先に手番の駒がある場合は移動不可
				var destSymbol = brd.map[dest.row*9+dest.column];
				var destPiece = pieceInfo[destSymbol];
				if (piece.owner == destPiece.owner) {
					return false;
				}
				
				// 桂馬なら即移動
				if ((piece.symbol == MY_KEI_SYMBOL) || 
					(piece.symbol == OPP_KEI_SYMBOL)) {
					return true;
				} else {
					// 桂馬以外なら、現在地～移動先の間に駒がない場合、移動
					var row_diff = dest.row - src.row;
					var column_diff = dest.column - src.column;
					
					
					var r_step = 0|0;
					if (row_diff != 0) {
						r_step = row_diff / Math.abs(row_diff);
					}
					var c_step = 0|0;
					if (column_diff != 0) {
						c_step = column_diff / Math.abs(column_diff);
					}
					
					var r = src.row|0;
					var c = src.column|0;
					
					// alert("Row:" + r + " R_step:" + r_step + 
					//		" Col:" + c +" C_step:" + c_step);
					
					while ((r != dest.row-r_step) || (c != dest.column-c_step)) {
						r += r_step;
						c += c_step;
						// alert("Row:"+r+" Col:"+c);
						symbol = brd.map[r*9+c];
						p = pieceInfo[symbol];
						if (p.owner != BLANK) {
							return false;
						}
					}
					
					return true;
				}
			}
		}
		
		return false;
	}
	
	/**
	 * クリックされた駒の選択
	 */
	function selectPiece(row, column)
	{
		if ((selectedCell.row != null) && (selectedCell.column != null)) {
			document.
				getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
					style.backgroundImage = '';
		}
	
		selectedCell.row = clickedCell.row|0;
		selectedCell.column = clickedCell.column|0;
		selectState = ON_BOARD;
		
		var path = 'url(img/focus/focus_bold_b.png)';
		if (currentTurn == OPPONENT) {
			path = 'url(img/focus/focus_bold_r.png)';
		}
		
		document.
			getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
				style.backgroundImage = path;
		
	}
	
	/**
	 * 駒の移動
	 */
	function movePiece(brd, src, dst, turn)
	{
		// 移動先に駒があるなら、駒を取る
		var targetSymbol = brd.map[dst.row*9+dst.column];
		var targetPiece = pieceInfo[targetSymbol];
		if ((targetPiece.owner != turn) && (targetPiece.owner != BLANK)) {
			// 王を取ったら勝ち
			if ((turn == PLAYER) && (targetSymbol == OPP_OU_SYMBOL) || 
				(turn == OPPONENT) && (targetSymbol == MY_OU_SYMBOL))  {
				brd.winner = turn;
			}
			// 取った駒に対応する自駒を取得
			targetSymbol = changeOwner(targetSymbol);
			brd.pieceInHand[turn][brd.pieceInHand[turn].length] = targetSymbol;
			brd.map[dst.row*9+dst.column] = BLANK_SYMBOL;
			
			if (turn == PLAYER) {
				brd.pieceNum['OPPONENT'] -= 1;
			} else if (turn == OPPONENT) {
				brd.pieceNum['PLAYER'] -= 1;
			}
		}
		
		// 駒の移動
		var selectedSymbol = brd.map[src.row*9+src.column];
		var selectedPiece = pieceInfo[selectedSymbol];
		// 相手陣地に入ったら成る
		if (((turn == PLAYER) && (dst.row <= 2)) || 
		    ((turn == OPPONENT) && (dst.row >= 6))) {
		    if (selectedPiece.promoted == false) {
				selectedSymbol = promotePiece(selectedSymbol);
		    };
		}
		brd.map[dst.row*9+dst.column] = selectedSymbol;
	
		// 移動前の駒選択の解除
		brd.map[src.row*9+src.column] =BLANK_SYMBOL;
		selectState = UNSELECTED;
		document.
			getElementById("cell"+src.row+"-"+src.column).
				style.backgroundImage = '';
		
		return brd;
	}
	
	/**
	 * 取った駒の所有者を変更したシンボルを返す。
	 * 成っている場合は基に戻す。
	 */
	function changeOwner(symbol)
	{
		var changedSymbol = BLANK_SYMBOL;
		
		// プレイヤー駒が取られた場合
		if ((MY_FU_SYMBOL == symbol) || 
			(MY_TO_SYMBOL == symbol)	){
			changedSymbol = OPP_FU_SYMBOL;
		} else if ((MY_KYO_SYMBOL == symbol) || 
				   (MY_NARIKYO_SYMBOL == symbol)) {
			changedSymbol = OPP_KYO_SYMBOL;
		} else if ((MY_KEI_SYMBOL == symbol) || 
				   (MY_NARIKEI_SYMBOL == symbol)) {
			changedSymbol = OPP_KEI_SYMBOL;
		} else if ((MY_GIN_SYMBOL == symbol) || 
				   (MY_NARIGIN_SYMBOL == symbol)) {
			changedSymbol = OPP_GIN_SYMBOL;
		} else if (MY_KIN_SYMBOL == symbol) {
			changedSymbol = OPP_KIN_SYMBOL;
		} else if ((MY_HISHA_SYMBOL == symbol) || 
				   (MY_RYU_SYMBOL == symbol)){
			changedSymbol = OPP_RYU_SYMBOL;
		} else if ((MY_KAKU_SYMBOL == symbol) || 
				   (MY_UMA_SYMBOL == symbol)) {
			changedSymbol = OPP_KAKU_SYMBOL;
		} else if (MY_OU_SYMBOL == symbol) {
			changedSymbol = OPP_OU_SYMBOL;
		}
		// コンピュータ駒が取られた場合
		if ((OPP_FU_SYMBOL == symbol) || 
			(OPP_TO_SYMBOL == symbol)	){
			changedSymbol = MY_FU_SYMBOL;
		} else if ((OPP_KYO_SYMBOL == symbol) || 
				   (OPP_NARIKYO_SYMBOL == symbol)) {
			changedSymbol = MY_KYO_SYMBOL;
		} else if ((OPP_KEI_SYMBOL == symbol) || 
				   (OPP_NARIKEI_SYMBOL == symbol)) {
			changedSymbol = MY_KEI_SYMBOL;
		} else if ((OPP_GIN_SYMBOL == symbol) || 
				   (OPP_NARIGIN_SYMBOL == symbol)) {
			changedSymbol = MY_GIN_SYMBOL;
		} else if (OPP_KIN_SYMBOL == symbol) {
			changedSymbol = MY_KIN_SYMBOL;
		} else if ((OPP_HISHA_SYMBOL == symbol) || 
				   (OPP_RYU_SYMBOL == symbol)){
			changedSymbol = MY_HISHA_SYMBOL;
		} else if ((OPP_KAKU_SYMBOL == symbol) || 
				   (OPP_UMA_SYMBOL == symbol)) {
			changedSymbol = MY_KAKU_SYMBOL;
		} else if (OPP_OU_SYMBOL == symbol) {
			changedSymbol = MY_OU_SYMBOL;
		}
		
		return changedSymbol;
	};
	
	/**
	 * 相手陣地に入った駒を成らせる
	 */
	function promotePiece(symbol)
	{
		var promSymbol = symbol;
	
		// プレイヤー駒を成らせる場合
		if (MY_FU_SYMBOL == symbol) {	// 歩
			promSymbol = MY_TO_SYMBOL;
		} else if (MY_KYO_SYMBOL == symbol) {	// 香車
			promSymbol = MY_NARIKYO_SYMBOL;
		} else if (MY_KEI_SYMBOL == symbol) {	// 桂馬
			promSymbol = MY_NARIKEI_SYMBOL;
		} else if (MY_GIN_SYMBOL == symbol) {	// 銀将
			promSymbol = MY_NARIGIN_SYMBOL;
		} else if (MY_HISHA_SYMBOL == symbol) {	// 飛車
			promSymbol = MY_RYU_SYMBOL;
		} else if (MY_KAKU_SYMBOL == symbol) {	// 各行
			promSymbol = MY_UMA_SYMBOL;
		}
		// コンピュータ駒を成らせる場合
		if (OPP_FU_SYMBOL == symbol) {	// 歩
			promSymbol = OPP_TO_SYMBOL;
		} else if (OPP_KYO_SYMBOL == symbol) {	// 香車
			promSymbol = OPP_NARIKYO_SYMBOL;
		} else if (OPP_KEI_SYMBOL == symbol) {	// 桂馬
			promSymbol = OPP_NARIKEI_SYMBOL;
		} else if (OPP_GIN_SYMBOL == symbol) {	// 銀将
			promSymbol = OPP_NARIGIN_SYMBOL;
		} else if (OPP_HISHA_SYMBOL == symbol) {	// 飛車
			promSymbol = OPP_RYU_SYMBOL;
		} else if (OPP_KAKU_SYMBOL == symbol) {	// 各行
			promSymbol = OPP_UMA_SYMBOL;
		}
	
		return promSymbol;
	}
	
	/**
	 * 取った駒を降格させる
	 */
	function demotePiece(symbol)
	{
		var demSymbol = symbol;
	
		// プレイヤー駒を降格させる場合
		if (MY_TO_SYMBOL == symbol) {	// と
			promSymbol = MY_FU_SYMBOL;
		} else if (MY_NARIKYO_SYMBOL == symbol) {	// 成香
			promSymbol = MY_KYO_SYMBOL;
		} else if (MY_NARIKEI_SYMBOL == symbol) {	// 桂馬
			promSymbol = MY_KEI_SYMBOL;
		} else if (MY_NARIGIN_SYMBOL == symbol) {	// 成銀
			promSymbol = MY_GIN_SYMBOL;
		} else if (MY_RYU_SYMBOL == symbol) {	// 竜王
			promSymbol = MY_HISHA_SYMBOL;
		} else if (MY_UMA_SYMBOL == symbol) {	// 竜馬
			promSymbol = MY_KAKU_SYMBOL;
		}
		// コンピュータ駒を降格させる場合
		if (OPP_TO_SYMBOL == symbol) {	// と
			promSymbol = OPP_FU_SYMBOL;
		} else if (OPP_NARIKYO_SYMBOL == symbol) {	// 成香
			promSymbol = OPP_KYO_SYMBOL;
		} else if (OPP_NARIKEI_SYMBOL == symbol) {	// 桂馬
			promSymbol = OPP_KEI_SYMBOL;
		} else if (OPP_NARIGIN_SYMBOL == symbol) {	// 成銀
			promSymbol = OPP_GIN_SYMBOL;
		} else if (OPP_RYU_SYMBOL == symbol) {	// 竜王
			promSymbol = OPP_HISHA_SYMBOL;
		} else if (OPP_UMA_SYMBOL == symbol) {	// 竜馬
			promSymbol = OPP_KAKU_SYMBOL;
		}
	
		return demSymbol;
	}
	
	/**
	 * 勝ち負けの判定
	 */
	function judgeWinner(brd)
	{
		if (BLANK != brd.winner) {
			var message = "";
			if (brd.winner == PLAYER) {
				message = "あなたの勝ちです！";
			} else if (brd.winner == OPPONENT) {
				message = "あなたの負けです…";
			}
			showDialog(message);
		}
		
		return;
	}
	
	/**
	 * プレイヤーの持ち駒を使用
	 */
	$("#player_pieces_area").click(function(event){
		detectCellOnPlayerArea(event);
		onPlayerAreaAction();
	});
		
	/**
	 * プレイヤーエリアのマスを特定
	 */
	function detectCellOnPlayerArea(event)
	{
		var hx, hy;
		
		hx = event.pageX|0;
		hy = event.pageY|0;
		
		if (((PLAYER_AREA_X0 < hx) && 
			 (hx < PLAYER_AREA_X0 + PLAYER_AREA_X_SIZE * 7)) && 
		    ((PLAYER_AREA_Y0 < hy) && 
		     (hy < PLAYER_AREA_Y0 + PLAYER_AREA_Y_SIZE * 3))) {
			var x, y;
			var i;
			var row=0, column=0;
		
			x = (hx - PLAYER_AREA_X0)/PLAYER_AREA_X_SIZE;
			for (i=0;i<7;i++) {
				if (x < i+1) {
					column = i|0;
					break;
				};
			};
			y = (hy - PLAYER_AREA_Y0)/PLAYER_AREA_Y_SIZE;
			for (i=0;i<3;i++) {
				if (y < i+1) {
					row = i|0;
					break;
				};
			};
			
			clickedPlayerAreaIdx = ((2 - row) * 7 + column)|0;
		};		
	}
	
	/**
	 * プレーヤーの持ち駒エリア　クリック時のアクション
	 */
	function onPlayerAreaAction()
	{
		if (currentTurn == PLAYER) {
			if (selectState == ON_BOARD) {
				/* 将棋盤上のコマの選択解除 */
				document.
					getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
					style.backgroundImage = '';
			} else if (selectState == ON_PLAYER_AREA) {
				document.getElementById("my_cell_in_hand_"+selectedPlayerAreaIdx).
					style.backgroundImage = '';
			}
			/* プレイヤーの持ち駒を選択 */
			selectedPlayerAreaIdx = clickedPlayerAreaIdx;
			document.getElementById("my_cell_in_hand_"+selectedPlayerAreaIdx).
				style.backgroundImage = 'url(img/focus/focus_bold_b.png)';
			selectState = ON_PLAYER_AREA;
		}
	
		return;
	}
	
	/**
	　* 持ち駒を配置可能か
	　*/
	function isPutable(brd, idx, dst, turn)
	{
		// 置く場所が空いているか
		if (brd.map[dst.row*9+dst.column] != BLANK_SYMBOL) {
			return false;
		}
		
		var symbol = brd.pieceInHand[turn][idx];
		
		if (symbol==MY_FU_SYMBOL) {
			// 動けない場所に打とうとしていないか
			if (dst.row == 0) return false;
			
			// 二歩か否か
			for (var i=0; i<ROW_NUM; i++) {
				if (brd.map[i*9+dst.column] == MY_FU_SYMBOL) {
					return false;
				};
			};
			
			// 打ち歩詰めか否か
			if (brd.map[(dst.row-1)*9+dst.column] == OPP_OU_SYMBOL) {
				return false;
			};
		} else if (symbol==OPP_FU_SYMBOL) {
			// 動けない場所に打とうとしていないか
			if (dst.row == 8) return false;
			
			// 二歩か否か
			for (var i=0; i<ROW_NUM; i++) {
				if (brd.map[i*9+dst.column] == OPP_FU_SYMBOL) {
					return false;
				};
			};
			
			// 打ち歩詰めか否か
			if (brd.map[(dst.row+1)*9+dst.column] == MY_OU_SYMBOL) {
				return false;
			};
		}
		
		
		return true;
	}
	
	
	/**
	　* 持ち駒を盤上に配置
	　*/
	function putPiece(brd, turn, idx, dst)
	{
		brd.map[dst.row*9+dst.column]
			= board.pieceInHand[turn][idx];
		brd.pieceInHand[turn].splice(idx, 1);
		
		if (turn==PLAYER) {
			document.getElementById("my_cell_in_hand_" + idx).
			style.backgroundImage = '';
			selectedPlayerAreaIdx = undefined;
		} else {
			selectedOppAreaIdx = undefined;
		}
		
		
		return brd;
	}
	
	/**
	　* 相手エリアのマスを特定
	　*/
	function detectCellOnOppArea(hx, hy)
	{
		var x, y;
		var i;
	
		x = (hx - OPP_AREA_X0)/X_SIZE;
		for (i=0;i<4;i++) {
			if (x < i+1) {
				clickedOppAreaCell.column = i|0;
				break;
			};
		}
		y = (hy - OPP_AREA_Y0)/Y_SIZE;
		for (i=0;i<5;i++) {
			if (y < i+1) {
				clickedOppAreaCell.row = i|0;
				break;
			};
		};
	};
	
	/**
	　* コンピュータの手番
	　*/
	function makeOpponentMove() {
		board = getOpponentMove();
		printMap(board);
		judgeWinner(board);
		changeTurn();
	}
	
	/**
	　* コンピュータ側の手の決定
	　*/
	function getOpponentMove() {
		var i, j, k, l;
		var nextBoard = board;	// 次の局面
		var tmpNextBoard;
		var symbol;
		var piece;
		var src;
		var dst;
		var score = Number.NEGATIVE_INFINITY;
		var max = Number.NEGATIVE_INFINITY;
		var len;
		
		for (i=0|0; i<9; i++) {
			for (j=0|0; j<9; j++) {
				symbol = board.map[i*9+j];
				piece = pieceInfo[symbol];
				src = new Cell(i, j);
				if (piece.owner == OPPONENT) {
					len = piece.area.length;
					for (k=0|0; k <len; k+=2) {
						var r = i + piece.area[k];
						var c = j + piece.area[k+1];
						dst = new Cell(r, c);
						if (isMovable(board, piece, src, dst)) {
							var brd = board.clone();
							tmpNextBoard = movePiece(brd, src, dst, currentTurn);
							score = (negaAlpha(tmpNextBoard, 2, 
									  Number.NEGATIVE_INFINITY, 
									  Number.POSITIVE_INFINITY, 
									  currentTurn))|0;
							if (score > max) {
								max = score|0;
								nextBoard = tmpNextBoard;
							};
							delete brd;
							// delete nxtBrd;
						};
					};
				};
			};
		};
		
		for (i=0|0; i<ROW_NUM; i++) {
			for (j=0|0; j<COLUMN_NUM; j++) {
				len = board.pieceInHand[OPPONENT].length;
				for (k=0|0; k<len; k++) {
					var brd = board.clone();
					var putDst = new Cell(i, j);
					if (isPutable(brd, k, putDst, OPPONENT)) {
						tmpNextBoard = putPiece(brd, currentTurn, k, putDst);
						score = negaAlpha(tmpNextBoard, 2, 
								  Number.NEGATIVE_INFINITY, 
								  Number.POSITIVE_INFINITY, 
								  currentTurn);
						if (score > max) {
							max = score|0;
							nextBoard = tmpNextBoard;
						};
					}
					delete brd;
					delete putDst;
				};
			};
		}
		
		
		return nextBoard;
	};
	
	
	/**
	 * Nega-α法での探索
	 */
	function negaAlpha(brd, depth, a, b, turn) {
		var i, j, k;
		var symbol;
		var piece;
		var src;
		var dst;
		var nextBoard;
		var len;
		
		if (depth == 0) {
			return brd.eval(turn)|0; 
		}
		
		for (i=0|0; i<9; i++) {
			for (j=0|0; j<9; j++) {
				symbol = brd.map[i*9+j];
				piece = pieceInfo[symbol];
				src = new Cell(i, j);
				if (piece.owner == OPPONENT) {
					len = piece.area.length;
					for (k=0|0; k<len ; k+=2) {
						dst = new Cell(i+piece.area[k], j+piece.area[k+1]);
						if (isMovable(brd, piece, src, dst)) {
							nextBoard = movePiece(brd.clone(), src, dst, turn);
							a = Math.max(a, -negaAlpha(nextBoard, depth-1, -b, -a, turn*-1));
							if (a > b) {
								return a|0;
							};
						};
					};
				};
			};
		};
		
		for (i=0|0; i<ROW_NUM; i++) {
			for (j=0|0; j<COLUMN_NUM; j++) {
				len = board.pieceInHand[turn].length;
				for (k=0|0; k<len; k++) {
					var nxtBrd = brd.clone();
					var putDst = new Cell(i, j);
					if (isPutable(nxtBrd, k, putDst, turn)) {
						nextBoard = putPiece(nxtBrd, turn, k, putDst);
						a = Math.max(a, -negaAlpha(nextBoard, depth-1, -b, -a, turn*-1));
						if (a > b) {
							delete nxtBrd;
							delete putDst;
							return a|0;
						};
					}
					delete nxtBrd;
					delete putDst;
				};
			};
		}
		
		return a;
	}
	
	/**
	 * ターンの交代
	 */
	function changeTurn()
	{
		if (currentTurn == PLAYER) {
			currentTurn = OPPONENT;
		} else {
			currentTurn = PLAYER;
		}
		printTurn();
	}
	
	/**
	 * ターンの表示
	 */
	function printTurn()
	{
		var playerStatusElements = 
				document.getElementsByClassName("player_status");
		var oppStatusElements = 
				document.getElementsByClassName("opp_status");
		
		if (currentTurn == PLAYER) {
			/* ターンを表すランプの透過度を変更 */
			for (var i=0, len=playerStatusElements.length; i<len; i++) {
				playerStatusElements[i].style.filter = 'alpha(opacity=100)';
				playerStatusElements[i].style.MozOpacity = 1.0;
				playerStatusElements[i].style.opacity = 1.0;
			}
			for (var i=0, len=oppStatusElements.length; i<len; i++) {
				oppStatusElements[i].style.filter = 'alpha(opacity=30)';
				oppStatusElements[i].style.MozOpacity = 0.3;
				oppStatusElements[i].style.opacity = 0.3;
			}
		} else {
			/* ターンを表すランプの透過度を変更 */
			for (var i=0, len=playerStatusElements.length; i<len; i++) {
				playerStatusElements[i].style.filter = 'alpha(opacity=30)';
				playerStatusElements[i].style.MozOpacity = 0.3;
				playerStatusElements[i].style.opacity = 0.3;
			}
			for (var i=0, len=oppStatusElements.length; i<len; i++) {
				oppStatusElements[i].style.filter = 'alpha(opacity=100)';
				oppStatusElements[i].style.MozOpacity = 1.0;
				oppStatusElements[i].style.opacity = 1.0;
			}
		}
	}
	
	
	/**
	 * 対局結果ダイアログの表示
	 */
	function showDialog(msg)
	{
		backTarget = document.getElementById("result_back");
		backTarget.style.visibility = "visible";
	
		document.getElementById("result_message").textContent = msg;
	
		dialogTarget = document.getElementById("result_dialog");
	
		cx = Math.floor((window.innerWidth - 200) / 2);
		cy = Math.floor((window.innerHeight - 100) / 2);
		dialogTarget.style.left = cx + "px";
		dialogTarget.style.top = cy + "px";
		dialogTarget.style.visibility = "visible";
	}
	
	/**
	 * 対局結果ダイアログを消し、もう一度対局を開始
	 */
	$("#retry_button").click(function() {
		backTarget = document.getElementById("result_back");
		backTarget.style.visibility = "hidden";
		document.getElementById("result_message").innerText = "";
		
		dialogTarget = document.getElementById("result_dialog");
		dialogTarget.style.visibility = "hidden";
		
		initGame();
	});
});
