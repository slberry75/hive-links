import { AxialCoordinates } from "./hex-links-coordinates";

/**
 * class to represent a color region in a Hex Link Puzzle
 */
export class ColorRegion {

    //properties
    color: HexLinkColor
    cells: AxialCoordinates[] = [];

    // derived properties
    get neighboringCoordinates(): AxialCoordinates[] {
        return [... new Set(this.cells
                .flatMap(cell => cell.getNeigboringCoordinates())
                .filter(cell => !this.isMemberCell(cell)))]
    }

    constructor(color: HexLinkColor) {
        this.color = color;
    }

    get memberCoordinates(): AxialCoordinates[] {
        return this.cells;
    }

    private isMemberCell(axialCoords: AxialCoordinates): boolean {
        return -1 < this.memberCoordinates.findIndex(c => JSON.stringify(c) === JSON.stringify(axialCoords))
    }
}

export class HexLinkPuzzle {
    colors: PuzzleColorOptions;
    difficulty: PuzzleDifficulty;
    rings: number;
    // cells: Record<string, HexLinkCell> = {};
    cells: HexLinkCell[] = [];
    regions: ColorRegion[] = [];
    solution : Record<string,HexLinkColor> = {};
    
    constructor(colors:PuzzleColorOptions, difficulty:PuzzleDifficulty, rings:number) {
        this.colors = colors;
        this.difficulty = difficulty;
        this.rings = rings;
    }


    public largeEnoughForCoords(coords: AxialCoordinates): boolean {
        return Math.max(Math.abs(coords.q), Math.abs(coords.r), Math.abs(coords.s)) <= this.rings
    }
    
}

export class HexLinkCell {
    // properties
    axialCoordinates: AxialCoordinates;
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
        return this.axialCoordinates.getNeigboringCoordinates()
    }

    //constructor
    constructor(
        axialCoords:AxialCoordinates, 
        clue:PuzzleClue|undefined=undefined, 
        barredNeighbors:AxialCoordinates[]|undefined=undefined
    ) {
        this.axialCoordinates = axialCoords;
        this.clue = clue;
        this.barredNeighbors = barredNeighbors;
    }
}

