// Engine do jogo de xadrez
export class ChessEngine {
  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.selectedPiece = null;
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.isCheck = false;
    this.isCheckmate = false;
    this.kingMoved = { white: false, black: false };
    this.rookMoved = { 
      white: { left: false, right: false }, 
      black: { left: false, right: false } 
    };
  }

  initializeBoard() {
    // Inicializa o tabuleiro 8x8 com as peças
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Peças brancas
    board[7] = [
      { type: 'rook', color: 'white', hasMoved: false },
      { type: 'knight', color: 'white', hasMoved: false },
      { type: 'bishop', color: 'white', hasMoved: false },
      { type: 'queen', color: 'white', hasMoved: false },
      { type: 'king', color: 'white', hasMoved: false },
      { type: 'bishop', color: 'white', hasMoved: false },
      { type: 'knight', color: 'white', hasMoved: false },
      { type: 'rook', color: 'white', hasMoved: false },
    ];
    board[6] = Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white', hasMoved: false }));
    
    // Peças pretas
    board[0] = [
      { type: 'rook', color: 'black', hasMoved: false },
      { type: 'knight', color: 'black', hasMoved: false },
      { type: 'bishop', color: 'black', hasMoved: false },
      { type: 'queen', color: 'black', hasMoved: false },
      { type: 'king', color: 'black', hasMoved: false },
      { type: 'bishop', color: 'black', hasMoved: false },
      { type: 'knight', color: 'black', hasMoved: false },
      { type: 'rook', color: 'black', hasMoved: false },
    ];
    board[1] = Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black', hasMoved: false }));
    
    return board;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece || piece.color !== this.currentPlayer) return false;
    
    const targetPiece = this.board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;

    let isValid = false;
    switch (piece.type) {
      case 'pawn':
        isValid = this.isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color);
        break;
      case 'rook':
        isValid = this.isValidRookMove(fromRow, fromCol, toRow, toCol);
        break;
      case 'knight':
        isValid = this.isValidKnightMove(fromRow, fromCol, toRow, toCol);
        break;
      case 'bishop':
        isValid = this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
        break;
      case 'queen':
        isValid = this.isValidQueenMove(fromRow, fromCol, toRow, toCol);
        break;
      case 'king':
        isValid = this.isValidKingMove(fromRow, fromCol, toRow, toCol);
        break;
      default:
        return false;
    }
    
    if (!isValid) return false;
    
    // Verificar se o movimento deixaria o rei em xeque
    return !this.wouldMoveResultInCheck(fromRow, fromCol, toRow, toCol);
  }

  isValidPawnMove(fromRow, fromCol, toRow, toCol, color) {
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Movimento para frente
    if (fromCol === toCol) {
      if (toRow === fromRow + direction && !this.board[toRow][toCol]) {
        return true;
      }
      // Primeiro movimento duplo
      if (fromRow === startRow && toRow === fromRow + 2 * direction && 
          !this.board[toRow][toCol] && !this.board[fromRow + direction][toCol]) {
        return true;
      }
    }
    
    // Captura diagonal
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
      return this.board[toRow][toCol] !== null;
    }
    
    return false;
  }

  isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return this.isPathClear(fromRow, fromCol, toRow, toCol);
  }

  isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
    return this.isPathClear(fromRow, fromCol, toRow, toCol);
  }

  isValidQueenMove(fromRow, fromCol, toRow, toCol) {
    return this.isValidRookMove(fromRow, fromCol, toRow, toCol) || 
           this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
  }

  isValidKingMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    
    // Movimento normal do rei
    if (rowDiff <= 1 && colDiff <= 1) {
      return true;
    }
    
    // Roque
    if (rowDiff === 0 && colDiff === 2) {
      return this.canCastle(fromRow, fromCol, toRow, toCol);
    }
    
    return false;
  }

  canCastle(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    
    // Verificar se o rei já se moveu
    if (piece.hasMoved) return false;
    
    // Verificar se está em xeque
    if (this.isKingInCheck(piece.color)) return false;
    
    // Roque do lado do rei (kingside)
    if (toCol === fromCol + 2) {
      const rook = this.board[fromRow][7];
      if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
      
      // Verificar se o caminho está livre
      if (!this.isPathClear(fromRow, fromCol, fromRow, 7)) return false;
      
      // Verificar se passa por casas atacadas
      for (let col = fromCol; col <= toCol; col++) {
        if (this.isSquareUnderAttack(fromRow, col, piece.color)) return false;
      }
      
      return true;
    }
    
    // Roque do lado da rainha (queenside)
    if (toCol === fromCol - 2) {
      const rook = this.board[fromRow][0];
      if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
      
      // Verificar se o caminho está livre
      if (!this.isPathClear(fromRow, fromCol, fromRow, 0)) return false;
      
      // Verificar se passa por casas atacadas
      for (let col = toCol; col <= fromCol; col++) {
        if (this.isSquareUnderAttack(fromRow, col, piece.color)) return false;
      }
      
      return true;
    }
    
    return false;
  }

  isSquareUnderAttack(row, col, byColor) {
    // Verifica se uma casa está sendo atacada por peças de uma determinada cor
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece && piece.color !== byColor) {
          // Temporariamente simular que é o turno do oponente
          const originalPlayer = this.currentPlayer;
          this.currentPlayer = piece.color;
          
          const canAttack = this.isValidMoveIgnoringCheck(i, j, row, col);
          
          this.currentPlayer = originalPlayer;
          
          if (canAttack) return true;
        }
      }
    }
    return false;
  }

  isValidMoveIgnoringCheck(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece) return false;
    
    const targetPiece = this.board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;

    switch (piece.type) {
      case 'pawn':
        return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, piece.color);
      case 'rook':
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol);
      case 'knight':
        return this.isValidKnightMove(fromRow, fromCol, toRow, toCol);
      case 'bishop':
        return this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
      case 'queen':
        return this.isValidQueenMove(fromRow, fromCol, toRow, toCol);
      case 'king':
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
      default:
        return false;
    }
  }

  findKing(color) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = this.board[i][j];
        if (piece && piece.type === 'king' && piece.color === color) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }

  isKingInCheck(color) {
    const kingPos = this.findKing(color);
    if (!kingPos) return false;
    return this.isSquareUnderAttack(kingPos.row, kingPos.col, color);
  }

  wouldMoveResultInCheck(fromRow, fromCol, toRow, toCol) {
    // Simular o movimento
    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];
    
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    
    const inCheck = this.isKingInCheck(piece.color);
    
    // Desfazer o movimento
    this.board[fromRow][fromCol] = piece;
    this.board[toRow][toCol] = capturedPiece;
    
    return inCheck;
  }

  isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  }

  makeMove(fromRow, fromCol, toRow, toCol, promotionPiece = null) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];
    
    // Realizar o movimento
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    piece.hasMoved = true;
    
    // Roque - mover a torre também
    if (piece.type === 'king' && Math.abs(fromCol - toCol) === 2) {
      if (toCol === fromCol + 2) {
        // Roque do lado do rei
        const rook = this.board[fromRow][7];
        this.board[fromRow][5] = rook;
        this.board[fromRow][7] = null;
        if (rook) rook.hasMoved = true;
      } else if (toCol === fromCol - 2) {
        // Roque do lado da rainha
        const rook = this.board[fromRow][0];
        this.board[fromRow][3] = rook;
        this.board[fromRow][0] = null;
        if (rook) rook.hasMoved = true;
      }
    }
    
    // Promoção de peão
    if (piece.type === 'pawn') {
      const promotionRow = piece.color === 'white' ? 0 : 7;
      if (toRow === promotionRow) {
        piece.type = promotionPiece || 'queen'; // Promove para rainha por padrão
      }
    }
    
    // Verificar se capturou o rei (não deve acontecer com xeque-mate adequado)
    if (capturedPiece && capturedPiece.type === 'king') {
      this.gameOver = true;
      this.winner = this.currentPlayer;
    }
    
    // Salvar no histórico
    this.moveHistory.push({ 
      fromRow, 
      fromCol, 
      toRow, 
      toCol, 
      piece: { ...piece }, 
      capturedPiece: capturedPiece ? { ...capturedPiece } : null,
      boardState: this.board.map(row => row.map(p => p ? { ...p } : null))
    });
    
    // Trocar jogador
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    
    // Verificar xeque e xeque-mate
    this.isCheck = this.isKingInCheck(this.currentPlayer);
    const hasNoMoves = this.hasNoLegalMoves(this.currentPlayer);
    
    if (hasNoMoves) {
      this.gameOver = true;
      if (this.isCheck) {
        // Xeque-mate: jogador que fez o movimento vence
        this.isCheckmate = true;
        this.winner = this.currentPlayer === 'white' ? 'black' : 'white';
      } else {
        // Afogamento (stalemate): empate
        this.isCheckmate = false;
        this.winner = 'draw';
      }
    }
    
    return true;
  }

  hasNoLegalMoves(color) {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = this.board[fromRow][fromCol];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  undoMove() {
    if (this.moveHistory.length === 0) return false;
    
    const lastMove = this.moveHistory.pop();
    
    // Restaurar o estado do tabuleiro
    if (lastMove.boardState) {
      this.board = lastMove.boardState.map(row => row.map(p => p ? { ...p } : null));
    }
    
    // Trocar jogador de volta
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    
    // Resetar estados de jogo
    this.isCheck = this.isKingInCheck(this.currentPlayer);
    this.isCheckmate = false;
    this.gameOver = false;
    this.winner = null;
    
    return true;
  }

  getMoveNotation(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece) return '';
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    const pieceSymbol = piece.type === 'knight' ? 'N' : piece.type[0].toUpperCase();
    const from = files[fromCol] + ranks[fromRow];
    const to = files[toCol] + ranks[toRow];
    
    if (piece.type === 'pawn') {
      return to;
    }
    
    return pieceSymbol + from + '-' + to;
  }

  getPossibleMoves(row, col) {
    const moves = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.isValidMove(row, col, i, j)) {
          moves.push({ row: i, col: j });
        }
      }
    }
    return moves;
  }

  checkGameState() {
    // Verificar o estado do jogo no início de cada turno
    this.isCheck = this.isKingInCheck(this.currentPlayer);
    const hasNoMoves = this.hasNoLegalMoves(this.currentPlayer);
    
    if (hasNoMoves) {
      this.gameOver = true;
      if (this.isCheck) {
        // Xeque-mate
        this.isCheckmate = true;
        this.winner = this.currentPlayer === 'white' ? 'black' : 'white';
      } else {
        // Afogamento (empate)
        this.isCheckmate = false;
        this.winner = 'draw';
      }
    }
    
    return {
      isCheck: this.isCheck,
      isCheckmate: this.isCheckmate,
      gameOver: this.gameOver,
      winner: this.winner
    };
  }

  resetGame() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.selectedPiece = null;
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
    this.isCheck = false;
    this.isCheckmate = false;
    this.kingMoved = { white: false, black: false };
    this.rookMoved = { 
      white: { left: false, right: false }, 
      black: { left: false, right: false } 
    };
  }
}
