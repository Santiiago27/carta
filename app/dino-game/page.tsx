"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trophy, RotateCcw, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
}

export default function DinoGamePage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"waiting" | "playing" | "gameOver">("waiting")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const gameRef = useRef({
    dino: { x: 50, y: 150, width: 40, height: 40, velocityY: 0, isJumping: false },
    obstacles: [] as GameObject[],
    gameSpeed: 3,
    frame: 0,
  })

  const CANVAS_WIDTH = 1000
  const CANVAS_HEIGHT = 300
  const GROUND_Y = 250
  const GRAVITY = 0.8
  const JUMP_FORCE = -15

  useEffect(() => {
    const savedHighScore = localStorage.getItem("dinoHighScore")
    if (savedHighScore) {
      setHighScore(Number.parseInt(savedHighScore))
    }
  }, [])

  const resetGame = useCallback(() => {
    gameRef.current = {
      dino: { x: 50, y: 200, width: 40, height: 40, velocityY: 0, isJumping: false },
      obstacles: [],
      gameSpeed: 3,
      frame: 0,
    }
    setScore(0)
  }, [])

  const startGame = useCallback(() => {
    resetGame()
    setGameState("playing")
  }, [resetGame])

  const jump = useCallback(() => {
    if (gameState === "playing" && !gameRef.current.dino.isJumping) {
      gameRef.current.dino.velocityY = JUMP_FORCE
      gameRef.current.dino.isJumping = true
    }
  }, [gameState])

  const checkCollision = useCallback((rect1: GameObject, rect2: GameObject) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }, [])

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const game = gameRef.current

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
    gradient.addColorStop(0, "#87CEEB")
    gradient.addColorStop(1, "#F0E68C")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    for (let i = 0; i < 5; i++) {
      const x = (game.frame * 0.5 + i * 200) % (CANVAS_WIDTH + 100)
      ctx.beginPath()
      ctx.arc(x, 50 + i * 20, 20, 0, Math.PI * 2)
      ctx.arc(x + 20, 50 + i * 20, 25, 0, Math.PI * 2)
      ctx.arc(x + 40, 50 + i * 20, 20, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw ground
    ctx.fillStyle = "#8B4513"
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 50)

    // Draw grass
    ctx.fillStyle = "#228B22"
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 10)

    // Update dino
    if (game.dino.isJumping) {
      game.dino.velocityY += GRAVITY
      game.dino.y += game.dino.velocityY

      if (game.dino.y >= 200) {
        game.dino.y = 200
        game.dino.velocityY = 0
        game.dino.isJumping = false
      }
    }

    // Draw dino with animation
    ctx.fillStyle = "#32CD32"
    ctx.fillRect(game.dino.x, game.dino.y, game.dino.width, game.dino.height)

    // Dino eyes
    ctx.fillStyle = "#000"
    ctx.fillRect(game.dino.x + 25, game.dino.y + 8, 4, 4)
    ctx.fillRect(game.dino.x + 32, game.dino.y + 8, 4, 4)

    // Add obstacles
    if (game.frame % 150 === 0) {
      const obstacleType = Math.random() > 0.5 ? "cactus" : "rock"
      game.obstacles.push({
        x: CANVAS_WIDTH,
        y: obstacleType === "cactus" ? 180 : 210,
        width: obstacleType === "cactus" ? 20 : 30,
        height: obstacleType === "cactus" ? 60 : 30,
      })
    }

    // Update and draw obstacles
    game.obstacles = game.obstacles.filter((obstacle) => {
      obstacle.x -= game.gameSpeed

      // Draw different obstacle types
      if (obstacle.height === 60) {
        // Cactus
        ctx.fillStyle = "#228B22"
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.fillStyle = "#006400"
        ctx.fillRect(obstacle.x + 5, obstacle.y + 10, 10, 10)
        ctx.fillRect(obstacle.x + 5, obstacle.y + 30, 10, 10)
      } else {
        // Rock
        ctx.fillStyle = "#696969"
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      }

      // Check collision
      if (checkCollision(game.dino, obstacle)) {
        setGameState("gameOver")
        const newHighScore = Math.max(score, highScore)
        setHighScore(newHighScore)
        localStorage.setItem("dinoHighScore", newHighScore.toString())
        return false
      }

      return obstacle.x > -obstacle.width
    })

    // Update score and speed
    game.frame++
    const newScore = Math.floor(game.frame / 10)
    setScore(newScore)
    game.gameSpeed = Math.min(8, 3 + newScore * 0.01)

    // Draw score with style
    ctx.fillStyle = "#000"
    ctx.font = "bold 24px Arial"
    ctx.fillText(`Puntuación: ${newScore}`, 20, 40)
    ctx.fillText(`Récord: ${highScore}`, 20, 70)

    // Draw speed indicator
    ctx.fillStyle = "#FF6347"
    ctx.font = "16px Arial"
    ctx.fillText(`Velocidad: ${game.gameSpeed.toFixed(1)}x`, CANVAS_WIDTH - 150, 40)
  }, [gameState, score, highScore, checkCollision])

  useEffect(() => {
    const interval = setInterval(gameLoop, 1000 / 60) // 60 FPS
    return () => clearInterval(interval)
  }, [gameLoop])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        if (gameState === "waiting" || gameState === "gameOver") {
          startGame()
        } else {
          jump()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState, startGame, jump])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-600 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <Button variant="ghost" className="mb-6 text-white hover:bg-white/20" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Sistema
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🦕 Juego del Dinosaurio</h1>
          <p className="text-white/90 text-lg">¡Diviértete esquivando obstáculos!</p>
        </div>

        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-orange-600 flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6" />
              Récord Personal: {highScore} puntos
            </CardTitle>
            <p className="text-center text-sm text-gray-600">
              Presiona ESPACIO o ↑ para saltar | También puedes hacer clic en el juego
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-4 border-orange-300 rounded-lg cursor-pointer shadow-2xl"
              onClick={() => {
                if (gameState === "waiting" || gameState === "gameOver") {
                  startGame()
                } else {
                  jump()
                }
              }}
            />

            <div className="flex gap-4 items-center flex-wrap justify-center">
              {gameState === "waiting" && (
                <Button onClick={startGame} className="bg-green-500 hover:bg-green-600 text-lg px-8 py-3">
                  <Play className="mr-2 h-5 w-5" />🎮 Iniciar Juego
                </Button>
              )}

              {gameState === "gameOver" && (
                <div className="text-center">
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-4">
                    <h3 className="text-2xl font-bold text-red-600 mb-2">¡Juego Terminado!</h3>
                    <p className="text-lg text-gray-700 mb-2">
                      Puntuación Final: <span className="font-bold text-orange-600">{score}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Récord Personal: <span className="font-bold text-green-600">{highScore}</span>
                    </p>
                    {score === highScore && score > 0 && (
                      <p className="text-yellow-600 font-bold mt-2">🏆 ¡Nuevo Récord!</p>
                    )}
                  </div>
                  <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-3">
                    <RotateCcw className="mr-2 h-5 w-5" />🔄 Jugar de Nuevo
                  </Button>
                </div>
              )}

              {gameState === "playing" && (
                <div className="text-center bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-lg font-bold text-blue-800">Puntuación Actual: {score}</p>
                  <p className="text-sm text-blue-600">Récord a Superar: {highScore}</p>
                  <div className="mt-2 bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (score / Math.max(highScore, 100)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                💡 <strong>Consejos:</strong> Los obstáculos aparecen más rápido conforme avanzas
              </p>
              <p className="text-xs text-gray-500">
                🎯 Esquiva cactus verdes y rocas grises para conseguir la puntuación más alta
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
