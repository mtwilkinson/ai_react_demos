import React, { useState, useEffect } from 'react';

interface Tile {
  id: number;
  number: number;
  revealed: boolean;
  matched: boolean;
}

const Tiles: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [clicks, setClicks] = useState<number>(0);

  // Initialize tiles
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const numbers = [];
    for (let i = 1; i <= 15; i++) {
      numbers.push(i, i); // two of each
    }
    // Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    const newTiles: Tile[] = numbers.map((num, index) => ({
      id: index,
      number: num,
      revealed: false,
      matched: false,
    }));
    setTiles(newTiles);
    setSelected([]);
    setClicks(0);
  };

  const handleClick = (id: number) => {
    if (selected.length === 2 || tiles[id].revealed || tiles[id].matched) return;
    setClicks(prev => prev + 1);
    setTiles(prev => prev.map(tile =>
      tile.id === id ? { ...tile, revealed: true } : tile
    ));
    setSelected(prev => [...prev, id]);
  };

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (tiles[first].number === tiles[second].number) {
        // Match
        setTiles(prev => prev.map(tile =>
          tile.id === first || tile.id === second ? { ...tile, matched: true } : tile
        ));
        setSelected([]);
      } else {
        // No match, hide after delay
        setTimeout(() => {
          setTiles(prev => prev.map(tile =>
            tile.id === first || tile.id === second ? { ...tile, revealed: false } : tile
          ));
          setSelected([]);
        }, 1000);
      }
    }
  }, [selected, tiles]);

  return (
    <div className="p-4 flex flex-col items-center justify-items-center">
      <h1 className="text-2xl font-bold mb-4">Memory Game</h1>
      <div className="mb-4">Clicks: {clicks}</div>
      <button onClick={resetGame} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">Reset</button>
      <div className="grid grid-cols-6 gap-2 max-w-md">
        {tiles.map(tile => (
          <div
            key={tile.id}
            onClick={() => handleClick(tile.id)}
            className={`w-12 h-12 flex items-center justify-center cursor-pointer rounded ${
              tile.matched ? 'bg-green-500' : tile.revealed ? 'bg-blue-300' : 'bg-blue-500'
            }`}
          >
            {tile.revealed || tile.matched ? tile.number : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tiles;