/**
 * Represents a point in 2D space.
 */
interface Point {
  x: number;
  y: number;
}

/**
 * Calculates the distance between two points.
 *
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between the two points.
 */
function distance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}


/**
 * Example usage of the distance function.
 */
function main() {
  const point1: Point = { x: 0, y: 0 };
  const point2: Point = { x: 3, y: 4 };

  const dist = distance(point1, point2);
  console.log(`The distance between the two points is: ${dist}`); // Output: 5

  const point3: Point = { x: 1, y: 1 };
  const point4: Point = { x: 4, y: 5 };
  const dist2 = distance(point3, point4);

  console.log(`The distance between the two points is: ${dist2}`); // Output 5
}


// Run the example
main();