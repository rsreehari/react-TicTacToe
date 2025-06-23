import React, { useState } from 'react';
import './App.css';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [playerX, setPlayerX] = useState('Player X');
  const [playerO, setPlayerO] = useState('Player O');
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [darkMode, setDarkMode] = useState(false);

  const currentSquares = history[step];
  const winnerData = calculateWinner(currentSquares);
  const winner = winnerData?.winner;
  const winningLine = winnerData?.line;

  const isDraw = !winner && currentSquares.every(Boolean);
  const status = winner
    ? `Winner: ${winner === 'X' ? playerX : playerO}`
    : isDraw
    ? "It's a draw!"
    : `Turn: ${xIsNext ? playerX : playerO}`;

  function handleClick(i) {
    if (currentSquares[i] || winner) return;
    const newSquares = currentSquares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';

    const newHistory = history.slice(0, step + 1).concat([newSquares]);
    setHistory(newHistory);
    setStep(newHistory.length - 1);
    setXIsNext(!xIsNext);

    const result = calculateWinner(newSquares);
    if (result?.winner) {
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    }
  }

  function jumpTo(move) {
    setStep(move);
    setXIsNext(move % 2 === 0);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setXIsNext(true);
  }

  function toggleMode() {
    setDarkMode(prev => !prev);
  }

  return (
    <div className={darkMode ? 'game dark' : 'game'}>
      <h1>Tic-Tac-Toe</h1>
      <div className="players">
        <input value={playerX} onChange={e => setPlayerX(e.target.value)} placeholder="Player X Name" />
        <input value={playerO} onChange={e => setPlayerO(e.target.value)} placeholder="Player O Name" />
      </div>
      <div className="scoreboard">
        <span>{playerX} (X): {scores.X}</span>
        <span>{playerO} (O): {scores.O}</span>
      </div>
      <div className="status">{status}</div>
      <div className="board">
        {currentSquares.map((val, i) => (
          <button
            key={i}
            className={`square ${winningLine?.includes(i) ? 'highlight' : ''}`}
            onClick={() => handleClick(i)}
          >
            {val}
          </button>
        ))}
      </div>
      <button className="restart" onClick={restartGame}>Restart</button>
      <button className="mode" onClick={toggleMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="history">
        {history.map((_, move) => (
          <button key={move} onClick={() => jumpTo(move)}>
            {move === 0 ? 'Go to start' : `Go to move #${move}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default App;
