export class GoogleDistanceMatrixRow {
  private readonly tooFarDistance = 10000;
  distance: number;

  constructor(args: {elements: {distance: {text: string; value: number}}[]}[]) {
    if (!args || args.length < 1) {
      this.distance = this.tooFarDistance;
      return;
    }

    const elements = args[0].elements;
    if (!elements || elements.length < 1) {
      this.distance = this.tooFarDistance;
      return;
    }

    const distanceElement = elements[0].distance;
    if (!distanceElement) {
      this.distance = this.tooFarDistance;
      return;
    }

    this.distance = distanceElement.value;
  }
}
