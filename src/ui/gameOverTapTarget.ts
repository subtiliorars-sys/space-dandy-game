/** Map a tap x-coordinate to game-over navigation (mirrors SPACE left / R right). */
export function gameOverTapTarget(x: number, viewportWidth: number): "title" | "retry" {
  if (viewportWidth <= 0) return "retry";
  return x < viewportWidth / 2 ? "title" : "retry";
}
