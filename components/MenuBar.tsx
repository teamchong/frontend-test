import classNames from 'classnames'
import React, { FC } from 'react'
import {
  GameStatus,
  GameStore,
  PlayMode,
  useGameStore,
} from '../hooks/useGameStore'

const selector = (state: GameStore) => ({
  playMode: state.playMode,
  p1Moves: state.p1Moves,
  p2Moves: state.p2Moves,
  gameStatus: state.gameStatus,
  setPlayMode: state.setPlayMode,
})

export const MenuBar: FC = () => {
  const { playMode, p1Moves, p2Moves, setPlayMode, gameStatus } =
    useGameStore(selector)
  const status = gameStatus(p1Moves, p2Moves)
  return (
    <nav
      className="relative inline-flex rounded-md w-72 sm:w-96 shadow-sm mb-5 justify-center pb-3"
      role="group"
    >
      <div
        className="absolute top-10 w-72 sm:w-96 text-center text-nowrap text-blue-700"
        style={{ textShadow: '1px 1px #ccc' }}
      >
        {status !== GameStatus.InProgress && <>( click to continue )</>}
      </div>
      <button
        type="button"
        className={classNames(
          'py-2 px-4 text-xs sm:text-sm font-medium rounded-l-lg border border-gray-200',
          {
            'text-gray-400 bg-white hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700':
              playMode !== PlayMode.ModePvC,
            'text-white bg-blue-700': playMode === PlayMode.ModePvC,
          }
        )}
        onClick={() => setPlayMode(PlayMode.ModePvC)}
      >
        <svg
          className="mr-2 w-4 h-4 fill-current inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        PvC
      </button>
      <button
        type="button"
        className={classNames(
          'py-2 px-4 text-xs sm:text-sm font-medium border border-gray-200',
          {
            'text-gray-400 bg-white hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700':
              playMode !== PlayMode.ModePvP,
            'text-white bg-blue-700': playMode === PlayMode.ModePvP,
          }
        )}
        onClick={() => setPlayMode(PlayMode.ModePvP)}
      >
        <svg
          className="mr-2 w-4 h-4 fill-current inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        PvP
      </button>
      <button
        type="button"
        className={classNames(
          'py-2 px-4 text-xs sm:text-sm font-medium rounded-r-md border border-gray-200',
          {
            'text-gray-400 bg-white hover:bg-gray-100 hover:text-blue-700 focus:text-blue-700':
              playMode !== PlayMode.ModeCvP,
            'text-white bg-blue-700': playMode === PlayMode.ModeCvP,
          }
        )}
        onClick={() => setPlayMode(PlayMode.ModeCvP)}
      >
        <svg
          className="mr-2 w-4 h-4 fill-current inline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        CvP
      </button>
    </nav>
  )
}
