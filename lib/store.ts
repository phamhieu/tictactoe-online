import { AuthSession, User } from '@supabase/supabase-js'
import { makeAutoObservable } from 'mobx'
import { createContext } from 'react'
import { supabase } from './supabaseClient'

export const StoreContext = createContext<IStore>(undefined!)

interface IStore {
  session: AuthSession | null
  user: User | null
  setSession: (value: AuthSession | null) => void
  setUser: (value: User | null) => void
}

class Store implements IStore {
  session: AuthSession | null = null
  user: User | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setSession(value: AuthSession | null) {
    this.session = value
    this.user = value?.user ?? null
  }

  setUser(value: User | null) {
    this.user = value
  }
}
export default Store
