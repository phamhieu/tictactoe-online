import { AuthSession, User } from '@supabase/supabase-js'
import { makeAutoObservable, runInAction } from 'mobx'
import { createContext } from 'react'
import { supabase } from './supabaseClient'
import { gameStatus } from './types'

export const StoreContext = createContext<IStore>(undefined!)

export interface Dictionary<T> {
  [Key: string]: T
}

let store: Store
export function initializeStore() {
  const _store = store ?? new Store()

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export interface IStore {
  currentGame: Dictionary<any> | null
  games: Dictionary<any>[]
  gameInvitations: Dictionary<any>[]
  onlineCount: number
  profiles: Dictionary<any>[]
  session: AuthSession | null
  sortedProfiles: Dictionary<any>[]
  user: User | null
  cancelInvitation: (id: string) => Promise<void>
  createNewGameAsync: (userId: string) => Promise<void>
  getGamesAsync: () => Promise<void>
  getProfileAsync: (id: string) => Promise<void>
  getProfilesAsync: () => Promise<void>
  replyInvitation: (id: string, accepted: boolean) => Promise<void>
  updateGame: (id: string, value: Dictionary<any>) => void
  updatePresenceAsync: () => Promise<void>
  updatePresenceStatus: (id: string, status: boolean) => void
}

class Store implements IStore {
  currentGame: Dictionary<any> | null = null
  games: Dictionary<any>[] = []
  profiles: Dictionary<any>[] = []
  session: AuthSession | null = null
  user: User | null = null

  constructor() {
    console.log('***** Store constructor')
    makeAutoObservable(this)
  }

  get gameInvitations() {
    return this.games.filter((x) => x.to_id == this.user?.id)
  }

  get onlineCount() {
    return this.profiles.filter((x) => x.status).length
  }

  get sortedProfiles() {
    return this.profiles.slice().sort((a, b) => {
      return b.status - a.status || a.username.localeCompare(b.username)
    })
  }

  async cancelInvitation(id: string) {
    try {
      const { data, error } = await supabase
        .from('games')
        .update({ status: gameStatus.CANCEL }, { returning: 'minimal' })
        .match({ id })
      if (error) throw error
      runInAction(() => {
        this.currentGame = null
        this.games = this.games.filter((x) => x.id != id)
      })
      console.log('**** cancelInvitation: ', data)
    } catch (error) {
      console.log('cancelInvitation: ', error)
    }
  }

  async createNewGameAsync(userId: string) {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([
          { from_id: this.user?.id, to_id: userId, first_move: Math.random() < 0.5 ? 'X' : 'O' },
        ])
      if (error) throw error
      if (data && data.length > 0) {
        runInAction(() => {
          this.currentGame = data[0]
          this.games.push(data)
        })
      }
      console.log('**** createNewGameAsync: ', data)
    } catch (error) {
      console.log('createNewGameAsync: ', error)
    }
  }

  async replyInvitation(id: string, accepted: boolean) {
    try {
      const { data, error } = await supabase
        .from('games')
        .update({ status: accepted ? gameStatus.READY : gameStatus.DENY, replied_at: UtcTime() })
        .match({ id })
      if (error) throw error
      if (data && data.length > 0) {
        let gameIndex = this.games.findIndex((x) => x.id === id)
        if (accepted) {
          runInAction(() => {
            this.games.splice(gameIndex, 1, data[0])
            this.currentGame = data[0]
          })
        } else {
          runInAction(() => {
            this.games = this.games.filter((x) => x.id != id)
          })
        }
      }
      console.log('**** replyInvitation: ', data)
    } catch (error) {
      console.log('replyInvitation: ', error)
    }
  }

  async getGamesAsync() {
    try {
      const { error, data } = await supabase
        .from('games')
        .select()
        .or(`from_id.eq.${this.user?.id},to_id.eq.${this.user?.id}`)
        .in('status', [gameStatus.WAITING, gameStatus.READY])
      if (error) throw error
      const temp = data ?? []
      runInAction(() => {
        this.games = temp.sort((a, b) => {
          return b.inserted_at - a.inserted_at
        })
        this.currentGame = temp.find(
          (x) => x.status == gameStatus.READY || x.from_id == this.user?.id
        )
      })
      console.log('**** getGamesAsync: ', data)
    } catch (error) {
      console.log('getGamesAsync: ', error)
    }
  }

  async getProfilesAsync() {
    try {
      const { error, data } = await supabase
        .from('profiles')
        .select('id, avatar_url, username, presence_status(status)')
      if (error) throw error
      const temp =
        data?.map((x) => {
          return { ...x, status: x.presence_status[0].status }
        }) ?? []
      runInAction(() => {
        this.profiles = temp
      })
      console.log('**** getProfilesAsync: ', temp)
    } catch (error) {
      console.log('getProfilesAsync: ', error)
    }
  }

  async getProfileAsync(id: string) {
    try {
      const { error, data } = await supabase
        .from('profiles')
        .select('id, avatar_url, username, presence_status(status)')
        .eq('id', id)
        .maybeSingle()
      if (error) throw error
      if (data) {
        const temp = { ...data, status: data.presence_status[0].status }
        runInAction(() => {
          this.profiles.push(temp)
        })
        console.log('**** getProfileAsync: ', temp)
      }
    } catch (error) {
      console.log('getProfileAsync: ', error)
    }
  }

  async updatePresenceAsync() {
    if (!this.user?.id) return
    try {
      const { error } = await supabase
        .from('presence')
        .update({ updated_at: UtcTime() }, { returning: 'minimal' })
        .match({ id: this.user?.id })
      if (error) throw error
    } catch (error) {
      console.log('updatePresenceAsync: ', error)
    }
  }

  updateGame = (id: string, value: Dictionary<any>) => {
    const found = this.games.find((x) => x.id == id)
    if (found) {
      found.status = value.status
      found.replied_at = value.replied_at
    }
    if (this.currentGame && this.currentGame.id == id) {
      this.currentGame.status = value.status
      this.currentGame.replied_at = value.replied_at
    }
  }

  updatePresenceStatus = (id: string, status: boolean) => {
    const found = this.profiles.find((x) => x.id == id)
    if (found) {
      found.status = status
    }
  }

  setSession(value: AuthSession | null) {
    console.log('*** setSession: ', value)
    this.session = value
    this.user = value?.user ?? null
  }
}
export default Store

function UtcTime() {
  return new Date().toISOString()
}
