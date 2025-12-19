
export enum MathCategory {
  TOPOLOGY = 'Topology (拓扑)',
  GEOMETRY = 'Geometry (几何)',
  ANALYSIS = 'Analysis (分析)',
  ALGEBRA = 'Algebra (代数)'
}

export enum MathWonder {
  LORENZ = 'Lorenz Attractor',
  POINCARE = 'Poincaré Disk',
  MANDELBROT = 'Mandelbrot Fractal',
  SCHWARZSCHILD = 'Schwarzschild Radius',
  RIEMANN = 'Riemann Surface',
  COVERING = 'Covering Space',
  KLEIN = 'Klein Bottle',
  PEANO = 'Peano Curve',
  HILBERT = 'Hilbert Curve',
  KOCH = 'Koch Snowflake'
}

export interface WonderData {
  id: MathWonder;
  category: MathCategory;
  title: string;
  description: string;
  formula: string;
  philosophy: string;
  color: string;
}
