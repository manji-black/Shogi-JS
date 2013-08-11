

/************************************************************/
/*	Classes                                                 */
/************************************************************/
/*****************************/
/*	駒のクラス               */
/*****************************/
var Piece = function(kind, owner, promoted) {
	this.kind = kind;
	this.owner = owner;
	this.promoted = promoted;
	// 移動可能な場所。
	this.area = new Array();

	this.setArea = function (array) {
		var i;
		for (i=0;i<array.length;i++) {
			this.area.push(array[i]);
		}
		// alert(this.area[0][0]);
	}
	
};

/*****************************/
/* 将棋盤のマスのクラス      */
/*****************************/
var Cell = function(row, column) {
	this.row = row;
	this.column = column;
};


/************************************************************/
// Constant Value
/************************************************************/
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

const TOP_EDGE = 0;
const BOTTOM_EDGE = 8;
const LEFT_EDGE = 0;
const RIGHT_EDGE = 8;

const ROW = 0;
const COLUMN = 1;

const PLAYER = -1;
const OPPONENT = 1;
const BLANK = 0;

const UNSELECTED = 0;
const ON_BOARD = 1;
const ON_PLAYER_AREA = 2;
const ON_OPP_AREA = 3;

const IS_BLANK_AREA = 0;
const IS_BOARD_AREA = 1;
const IS_PLAYER_AREA = 2;
const IS_OPP_AREA = 3;

const X0 = 274;
const Y0 = 30;

const OPP_AREA_X0 = 43;
const OPP_AREA_Y0 = 60;

const PLAYER_AREA_X0 = 713;
const PLAYER_AREA_Y0 = 183;

const X_SIZE = 43;
const Y_SIZE = 48;

const BLANK_PIECE = new Piece("○", BLANK);

const OPP_FU_AREA = new Array([1, 0]);
const OPP_KYO_AREA = 
		new Array([1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]);
const OPP_KEI_AREA = 
		new Array([2, -1], [2, 1]);
const OPP_GIN_AREA = 
		new Array([1, 0], [1, -1], [1, 1], [-1, -1], [-1, 1]);
const OPP_KIN_AREA = 
		new Array([1, 0], [1, -1], [1, 1], [0, -1], [0, 1], [-1, 0]);
const OPP_HISHA_AREA = 
		new Array([1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
				  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
				  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
				  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
const OPP_KAKU_AREA = 
		new Array([1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
				  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
				  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
				  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
const OPP_RYU_AREA = 
		new Array([1, 1], [1, -1], [-1, 1], [-1, -1], 
				  [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
				  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
				  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
				  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
const OPP_UMA_AREA = 
		new Array([1, 0], [-1, 0], [0, 1], [0, -1], 
				  [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
				  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
				  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
				  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
const OPP_OU_AREA = 
		new Array([1, 0], [1, -1], [1, 1], [0, -1], [0, 1], [-1, 0], [-1, 1], [-1, -1]);

const MY_FU_AREA = new Array([-1, 0]);
const MY_KYO_AREA = 
		new Array([-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0]);
const MY_KEI_AREA = 
		new Array([-2, -1], [-2, 1]);
const MY_GIN_AREA = 
		new Array([-1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]);
const MY_KIN_AREA = 
		new Array([-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0]);
const MY_HISHA_AREA = 
		new Array([1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
				  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
				  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
				  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
const MY_KAKU_AREA = 
		new Array([1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
				  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
				  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
				  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
const MY_RYU_AREA = 
		new Array([1, 1], [1, -1], [-1, 1], [-1, -1], 
				  [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], 
				  [-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0], [-8, 0], 
				  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], 
				  [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7], [0, -8]);
const MY_UMA_AREA = 
		new Array([1, 0], [-1, 0], [0, 1], [0, -1], 
				  [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], 
				  [-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7], [-8, -8], 
				  [1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7], [8, -8], 
				  [-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7], [-8, 8]);
const MY_OU_AREA = 
		new Array([-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1], [1, -1]);

/************************************************************/
// Variables
/************************************************************/

var i;
var map = new Array(9);
for (i=0;i<9;i++) {
	map[i]=new Array(9);
}
var selectState = UNSELECTED;

var clickedCell = new Cell(0, 0);
var selectedCell = new Cell(null, null);
var clickedPlayerAreaCell = new Cell(0, 0);
var selectedPlayerAreaCell = new Cell(0, 0);
var clickedOppAreaCell = new Cell(0, 0);
var selectedOppAreaCell = new Cell(0, 0);

// 持ち駒のバッファ
var pieceInHand = new Array(2);
pieceInHand[PLAYER] = new Array();
pieceInHand[OPPONENT] = new Array();

// ターン。そのうちランダムに。
var currentTurn = PLAYER;
var winner = BLANK;

/************************************************************/
/* Operation code                                           */
/************************************************************/
window.addEventListener
	('click', 
	 function(event)
	 {
	 	clickEvent(event);
	 }, 
	 false);


window.addEventListener
	('keydown', 
	 function(event)
	 {
// 		code = event.keyCode;
// 		movePosition(code);
// 		printMap();
 	 }, 
	 false);

initGame();


/************************************************************/
/* Functions                                                */
/************************************************************/

/*****************************/
/* 対局の初期化              */
/*****************************/
function initGame()
{
	initMap();
	winner = BLANK;
	printMap();

	// ターンの決定
	n = Math.floor(Math.random() * 91) % 2;
	// alert("Turn Num: " + n);
	if (n == 1) {
		currentTurn = PLAYER;
	} else {
		currentTurn = OPPONENT;
	}
	printTurn();

}

/*****************************/
/* 将棋盤画像の初期化        */
/*****************************/
function initMap()
{
	var i, j;
	
	// 一行目
	map[0][0] = new Piece("香車", OPPONENT, false);
	map[0][0].setArea(OPP_KYO_AREA);
	
	map[0][1] = new Piece("桂馬", OPPONENT, false);
	map[0][1].setArea(OPP_KEI_AREA);

	map[0][2] = new Piece("銀", OPPONENT, false);
	map[0][2].setArea(OPP_GIN_AREA);

	map[0][3] = new Piece("金", OPPONENT, false);
	map[0][3].setArea(OPP_KIN_AREA);

	map[0][4] = new Piece("王", OPPONENT, false);
	map[0][4].setArea(OPP_OU_AREA);

	map[0][5] = new Piece("金", OPPONENT, false);
	map[0][5].setArea(OPP_KIN_AREA);

	map[0][6] = new Piece("銀", OPPONENT, false);
	map[0][6].setArea(OPP_GIN_AREA);

	map[0][7] = new Piece("桂馬", OPPONENT, false);
	map[0][7].setArea(OPP_KEI_AREA);

	map[0][8] = new Piece("香車", OPPONENT, false);
	map[0][8].setArea(OPP_KYO_AREA);

	// 二行目
	map[1][0] = BLANK_PIECE;

	map[1][1] = new Piece("飛車", OPPONENT, false);
	map[1][1].setArea(OPP_HISHA_AREA);
	
	for (j=2;j<7;j++) {
		map[1][j] = BLANK_PIECE;
	}
	
	map[1][7] = new Piece("角", OPPONENT, false);
	map[1][7].setArea(OPP_KAKU_AREA);
	
	map[1][8] = BLANK_PIECE;

	// 三行目
	for (j=0;j<9;j++) {
		map[2][j] = new Piece("歩", OPPONENT, false);
		map[2][j].setArea(OPP_FU_AREA);
		// alert("["+0+"]["+j+"]="+ map[0][j].kind);
	}
	
	// 四～六行目
	for (i=3;i<6;i++) { 
		for (j=0;j<9;j++) {
			map[i][j] = BLANK_PIECE;
			// alert("["+i+"]["+j+"]="+map[i][j].kind);
		}
	}
	
	// 七行目
	for (j=0;j<9;j++) {
		map[6][j] = new Piece("歩", PLAYER, false);
		map[6][j].setArea(MY_FU_AREA);
		// alert("["+8+"]["+j+"]="+map[8][j].kind);
	}

	for (j=0;j<9;j++) {
		map[7][j] = BLANK_PIECE;
	}

	for (j=0;j<9;j++) {
		map[8][j] = BLANK_PIECE;
	}

	// 八行目
	map[7][0] = BLANK_PIECE;

	map[7][1] = new Piece("角", PLAYER, false);
	map[7][1].setArea(MY_KAKU_AREA);
	
	for (j=2;j<7;j++) {
		map[1][j] = BLANK_PIECE;
	}
	
	map[7][7] = new Piece("飛車", PLAYER, false);
	map[7][7].setArea(MY_HISHA_AREA);
	
	map[7][8] = BLANK_PIECE;

	// 九行目
	map[8][0] = new Piece("香車", PLAYER, false);
	map[8][0].setArea(MY_KYO_AREA);
	
	map[8][1] = new Piece("桂馬", PLAYER, false);
	map[8][1].setArea(MY_KEI_AREA);

	map[8][2] = new Piece("銀", PLAYER, false);
	map[8][2].setArea(MY_GIN_AREA);

	map[8][3] = new Piece("金", PLAYER, false);
	map[8][3].setArea(MY_KIN_AREA);

	map[8][4] = new Piece("王", PLAYER, false);
	map[8][4].setArea(MY_OU_AREA);

	map[8][5] = new Piece("金", PLAYER, false);
	map[8][5].setArea(MY_KIN_AREA);

	map[8][6] = new Piece("銀", PLAYER, false);
	map[8][6].setArea(MY_GIN_AREA);

	map[8][7] = new Piece("桂馬", PLAYER, false);
	map[8][7].setArea(MY_KEI_AREA);

	map[8][8] = new Piece("香車", PLAYER, false);
	map[8][8].setArea(MY_KYO_AREA);
	
	pieceInHand[PLAYER].length = 0;
	pieceInHand[OPPONENT].length = 0;


}


/*****************************/
/* 将棋盤画像の更新          */
/*****************************/
function printMap()
{
	var i, j, k;
	var pieceObj;

	for (i=0;i<9;i++) {
		var mapStr = "";
		for (j=0;j<9;j++) {
			pieceObj = map[i][j];
			document.getElementById("piece"+i+"-"+j).src=
											getPieceImage(pieceObj);
		}
	}
	
	for (k=0;k<pieceInHand[PLAYER].length;k++) {
		document.getElementById("my_piece_in_hand_"+k).src = 
									getPieceImage(pieceInHand[PLAYER][k]);
	}
	for (;k<20;k++) {
		document.getElementById("my_piece_in_hand_"+k).src = 
											"img/piece/blank.png";
	}
	
	for (k=0;k<pieceInHand[OPPONENT].length;k++) {
		document.getElementById("opp_piece_in_hand_"+k).src = 
									getPieceImage(pieceInHand[OPPONENT][k]);
	}
	for (;k<20;k++) {
		document.getElementById("opp_piece_in_hand_"+k).src = 
											"img/piece/blank.png";
	}
}

/*****************************/
/* 駒画像のパスの取得        */
/*****************************/
function getPieceImage(piece)
{
	imgPath = "img/piece/blank.png";
	
	if (PLAYER == piece.owner) {
		if ("歩" == piece.kind) {
			imgPath = "img/piece/S/Sfu.png";
		} else if ("香車" == piece.kind) {
			imgPath = "img/piece/S/Skyo.png";
		} else if ("桂馬" == piece.kind) {
			imgPath = "img/piece/S/Skei.png";
		} else if ("銀" == piece.kind) {
			imgPath = "img/piece/S/Sgin.png";
		} else if ("金" == piece.kind) {
			imgPath = "img/piece/S/Skin.png";
		} else if ("飛車" == piece.kind) {
			imgPath = "img/piece/S/Shi.png";
		} else if ("角" == piece.kind) {
			imgPath = "img/piece/S/Skaku.png";
		} else if ("と" == piece.kind) {
			imgPath = "img/piece/S/Sto.png";
		} else if ("成香" == piece.kind) {
			imgPath = "img/piece/S/Snkyo.png";
		} else if ("成桂" == piece.kind) {
			imgPath = "img/piece/S/Snkei.png";
		} else if ("成銀" == piece.kind) {
			imgPath = "img/piece/S/Sngin.png";
		} else if ("龍" == piece.kind) {
			imgPath = "img/piece/S/Sryu.png";
		} else if ("馬" == piece.kind) {
			imgPath = "img/piece/S/Suma.png";
		} else {
			imgPath = "img/piece/S/Sou.png";
		} 
	} else if (OPPONENT == piece.owner) {
		if ("歩" == piece.kind) {
			imgPath = "img/piece/G/Gfu.png";
		} else if ("香車" == piece.kind) {
			imgPath = "img/piece/G/Gkyo.png";
		} else if ("桂馬" == piece.kind) {
			imgPath = "img/piece/G/Gkei.png";
		} else if ("銀" == piece.kind) {
			imgPath = "img/piece/G/Ggin.png";
		} else if ("金" == piece.kind) {
			imgPath = "img/piece/G/Gkin.png";
		} else if ("飛車" == piece.kind) {
			imgPath = "img/piece/G/Ghi.png";
		} else if ("角" == piece.kind) {
			imgPath = "img/piece/G/Gkaku.png";
		} else if ("と" == piece.kind) {
			imgPath = "img/piece/G/Gto.png";
		} else if ("成香" == piece.kind) {
			imgPath = "img/piece/G/Gnkyo.png";
		} else if ("成桂" == piece.kind) {
			imgPath = "img/piece/G/Gnkei.png";
		} else if ("成銀" == piece.kind) {
			imgPath = "img/piece/G/Gngin.png";
		} else if ("龍" == piece.kind) {
			imgPath = "img/piece/G/Gryu.png";
		} else if ("馬" == piece.kind) {
			imgPath = "img/piece/G/Guma.png";
		} else {
			imgPath = "img/piece/G/Gou.png";
		} 
	}
	return imgPath;
}

/******************************/
/* 画面クリックイベントの処理 */
/******************************/
function clickEvent(event)
{
	var clickedArea = calcClickedCell(event);
	
	if (IS_BOARD_AREA == clickedArea) {
		onBoardAction();
	} else if (IS_PLAYER_AREA == clickedArea) {
		// プレイヤーエリアの操作
		onPlayerAreaAction();
	} else if (IS_OPP_AREA == clickedArea) {
		// 相手エリアの操作
	}
	
	return;
}


/*****************************/
/* クリックされたマスの特定  */
/*****************************/
function calcClickedCell(event)
{
	var hx, hy;

	if (document.all) { // for IE
		hx = event.offsetX;
		hy = event.offsetY;
	} else {
		hx = event.layerX;
		hy = event.layerY;
	}

	// alert("clicked: (" + hx + ", " + hy + ")");
	
	if (((X0 < hx) && (hx < X0 + X_SIZE * 9)) && 
	    ((Y0 < hy) && (hy < Y0 + Y_SIZE * 9))) {
		/* 将棋盤上 */
		detectCellOnBoard(hx, hy);
		document.getElementById("clicked_cell").innerText
			= "Clicked: ( " + clickedCell.row + " , " + clickedCell.column + " )";
		return IS_BOARD_AREA;
	} else if (((PLAYER_AREA_X0 < hx) && (hx < PLAYER_AREA_X0 + X_SIZE * 4)) && 
	           ((PLAYER_AREA_Y0 < hy) && (hy < PLAYER_AREA_Y0 + Y_SIZE * 5))) {
		/* 自分の持ち駒エリア */
		detectCellOnPlayerArea(hx, hy);
		alert("PLAYER_AREA: " + clickedPlayerAreaCell.row + ", " + clickedPlayerAreaCell.column);
		return IS_PLAYER_AREA;
	} else if (((OPP_AREA_X0 < hx) && (hx < OPP_AREA_X0 + X_SIZE * 4)) && 
	           ((OPP_AREA_Y0 < hy) && (hy < OPP_AREA_Y0 + Y_SIZE * 5))) {
		/* 相手の持ち駒エリア */
		detectCellOnOppArea(hx, hy);
		alert("OPP_AREA: " + clickedOppAreaCell.row + ", " + clickedOppAreaCell.column);
		return IS_OPP_AREA;
	} 

	/* クリック場所がエリア外 */
	return false;
}

/*****************************/
/* 将棋盤上のマスを特定      */
/*****************************/
function detectCellOnBoard(hx, hy)
{
	var x, y;
	var i;

	x = (hx - X0)/X_SIZE;
	for (i=0;i<9;i++) {
		if (x < i+1) {
			clickedCell.column = i;
			break;
		}
	}
	y = (hy - Y0)/Y_SIZE;
	for (i=0;i<9;i++) {
		if (y < i+1) {
			clickedCell.row = i;
			break;
		}
	}
}

/********************************/
/* 将棋盤クリック時のアクション */
/********************************/
function onBoardAction()
{
	var piece = map[clickedCell.row][clickedCell.column];
	
	if (piece.owner == currentTurn) {
		selectPiece(clickedCell.row, clickedCell.column);
	} else if ((selectedCell.row != null) && (selectedCell.column != null)) {
		var selectedPiece = map[selectedCell.row][selectedCell.column];
		if (selectedPiece.owner == currentTurn) {
			if (isMovable(selectedPiece, selectedCell, clickedCell)) {
				movePiece(clickedCell.row, clickedCell.column);
				printMap();
				changeTurn();
			} else {
				alert("そこには動かせません！");
			}
		}
	}

/*	if ((selectState == UNSELECTED) && (piece.owner == currentTurn)) {
		selectPiece(clickedCell.row, clickedCell.column);
	} else if (selectState == ON_BOARD) {
	}
*/
	document.getElementById("winner_text").innerText="Winner: "+winner;
	if (BLANK != winner) {
		var message = "";
		if (winner == PLAYER) {
			message = "あなたの勝ちです！";
		} else if (winner == OPPONENT) {
			message = "あなたの負けです…";
		}
		showDialog(message);
	}

	return;
}

/*****************************/
/* 移動可能か判定する        */
/*****************************/
function isMovable(piece, src, dest) {
	var i;

	// alert("Src: (" + src.row + ", " + src.column + "), " + 
	//		"Dest: (" + dest.row + ", " + dest.column + ") ");
	for (i=0;i<piece.area.length;i++) {
		// 移動先のマスが、その駒の移動範囲内
		if ((src.row + piece.area[i][0] == dest.row) &&
			(src.column + piece.area[i][1] == dest.column)) {
			// 桂馬なら即移動
			if (piece.kind == "桂馬") {
				return true;
			} else {
				// 桂馬以外なら、現在地～移動先の間に駒がない場合、移動
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
					if (map[r][c].owner != BLANK) {
						return false;
					}
				}
				
				return true;
			}
		}
	}
	
	return false;
}


/*****************************/
/* クリックされた駒の選択    */
/*****************************/
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
	
	document.getElementById("selected_cell").innerText
		= "Selected: ( " + selectedCell.row + " , " + selectedCell.column + " )";

	document.
		getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
			style.backgroundImage = path;
	
}

/*****************************/
/* 駒の移動                  */
/*****************************/
function movePiece(row, column)
{
	// 移動先に駒があるなら、駒を取る
	var targetPiece = map[row][column];
	if ((targetPiece.owner != currentTurn) && (targetPiece.owner != BLANK)) {
		// 王を取ったら勝ち
		if (targetPiece.kind == "王") {
			winner = currentTurn;
		} else if (targetPiece.promoted) {
			targetPiece = demotePiece(targetPiece);
		}
		targetPiece.owner = currentTurn;
		pieceInHand[currentTurn].push(targetPiece);
		map[row][column] = BLANK_PIECE;
	}
	
	// 駒の移動
	var selectedPiece = map[selectedCell.row][selectedCell.column];
	// 相手陣地に入ったら成る
	if (((currentTurn == PLAYER) && (row <= 2)) || 
	    ((currentTurn == OPPONENT) && (row >= 6))) {
	    if (selectedPiece.promoted == false) {
			selectedPiece = promotePiece(selectedPiece)
	    }
	}
	map[row][column] = selectedPiece;

	// 移動前の駒選択の解除
	map[selectedCell.row][selectedCell.column] =BLANK_PIECE;
	document.getElementById("selected_cell").innerText
		= "Selected: ";
	selectState = UNSELECTED;
	document.
		getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
			style.backgroundImage = '';
}

/********************************/
/* 相手陣地に入った駒を成らせる */
/********************************/
function promotePiece(piece)
{
	var promPiece = piece;
	if (PLAYER == piece.owner) {
		if ("歩" == piece.kind) {
			promPiece = new Piece("と", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("香車" == piece.kind) {
			promPiece = new Piece("成香", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("桂馬" == piece.kind) {
			promPiece = new Piece("成桂", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("銀" == piece.kind) {
			promPiece = new Piece("成銀", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("飛車" == piece.kind) {
			promPiece = new Piece("龍", PLAYER, true);
			promPiece.setArea(MY_RYU_AREA);
		} else if ("角" == piece.kind) {
			promPiece = new Piece("馬", PLAYER, true);
			promPiece.setArea(MY_UMA_AREA);
		} 
	} else if (OPPONENT == piece.owner) {
		if ("歩" == piece.kind) {
			promPiece = new Piece("と", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("香車" == piece.kind) {
			promPiece = new Piece("成香", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("桂馬" == piece.kind) {
			promPiece = new Piece("成桂", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("銀" == piece.kind) {
			promPiece = new Piece("成銀", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("飛車" == piece.kind) {
			promPiece = new Piece("龍", OPPONENT, true);
			promPiece.setArea(OPP_RYU_AREA);
		} else if ("角" == piece.kind) {
			promPiece = new Piece("馬", OPPONENT, true);
			promPiece.setArea(OPP_UMA_AREA);
		} 
	}
	return promPiece;
}

/********************************/
/* 取った駒を降格させる         */
/********************************/
function demotePiece(piece)
{
	var demPiece = piece;
	if (PLAYER == piece.owner) {
		if ("と" == piece.kind) {
			demPiece = new Piece("歩", PLAYER, false);
			demPiece.setArea(MY_FU_AREA);
		} else if ("成香" == piece.kind) {
			demPiece = new Piece("香車", PLAYER, false);
			demPiece.setArea(MY_KYO_AREA);
		} else if ("成桂" == piece.kind) {
			demPiece = new Piece("桂馬", PLAYER, false);
			demPiece.setArea(MY_KEI_AREA);
		} else if ("成銀" == piece.kind) {
			demPiece = new Piece("銀", PLAYER, false);
			demPiece.setArea(MY_GIN_AREA);
		} else if ("龍" == piece.kind) {
			demPiece = new Piece("飛車", PLAYER, false);
			demPiece.setArea(MY_HISHA_AREA);
		} else if ("馬" == piece.kind) {
			demPiece = new Piece("角", PLAYER, false);
			demPiece.setArea(MY_KAKU_AREA);
		} 
	} else if (OPPONENT == piece.owner) {
		if ("と" == piece.kind) {
			demPiece = new Piece("歩", OPPONENT, false);
			demPiece.setArea(OPP_FU_AREA);
		} else if ("成香" == piece.kind) {
			demPiece = new Piece("香車", OPPONENT, false);
			demPiece.setArea(OPP_KYO_AREA);
		} else if ("成桂" == piece.kind) {
			demPiece = new Piece("桂馬", OPPONENT, false);
			demPiece.setArea(OPP_KEI_AREA);
		} else if ("成銀" == piece.kind) {
			demPiece = new Piece("銀", OPPONENT, false);
			demPiece.setArea(OPP_GIN_AREA);
		} else if ("龍" == piece.kind) {
			demPiece = new Piece("飛車", OPPONENT, false);
			demPiece.setArea(OPP_HISHA_AREA);
		} else if ("馬" == piece.kind) {
			demPiece = new Piece("角", OPPONENT, false);
			demPiece.setArea(OPP_KAKU_AREA);
		} 
	}
	return demPiece;
}


/********************************/
/* プレイヤーエリアのマスを特定 */
/********************************/
function detectCellOnPlayerArea(hx, hy)
{
	var x, y;
	var i;

	x = (hx - PLAYER_AREA_X0)/X_SIZE;
	for (i=0;i<4;i++) {
		if (x < i+1) {
			clickedPlayerAreaCell.column = i;
			break;
		}
	}
	y = (hy - PLAYER_AREA_Y0)/Y_SIZE;
	for (i=0;i<5;i++) {
		if (y < i+1) {
			clickedPlayerAreaCell.row = i;
			break;
		}
	}
}

/********************************/
/* プレーヤーエリア
   クリック時のアクション       */
/********************************/
function onPlayerAreaAction()
{
	if (currentTurn == PLAYER) {
		if (selectState == ON_BOARD) {
			/* 将棋盤上のコマの選択解除 */
			document.getElementById("selected_cell").innerText
				= "Selected: ";
			document.
				getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
				style.backgroundImage = '';
		} else if (selectState == ON_PLAYER_AREA) {
			var cellNum = (4 - selectedPlayerAreaCell.row) * 4 
								+ selectedPlayerAreaCell.column;
		
			document.getElementById("my_cell_in_hand_"+cellNum).
				style.backgroundImage = '';
		}
		/* プレイヤーの持ち駒を選択 */
		selectedPlayerAreaCell.row = clickedPlayerAreaCell.row;
		selectedPlayerAreaCell.column = clickedPlayerAreaCell.column;
		
		var cellNum = (4 - selectedPlayerAreaCell.row) * 4 
							+ selectedPlayerAreaCell.column;
		
		document.getElementById("my_cell_in_hand_"+cellNum).
			style.backgroundImage = 'url(img/focus/focus_bold_b.png)';
		selectState = ON_PLAYER_AREA;
	}

	return;
}


/********************************/
/* 相手エリアのマスを特定 */
/********************************/
function detectCellOnOppArea(hx, hy)
{
	var x, y;
	var i;

	x = (hx - OPP_AREA_X0)/X_SIZE;
	for (i=0;i<4;i++) {
		if (x < i+1) {
			clickedOppAreaCell.column = i;
			break;
		}
	}
	y = (hy - OPP_AREA_Y0)/Y_SIZE;
	for (i=0;i<5;i++) {
		if (y < i+1) {
			clickedOppAreaCell.row = i;
			break;
		}
	}
}

/********************************/
/* 相手クリック時のアクション   */
/********************************/



/*****************************/
/* ターンの交代              */
/*****************************/
function changeTurn()
{
	if (currentTurn == PLAYER) {
		currentTurn = OPPONENT;
	} else {
		currentTurn = PLAYER;
	}
	printTurn();
}

/*****************************/
/* ターンの表示              */
/*****************************/
function printTurn()
{
	var playerStatus = document.getElementById("player_status");
	var oppStatus = document.getElementById("opp_status");
	
	if (currentTurn == PLAYER) {
		document.getElementById("turn").innerText = "あなたの番です";
		
		/* ターンを表すランプの透過度を変更 */
		playerStatus.style.filter = 'alpha(opacity=100)';
		playerStatus.style.MozOpacity = 1.0;
		playerStatus.style.opacity = 1.0;
		oppStatus.style.filter = 'alpha(opacity=30)';
		oppStatus.style.MozOpacity = 0.3;
		oppStatus.style.opacity = 0.3;
	} else {
		document.getElementById("turn").innerText = "相手の番です";
		
		/* ターンを表すランプの透過度を変更 */
		playerStatus.style.filter = 'alpha(opacity=30)';
		playerStatus.style.MozOpacity = 0.3;
		playerStatus.style.opacity = 0.3;
		oppStatus.style.filter = 'alpha(opacity=100)';
		oppStatus.style.MozOpacity = 1.0;
		oppStatus.style.opacity = 1.0;
	}
}


/*****************************/
/* 対局結果ダイアログの表示          */
/*****************************/
function showDialog(msg)
{
	backTarget = document.getElementById("result_back");
	backTarget.style.visibility = "visible";

	document.getElementById("result_message").innerText = msg;

	dialogTarget = document.getElementById("result_dialog");

	cx = Math.floor((window.innerWidth - 200) / 2);
	cy = Math.floor((window.innerHeight - 100) / 2);
	dialogTarget.style.left = cx + "px";
	dialogTarget.style.top = cy + "px";
	dialogTarget.style.visibility = "visible";
}

/*****************************/
/* 対局結果ダイアログを消し、
   もう一度対局を開始        */
/*****************************/
function hideDialog()
{
	backTarget = document.getElementById("result_back");
	backTarget.style.visibility = "hidden";
	document.getElementById("result_message").innerText = "";
	
	dialogTarget = document.getElementById("result_dialog");
	dialogTarget.style.visibility = "hidden";
	
	initGame();
}

