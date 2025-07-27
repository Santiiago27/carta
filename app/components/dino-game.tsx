"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Play } from "lucide-react"

interface GameObject {
  x: number
  y: number
  width: number
  height: number
}

export default function DinoGame() {
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

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 200
  const GROUND_Y = 180
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
      dino: { x: 50, y: 150, width: 40, height: 40, velocityY: 0, isJumping: false },
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

    // Clear canvas
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw ground
    ctx.fillStyle = "#333"
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 20)

    // Update dino
    if (game.dino.isJumping) {
      game.dino.velocityY += GRAVITY
      game.dino.y += game.dino.velocityY

      if (game.dino.y >= 150) {
        game.dino.y = 150
        game.dino.velocityY = 0
        game.dino.isJumping = false
      }
    }

    // Draw dino
    ctx.fillStyle = "#4ade80"
    ctx.fillRect(game.dino.x, game.dino.y, game.dino.width, game.dino.height)

    // Add obstacles
    if (game.frame % 120 === 0) {
      game.obstacles.push({
        x: CANVAS_WIDTH,
        y: 140,
        width: 20,
        height: 40,
      })
    }

    // Update and draw obstacles
    game.obstacles = game.obstacles.filter((obstacle) => {
      obstacle.x -= game.gameSpeed

      // Draw obstacle
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)

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
    game.gameSpeed = 3 + newScore * 0.01

    // Draw score
    ctx.fillStyle = "#333"
    ctx.font = "20px Arial"
    ctx.fillText(`Puntuación: ${newScore}`, 10, 30)
    ctx.fillText(`Récord: ${highScore}`, 10, 55)
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

  const openFullGame = () => {
    window.open("/dino-game", "_blank")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-center text-orange-600">🦕 Juego del Dinosaurio</CardTitle>
          <Button
            onClick={openFullGame}
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Jugar en Pantalla Completa
          </Button>
        </div>
        <p className="text-center text-sm text-gray-600">
          ¡Diviértete mientras esperas! Presiona ESPACIO o ↑ para saltar
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-gray-300 rounded-lg cursor-pointer"
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
            <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
              <Play className="mr-2 h-4 w-4" />🎮 Iniciar Juego
            </Button>
          )}

          {gameState === "gameOver" && (
            <div className="text-center">
              <p className="text-lg font-bold text-red-600 mb-2">¡Juego Terminado!</p>
              <p className="text-sm text-gray-600 mb-3">
                Puntuación: {score} | Récord: {highScore}
              </p>
              <Button onClick={startGame} className="bg-orange-500 hover:bg-orange-600">
                🔄 Jugar de Nuevo
              </Button>
            </div>
          )}

          {gameState === "playing" && (
            <div className="text-center">
              <p className="text-sm text-gray-600">Puntuación: {score}</p>
              <p className="text-xs text-gray-500">Récord: {highScore}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center">
          💡 Consejo: También puedes hacer clic en el juego para saltar
        </p>
      </CardContent>
    </Card>
  )
}
