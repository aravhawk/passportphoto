// US Passport photo specification (travel.state.gov)
// Photo is 2 x 2 in, square. Standard digital output is 600x600 px @ 300 DPI.

export const DPI = 300;

export const OUTPUT_SIZES = [600, 1200] as const;
export type OutputSize = (typeof OUTPUT_SIZES)[number];
export const DEFAULT_OUTPUT_SIZE: OutputSize = 600;

// All guide values are fractions of the square frame height (top = 0, bottom = 1).
// Eye line must sit 1 1/8" to 1 3/8" from the bottom of a 2" photo.
//   -> from the top: 1 - 1.375/2 = 0.3125  to  1 - 1.125/2 = 0.4375
// Head (chin to crown) must be 1" to 1 3/8" tall -> 0.5 to 0.6875 of the frame.
// The head oval below encodes a comfortably-compliant target: crown at 12.5%,
// chin at 75% (head = 62.5% tall, eyes land ~37.5% from the top).
export const GUIDES = {
  eyeBandTop: 0.3125,
  eyeBandBottom: 0.4375,
  eyeLine: 0.375,
  headCrown: 0.125,
  headChin: 0.75,
  headWidth: 0.52, // fraction of frame width, visual aid only
} as const;
