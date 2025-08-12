import { AxialCoordinates } from "../utils/hex-links-coordinates";
import { HexLinkPuzzle, HexLinkCell, ColorRegion } from "../utils/hex-puzzle-components";
import { getRandomEntry } from "../utils/utilities";


export class PuzzleGenerator extends HexLinkPuzzle {

    get unassignedCells():AxialCoordinates[] {
        return this.cells.filter(c => 
            Object.keys(this.solution).findIndex(
                key => key == c.axialCoordinates.toString()
            ) === -1).map(c => c.axialCoordinates);
    }

    constructor(rings:number = 2, difficulty:PuzzleDifficulty = 'easy', colors?:PuzzleColorOptions) 
    {
        colors ??= PuzzleGenerator.getDefaultColors();
        super(colors, difficulty, rings);
    }
    
    generate():HexLinkPuzzle {
        this.cells = this.initCells();
        this.initRegions();
        console.log('generating puzzle...', this);
        return this;
    }

    private initCells  = (
        axialCoordinates?:AxialCoordinates, cells: HexLinkCell[] = []
    ) : HexLinkCell[] => {
        axialCoordinates??=new AxialCoordinates([0,0,0]);

        if (!this.largeEnoughForCoords(axialCoordinates)) {
            throw new Error(`Cell with coordinates ${axialCoordinates.toString()} out of bounds.  Limit is +/- ${this.rings}.`);
        }

        let thisCell = new HexLinkCell(axialCoordinates);
        this.cells.push(thisCell);

        thisCell.neighbors
            .filter(x => this.largeEnoughForCoords(x) 
                && cells.findIndex(c => c.axialCoordinates.toString() === x.toString()) === -1
            )
            .forEach(x => {
                const cellsFromNeighbor = this.initCells(x, this.cells);
            })

        return this.cells;
    }

    private assignNewCell(region: ColorRegion) : void {
        const cellChoices = region.neighboringCoordinates && region.neighboringCoordinates.length ?
            region.neighboringCoordinates : this.unassignedCells;
        const newCell = getRandomEntry(this.unassignedCells);
        this.solution[newCell.toString()] = region.color;
        region.cells.push(newCell);
    }

    private initRegions  = ():void => {
        this.colors.forEach(color => this.regions.push(new ColorRegion(color)));
        while(this.unassignedCells.length > 0) {
            this.regions.forEach(region => {
                this.assignNewCell(region);
                console.log(`Region ${region.color}`, region)
            });
            break;
        }
        console.log(this.solution)
        // while(this.unassignedCells.length) {
        //     this.regions.forEach(region => {
        //         let neighbors = [ ...region.neighboringCoordinates]
        //     })
        // }
    }

    static getDefaultColors():PuzzleColorOptions {
        return [
            [93, 0, 255],
            [255, 166, 0],
            [255, 0, 153],
        ];
    }
}