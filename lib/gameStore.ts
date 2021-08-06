import { makeAutoObservable, runInAction } from 'mobx'
import { Dictionary, IStore } from './store'
import { supabase } from './supabaseClient'
import { gameMoveValue } from './types'

export interface IGameStore {
  game: Dictionary<any> | null
  gameMoves: Dictionary<any>[]
  isMyTurn: boolean
  xIsNext: boolean
  gameBoardValues: gameMoveValue[]
  createGameMoveAsync: (position: number, value: string) => Promise<void>
  getGameAsync: (id: string) => Promise<void>
  getGameMovesAsync: (id: string) => Promise<void>
}

class GameStore implements IGameStore {
  game: Dictionary<any> | null = null
  gameMoves: Dictionary<any>[] = []
  store: IStore

  constructor(store: IStore) {
    makeAutoObservable(this)
    this.store = store
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

  get gameBoardValues() {
    const values = []
    for (let i = 0; i < 10; i++) {
      const found = this.gameMoves.find((x) => x.position == i)
      values.push(found?.value ?? gameMoveValue.null)
    }
    return values
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
        .select('*, profiles(id, avatar_url, username)')
        .eq('game_id', id)
      if (error) throw error
      const temp =
        data?.sort((a, b) => {
          const date1 = new Date(a.inserted_at)
          const date2 = new Date(b.inserted_at)
          return date1 < date2 ? 1 : -1
        }) ?? []
      runInAction(() => {
        this.gameMoves = temp
      })
      console.log('**** getGameMovesAsync: ', temp)
    } catch (error) {
      console.log('getGameMovesAsync: ', error)
    }
  }
}
export default GameStore

function isOdd(num: number) {
  return num % 2 == 1
}
