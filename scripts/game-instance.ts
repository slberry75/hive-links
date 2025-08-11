import { GameRenderer } from "./game-renderer";
import { GridContainer } from "./grid-container";
import { AxialCoordinates, HexLinkPuzzle, PuzzleGridCell } from "./puzzle-generator";

export class GameInstance {
    // properties
    readonly colors:PuzzleColorOptions;
    readonly difficulty: PuzzleDifficulty;
    readonly rings: number;
    readonly container: GridContainer;
    readonly cells?: Record<string, GameCell>;
    debugLayout: boolean;

    // computed properties:
    get cellSize(): ElementDimensions {
        const w = Math.floor(this.container.width / (this.rings * 2 + 1));
        const h = Math.sqrt(3)*w*.5; 
        return {width: w, height: h};
    }

    constructor(puzzle:HexLinkPuzzle, container:GridContainer, debugLayout:boolean = false) {
        this.colors = puzzle.colors;
        this.difficulty = puzzle.difficulty;
        this.rings = puzzle.rings;
        this.container = container;
        this.debugLayout = debugLayout;
        this.cells = Object.fromEntries(
            Object.entries(puzzle.cells as object).map(([key, value]) => [key, new GameCell(value.axialCoordinates)])
        );

        GameRenderer.render(this);
    }

}

export class GameCell extends PuzzleGridCell {
    readonly userColor:HexLinkColor|null = null;
    readonly userGuess:HexLinkColor|null = null;

    constructor(axialCoords:AxialCoordinates) {
        super(axialCoords);
    }

    scaleCoordinates(instance: GameInstance):NormalizedPixelLocation  {
        
        return Object.fromEntries(
            Object.entries(this.coordinates).map(([key, value]) => {
                const thisDimension =  key === 'x' ? instance.cellSize.width : instance.cellSize.height;
                const thisOrigin = key === 'x' ? instance.container.origin.x : instance.container.origin.y;
                return [key, (value*thisDimension*.6) + thisOrigin - (thisDimension / 2)]
            })
        ) as NormalizedPixelLocation
    }
}