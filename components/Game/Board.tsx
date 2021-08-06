import * as React from 'react'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction, useState } from 'react'
import Square from './Square'
import { gameMoveValue } from '../../lib/types'
import { GameStoreContext } from '../../pages/games/[id]'
import { observer } from 'mobx-react-lite'

const Board: React.FC = observer(() => {
  const _gameStore = React.useContext(GameStoreContext)
  const isMyTurn = _gameStore?.isMyTurn
  const [squares, setSquares]: [
    squares: gameMoveValue[],
    setSquares: Dispatch<SetStateAction<any[]>>
  ] = useState(Array(9).fill(gameMoveValue.null))

  React.useEffect(() => {
    setSquares(_gameStore.gameBoardValues)
  }, [_gameStore.gameBoardValues])

  const winner = calculateWinner(squares)
  if (winner !== gameMoveValue.null) {
    console.log(`${winner} wins!`)
  } else if (squares.filter((e) => e !== gameMoveValue.null).length >= 9) {
    console.log('Draw!')
  }

  async function handleClick(i: number) {
    if (!isMyTurn) {
      toast.error("It's not your turn. Please wait!")
      return
    } else {
      const currentSquares = squares.slice()
      const value = _gameStore.xIsNext ? gameMoveValue.X : gameMoveValue.O
      currentSquares[i] = value
      setSquares(currentSquares)

      await _gameStore?.createGameMoveAsync(i, value)

      if (
        calculateWinner(currentSquares) !== gameMoveValue.null ||
        currentSquares[i] !== gameMoveValue.null
      ) {
        console.log(currentSquares[i])
        return
      }
    }
  }

  function renderSquare(i: number) {
    return <Square value={squares[i]} position={i} onClick={() => handleClick(i)} />
  }

  return (
    <div className="grid grid-rows-3 grid-cols-3 h-full w-full border-2 border-solid border-gray-400">
      {renderSquare(0)}
      {renderSquare(1)}
      {renderSquare(2)}
      {renderSquare(3)}
      {renderSquare(4)}
      {renderSquare(5)}
      {renderSquare(6)}
      {renderSquare(7)}
      {renderSquare(8)}
    </div>
  )
})

export default Board

function calculateWinner(squares: gameMoveValue[]) {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < winningPatterns.length; i++) {
    const [a, b, c] = winningPatterns[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return gameMoveValue.null
}
