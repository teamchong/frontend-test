import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Board } from '../components/Board'
import { GamePanel } from '../components/GamePanel'
import { MenuBar } from '../components/MenuBar'
import { GameStore, useGameStore } from '../hooks/useGameStore'
import { useEffect } from 'react'

const selector = (state: GameStore) => ({
  load: state.load,
})

const Home: NextPage = () => {
  const { load } = useGameStore(selector)
  useEffect(() => load(), [load])
  return (
    <div className={styles.container}>
      <Head>
        <title>Tic-Tac-Toe</title>
        <meta name="description" content="Tic-Tac-Toe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col flex-wrap min-h-screen place-content-center place-items-center">
        <MenuBar />
        <Board />

        <GamePanel />
      </main>
    </div>
  )
}

export default Home
