
$(function() {
	/************************************************************/
	/*	Classes                                                 */
	/************************************************************/
	/**
	 *	��̃N���X               
	 */
	function Piece(symbol, owner, promoted, point, array) {
		this.symbol = symbol;
		this.owner = owner;
		this.promoted = promoted;
		this.point = point;
	
		this.area = new Array();	// �ړ��\�ȏꏊ
		if (array != undefined) {
			for (var i=0; i<array.length; i++) {
				this.area.push(array[i]);
			}
		}
	};
	
	/**
	 * �����Ղ̃}�X�̃N���X
	 */
	function Cell(row, column) {
		this.row = row;
		this.column = column;
	};
	
	/**
	 * �����Ղ̃N���X
	 */
	function Board() {
		this.map = new Array(9);
		for (var i=0;i<9;i++) {
			this.map[i]=new Array(9);
		}
		
		this.pieceInHand = new Array(2);
		this.pieceInHand[PLAYER] = new Array();
		this.pieceInHand[OPPONENT] = new Array();
		
		this.pieceNum = {};
		this.pieceNum['PLAYER'] = 0;
		this.pieceNum['OPPONENT'] = 0;
		
		this.winner = BLANK;
	};
	
	/** �����Ղ̃N���[���̍쐬 */
	Board.prototype.clone = function() {
		var b = new Board();
		for (var i=0; i<9; i++) {
			for (var j=0; j<9; j++) {
				b.map[i][j] = this.map[i][j];
			};
		};
		
		for (var i=0; i<this.pieceInHand[PLAYER].length; i++) {
			b.pieceInHand[PLAYER][i] = this.pieceInHand[PLAYER][i];
		}
		for (var i=0; i<this.pieceInHand[OPPONENT].length; i++) {
			b.pieceInHand[OPPONENT][i] = this.pieceInHand[OPPONENT][i];
		}
		
		b.pieceNum['PLAYER'] = this.pieceNum['PLAYER'];
		b.pieceNum['OPPONENT'] = this.pieceNum['OPPONENT'];
		
		b.winner = this.winner;
		
		return b;
	}; 
	
	/** ���݂̋ǖʂ̕]�� */
	Board.prototype.eval = function(turn) {
		var playerPoint, opponentPoint;
		var symbol, piece;
		
		playerPoint = 0;
		opponentPoint = 0;
		
		for (var i=0; i<9; i++) {
			for (var j=0; j<9; j++) {
				symbol = this.map[i][j];
				piece = pieceInfo[symbol];
				if (piece.owner == PLAYER) {
					playerPoint += piece.point;
				} else if (piece.owner == OPPONENT) {
					opponentPoint += piece.point;
				};
			};
		};
		
		for (var i=0; i<this.pieceInHand[PLAYER].length; i++) {
			symbol = this.pieceInHand[PLAYER][i];
			piece = pieceInfo[symbol];
			playerPoint += piece.point;
		}
		
		for (var i=0; i<this.pieceInHand[OPPONENT].length; i++) {
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
	const LEFT = 37;
	const UP = 38;
	const RIGHT = 39;
	const DOWN = 40;
	
	// �����Ղ̍s�E��
	const TOP_EDGE = 0;
	const BOTTOM_EDGE = 8;
	const LEFT_EDGE = 0;
	const RIGHT_EDGE = 8;
	
	const ROW = 0;
	const COLUMN = 1;
	
	const ROW_NUM = 9;
	const COLUMN_NUM = 9;
	
	// ��ԁE��̏��L�҂�\�����
	const PLAYER = -1;
	const OPPONENT = 1;
	const BLANK = 0;
	
	// �����Ղ̃N���b�N���
	const UNSELECTED = 0;
	const ON_BOARD = 1;
	const ON_PLAYER_AREA = 2;
	const ON_OPP_AREA = 3;
	
	// �N���b�N�ʒu
	const IS_BLANK_AREA = 0;
	const IS_BOARD_AREA = 1;
	const IS_PLAYER_AREA = 2;
	const IS_OPP_AREA = 3;
	
	// ����W
	const X0 = 17;
	const Y0 = 75;
	
	const OPP_AREA_X0 = 43;
	const OPP_AREA_Y0 = 60;
	
	const PLAYER_AREA_X0 = 11;
	const PLAYER_AREA_Y0 = 194;
	
	const X_SIZE = 30;
	const Y_SIZE = 34;
	
	const PLAYER_AREA_X_SIZE = 32;
	const PLAYER_AREA_Y_SIZE = 36;
	
	//��̃|�C���g
	const FU_POINT = 1;
	const KYO_POINT = 10;
	const KEI_POINT = 20;
	const GIN_POINT = 30;
	const KIN_POINT = 80;
	const KAKU_POINT = 300;
	const HISHA_POINT = 400;
	const OU_POINT = 1000;
	
	const TO_POINT = 40;
	const NARIKYO_POINT = 50;
	const NARIKEI_POINT = 60;
	const NARIGIN_POINT = 70;
	const UMA_POINT = 500;
	const RYU_POINT = 600;
	
	// ��̃V���{���ƈړ��͈�
	const OPP_FU_SYMBOL = "�G-��";
	const OPP_FU_AREA = new Array([1, 0]);
	
	const OPP_KYO_SYMBOL = "�G-����";
	const OPP_KYO_AREA = 
			new Array([1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]);
	
	const OPP_KEI_SYMBOL = "�G-�j�n";
	const OPP_KEI_AREA = 
			new Array([2, -1], [2, 1]);
	
	const OPP_GIN_SYMBOL = "�G-��";
	const OPP_GIN_AREA = 
			new Array([1, 0], [1, -1], [1, 1], [-1, -1], [-1, 1]);
	
	const OPP_KIN_SYMBOL = "�G-��";
	const OPP_KIN_AREA = 
			new Array([1, 0], [1, -1], [1, 1], [0, -1], [0, 1], [-1, 0]);
	
	const OPP_HISHA_SYMBOL = "�G-���";
	const OPP_HISHA_AREA = 
			new Array([1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
					  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
					  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
					  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
	
	const OPP_KAKU_SYMBOL = "�G-�p�s";
	const OPP_KAKU_AREA = 
			new Array([1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
					  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
					  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
					  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
	
	const OPP_RYU_SYMBOL = "�G-����";
	const OPP_RYU_AREA = 
			new Array([1, 1], [1, -1], [-1, 1], [-1, -1], 
					  [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
					  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
					  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
					  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
	
	const OPP_UMA_SYMBOL = "�G-���n";
	const OPP_UMA_AREA = 
			new Array([1, 0], [-1, 0], [0, 1], [0, -1], 
					  [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
					  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
					  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
					  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
	
	const OPP_OU_SYMBOL = "�G-��";
	const OPP_OU_AREA = 
			new Array([1, 0], [1, -1], [1, 1], [0, -1], [0, 1], [-1, 0], [-1, 1], [-1, -1]);
	
	const OPP_TO_SYMBOL = "�G-��";
	const OPP_NARIKYO_SYMBOL = "�G-����";
	const OPP_NARIKEI_SYMBOL = "�G-���j";
	const OPP_NARIGIN_SYMBOL = "�G-����";
	
	const MY_FU_SYMBOL = "��-��";
	const MY_FU_AREA = new Array([-1, 0]);
	
	const MY_KYO_SYMBOL = "��-����";
	const MY_KYO_AREA = 
			new Array([-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0]);
	
	const MY_KEI_SYMBOL = "��-�j�n";
	const MY_KEI_AREA = 
			new Array([-2, -1], [-2, 1]);
	
	const MY_GIN_SYMBOL = "��-��";
	const MY_GIN_AREA = 
			new Array([-1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]);
	
	const MY_KIN_SYMBOL = "��-��";
	const MY_KIN_AREA = 
			new Array([-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0]);
	
	const MY_HISHA_SYMBOL = "��-���";
	const MY_HISHA_AREA = 
			new Array([1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
					  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
					  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
					  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
	
	const MY_KAKU_SYMBOL = "��-�p�s";
	const MY_KAKU_AREA = 
			new Array([1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
					  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
					  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
					  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
	
	const MY_RYU_SYMBOL = "��-����";
	const MY_RYU_AREA = 
			new Array([1, 1], [1, -1], [-1, 1], [-1, -1], 
					  [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
					  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
					  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
					  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
	
	const MY_UMA_SYMBOL = "��-���n";
	const MY_UMA_AREA = 
			new Array([1, 0], [-1, 0], [0, 1], [0, -1], 
					  [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
					  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
					  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
					  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
	
	const MY_OU_SYMBOL = "��-��";
	const MY_OU_AREA = 
			new Array([-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1], [1, -1]);
	
	const MY_TO_SYMBOL = "��-��";
	const MY_NARIKYO_SYMBOL = "��-����";
	const MY_NARIKEI_SYMBOL = "��-���j";
	const MY_NARIGIN_SYMBOL = "��-����";
	
	const BLANK_SYMBOL = "��";
	
	//��̏��
	//�G�̋�
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
	
	//�v���C���[�̋�
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
	
	var i;
	var board = new Board();
	var selectState = UNSELECTED;
	
	var clickedCell = new Cell(0, 0);
	var selectedCell = new Cell(null, null);
	// var clickedPlayerAreaCell = new Cell(0, 0);
	var clickedPlayerAreaIdx = undefined;
	// var selectedPlayerAreaCell = new Cell(0, 0);
	var selectedPlayerAreaIdx = undefined;
	var clickedOppAreaCell = new Cell(0, 0);
	// var selectedOppAreaCell = new Cell(0, 0);
	var selectedOppAreaIdx = undefined;
	
	var pieceInfo = new Array();
	
	// �^�[���B���̂��������_���ɁB
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
	 * �΋ǂ̏�����
	 */
	function initGame()
	{
		// ����̏�����
		initPieceInfo();
		
		// �����Ղ̏�����
		initMap();
		printMap(board);
	
		// �^�[���̌���
		n = Math.floor(Math.random() * 91) % 2;
		// alert("Turn Num: " + n);
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
	 * ����̏�����
	 */
	function initPieceInfo()
	{
		// �G��̏���ǉ�
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
	
		// ����̏���ǉ�
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
		
		// ��̃}�X�̏���ǉ�
		pieceInfo[BLANK_SYMBOL] = BLANK_PIECE;
	}
	
	/**
	 * �����Չ摜�̏�����
	 */
	function initMap()
	{
		var i, j;
		
		// ��s��
		board.map[0][0] = OPP_KYO_SYMBOL;	// ����
		board.map[0][1] = OPP_KEI_SYMBOL;	// �j�n
		board.map[0][2] = OPP_GIN_SYMBOL;	// �⏫
		board.map[0][3] = OPP_KIN_SYMBOL;	// ����
		board.map[0][4] = OPP_OU_SYMBOL;	// ����
		board.map[0][5] = OPP_KIN_SYMBOL;	// ����
		board.map[0][6] = OPP_GIN_SYMBOL;	// �⏫
		board.map[0][7] = OPP_KEI_SYMBOL;	// �j�n
		board.map[0][8] = OPP_KYO_SYMBOL;	// ����
	
		// ��s��
		board.map[1][0] = BLANK_SYMBOL;
		board.map[1][1] = OPP_HISHA_SYMBOL;
		for (j=2;j<7;j++) {
			board.map[1][j] = BLANK_SYMBOL;
		}
		board.map[1][7] = OPP_KAKU_SYMBOL;
		board.map[1][8] = BLANK_SYMBOL;
	
		// �O�s��
		for (j=0;j<9;j++) {
			board.map[2][j] = OPP_FU_SYMBOL;
		}
		
		// �l�`�Z�s��
		for (i=3;i<6;i++) { 
			for (j=0;j<9;j++) {
				board.map[i][j] = BLANK_SYMBOL;
			};
		}
		
		// ���s��
		for (j=0;j<9;j++) {
			board.map[6][j] = MY_FU_SYMBOL;
		}
	
		// ���s��
		board.map[7][0] = BLANK_SYMBOL;
		board.map[7][1] = MY_KAKU_SYMBOL;
		for (j=2;j<7;j++) {
			board.map[7][j] = BLANK_SYMBOL;
		}
		board.map[7][7] = MY_HISHA_SYMBOL;
		board.map[7][8] = BLANK_SYMBOL;
	
		// ��s��
		board.map[8][0] = MY_KYO_SYMBOL;	// ����
		board.map[8][1] = MY_KEI_SYMBOL;	// �j�n
		board.map[8][2] = MY_GIN_SYMBOL;	// �⏫
		board.map[8][3] = MY_KIN_SYMBOL;	// ����
		board.map[8][4] = MY_OU_SYMBOL;		// ����
		board.map[8][5] = MY_KIN_SYMBOL;	// ����
		board.map[8][6] = MY_GIN_SYMBOL;	// �⏫
		board.map[8][7] = MY_KEI_SYMBOL;	// �j�n
		board.map[8][8] = MY_KYO_SYMBOL;	// ����
		
		board.pieceInHand[PLAYER] = [];
		board.pieceInHand[OPPONENT] = [];
		
		board.pieceNum['PLAYER'] = 20;
		board.pieceNum['OPPONENT'] = 20;
		
		board.winner = BLANK;
	}
	
	
	/**
	 * �����Չ摜�̍X�V
	 */
	function printMap(brd)
	{
		var i, j, k;
		var pieceObj;
	
		// �����Ղ̕`��
		for (i=0;i<9;i++) {
			var mapStr = "";
			for (j=0;j<9;j++) {
				pieceObj = brd.map[i][j];
				var id = "piece"+i+"-"+j;
				var cell = document.getElementById(id);
				cell.src = getPieceImage(pieceObj);
			}
		}
	
		// �v���C���[�̎�����̕`��
		for (k=0;k<brd.pieceInHand[PLAYER].length;k++) {
			document.getElementById("my_piece_in_hand_"+k).src = 
										getPieceImage(brd.pieceInHand[PLAYER][k]);
		}
		for (;k<21;k++) {
			document.getElementById("my_piece_in_hand_"+k).src = 
												"img/piece/blank.png";
		}
		
		// �R���s���[�^�̎�����̕`��
		for (k=0;k<brd.pieceInHand[OPPONENT].length;k++) {
			document.getElementById("opp_piece_in_hand_"+k).src = 
										getPieceImage(brd.pieceInHand[OPPONENT][k]);
		}
		for (;k<21;k++) {
			document.getElementById("opp_piece_in_hand_"+k).src = 
												"img/piece/blank.png";
		}
	}
	
	/**
	 * ��摜�̃p�X�̎擾
	 */
	function getPieceImage(symbol)
	{
		imgPath = "img/piece/blank.png";
		
		// ����̉摜�̎擾
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
		// �G��̉摜�̎擾
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
	 * �����Ղ��N���b�N�������̏���
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
	 * �N���b�N���ꂽ�����Տ�̃}�X�̓���
	 */
	function detectCellOnBoard(event)
	{
		var hx, hy;
		
		hx = event.pageX;
		hy = event.pageY;
		
		if (((X0 < hx) && (hx < X0 + X_SIZE * 9)) && 
		    ((Y0 < hy) && (hy < Y0 + Y_SIZE * 9))) {
			/* �����Տ� */
			var x, y;
			var i;
		
			x = (hx - X0)/X_SIZE;
			for (i=0;i<9;i++) {
				if (x < i+1) {
					clickedCell.column = i;
					break;
				};
			}
			y = (hy - Y0)/Y_SIZE;
			for (i=0;i<9;i++) {
				if (y < i+1) {
					clickedCell.row = i;
					break;
				};
			};
		};
	}
	
	
	/**
	 * �����ՃN���b�N���̃A�N�V����
	 */
	function onBoardAction()
	{
		var symbol = board.map[clickedCell.row][clickedCell.column];
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
				var selectedSymbol = board.map[selectedCell.row][selectedCell.column];
				var selectedPiece = pieceInfo[selectedSymbol];
				if (selectedPiece.owner == currentTurn) {
					if (isMovable(board, selectedPiece, selectedCell, clickedCell)) {
						board = movePiece(board, selectedCell, clickedCell, currentTurn);
						printMap(board);
						haveMoved = true;
						changeTurn();
					} else {
						alert("�����ɂ͓������܂���I");
					}
				}
			} else if (selectState == ON_PLAYER_AREA) {
				if (isPutable(board, selectedPlayerAreaIdx, clickedCell, currentTurn)) {
					board = putPiece(board, currentTurn, selectedPlayerAreaIdx, clickedCell);

					haveMoved = true;
					changeTurn();
				} else {
					alert("�����ɂ͑łĂ܂���I");
				}
			}
		}
	
		judgeWinner(board);
		return;
	}
	
	/**
	 * �ړ��\�����肷��
	 */
	function isMovable(brd, piece, src, dest) {
		var i;
		var symbol;
		var p;
		
		// alert("Src: (" + src.row + ", " + src.column + "), " + 
		//		"Dest: (" + dest.row + ", " + dest.column + ") ");
		
		// �ړ��悪�����Ղ͈̔͊O�Ȃ�A�ړ��s��
		if (((dest.row < 0) || (8 < dest.row)) || 
			((dest.column < 0) || (8 < dest.column))) {
			return false;
		}
		
		for (i=0;i<piece.area.length;i++) {
			// �ړ���̃}�X���A���̋�̈ړ��͈͓�
			if ((src.row + piece.area[i][0] == dest.row) &&
				(src.column + piece.area[i][1] == dest.column)) {
				// �ړ���Ɏ�Ԃ̋����ꍇ�͈ړ��s��
				var destSymbol = brd.map[dest.row][dest.column];
				var destPiece = pieceInfo[destSymbol];
				if (piece.owner == destPiece.owner) {
					return false;
				}
				
				// �j�n�Ȃ瑦�ړ�
				if ((piece.symbol == MY_KEI_SYMBOL) || 
					(piece.symbol == OPP_KEI_SYMBOL)) {
					return true;
				} else {
					// �j�n�ȊO�Ȃ�A���ݒn�`�ړ���̊Ԃɋ�Ȃ��ꍇ�A�ړ�
					var row_diff = dest.row - src.row;
					var column_diff = dest.column - src.column;
					
					
					var r_step = 0;
					if (row_diff != 0) {
						r_step = row_diff / Math.abs(row_diff);
					}
					var c_step = 0;
					if (column_diff != 0) {
						c_step = column_diff / Math.abs(column_diff);
					}
					
					var r = src.row;
					var c = src.column;
					
					// alert("Row:" + r + " R_step:" + r_step + 
					//		" Col:" + c +" C_step:" + c_step);
					
					while ((r != dest.row-r_step) || (c != dest.column-c_step)) {
						r += r_step;
						c += c_step;
						// alert("Row:"+r+" Col:"+c);
						symbol = brd.map[r][c];
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
	 * �N���b�N���ꂽ��̑I��
	 */
	function selectPiece(row, column)
	{
		if ((selectedCell.row != null) && (selectedCell.column != null)) {
			document.
				getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
					style.backgroundImage = '';
		}
	
		selectedCell.row = clickedCell.row;
		selectedCell.column = clickedCell.column;
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
	 * ��̈ړ�
	 */
	function movePiece(brd, src, dst, turn)
	{
		// �ړ���ɋ����Ȃ�A������
		var targetSymbol = brd.map[dst.row][dst.column];
		var targetPiece = pieceInfo[targetSymbol];
		if ((targetPiece.owner != turn) && (targetPiece.owner != BLANK)) {
			// ����������珟��
			if ((turn == PLAYER) && (targetSymbol == OPP_OU_SYMBOL) || 
				(turn == OPPONENT) && (targetSymbol == MY_OU_SYMBOL))  {
				brd.winner = turn;
			}
			// �������ɑΉ����鎩����擾
			targetSymbol = changeOwner(targetSymbol);
			brd.pieceInHand[turn].push(targetSymbol);
			brd.map[dst.row][dst.column] = BLANK_SYMBOL;
			
			if (turn == PLAYER) {
				brd.pieceNum['OPPONENT'] -= 1;
			} else if (turn == OPPONENT) {
				brd.pieceNum['PLAYER'] -= 1;
			}
		}
		
		// ��̈ړ�
		var selectedSymbol = brd.map[src.row][src.column];
		var selectedPiece = pieceInfo[selectedSymbol];
		// ����w�n�ɓ������琬��
		if (((turn == PLAYER) && (dst.row <= 2)) || 
		    ((turn == OPPONENT) && (dst.row >= 6))) {
		    if (selectedPiece.promoted == false) {
				selectedSymbol = promotePiece(selectedSymbol);
		    };
		}
		brd.map[dst.row][dst.column] = selectedSymbol;
	
		// �ړ��O�̋�I���̉���
		brd.map[src.row][src.column] =BLANK_SYMBOL;
		selectState = UNSELECTED;
		document.
			getElementById("cell"+src.row+"-"+src.column).
				style.backgroundImage = '';
		
		return brd;
	}
	
	/**
	 * �������̏��L�҂�ύX�����V���{����Ԃ��B
	 * �����Ă���ꍇ�͊�ɖ߂��B
	 */
	function changeOwner(symbol) {
		var changedSymbol = BLANK_SYMBOL;
		
		// �v���C���[����ꂽ�ꍇ
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
		// �R���s���[�^����ꂽ�ꍇ
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
	 * ����w�n�ɓ�������𐬂点��
	 */
	function promotePiece(symbol)
	{
		var promSymbol = symbol;
	
		// �v���C���[��𐬂点��ꍇ
		if (MY_FU_SYMBOL == symbol) {	// ��
			promSymbol = MY_TO_SYMBOL;
		} else if (MY_KYO_SYMBOL == symbol) {	// ����
			promSymbol = MY_NARIKYO_SYMBOL;
		} else if (MY_KEI_SYMBOL == symbol) {	// �j�n
			promSymbol = MY_NARIKEI_SYMBOL;
		} else if (MY_GIN_SYMBOL == symbol) {	// �⏫
			promSymbol = MY_NARIGIN_SYMBOL;
		} else if (MY_HISHA_SYMBOL == symbol) {	// ���
			promSymbol = MY_RYU_SYMBOL;
		} else if (MY_KAKU_SYMBOL == symbol) {	// �e�s
			promSymbol = MY_UMA_SYMBOL;
		}
		// �R���s���[�^��𐬂点��ꍇ
		if (OPP_FU_SYMBOL == symbol) {	// ��
			promSymbol = OPP_TO_SYMBOL;
		} else if (OPP_KYO_SYMBOL == symbol) {	// ����
			promSymbol = OPP_NARIKYO_SYMBOL;
		} else if (OPP_KEI_SYMBOL == symbol) {	// �j�n
			promSymbol = OPP_NARIKEI_SYMBOL;
		} else if (OPP_GIN_SYMBOL == symbol) {	// �⏫
			promSymbol = OPP_NARIGIN_SYMBOL;
		} else if (OPP_HISHA_SYMBOL == symbol) {	// ���
			promSymbol = OPP_RYU_SYMBOL;
		} else if (OPP_KAKU_SYMBOL == symbol) {	// �e�s
			promSymbol = OPP_UMA_SYMBOL;
		}
	
		return promSymbol;
	}
	
	/**
	 * ���������~�i������
	 */
	function demotePiece(symbol)
	{
		var demSymbol = symbol;
	
		// �v���C���[����~�i������ꍇ
		if (MY_TO_SYMBOL == symbol) {	// ��
			promSymbol = MY_FU_SYMBOL;
		} else if (MY_NARIKYO_SYMBOL == symbol) {	// ����
			promSymbol = MY_KYO_SYMBOL;
		} else if (MY_NARIKEI_SYMBOL == symbol) {	// �j�n
			promSymbol = MY_KEI_SYMBOL;
		} else if (MY_NARIGIN_SYMBOL == symbol) {	// ����
			promSymbol = MY_GIN_SYMBOL;
		} else if (MY_RYU_SYMBOL == symbol) {	// ����
			promSymbol = MY_HISHA_SYMBOL;
		} else if (MY_UMA_SYMBOL == symbol) {	// ���n
			promSymbol = MY_KAKU_SYMBOL;
		}
		// �R���s���[�^����~�i������ꍇ
		if (OPP_TO_SYMBOL == symbol) {	// ��
			promSymbol = OPP_FU_SYMBOL;
		} else if (OPP_NARIKYO_SYMBOL == symbol) {	// ����
			promSymbol = OPP_KYO_SYMBOL;
		} else if (OPP_NARIKEI_SYMBOL == symbol) {	// �j�n
			promSymbol = OPP_KEI_SYMBOL;
		} else if (OPP_NARIGIN_SYMBOL == symbol) {	// ����
			promSymbol = OPP_GIN_SYMBOL;
		} else if (OPP_RYU_SYMBOL == symbol) {	// ����
			promSymbol = OPP_HISHA_SYMBOL;
		} else if (OPP_UMA_SYMBOL == symbol) {	// ���n
			promSymbol = OPP_KAKU_SYMBOL;
		}
	
		return demSymbol;
	}
	
	/**
	 * ���������̔���
	 */
	function judgeWinner(brd)
	{
		if (BLANK != brd.winner) {
			var message = "";
			if (brd.winner == PLAYER) {
				message = "���Ȃ��̏����ł��I";
			} else if (brd.winner == OPPONENT) {
				message = "���Ȃ��̕����ł��c";
			}
			showDialog(message);
		}
		
		return;
	}
	
	/**
	 * �v���C���[�̎�������g�p
	 */
	$("#player_pieces_area").click(function(event){
		detectCellOnPlayerArea(event);
		onPlayerAreaAction();
	});
		
	/**
	 * �v���C���[�G���A�̃}�X�����
	 */
	function detectCellOnPlayerArea(event)
	{
		var hx, hy;
		
		hx = event.pageX;
		hy = event.pageY;
		
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
					column = i;
					break;
				};
			};
			y = (hy - PLAYER_AREA_Y0)/PLAYER_AREA_Y_SIZE;
			for (i=0;i<3;i++) {
				if (y < i+1) {
					row = i;
					break;
				};
			};
			
			clickedPlayerAreaIdx = (2 - row) * 7 + column;
		};		
	}
	
	/**
	 * �v���[���[�̎�����G���A�@�N���b�N���̃A�N�V����
	 */
	function onPlayerAreaAction()
	{
		if (currentTurn == PLAYER) {
			if (selectState == ON_BOARD) {
				/* �����Տ�̃R�}�̑I������ */
				document.
					getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
					style.backgroundImage = '';
			} else if (selectState == ON_PLAYER_AREA) {
				document.getElementById("my_cell_in_hand_"+selectedPlayerAreaIdx).
					style.backgroundImage = '';
			}
			/* �v���C���[�̎������I�� */
			selectedPlayerAreaIdx = clickedPlayerAreaIdx;
			document.getElementById("my_cell_in_hand_"+selectedPlayerAreaIdx).
				style.backgroundImage = 'url(img/focus/focus_bold_b.png)';
			selectState = ON_PLAYER_AREA;
		}
	
		return;
	}
	
	/**
	�@* �������z�u�\��
	�@*/
	function isPutable(brd, idx, dst, turn)
	{
		// �u���ꏊ���󂢂Ă��邩
		if (brd.map[dst.row][dst.column] != BLANK_SYMBOL) {
			return false;
		}
		
		var symbol = brd.pieceInHand[turn][idx];
		
		if (symbol==MY_FU_SYMBOL) {
			// �����Ȃ��ꏊ�ɑłƂ��Ƃ��Ă��Ȃ���
			if (dst.row == 0) return false;
			
			// ������ۂ�
			for (var i=0; i<ROW_NUM; i++) {
				if (brd.map[i][dst.column] == MY_FU_SYMBOL) {
					return false;
				};
			};
			
			// �ł����l�߂��ۂ�
			if (brd.map[dst.row-1][dst.column] == OPP_OU_SYMBOL) {
				return false;
			};
		} else if (symbol==OPP_FU_SYMBOL) {
			// �����Ȃ��ꏊ�ɑłƂ��Ƃ��Ă��Ȃ���
			if (dst.row == 8) return false;
			
			// ������ۂ�
			for (var i=0; i<ROW_NUM; i++) {
				if (brd.map[i][dst.column] == OPP_FU_SYMBOL) {
					return false;
				};
			};
			
			// �ł����l�߂��ۂ�
			if (brd.map[dst.row+1][dst.column] == MY_OU_SYMBOL) {
				return false;
			};
		}
		
		
		return true;
	}
	
	
	/**
	�@* �������Տ�ɔz�u
	�@*/
	function putPiece(brd, turn, idx, dst)
	{
		brd.map[dst.row][dst.column]
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
	�@* ����G���A�̃}�X�����
	�@*/
	function detectCellOnOppArea(hx, hy)
	{
		var x, y;
		var i;
	
		x = (hx - OPP_AREA_X0)/X_SIZE;
		for (i=0;i<4;i++) {
			if (x < i+1) {
				clickedOppAreaCell.column = i;
				break;
			};
		}
		y = (hy - OPP_AREA_Y0)/Y_SIZE;
		for (i=0;i<5;i++) {
			if (y < i+1) {
				clickedOppAreaCell.row = i;
				break;
			};
		};
	};
	
	/**
	�@* �R���s���[�^�̎��
	�@*/
	function makeOpponentMove() {
		board = getOpponentMove();
		printMap(board);
		judgeWinner(board);
		changeTurn();
	}
	
	/**
	�@* �R���s���[�^���̎�̌���
	�@*/
	function getOpponentMove() {
		var i, j, k, l;
		var nextBoard = board;	// ���̋ǖ�
		var tmpNextBoard;
		var symbol;
		var piece;
		var src;
		var dst;
		var score = Number.NEGATIVE_INFINITY;
		var max = Number.NEGATIVE_INFINITY;
		
		for (i=0; i<9; i++) {
			for (j=0; j<9; j++) {
				symbol = board.map[i][j];
				piece = pieceInfo[symbol];
				src = new Cell(i, j);
				if (piece.owner == OPPONENT) {
					for (k=0; k < piece.area.length; k++) {
						var r = i + piece.area[k][0];
						var c = j + piece.area[k][1];
						dst = new Cell(r, c);
						if (isMovable(board, piece, src, dst)) {
							var brd = board.clone();
							tmpNextBoard = movePiece(brd, src, dst, currentTurn);
							score = negaAlpha(tmpNextBoard, 2, 
									  Number.NEGATIVE_INFINITY, 
									  Number.POSITIVE_INFINITY, 
									  currentTurn);
							if (score > max) {
								max = score;
								nextBoard = tmpNextBoard;
							};
							delete brd;
							// delete nxtBrd;
						};
					};
				};
			};
		};
		
		for (i=0; i<ROW_NUM; i++) {
			for (j=0; j<COLUMN_NUM; j++) {
				for (k=0; k<board.pieceInHand[OPPONENT].length; k++) {
					var brd = board.clone();
					var putDst = new Cell(i, j);
					if (isPutable(brd, k, putDst, OPPONENT)) {
						tmpNextBoard = putPiece(brd, currentTurn, k, putDst);
						score = negaAlpha(tmpNextBoard, 2, 
								  Number.NEGATIVE_INFINITY, 
								  Number.POSITIVE_INFINITY, 
								  currentTurn);
						if (score > max) {
							max = score;
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
	 * Nega-���@�ł̒T��
	 */
	function negaAlpha(brd, depth, a, b, turn) {
		var i, j, k;
		var symbol;
		var piece;
		var src;
		var dst;
		var nextBoard;
		
		if (depth == 0) {
			return brd.eval(turn); 
		}
		
		for (i=0; i<9; i++) {
			for (j=0; j<9; j++) {
				symbol = brd.map[i][j];
				piece = pieceInfo[symbol];
				src = new Cell(i, j);
				if (piece.owner == OPPONENT) {
					for (k=0; k < piece.area.length; k++) {
						dst = new Cell(i+piece.area[k][0], j+piece.area[k][1]);
						if (isMovable(brd, piece, src, dst)) {
							nextBoard = movePiece(brd.clone(), src, dst, turn);
							a = Math.max(a, -negaAlpha(nextBoard, depth-1, -b, -a, turn*-1));
							if (a > b) {
								return a;
							};
						};
					};
				};
			};
		};
		
		for (i=0; i<ROW_NUM; i++) {
			for (j=0; j<COLUMN_NUM; j++) {
				for (k=0; k<board.pieceInHand[turn].length; k++) {
					var nxtBrd = brd.clone();
					var putDst = new Cell(i, j);
					if (isPutable(nxtBrd, k, putDst, turn)) {
						nextBoard = putPiece(nxtBrd, turn, k, putDst);
						a = Math.max(a, -negaAlpha(nextBoard, depth-1, -b, -a, turn*-1));
						if (a > b) {
							delete nxtBrd;
							delete putDst;
							return a;
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
	 * �^�[���̌��
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
	 * �^�[���̕\��
	 */
	function printTurn()
	{
		var playerStatusElements = 
				document.getElementsByClassName("player_status");
		var oppStatusElements = 
				document.getElementsByClassName("opp_status");
		
		if (currentTurn == PLAYER) {
			/* �^�[����\�������v�̓��ߓx��ύX */
			for (var i=0; i<playerStatusElements.length; i++) {
				playerStatusElements[i].style.filter = 'alpha(opacity=100)';
				playerStatusElements[i].style.MozOpacity = 1.0;
				playerStatusElements[i].style.opacity = 1.0;
			}
			for (var i=0; i<oppStatusElements.length; i++) {
				oppStatusElements[i].style.filter = 'alpha(opacity=30)';
				oppStatusElements[i].style.MozOpacity = 0.3;
				oppStatusElements[i].style.opacity = 0.3;
			}
		} else {
			/* �^�[����\�������v�̓��ߓx��ύX */
			for (var i=0; i<playerStatusElements.length; i++) {
				playerStatusElements[i].style.filter = 'alpha(opacity=30)';
				playerStatusElements[i].style.MozOpacity = 0.3;
				playerStatusElements[i].style.opacity = 0.3;
			}
			for (var i=0; i<oppStatusElements.length; i++) {
				oppStatusElements[i].style.filter = 'alpha(opacity=100)';
				oppStatusElements[i].style.MozOpacity = 1.0;
				oppStatusElements[i].style.opacity = 1.0;
			}
		}
	}
	
	
	/**
	 * �΋ǌ��ʃ_�C�A���O�̕\��
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
	 * �΋ǌ��ʃ_�C�A���O�������A������x�΋ǂ��J�n
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
