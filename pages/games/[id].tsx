import * as React from 'react'
import { observer } from 'mobx-react-lite'
import Layout from '../../components/Layout/Layout'
import Board from '../../components/Game/Board'
import ProfileHeading from '../../components/Layout/ProfileHeading'

export default function GameBoard() {
  return (
    <Layout>
      <ProfileHeading />
      <div className="max-w-sm max-h-96 w-screen h-screen m-auto">
        <Board />
      </div>
    </Layout>
  )
}
