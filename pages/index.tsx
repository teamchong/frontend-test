import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Board } from '../components/Board'
import { GamePanel } from '../components/GamePanel'
import { MenuBar } from '../components/MenuBar'
import { useGameStore } from '../hooks/useGameStore'
import { useRoom } from '../hooks/useRoom'
import { GameStore } from '../types'
import { load } from '../utils/load'

const selector = (state: GameStore) => ({
  dispatch: state.dispatch,
})

const Home: NextPage = () => {
  const { dispatch } = useGameStore(selector)
  useRoom()
  return (
    <div className={styles.container}>
      <Head>
        <title>Tic-Tac-Toe</title>
        <meta name="description" content="Tic-Tac-Toe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col flex-wrap min-h-screen place-content-center place-items-center">
        <button
          type="button"
          onClick={() => load(dispatch, '0_0_0_0_0_0_0_0_0_0')}
          className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 rounded-full text-xs py-2 m-2.5 px-2.5 top-0 right-0 absolute z-50"
        >
          reset
        </button>
        <MenuBar />
        <Board />
        <GamePanel />
      </main>
    </div>
  )
}

export default Home
