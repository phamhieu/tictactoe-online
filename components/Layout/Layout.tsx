import * as React from 'react'
import Head from 'next/head'

const Layout: React.FC = ({ children }) => {
  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <Head>
        <title>TicTacToe online</title>
        <meta name="description" content="Tic tac toe online; play the classic game with others." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <a
            href="https://supabase.io/"
            className="text-sm font-medium text-gray-500 hover:text-gray-600"
          >
            Supabase
          </a>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <a
            href="https://github.com/phamhieu/tictactoe-online"
            className="text-sm font-medium text-gray-500 hover:text-gray-600"
          >
            Github
          </a>
        </nav>
      </footer>
    </div>
  )
}
export default Layout
