import { GameInstance } from "./game-instance";
import { GridContainer } from "./grid-container";
import { GameRenderer } from "./game-renderer";
import { HexLinkPuzzle } from "../../utils/hex-puzzle-components";
import { PuzzleGenerator } from "../../puzzle-generator/generator";


const gridContainer =  document.getElementById('hex-grid');

if (gridContainer) {
    const container = new GridContainer(gridContainer);
    const puzzle = new PuzzleGenerator().generate();
    console.log('Before instantiation', puzzle.cells.filter(c => c.clue));
    container.instance = new GameInstance(puzzle, container, true);
    window.addEventListener('resize', () => {
        if (container.instance) {
            GameRenderer.render(container.instance);
        }
    });
}
