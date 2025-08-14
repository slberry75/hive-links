import { AxialCoordinates } from "../utils/hex-links-coordinates";
import { HexLinkPuzzle, HexLinkCell, ColorRegion } from "../utils/hex-puzzle-components";
import { getRandomEntry, shuffleArray } from "../utils/utilities";


export class PuzzleGenerator extends HexLinkPuzzle {

    get assignedCells():AxialCoordinates[] {
        return [... new Set(this.cells.filter(c => this.solution[c.axialCoordinates.toString()]).map(c => c.axialCoordinates))];
    }
    get unassignedCells():AxialCoordinates[] {
        return this.cells.filter(c => !this.solution[c.axialCoordinates.toString()]).map(c => c.axialCoordinates);
    }

    constructor(rings:number = 2, difficulty:PuzzleDifficulty = 'easy', colors?:PuzzleColorOptions) 
    {
        colors ??= PuzzleGenerator.getDefaultColors();
        super(colors, difficulty, rings);
    }
    
    generate():HexLinkPuzzle {
        this.initCells();
        this.initRegions();
        return this;
    }

    private initCells  = (
        axialCoordinates?:AxialCoordinates
    ) : void => {
        axialCoordinates??=new AxialCoordinates([0,0,0]);

        if (this.cells.find(c => c.axialCoordinates.toString() == axialCoordinates.toString())) return;

        if (!this.largeEnoughForCoords(axialCoordinates)) {
            throw new Error(`Cell with coordinates ${axialCoordinates.toString()} out of bounds.  Limit is +/- ${this.rings}.`);
        }

        let thisCell = new HexLinkCell(axialCoordinates);
        this.cells.push(thisCell);

        thisCell.neighbors
            .filter(x => this.largeEnoughForCoords(x) 
                && this.cells.findIndex(c => c.axialCoordinates.toString() === x.toString()) === -1
            )
            .forEach(x => {
                const cellsFromNeighbor = this.initCells(x);
            })

    }

    /**
     * Overwrites the clue for this cell every time
     * @param axialCoords - location of cell to be given clue
     * @param color - color of cell
     * @param matches - number of matches adjacent to cell
     */
    private assignClue(axialCoords:AxialCoordinates, color?:HexLinkColor, matches?:number) {
        let thisCell = this.cells.filter(c => c.axialCoordinates.toString() === axialCoords.toString()).pop();
        if (!thisCell) return;//throw new RangeError(`Cannot assign a clue to axial coordinates ${axialCoords.toString()}`)
        if (color === undefined && matches === undefined) {
                throw new TypeError(`Invalid Arguments: assignClue expects either the argument color or matches.`);
            }
        let clue:PuzzleClue = { color: color, matches: matches }
        thisCell.clue = clue;
    }

    private getCellFromCoords(coords:AxialCoordinates) :HexLinkCell|undefined {
        return this.cells.filter(x => 
            x.axialCoordinates.toString() === coords.toString()
        ).pop();
    }

    private hasEmptyOrMatchingNeighbors(coords: AxialCoordinates) : boolean {
        const coordColor = this.solution[coords.toString()] ;
        if (coordColor) {
            return coords.getNeigboringCoordinates().filter(c => this.solution[c.toString()]).length > 0;
        }
        return false;
    }

    private assignNewCell(region: ColorRegion) : void {
        let cellChoices = [...(region.neighboringCoordinates && region.neighboringCoordinates.length ?
            region.neighboringCoordinates : this.unassignedCells)
            // .filter(coord => Math.max(Math.abs(coord.q), Math.abs(coord.r), Math.abs(coord.s)) <= this.rings)
            .filter(c => !this.solution[c.toString()])]
            ;

        console.log(`${this.assignedCells.length} assigned cells.   ${region.color.toString()} turn.  ${cellChoices.length} choices `, cellChoices)

        shuffleArray(cellChoices);
        while(cellChoices.length > 1) {
            const newCoords = getRandomEntry(cellChoices);
            cellChoices = cellChoices.filter(x => x.toString() !== newCoords.toString())
            if (newCoords) {
                this.solution[newCoords.toString()] = region.color;
                this.assignClue(newCoords, region.color, this.assignedCells.length);
                region.cells.push(newCoords);
                break;
            }
        }
    }

    private initRegions  = ():void => {
        this.colors.forEach(color => this.regions.push(new ColorRegion(color)));
        while(this.unassignedCells.length > 0) {
            this.regions.forEach((region, idx) => {
                const unBefore = this.unassignedCells.length;
                this.assignNewCell(region);
            });
        }
    }

    static getDefaultColors():PuzzleColorOptions {
        return [
            [93, 0, 255],
            [255, 166, 0],
            [255, 0, 153],
        ];
    }
}