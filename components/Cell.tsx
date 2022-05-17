import React, { FC, useCallback, useEffect } from 'react'
import { GameStore, PlayMode, useGameStore } from '../hooks/useGameStore'
import classNames from 'classnames'

export type CellProps = {
  position: number
}

const selector = (state: GameStore) => ({
  playMode: state.playMode,
  playerNo: state.playerNo,
  p1Moves: state.p1Moves,
  p2Moves: state.p2Moves,
  move: state.move,
  victoryPattern: state.victoryPattern,
})

export const Cell: FC<CellProps> = ({ position }) => {
  const { playMode, playerNo, p1Moves, p2Moves, move, victoryPattern } =
    useGameStore(selector)

  const victory = victoryPattern(p1Moves) || victoryPattern(p2Moves)
  const handleClick = useCallback(() => {
    move(position)
    new Audio('./click.mp3').play()
  }, [move, position])

  return (
    <button
      key={position}
      onClick={handleClick}
      className={classNames('text-7xl sm:text-9xl w-1/3 h-1/3', {
        blink: victory & position,
        'text-red-700': p1Moves & position,
        'text-green-700': p2Moves & position,
        'opacity-10': victory !== 0 && !(victory & position),
      })}
      disabled={playMode === PlayMode.ModePvC && playerNo !== 0}
    >
      {p1Moves & position ? 'X' : p2Moves & position ? 'O' : ''}
    </button>
  )
}
