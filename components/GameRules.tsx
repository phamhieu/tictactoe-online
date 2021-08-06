import * as React from 'react'
import {
  BanIcon,
  ViewGridIcon,
  EmojiHappyIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/outline'
import { joinClassNames } from '../lib/helper'

const items = [
  {
    description: "The game is played on a grid that's 3 squares by 3 squares.",
    iconColor: 'bg-blue-500',
    icon: ViewGridIcon,
  },
  {
    description: 'Players take turns putting their marks (X or O) in empty squares.',
    iconColor: 'bg-purple-500',
    icon: ChevronDoubleRightIcon,
  },
  {
    description:
      'The first player to get 3 of her marks in a row (up, down, across, or diagonally) is the winner.',
    iconColor: 'bg-green-500',
    icon: EmojiHappyIcon,
  },
  {
    description:
      'When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie.',
    iconColor: 'bg-red-500',
    icon: BanIcon,
  },
]

const GameRules: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mt-10">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          The game rules
        </h3>
        <ul role="list" className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200">
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>
              <div className="relative group py-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <span
                    className={joinClassNames(
                      item.iconColor,
                      'inline-flex items-center justify-center h-10 w-10 rounded-lg'
                    )}
                  >
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default GameRules
