export interface Line {
  part: string,
  quantity: number,
  reference: string,
}

export interface Result {
  success: boolean
  fails: Array<Line>
  warnings: Array<Line>
}
