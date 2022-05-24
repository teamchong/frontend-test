import classNames from 'classnames'
import React, { FC, useEffect } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { GameStatus, PlayMode, GameStore } from '../types'
import { aiMove } from '../utils/aiMove'
import { cells } from '../utils/cells'
import { gameStatus } from '../utils/gameStatus'
import { move } from '../utils/move'
import { Cell } from './Cell'

const selector = (state: GameStore) => ({
  playMode: state.playMode,
  playerNo: state.playerNo,
  p1Moves: state.p1Moves,
  p2Moves: state.p2Moves,
  dispatch: state.dispatch,
})

export const Board: FC = () => {
  const { playMode, playerNo, p1Moves, p2Moves, dispatch } =
    useGameStore(selector)

  useEffect(() => {
    if (
      (playMode === PlayMode.ModePvC && playerNo === 1) ||
      (playMode === PlayMode.ModeCvP && playerNo === 0)
    )
      setTimeout(
        () => aiMove(playMode, playerNo, p1Moves, p2Moves, dispatch),
        300
      )
  }, [dispatch, p1Moves, p2Moves, playMode, playerNo])

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
          onClick={() => move(dispatch, 0b000000000)}
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
