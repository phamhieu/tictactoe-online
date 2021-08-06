import { AuthSession, User } from '@supabase/supabase-js'
import { makeAutoObservable, runInAction } from 'mobx'
import { createContext } from 'react'
import { supabase } from './supabaseClient'

export const StoreContext = createContext<IStore>(undefined!)

export interface Dictionary<T> {
  [Key: string]: T
}

interface IStore {
  currentGame: Dictionary<any> | null
  games: Dictionary<any>[]
  gameInvitations: Dictionary<any>[]
  onlineCount: number
  profiles: Dictionary<any>[]
  session: AuthSession | null
  sortedProfiles: Dictionary<any>[]
  user: User | null
  createNewGameAsync: (userId: string) => Promise<void>
  getGamesAsync: () => Promise<void>
  getProfileAsync: (id: string) => Promise<void>
  getProfilesAsync: () => Promise<void>
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

  async getGamesAsync() {
    try {
      const { error, data } = await supabase
        .from('games')
        .select()
        .or(`from_id.eq.${this.user?.id},to_id.eq.${this.user?.id}`)
        .in('status', ['WAITING', 'READY'])
      if (error) throw error
      const temp = data ?? []
      runInAction(() => {
        this.games = temp.sort((a, b) => {
          return b.inserted_at - a.inserted_at
        })
        this.currentGame = temp.find((x) => x.from_id == this.user?.id)
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
    console.log('**** updatePresenceAsync')
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

  updatePresenceStatus = (id: string, status: boolean) => {
    const found = this.profiles.find((x) => x.id == id)
    if (found) {
      found.status = status
    }
  }

  setSession(value: AuthSession | null) {
    this.session = value
    this.user = value?.user ?? null
  }
}
export default Store

function UtcTime() {
  return new Date().toISOString()
}
