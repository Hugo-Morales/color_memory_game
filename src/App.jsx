import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500"
]

export default function App() {
    const [cards, setCards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [solved, setSolved] = useState([])
    const [moves, setMoves] = useState(0)
    const [time, setTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [isGameWon, setIsGameWon] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [isGameStarted, setIsGameStarted] = useState(false)

    useEffect(() => {
        initializeGame()
    }, [])

    useEffect(() => {
        let timer

        if (isPlaying && !isPaused && !isGameWon) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1)
            }, 1000)
        }

        return () => clearInterval(timer)
    }, [isPlaying, isPaused, isGameWon])

    const initializeGame = () => {
        const newCards = [...colors, ...colors].sort(() => Math.random() - 0.5);
        setCards(newCards)
        setFlipped([])
        setSolved([])
        setMoves(0)
        setTime(0)
        setIsPlaying(true)
        setIsPaused(false)
        setIsGameWon(false)
        setIsChecking(false)
    }

    const handleCardClick = (index) => {
        if (!isPlaying || isPaused || flipped.includes(index) || solved.includes(index) || isChecking) return

        const newFlipped = [...flipped, index]
        setFlipped(newFlipped)

        if (newFlipped.length === 2) {
            setMoves(moves + 1)
            setIsChecking(true)
            const [firstIndex, secondIndex] = newFlipped
            const isMatch = cards[firstIndex] === cards[secondIndex];

            setTimeout(() => {
                if (isMatch) {
                    setSolved((prevSolved) => [...prevSolved, firstIndex, secondIndex]);
                    checkGameWon([...solved, firstIndex, secondIndex]);
                } else {
                    // Añade clase de animación cuando se equivoca
                    setFlipped((prevFlipped) => prevFlipped.map((i) => (i === firstIndex || i === secondIndex ? 'animate-shake' : i)));
                }
                setFlipped([]);
                setIsChecking(false);
            }, 1000);
        }
    }

    const togglePause = () => {
        setIsPaused(!isPaused)
    }

    const checkGameWon = (solvedCards) => {
        if (solvedCards.length === cards.length) {
            setIsGameWon(true)
            setIsPlaying(false)
        }
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const startGame = () => {
        setIsGameStarted(true);
        initializeGame();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Juego de Memoria</h1>
            {!isGameStarted ? (
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={startGame}
                >
                    Empezar Juego
                </button>
            ) : (
                <>
                    <div className="mb-4">Movimientos: {moves} | Tiempo: {formatTime(time)}</div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        {cards.map((color, index) => (
                            <div
                                key={index}
                                className={`w-20 h-20 rounded-lg cursor-pointer transition-all duration-300 ${flipped.includes(index) || solved.includes(index)
                                        ? color
                                        : 'bg-gray-300'
                                    } ${solved.includes(index)
                                        ? 'opacity-0'
                                        : flipped.includes(index) && flipped.length === 2 && !solved.includes(index)
                                            ? 'animate-shake'
                                            : ''
                                    }`}
                                onClick={() => handleCardClick(index)}
                            />
                        ))}
                    </div>
                    {isGameWon && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-lg text-center">
                                <h2 className="text-3xl font-bold mb-4">¡Felicidades!</h2>
                                <p className="text-xl mb-2">Has completado el juego en {formatTime(time)}</p>
                                <p className="text-lg mb-4">Número de movimientos: {moves}</p>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={initializeGame}
                                >
                                    Jugar de nuevo
                                </button>
                            </div>
                            <Confetti />
                        </div>
                    )}
                    <div className="mt-4 space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={initializeGame}
                        >
                            {isPlaying ? 'Reiniciar Juego' : 'Jugar'}
                        </button>
                        {isPlaying && (
                            <button
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                onClick={togglePause}
                            >
                                {isPaused ? 'Reanudar' : 'Pausar'}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
