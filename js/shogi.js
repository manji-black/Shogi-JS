

/************************************************************/
/*	Classes                                                 */
/************************************************************/
/*****************************/
/*	��̃N���X               */
/*****************************/
var Piece = function(kind, owner, promoted) {
	this.kind = kind;
	this.owner = owner;
	this.promoted = promoted;
	// �ړ��\�ȏꏊ�B
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
/* �����Ղ̃}�X�̃N���X      */
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

const BLANK_PIECE = new Piece("��", BLANK);

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

// ������̃o�b�t�@
var pieceInHand = new Array(2);
pieceInHand[PLAYER] = new Array();
pieceInHand[OPPONENT] = new Array();

// �^�[���B���̂��������_���ɁB
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
/* �΋ǂ̏�����              */
/*****************************/
function initGame()
{
	initMap();
	winner = BLANK;
	printMap();

	// �^�[���̌���
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
/* �����Չ摜�̏�����        */
/*****************************/
function initMap()
{
	var i, j;
	
	// ��s��
	map[0][0] = new Piece("����", OPPONENT, false);
	map[0][0].setArea(OPP_KYO_AREA);
	
	map[0][1] = new Piece("�j�n", OPPONENT, false);
	map[0][1].setArea(OPP_KEI_AREA);

	map[0][2] = new Piece("��", OPPONENT, false);
	map[0][2].setArea(OPP_GIN_AREA);

	map[0][3] = new Piece("��", OPPONENT, false);
	map[0][3].setArea(OPP_KIN_AREA);

	map[0][4] = new Piece("��", OPPONENT, false);
	map[0][4].setArea(OPP_OU_AREA);

	map[0][5] = new Piece("��", OPPONENT, false);
	map[0][5].setArea(OPP_KIN_AREA);

	map[0][6] = new Piece("��", OPPONENT, false);
	map[0][6].setArea(OPP_GIN_AREA);

	map[0][7] = new Piece("�j�n", OPPONENT, false);
	map[0][7].setArea(OPP_KEI_AREA);

	map[0][8] = new Piece("����", OPPONENT, false);
	map[0][8].setArea(OPP_KYO_AREA);

	// ��s��
	map[1][0] = BLANK_PIECE;

	map[1][1] = new Piece("���", OPPONENT, false);
	map[1][1].setArea(OPP_HISHA_AREA);
	
	for (j=2;j<7;j++) {
		map[1][j] = BLANK_PIECE;
	}
	
	map[1][7] = new Piece("�p", OPPONENT, false);
	map[1][7].setArea(OPP_KAKU_AREA);
	
	map[1][8] = BLANK_PIECE;

	// �O�s��
	for (j=0;j<9;j++) {
		map[2][j] = new Piece("��", OPPONENT, false);
		map[2][j].setArea(OPP_FU_AREA);
		// alert("["+0+"]["+j+"]="+ map[0][j].kind);
	}
	
	// �l�`�Z�s��
	for (i=3;i<6;i++) { 
		for (j=0;j<9;j++) {
			map[i][j] = BLANK_PIECE;
			// alert("["+i+"]["+j+"]="+map[i][j].kind);
		}
	}
	
	// ���s��
	for (j=0;j<9;j++) {
		map[6][j] = new Piece("��", PLAYER, false);
		map[6][j].setArea(MY_FU_AREA);
		// alert("["+8+"]["+j+"]="+map[8][j].kind);
	}

	for (j=0;j<9;j++) {
		map[7][j] = BLANK_PIECE;
	}

	for (j=0;j<9;j++) {
		map[8][j] = BLANK_PIECE;
	}

	// ���s��
	map[7][0] = BLANK_PIECE;

	map[7][1] = new Piece("�p", PLAYER, false);
	map[7][1].setArea(MY_KAKU_AREA);
	
	for (j=2;j<7;j++) {
		map[1][j] = BLANK_PIECE;
	}
	
	map[7][7] = new Piece("���", PLAYER, false);
	map[7][7].setArea(MY_HISHA_AREA);
	
	map[7][8] = BLANK_PIECE;

	// ��s��
	map[8][0] = new Piece("����", PLAYER, false);
	map[8][0].setArea(MY_KYO_AREA);
	
	map[8][1] = new Piece("�j�n", PLAYER, false);
	map[8][1].setArea(MY_KEI_AREA);

	map[8][2] = new Piece("��", PLAYER, false);
	map[8][2].setArea(MY_GIN_AREA);

	map[8][3] = new Piece("��", PLAYER, false);
	map[8][3].setArea(MY_KIN_AREA);

	map[8][4] = new Piece("��", PLAYER, false);
	map[8][4].setArea(MY_OU_AREA);

	map[8][5] = new Piece("��", PLAYER, false);
	map[8][5].setArea(MY_KIN_AREA);

	map[8][6] = new Piece("��", PLAYER, false);
	map[8][6].setArea(MY_GIN_AREA);

	map[8][7] = new Piece("�j�n", PLAYER, false);
	map[8][7].setArea(MY_KEI_AREA);

	map[8][8] = new Piece("����", PLAYER, false);
	map[8][8].setArea(MY_KYO_AREA);
	
	pieceInHand[PLAYER].length = 0;
	pieceInHand[OPPONENT].length = 0;


}


/*****************************/
/* �����Չ摜�̍X�V          */
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
/* ��摜�̃p�X�̎擾        */
/*****************************/
function getPieceImage(piece)
{
	imgPath = "img/piece/blank.png";
	
	if (PLAYER == piece.owner) {
		if ("��" == piece.kind) {
			imgPath = "img/piece/S/Sfu.png";
		} else if ("����" == piece.kind) {
			imgPath = "img/piece/S/Skyo.png";
		} else if ("�j�n" == piece.kind) {
			imgPath = "img/piece/S/Skei.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/S/Sgin.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/S/Skin.png";
		} else if ("���" == piece.kind) {
			imgPath = "img/piece/S/Shi.png";
		} else if ("�p" == piece.kind) {
			imgPath = "img/piece/S/Skaku.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/S/Sto.png";
		} else if ("����" == piece.kind) {
			imgPath = "img/piece/S/Snkyo.png";
		} else if ("���j" == piece.kind) {
			imgPath = "img/piece/S/Snkei.png";
		} else if ("����" == piece.kind) {
			imgPath = "img/piece/S/Sngin.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/S/Sryu.png";
		} else if ("�n" == piece.kind) {
			imgPath = "img/piece/S/Suma.png";
		} else {
			imgPath = "img/piece/S/Sou.png";
		} 
	} else if (OPPONENT == piece.owner) {
		if ("��" == piece.kind) {
			imgPath = "img/piece/G/Gfu.png";
		} else if ("����" == piece.kind) {
			imgPath = "img/piece/G/Gkyo.png";
		} else if ("�j�n" == piece.kind) {
			imgPath = "img/piece/G/Gkei.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/G/Ggin.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/G/Gkin.png";
		} else if ("���" == piece.kind) {
			imgPath = "img/piece/G/Ghi.png";
		} else if ("�p" == piece.kind) {
			imgPath = "img/piece/G/Gkaku.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/G/Gto.png";
		} else if ("����" == piece.kind) {
			imgPath = "img/piece/G/Gnkyo.png";
		} else if ("���j" == piece.kind) {
			imgPath = "img/piece/G/Gnkei.png";
		} else if ("����" == piece.kind) {
			imgPath = "img/piece/G/Gngin.png";
		} else if ("��" == piece.kind) {
			imgPath = "img/piece/G/Gryu.png";
		} else if ("�n" == piece.kind) {
			imgPath = "img/piece/G/Guma.png";
		} else {
			imgPath = "img/piece/G/Gou.png";
		} 
	}
	return imgPath;
}

/******************************/
/* ��ʃN���b�N�C�x���g�̏��� */
/******************************/
function clickEvent(event)
{
	var clickedArea = calcClickedCell(event);
	
	if (IS_BOARD_AREA == clickedArea) {
		onBoardAction();
	} else if (IS_PLAYER_AREA == clickedArea) {
		// �v���C���[�G���A�̑���
		onPlayerAreaAction();
	} else if (IS_OPP_AREA == clickedArea) {
		// ����G���A�̑���
	}
	
	return;
}


/*****************************/
/* �N���b�N���ꂽ�}�X�̓���  */
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
		/* �����Տ� */
		detectCellOnBoard(hx, hy);
		document.getElementById("clicked_cell").innerText
			= "Clicked: ( " + clickedCell.row + " , " + clickedCell.column + " )";
		return IS_BOARD_AREA;
	} else if (((PLAYER_AREA_X0 < hx) && (hx < PLAYER_AREA_X0 + X_SIZE * 4)) && 
	           ((PLAYER_AREA_Y0 < hy) && (hy < PLAYER_AREA_Y0 + Y_SIZE * 5))) {
		/* �����̎�����G���A */
		detectCellOnPlayerArea(hx, hy);
		alert("PLAYER_AREA: " + clickedPlayerAreaCell.row + ", " + clickedPlayerAreaCell.column);
		return IS_PLAYER_AREA;
	} else if (((OPP_AREA_X0 < hx) && (hx < OPP_AREA_X0 + X_SIZE * 4)) && 
	           ((OPP_AREA_Y0 < hy) && (hy < OPP_AREA_Y0 + Y_SIZE * 5))) {
		/* ����̎�����G���A */
		detectCellOnOppArea(hx, hy);
		alert("OPP_AREA: " + clickedOppAreaCell.row + ", " + clickedOppAreaCell.column);
		return IS_OPP_AREA;
	} 

	/* �N���b�N�ꏊ���G���A�O */
	return false;
}

/*****************************/
/* �����Տ�̃}�X�����      */
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
/* �����ՃN���b�N���̃A�N�V���� */
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
				alert("�����ɂ͓������܂���I");
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
			message = "���Ȃ��̏����ł��I";
		} else if (winner == OPPONENT) {
			message = "���Ȃ��̕����ł��c";
		}
		showDialog(message);
	}

	return;
}

/*****************************/
/* �ړ��\�����肷��        */
/*****************************/
function isMovable(piece, src, dest) {
	var i;

	// alert("Src: (" + src.row + ", " + src.column + "), " + 
	//		"Dest: (" + dest.row + ", " + dest.column + ") ");
	for (i=0;i<piece.area.length;i++) {
		// �ړ���̃}�X���A���̋�̈ړ��͈͓�
		if ((src.row + piece.area[i][0] == dest.row) &&
			(src.column + piece.area[i][1] == dest.column)) {
			// �j�n�Ȃ瑦�ړ�
			if (piece.kind == "�j�n") {
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
/* �N���b�N���ꂽ��̑I��    */
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
/* ��̈ړ�                  */
/*****************************/
function movePiece(row, column)
{
	// �ړ���ɋ����Ȃ�A������
	var targetPiece = map[row][column];
	if ((targetPiece.owner != currentTurn) && (targetPiece.owner != BLANK)) {
		// ����������珟��
		if (targetPiece.kind == "��") {
			winner = currentTurn;
		} else if (targetPiece.promoted) {
			targetPiece = demotePiece(targetPiece);
		}
		targetPiece.owner = currentTurn;
		pieceInHand[currentTurn].push(targetPiece);
		map[row][column] = BLANK_PIECE;
	}
	
	// ��̈ړ�
	var selectedPiece = map[selectedCell.row][selectedCell.column];
	// ����w�n�ɓ������琬��
	if (((currentTurn == PLAYER) && (row <= 2)) || 
	    ((currentTurn == OPPONENT) && (row >= 6))) {
	    if (selectedPiece.promoted == false) {
			selectedPiece = promotePiece(selectedPiece)
	    }
	}
	map[row][column] = selectedPiece;

	// �ړ��O�̋�I���̉���
	map[selectedCell.row][selectedCell.column] =BLANK_PIECE;
	document.getElementById("selected_cell").innerText
		= "Selected: ";
	selectState = UNSELECTED;
	document.
		getElementById("cell"+selectedCell.row+"-"+selectedCell.column).
			style.backgroundImage = '';
}

/********************************/
/* ����w�n�ɓ�������𐬂点�� */
/********************************/
function promotePiece(piece)
{
	var promPiece = piece;
	if (PLAYER == piece.owner) {
		if ("��" == piece.kind) {
			promPiece = new Piece("��", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("����" == piece.kind) {
			promPiece = new Piece("����", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("�j�n" == piece.kind) {
			promPiece = new Piece("���j", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("��" == piece.kind) {
			promPiece = new Piece("����", PLAYER, true);
			promPiece.setArea(MY_KIN_AREA);
		} else if ("���" == piece.kind) {
			promPiece = new Piece("��", PLAYER, true);
			promPiece.setArea(MY_RYU_AREA);
		} else if ("�p" == piece.kind) {
			promPiece = new Piece("�n", PLAYER, true);
			promPiece.setArea(MY_UMA_AREA);
		} 
	} else if (OPPONENT == piece.owner) {
		if ("��" == piece.kind) {
			promPiece = new Piece("��", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("����" == piece.kind) {
			promPiece = new Piece("����", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("�j�n" == piece.kind) {
			promPiece = new Piece("���j", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("��" == piece.kind) {
			promPiece = new Piece("����", OPPONENT, true);
			promPiece.setArea(OPP_KIN_AREA);
		} else if ("���" == piece.kind) {
			promPiece = new Piece("��", OPPONENT, true);
			promPiece.setArea(OPP_RYU_AREA);
		} else if ("�p" == piece.kind) {
			promPiece = new Piece("�n", OPPONENT, true);
			promPiece.setArea(OPP_UMA_AREA);
		} 
	}
	return promPiece;
}

/********************************/
/* ���������~�i������         */
/********************************/
function demotePiece(piece)
{
	var demPiece = piece;
	if (PLAYER == piece.owner) {
		if ("��" == piece.kind) {
			demPiece = new Piece("��", PLAYER, false);
			demPiece.setArea(MY_FU_AREA);
		} else if ("����" == piece.kind) {
			demPiece = new Piece("����", PLAYER, false);
			demPiece.setArea(MY_KYO_AREA);
		} else if ("���j" == piece.kind) {
			demPiece = new Piece("�j�n", PLAYER, false);
			demPiece.setArea(MY_KEI_AREA);
		} else if ("����" == piece.kind) {
			demPiece = new Piece("��", PLAYER, false);
			demPiece.setArea(MY_GIN_AREA);
		} else if ("��" == piece.kind) {
			demPiece = new Piece("���", PLAYER, false);
			demPiece.setArea(MY_HISHA_AREA);
		} else if ("�n" == piece.kind) {
			demPiece = new Piece("�p", PLAYER, false);
			demPiece.setArea(MY_KAKU_AREA);
		} 
	} else if (OPPONENT == piece.owner) {
		if ("��" == piece.kind) {
			demPiece = new Piece("��", OPPONENT, false);
			demPiece.setArea(OPP_FU_AREA);
		} else if ("����" == piece.kind) {
			demPiece = new Piece("����", OPPONENT, false);
			demPiece.setArea(OPP_KYO_AREA);
		} else if ("���j" == piece.kind) {
			demPiece = new Piece("�j�n", OPPONENT, false);
			demPiece.setArea(OPP_KEI_AREA);
		} else if ("����" == piece.kind) {
			demPiece = new Piece("��", OPPONENT, false);
			demPiece.setArea(OPP_GIN_AREA);
		} else if ("��" == piece.kind) {
			demPiece = new Piece("���", OPPONENT, false);
			demPiece.setArea(OPP_HISHA_AREA);
		} else if ("�n" == piece.kind) {
			demPiece = new Piece("�p", OPPONENT, false);
			demPiece.setArea(OPP_KAKU_AREA);
		} 
	}
	return demPiece;
}


/********************************/
/* �v���C���[�G���A�̃}�X����� */
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
/* �v���[���[�G���A
   �N���b�N���̃A�N�V����       */
/********************************/
function onPlayerAreaAction()
{
	if (currentTurn == PLAYER) {
		if (selectState == ON_BOARD) {
			/* �����Տ�̃R�}�̑I������ */
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
		/* �v���C���[�̎������I�� */
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
/* ����G���A�̃}�X����� */
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
/* ����N���b�N���̃A�N�V����   */
/********************************/



/*****************************/
/* �^�[���̌��              */
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
/* �^�[���̕\��              */
/*****************************/
function printTurn()
{
	var playerStatus = document.getElementById("player_status");
	var oppStatus = document.getElementById("opp_status");
	
	if (currentTurn == PLAYER) {
		document.getElementById("turn").innerText = "���Ȃ��̔Ԃł�";
		
		/* �^�[����\�������v�̓��ߓx��ύX */
		playerStatus.style.filter = 'alpha(opacity=100)';
		playerStatus.style.MozOpacity = 1.0;
		playerStatus.style.opacity = 1.0;
		oppStatus.style.filter = 'alpha(opacity=30)';
		oppStatus.style.MozOpacity = 0.3;
		oppStatus.style.opacity = 0.3;
	} else {
		document.getElementById("turn").innerText = "����̔Ԃł�";
		
		/* �^�[����\�������v�̓��ߓx��ύX */
		playerStatus.style.filter = 'alpha(opacity=30)';
		playerStatus.style.MozOpacity = 0.3;
		playerStatus.style.opacity = 0.3;
		oppStatus.style.filter = 'alpha(opacity=100)';
		oppStatus.style.MozOpacity = 1.0;
		oppStatus.style.opacity = 1.0;
	}
}


/*****************************/
/* �΋ǌ��ʃ_�C�A���O�̕\��          */
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
/* �΋ǌ��ʃ_�C�A���O�������A
   ������x�΋ǂ��J�n        */
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

