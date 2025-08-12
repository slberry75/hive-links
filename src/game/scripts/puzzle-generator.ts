const AxialOffsets =  [
    [1, 0, -1], // Right        
    [1, -1, 0], // Top Right  
    [0, -1, 1], // Top Left
    [-1, 0, 1], // Left   
    [-1, 1, 0], // Bottom Left
    [0, 1, -1]  // Bottom Right
];

export class HexLinkPuzzle {
    colors: PuzzleColorOptions;
    difficulty: PuzzleDifficulty;
    rings: number;
    initialized: boolean = false;
    cells?: Record<string, PuzzleGridCell> = undefined;

    constructor(colors:PuzzleColorOptions, difficulty:PuzzleDifficulty, rings:number) {
        this.colors = colors;
        this.difficulty = difficulty;
        this.rings = rings;
        this.cells = this.initCells();
    }

    private initCells  = (axialCoordinates?:AxialCoordinates, cells: Record<string, PuzzleGridCell> = {}) : Record<string, PuzzleGridCell> => {
        axialCoordinates??=new AxialCoordinates([0,0,0]);

        if (!this.largeEnoughForCoords(axialCoordinates)) {
            throw new Error(`Cell with coordinates ${axialCoordinates.toString()} out of bounds.  Limit is +/- ${this.rings}.`);
        }

        let thisCell = new PuzzleGridCell(axialCoordinates);
        cells[thisCell.axialCoordinates.toString()]  = thisCell;

        thisCell.neighbors
            .filter(x => this.largeEnoughForCoords(x) && !(x.toString() in cells))
            .forEach(x => {
                const cellsFromNeighbor = this.initCells(x, cells);
                Object.assign(cells, cellsFromNeighbor);
            })

        return cells;
    }

    private largeEnoughForCoords(coords: AxialCoordinates): boolean {
        return Math.max(Math.abs(coords.q), Math.abs(coords.r), Math.abs(coords.s)) <= this.rings
    }
}

export class PuzzleGridCell {
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

export class AxialCoordinates {
    // properties
    readonly q: number;
    readonly r: number;
    readonly s: number;

    constructor(coords:[number,number,number]);
    constructor(q:number,r:number,s:number);
    constructor(qOrCoords:[number,number,number]|number, r?: number, s?: number) {
        if (Array.isArray(qOrCoords)) 
        {
            r = qOrCoords[1];
            s = qOrCoords[2];
            qOrCoords = qOrCoords[0];
        }
          
        if (r === undefined || s === undefined)  
        {
            throw new Error("Invalid instantiation of Axial Coordinates");
        }
        else if (Math.abs(qOrCoords + r + s) > 0.0001)
        {
            throw new Error(`Invalid axial coordinates: ${[qOrCoords, r, s]}`);
        }
        else
        {
            this.q = qOrCoords;
            this.r = r;
            this.s = s;   
        }
    }

    toArray():[number,number,number] {
        return [this.q, this.r, this.s]
    }

    toString():string {
        return JSON.stringify(this.toArray());
    }
}