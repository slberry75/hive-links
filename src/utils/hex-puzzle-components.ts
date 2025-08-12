import { AxialCoordinates, AxialOffsets } from "./hex-links-coordinates";

export class HexLinkCell {
    // properties
    axialCoordinates: AxialCoordinates;
    solvedColor?: HexLinkColor ;  
    clue?: PuzzleClue
    barredNeighbors?:AxialCoordinates[];

    // computed properties
    get q(): number {
        return this.axialCoordinates.q;
    }
    get r(): number {
        return this.axialCoordinates.r;
    }
    get s(): number {
        return this.axialCoordinates.s;
    }

    get coordinates(): NormalizedPixelLocation {
        return {
            x:(3/2) * this.q,
            y:(Math.sqrt(3)/2 * this.q + Math.sqrt(3) * this.r)
        };
    }

    get neighbors():AxialCoordinates[] {
      return AxialOffsets.map(offset => {
        return { q: offset[0], r: offset[1], s: offset[2]};
      }).map(offset => new AxialCoordinates([this.q + offset.q, this.r + offset.r, this.s + offset.s]));  
    }

    //constructor
    constructor(axialCoords:AxialCoordinates, solvedColor=undefined, clue=undefined, barredNeighbors=undefined) {
        this.axialCoordinates = axialCoords;
        this.clue = clue;
        this.solvedColor = solvedColor;
        this.barredNeighbors = barredNeighbors;
    }
}

