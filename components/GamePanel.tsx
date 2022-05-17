import classNames from 'classnames'
import React, { FC } from 'react'
import {
  useGameStore,
  GameStatus,
  GameStore,
  PlayMode,
} from '../hooks/useGameStore'

const selector = (state: GameStore) => ({
  playMode: state.playMode,
  playerNo: state.playerNo,
  pvcRecords: state.pvcRecords,
  pvpRecords: state.pvpRecords,
  p1Moves: state.p1Moves,
  p2Moves: state.p2Moves,
  gameStatus: state.gameStatus,
})

export const GamePanel: FC = () => {
  const {
    playMode,
    playerNo,
    pvcRecords,
    pvpRecords,
    p1Moves,
    p2Moves,
    gameStatus,
  } = useGameStore(selector)

  const status = gameStatus(p1Moves, p2Moves)
  const isTie = status === GameStatus.Tie
  const [p1Victory, p2Victory, tie] =
    playMode === PlayMode.ModePvC ? pvcRecords : pvpRecords
  const p1Name = playMode === PlayMode.ModeCvP ? 'Computer' : 'Player 1'
  const p2Name = playMode === PlayMode.ModePvC ? 'Computer' : 'Player 2'

  return (
    <div className="relative flex text-xs sm:text-sm justify-center w-72 sm:w-96 pt-8">
      <div
        className="absolute top-0 w-72 sm:w-96 text-center text-nowrap text-blue-700"
        style={{ textShadow: '1px 1px #ccc' }}
      >
        {status !== GameStatus.InProgress && (
          <>( click any cell to continue )</>
        )}
      </div>
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
    </div>
  )
}
