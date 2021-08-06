import { makeAutoObservable, runInAction } from 'mobx'
import { UtcTime } from './helper'
import { Dictionary, IStore } from './store'
import { supabase } from './supabaseClient'
import { gameMoveValue, gameStatus } from './types'

export interface IGameStore {
  game: Dictionary<any> | null
  gameMoves: Dictionary<any>[]
  isDraw: boolean
  isEnded: boolean
  isMyTurn: boolean
  xIsNext: boolean
  winner: Dictionary<any> | null
  gameBoardValues: gameMoveValue[]
  createGameMoveAsync: (position: number, value: string) => Promise<void>
  getGameAsync: (id: string) => Promise<void>
  getGameMovesAsync: (id: string) => Promise<void>
}

class GameStore implements IGameStore {
  game: Dictionary<any> | null = null
  gameBoardValues: gameMoveValue[] = Array(9).fill(gameMoveValue.null)
  gameMoves: Dictionary<any>[] = []
  store: IStore

  constructor(store: IStore) {
    makeAutoObservable(this)
    this.store = store
  }

  get isDraw() {
    return this.gameBoardValues.filter((e) => e !== gameMoveValue.null).length >= 9
  }

  get isEnded() {
    return this.isDraw || calculateWinner(this.gameBoardValues) != gameMoveValue.null
  }

  /**
   * from_id will have X, to_id will have O. first_move will decide who can go first.
   * */
  get isMyTurn() {
    if (!this.game) {
      return false
    }
    if (this.game.first_move == 'X') {
      if (this.game.from_id == this.store.user?.id) {
        // i go first, so my move is even move
        return !isOdd(this.gameMoves.length)
      } else {
        // i go later, so my move is odd move
        return isOdd(this.gameMoves.length)
      }
    } else {
      if (this.game.from_id == this.store.user?.id) {
        // i go later, so my move is even move
        return isOdd(this.gameMoves.length)
      } else {
        // i go first, so my move is odd move
        return !isOdd(this.gameMoves.length)
      }
    }
  }

  get xIsNext() {
    if (!this.game) {
      return false
    }
    if (this.gameMoves.length > 0) {
      return this.gameMoves[0].value != 'X'
    } else {
      return this.game.first_move == 'X'
    }
  }

  get winner() {
    if (this.gameMoves.length > 0) {
      const lastMove = this.gameMoves[0]
      return lastMove.profile
    } else {
      return null
    }
  }

  async createGameMoveAsync(position: number, value: string) {
    try {
      const { data, error } = await supabase.from('game_moves').insert([
        {
          game_id: this.game?.id,
          user_id: this.store.user?.id,
          position,
          duration: 0,
          value: value,
          turn: this.gameMoves.length,
        },
      ])
      if (error) throw error
      if (data && data.length > 0) {
        runInAction(() => {
          this.gameMoves.unshift(data)
        })
      }
      console.log('**** createGameMoveAsync: ', data)

      if (this.isEnded) {
        // Complete the game
        await supabase
          .from('games')
          .update({ status: gameStatus.COMPLETE, completed_at: UtcTime() })
          .match({ id: this.game?.id })
      }
    } catch (error) {
      console.log('createGameMoveAsync: ', error)
    }
  }

  async getGameAsync(id: string) {
    try {
      const { error, data } = await supabase
        .from('games')
        .select('*, from:from_id(id, avatar_url, username),to:to_id(id, avatar_url, username)')
        .eq('id', id)
      if (error) throw error
      if (data && data.length > 0) {
        runInAction(() => {
          this.game = data[0]
        })
      }
      console.log('**** getGameAsync: ', data)
    } catch (error) {
      console.log('getGameAsync: ', error)
    }
  }

  async getGameMovesAsync(id: string) {
    try {
      const { error, data } = await supabase
        .from('game_moves')
        .select('*, profile:user_id(id, avatar_url, username)')
        .eq('game_id', id)
      if (error) throw error
      const _gameMoves =
        data?.sort((a, b) => {
          const date1 = new Date(a.inserted_at)
          const date2 = new Date(b.inserted_at)
          return date1 < date2 ? 1 : -1
        }) ?? []
      const _gameBoardValues: gameMoveValue[] = []
      for (let i = 0; i < 10; i++) {
        const found = _gameMoves.find((x) => x.position == i)
        _gameBoardValues.push(found?.value ?? gameMoveValue.null)
      }
      runInAction(() => {
        this.gameMoves = _gameMoves
        this.gameBoardValues = _gameBoardValues
      })
      console.log('**** getGameMovesAsync: ', _gameMoves)
    } catch (error) {
      console.log('getGameMovesAsync: ', error)
    }
  }
}
export default GameStore

function isOdd(num: number) {
  return num % 2 == 1
}

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
