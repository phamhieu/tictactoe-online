import { AuthSession, User } from '@supabase/supabase-js'
import { makeAutoObservable, runInAction } from 'mobx'
import { createContext } from 'react'
import { supabase } from './supabaseClient'

export const StoreContext = createContext<IStore>(undefined!)

export interface Dictionary<T> {
  [Key: string]: T
}

interface IStore {
  onlineCount: number
  profiles: Dictionary<any>[]
  session: AuthSession | null
  sortedProfiles: Dictionary<any>[]
  user: User | null
  getProfileAsync: (id: string) => void
  getProfilesAsync: () => void
  updatePresenceAsync: () => void
  updatePresenceStatus: (id: string, status: boolean) => void
}

class Store implements IStore {
  session: AuthSession | null = null
  user: User | null = null
  profiles: Dictionary<any>[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get sortedProfiles() {
    return this.profiles.slice().sort((a, b) => {
      return b.status - a.status || a.username.localeCompare(b.username)
    })
  }

  get onlineCount() {
    return this.profiles.filter((x) => x.status).length
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
        this.profiles = temp.filter((x) => x.id != this.user?.id)
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
