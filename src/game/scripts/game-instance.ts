import { GameRenderer } from "./game-renderer";
import { GridContainer } from "./grid-container";
import { AxialCoordinates } from "../../utils/hex-links-coordinates";
import { HexLinkPuzzle, HexLinkCell } from "../../utils/hex-puzzle-components";

export class GameInstance {
    // properties
    readonly colors:PuzzleColorOptions;
    readonly difficulty: PuzzleDifficulty;
    readonly rings: number;
    readonly container: GridContainer;
    readonly cells: GameCell[] = [];
    debugLayout: boolean;

    // computed properties:
    get cellSize(): number {
        return Math.floor(this.container.widthHeight / (this.rings * 2 + 1));
    }

    constructor(puzzle:HexLinkPuzzle, container:GridContainer, debugLayout:boolean = false) {
        this.colors = puzzle.colors;
        this.difficulty = puzzle.difficulty;
        this.rings = puzzle.rings;
        this.container = container;
        this.debugLayout = debugLayout;
        this.cells = Object.entries(puzzle.cells as object).map(([key, value]) => new GameCell(value.axialCoordinates));
        console.log(this.cells)
        GameRenderer.render(this);
    }

}

export class GameCell extends HexLinkCell {
    readonly userColor:HexLinkColor|null = null;
    readonly userGuess:HexLinkColor|null = null;

    constructor(axialCoords:AxialCoordinates) {
        super(axialCoords);
    }

    scaleCoordinates(instance: GameInstance):NormalizedPixelLocation  {
        
        return Object.fromEntries(
            Object.entries(this.coordinates).map(([key, value]) => {
                return [key, (value*instance.cellSize * .55) + instance.container.origin - (instance.cellSize/2)];
            })
        ) as NormalizedPixelLocation
    }
}