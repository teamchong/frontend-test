import classNames from 'classnames'
import React, { FC } from 'react'
import { useGameStore } from '../hooks/useGameStore'
import { GameStatus, PlayMode, GameStore } from '../types'
import { gameStatus } from '../utils/gameStatus'

const selector = (state: GameStore) => ({
  playMode: state.playMode,
  playerNo: state.playerNo,
  pvcRecords: state.pvcRecords,
  pvpRecords: state.pvpRecords,
  p1Moves: state.p1Moves,
  p2Moves: state.p2Moves,
})

export const GamePanel: FC = () => {
  const { playMode, playerNo, pvcRecords, pvpRecords, p1Moves, p2Moves } =
    useGameStore(selector)

  const status = gameStatus(p1Moves, p2Moves)
  const isTie = status === GameStatus.Tie
  const [p1Victory, p2Victory, tie] =
    playMode === PlayMode.ModePvC ? pvcRecords : pvpRecords
  const p1Name = playMode === PlayMode.ModeCvP ? 'Computer' : 'Player 1'
  const p2Name = playMode === PlayMode.ModePvC ? 'Computer' : 'Player 2'

  return (
    <footer className="relative flex text-xs sm:text-sm justify-center w-72 sm:w-96 pt-4">
      <div
        className={classNames(
          'flex text-xs sm:text-sm w-20 h-20 sm:w-28 sm:h-28 text-center place-items-center place-content-center text-red-700 border-dashed rounded-full',
          {
            'border border-black': !isTie && playerNo === 0,
          }
        )}
      >
        {p1Name} (X)
        <br />
        {p1Victory}
      </div>
      <div
        className={classNames(
          'flex text-xs sm:text-sm w-20 h-20 sm:w-28 sm:h-28 text-center place-items-center place-content-center  border-dashed rounded-full',
          {
            'border border-black': isTie,
          }
        )}
      >
        Tie
        <br />
        {tie}
      </div>
      <div
        className={classNames(
          'flex text-xs sm:text-sm w-20 h-20 sm:w-28 sm:h-28 text-center place-items-center place-content-center text-green-700 border-dashed rounded-full',
          {
            'border border-black': !isTie && playerNo === 1,
          }
        )}
      >
        {p2Name} (O)
        <br />
        {p2Victory}
      </div>
    </footer>
  )
}
