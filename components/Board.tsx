import classNames from 'classnames'
import React, { FC, useEffect } from 'react'
import {
  GameStatus,
  GameStore,
  PlayMode,
  useGameStore,
} from '../hooks/useGameStore'
import { Cell } from './Cell'

const selector = (state: GameStore) => ({
  playMode: state.playMode,
  playerNo: state.playerNo,
  p1Moves: state.p1Moves,
  p2Moves: state.p2Moves,
  cells: state.cells,
  move: state.move,
  aiMove: state.aiMove,
  gameStatus: state.gameStatus,
})

export const Board: FC = () => {
  const {
    playMode,
    playerNo,
    p1Moves,
    p2Moves,
    cells,
    move,
    aiMove,
    gameStatus,
  } = useGameStore(selector)

  useEffect(() => {
    if (
      (playMode === PlayMode.ModePvC && playerNo === 1) ||
      (playMode === PlayMode.ModeCvP && playerNo === 0)
    )
      setTimeout(() => aiMove(), 300)
  }, [playMode, playerNo, aiMove])

  const status = gameStatus(p1Moves, p2Moves)
  const blink = { blink: status === GameStatus.Tie }

  return (
    <div
      id="board"
      className="relative flex flex-wrap w-72 h-72 sm:w-96 sm:h-96 justify-center"
    >
      {status !== GameStatus.InProgress && (
        <div
          className="fixed inset-0 z-40 cursor-pointer"
          onClick={() => move(0b000000000)}
        ></div>
      )}
      <div
        className={classNames(
          'absolute w-72 sm:w-96 border-8 border-black rounded-full',
          blink
        )}
        style={{ top: '33.333333%' }}
      ></div>
      <div
        className={classNames(
          'absolute w-72 sm:w-96 border-8 border-black rounded-full',
          blink
        )}
        style={{ top: '66.666666%' }}
      ></div>
      <div
        className={classNames(
          'absolute h-72 sm:h-96 border-8 border-black rounded-full',
          blink
        )}
        style={{ left: '33.333333%' }}
      ></div>
      <div
        className={classNames(
          'absolute h-72 sm:h-96 border-8 border-black rounded-full',
          blink
        )}
        style={{ left: '66.666666%' }}
      ></div>
      {cells().map((position) => (
        <Cell key={position} position={position} />
      ))}
    </div>
  )
}
