import { AxialOffsets, AxialCoordinates } from "../../utils/coordinates";
import { HexLinkCell } from "../../utils/HexLinkCell";
export class HexLinkPuzzle {
    colors: PuzzleColorOptions;
    difficulty: PuzzleDifficulty;
    rings: number;
    initialized: boolean = false;
    cells?: Record<string, HexLinkCell> = undefined;

    constructor(colors:PuzzleColorOptions, difficulty:PuzzleDifficulty, rings:number) {
        this.colors = colors;
        this.difficulty = difficulty;
        this.rings = rings;
        this.cells = this.initCells();
    }

    private initCells  = (axialCoordinates?:AxialCoordinates, cells: Record<string, HexLinkCell> = {}) : Record<string, HexLinkCell> => {
        axialCoordinates??=new AxialCoordinates([0,0,0]);

        if (!this.largeEnoughForCoords(axialCoordinates)) {
            throw new Error(`Cell with coordinates ${axialCoordinates.toString()} out of bounds.  Limit is +/- ${this.rings}.`);
        }

        let thisCell = new HexLinkCell(axialCoordinates);
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

