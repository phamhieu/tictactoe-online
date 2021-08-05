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
  getProfilesAsync: () => void
  updatePresenceAsync: () => void
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

  getProfilesAsync = async () => {
    try {
      const { error, data } = await supabase
        .from('profiles')
        .select('id, avatar_url, username, presence(status)')
      if (error) throw error
      const _temp =
        data?.map((x) => {
          return { ...x, status: x.presence[0].status }
        }) ?? []
      runInAction(() => {
        this.profiles = _temp
      })
      console.log('**** getProfilesAsync: ', _temp)
    } catch (error) {
      console.log('getProfilesAsync: ', error)
    }
  }

  updatePresenceAsync = async () => {
    console.log('**** updatePresenceAsync')
    try {
      const { error } = await supabase
        .from('presence')
        .update({ status: true, updated_at: UtcTime() }, { returning: 'minimal' })
        .match({ id: this.user?.id })
      if (error) throw error
    } catch (error) {
      console.log('updatePresenceAsync: ', error)
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
