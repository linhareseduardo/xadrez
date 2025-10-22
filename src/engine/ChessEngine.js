// Engine do jogo de xadrez
export class ChessEngine {
  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.selectedPiece = null;
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
  }

  initializeBoard() {
    // Inicializa o tabuleiro 8x8 com as peças
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Peças brancas
    board[7] = [
      { type: 'rook', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'rook', color: 'white' },
    ];
    board[6] = Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' }));
    
    // Peças pretas
    board[0] = [
      { type: 'rook', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'rook', color: 'black' },
    ];
    board[1] = Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' }));
    
    return board;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece || piece.color !== this.currentPlayer) return false;
    
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
        return this.isValidKingMove(fromRow, fromCol, toRow, toCol);
      default:
        return false;
    }
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
    return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
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

  makeMove(fromRow, fromCol, toRow, toCol) {
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return false;
    }

    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];
    
    // Realizar o movimento
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    
    // Verificar se capturou o rei
    if (capturedPiece && capturedPiece.type === 'king') {
      this.gameOver = true;
      this.winner = this.currentPlayer;
    }
    
    // Trocar jogador
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    
    this.moveHistory.push({ fromRow, fromCol, toRow, toCol, piece, capturedPiece });
    
    return true;
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

  resetGame() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.selectedPiece = null;
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
  }
}
