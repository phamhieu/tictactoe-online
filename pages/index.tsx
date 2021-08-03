import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <Head>
        <title>TicTacToe online</title>
        <meta
          name="description"
          content="Tic tac toe online; play the classic game with your friends."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Tic Tac Toe online
          </h1>
        </div>
        <div className="max-w-lg mx-auto py-24">
          <div className="text-center">
            <p className="mt-2 text-base text-gray-500">
              Sign in with magic link to start playing with others
            </p>
            <form action="#" className="mt-6 flex">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="text"
                name="email"
                id="email"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter an email"
              />
              <button
                type="submit"
                className="ml-4 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send magic link
              </button>
            </form>
          </div>
        </div>
      </main>
      <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Twitter
          </a>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Github
          </a>
        </nav>
      </footer>
    </div>
  )
}
