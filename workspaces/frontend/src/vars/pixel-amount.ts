// Use a base value of 8 and create all fixed pixel amounts from that base and get a value + px
export function getPixelAmount(factor: number): string {
  return `${8 * factor}px`;
}

export const pixelAmount = {
  xxs: getPixelAmount(0.125),
  xs: getPixelAmount(0.25),
  sm: getPixelAmount(0.5),
  md: getPixelAmount(1),
  lg: getPixelAmount(2),
  xl: getPixelAmount(3),
  xxl: getPixelAmount(4),
  xl3: getPixelAmount(5),
  xl4: getPixelAmount(6),
  xl5: getPixelAmount(7),
  xl6: getPixelAmount(8),
  xl7: getPixelAmount(9),
  xl8: getPixelAmount(10),
  xl9: getPixelAmount(11),
  xl10: getPixelAmount(12),
  xl11: getPixelAmount(13),
  xl12: getPixelAmount(14),
  xl13: getPixelAmount(15),
  xl14: getPixelAmount(16),
  xl15: getPixelAmount(17),
};
