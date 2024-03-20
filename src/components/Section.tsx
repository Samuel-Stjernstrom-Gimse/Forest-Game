import React, { useRef, useEffect } from 'react'
import { calculateDistance, getRandomNumberInRange } from '../helpers/mathHelpers.ts'

type Tree = {
	x: number
	y: number
	health: number
}

export const Section: React.FC = () => {
	const canvasRef: React.RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null)
	const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

	const worker = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
		width: 20,
		height: 20,
		chopping: false,
		keyPressed: {
			ArrowUp: false,
			ArrowLeft: false,
			ArrowRight: false,
			ArrowDown: false
		}
	}

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvasRef.current! as HTMLCanvasElement
		const ctx: CanvasRenderingContext2D = canvas.getContext('2d')! as CanvasRenderingContext2D
		const image = new Image()
		let treeArray: Tree[] = []

		image.src = '/src/assets/images/tree.png'

		const createTrees = (numberOfTrees: number): void => {
			for (let i: number = 0; i < numberOfTrees; i++) {
				const tree: Tree = {
					x: getRandomNumberInRange(0, canvas.width),
					y: getRandomNumberInRange(0, canvas.height),
					health: 100
				}
				treeArray.push(tree)
			}
		}

		createTrees(200)
		treeArray = treeArray.sort((a: Tree, b: Tree) => {
			return a.y - b.y
		})

		image.onload = (): void => {
			const gameLoop = (): void => {
				ctx.clearRect(0, 0, canvas.width, canvas.height)

				treeArray.forEach((tree: Tree): void => {
					const distance = calculateDistance(tree.x, tree.y, worker.x, worker.y)
					if (distance <= 20) {
						worker.chopping = true
						tree.health -= 1
					}
					treeArray = treeArray.filter((tree) => {
						if (tree.health > 0) {
							return tree
						} else if (distance >= 20) return
					})

					if (tree.health < 100) {
						ctx.fillStyle = 'green'
						ctx.fillRect(tree.x - 25, tree.y - 40, tree.health / 2, 10)
					}

					ctx.drawImage(image, tree.x - 15, tree.y - 25, 30, 50)

					// Collision detection between worker and tree
				})

				const speed: number = 2

				if (worker.keyPressed.ArrowDown && worker.keyPressed.ArrowLeft) {
					worker.y += speed * 0.7
					worker.x -= speed * 0.7
				} else if (worker.keyPressed.ArrowDown && worker.keyPressed.ArrowRight) {
					worker.y += speed * 0.7
					worker.x += speed * 0.7
				} else if (worker.keyPressed.ArrowUp && worker.keyPressed.ArrowLeft) {
					worker.x -= speed * 0.7
					worker.y -= speed * 0.7
				} else if (worker.keyPressed.ArrowUp && worker.keyPressed.ArrowRight) {
					worker.x += speed * 0.7
					worker.y -= speed * 0.7
				} else if (worker.keyPressed.ArrowRight) {
					worker.x += speed
				} else if (worker.keyPressed.ArrowLeft) {
					worker.x -= speed
				} else if (worker.keyPressed.ArrowUp) {
					worker.y -= speed
				} else if (worker.keyPressed.ArrowDown) {
					worker.y += speed
				}

				if (worker.y < 0) {
					worker.y = 0
				} else if (worker.y > window.innerHeight) {
					worker.y = window.innerHeight
				}

				if (worker.x < 0) {
					worker.x = 0
				} else if (worker.x > window.innerWidth) {
					worker.x = window.innerWidth
				}

				ctx.fillStyle = 'red'
				ctx.fillRect(worker.x - 10, worker.y - 10, worker.width, worker.height)

				requestAnimationFrame(gameLoop)
			}
			gameLoop()
		}
		treeArray.length < 100 ? setInterval(createTrees, 1000, 1) : null
	}, [])

	window.addEventListener('keydown', (e: KeyboardEvent): void => {
		arrowKeys.forEach((button: string): void => {
			if (button === e.key) {
				e.preventDefault()
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				worker.keyPressed[button] = true
			}
		})
	})

	window.addEventListener('keyup', (e: KeyboardEvent): void => {
		arrowKeys.forEach((button: string): void => {
			if (button === e.key) {
				e.preventDefault()
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				worker.keyPressed[button] = false
			}
		})
	})

	return (
		<>
			<canvas
				ref={canvasRef}
				style={{
					position: 'fixed',
					left: 0,
					top: 0,
					backgroundImage: 'url(src/assets/images/grass.png)',
					backgroundRepeat: 'repeat',
					backgroundSize: '100px'
				}}
				width={window.innerWidth}
				height={window.innerHeight}
			></canvas>
		</>
	)
}
