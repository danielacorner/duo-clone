export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-duo-dark to-gray-900">
      <div className="text-center">
        <div className="text-8xl mb-6">🦉</div>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Duo Clone!</h1>
        <p className="text-gray-400 text-lg mb-8">Start learning a new language today</p>
        <button className="bg-duo-green hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg">
          Get Started
        </button>
      </div>
    </div>
  );
}
