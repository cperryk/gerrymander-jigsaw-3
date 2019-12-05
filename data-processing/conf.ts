export interface Conf {
  outPath: string;
  inShapeFilePath: string;
  inDataFilePath: string;
  inputCRS: string;
  outputCRS: string;
  simplificationFactor: number;
  svgStartX: number;
  svgStartY: number;
  svgWidth: number;
  svgHeight: number;
  svgGutter: number;
}
