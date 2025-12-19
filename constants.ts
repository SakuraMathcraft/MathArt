
import { MathWonder, WonderData, MathCategory } from './types';

export const WONDERS: Record<MathWonder, WonderData> = {
  [MathWonder.LORENZ]: {
    id: MathWonder.LORENZ,
    category: MathCategory.ANALYSIS,
    title: 'Lorenz Attractor',
    description: '混沌理论的象征。展示了在确定性系统中，微小的初值差异如何演化出巨大的、不可预测的复杂行为。',
    formula: '\\begin{cases} \\dot{x} = \\sigma(y - x) \\\\ \\dot{y} = x(\\rho - z) - y \\\\ \\dot{z} = xy - \\beta z \\end{cases}',
    philosophy: '蝴蝶扇动翅膀，终将在彼岸引起风暴。',
    color: '#3b82f6'
  },
  [MathWonder.POINCARE]: {
    id: MathWonder.POINCARE,
    category: MathCategory.GEOMETRY,
    title: 'Poincaré Disk',
    description: '双曲几何的模型。平行线在此处发散，边界代表无穷，揭示了非欧空间的奇异结构。',
    formula: 'ds^2 = 4\\frac{dx^2 + dy^2}{(1 - x^2 - y^2)^2}',
    philosophy: '有限的圆盘，承载着无限的自由。',
    color: '#8b5cf6'
  },
  [MathWonder.MANDELBROT]: {
    id: MathWonder.MANDELBROT,
    category: MathCategory.ALGEBRA,
    title: 'Mandelbrot Set',
    description: '上帝的指纹。通过极简的二次迭代，在复平面上编织出无穷无尽、自相似的宇宙景观。',
    formula: 'z_{n+1} = z_n^2 + c',
    philosophy: '部分即是整体，瞬间即是永恒。',
    color: '#ec4899'
  },
  [MathWonder.SCHWARZSCHILD]: {
    id: MathWonder.SCHWARZSCHILD,
    category: MathCategory.GEOMETRY,
    title: 'Schwarzschild Radius',
    description: '时空的终极边界。在此临界点，引力强到连光都无法逃逸，时空结构塌缩为奇异点。',
    formula: 'R_s = \\frac{2GM}{c^2}',
    philosophy: '一旦跨越视界，时间便是唯一的方向。',
    color: '#f59e0b'
  },
  [MathWonder.RIEMANN]: {
    id: MathWonder.RIEMANN,
    category: MathCategory.ANALYSIS,
    title: 'Riemann Surface',
    description: '复变函数的多层景观。将多值函数转化为在更高维度上的单值函数，让真理分层显现。',
    formula: 'w = \\sqrt{z}',
    philosophy: '当视线升维，迷局终将化为坦途。',
    color: '#10b981'
  },
  [MathWonder.COVERING]: {
    id: MathWonder.COVERING,
    category: MathCategory.TOPOLOGY,
    title: 'Covering Space',
    description: '拓扑学的层级投影。一个空间如何螺旋式地覆盖在另一个空间之上，如同记忆的重影。',
    formula: 'p: E \\to B',
    philosophy: '循环往复，却在每一层中悄然升迁。',
    color: '#06b6d4'
  },
  [MathWonder.KLEIN]: {
    id: MathWonder.KLEIN,
    category: MathCategory.TOPOLOGY,
    title: 'Klein Bottle',
    description: '不可定向的奇迹。一个没有内外之分的闭合曲面，代表了拓扑结构的极致悖论。',
    formula: '\\chi(M) = 0',
    philosophy: '没有内外之分，宇宙亦或是个整体。',
    color: '#f43f5e'
  },
  [MathWonder.PEANO]: {
    id: MathWonder.PEANO,
    category: MathCategory.ALGEBRA,
    title: 'Peano Curve',
    description: '空间填充曲线。它打破了维度的直觉，展示了一维线段如何通过无限弯折填满二维平面。',
    formula: 'f: [0, 1] \\to [0, 1]^2',
    philosophy: '极致的细腻，让线条化作了平面。',
    color: '#0ea5e9'
  },
  [MathWonder.HILBERT]: {
    id: MathWonder.HILBERT,
    category: MathCategory.ALGEBRA,
    title: 'Hilbert Curve',
    description: '递归的空间映射。通过精密的自相似结构，在局部与整体之间建立起跨维度的连续性。',
    formula: 'L = \\lim_{n \\to \\infty} f_n',
    philosophy: '简单规则的重复，构筑了世界的深度。',
    color: '#a855f7'
  },
  [MathWonder.KOCH]: {
    id: MathWonder.KOCH,
    category: MathCategory.GEOMETRY,
    title: 'Koch Snowflake',
    description: '周长无限而面积有限的分形。每一个局部的细节都映射着整体的壮丽。',
    formula: 'D = \\frac{\\log 4}{\\log 3}',
    philosophy: '在有限的怀抱中，拥抱无穷的边界。',
    color: '#60a5fa'
  }
};
