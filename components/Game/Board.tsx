import * as React from 'react'
import toast from 'react-hot-toast'
import Square from './Square'
import { gameMoveValue } from '../../lib/types'
import { GameStoreContext } from '../../pages/games/[id]'
import { observer } from 'mobx-react-lite'
import { runInAction } from 'mobx'

const Board: React.FC = observer(() => {
  const _gameStore = React.useContext(GameStoreContext)
  const isMyTurn = _gameStore?.isMyTurn
  const isEnded = _gameStore?.isEnded

  async function handleClick(i: number) {
    if (!isMyTurn) {
      toast.error("It's not your turn. Please wait!")
    } else {
      const value = _gameStore.xIsNext ? gameMoveValue.X : gameMoveValue.O
      runInAction(() => {
        _gameStore.gameBoardValues[i] = value
      })
      await _gameStore?.createGameMoveAsync(i, value)
    }
  }

  function renderSquare(i: number) {
    return (
      <Square
        value={_gameStore.gameBoardValues[i]}
        onClick={isEnded ? undefined : () => handleClick(i)}
      />
    )
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
