export const getRandomNumberInRange = (min: number, max: number) => Math.random() * (max - min) + min

export const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number =>
	Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

export const getRandomColor = (): string => {
	// Generate random values for red, green, and blue components
	const red = Math.floor(Math.random() * 256)
	const green = Math.floor(Math.random() * 256)
	const blue = Math.floor(Math.random() * 256)

	return `rgb(${red},${green},${blue})`
}
