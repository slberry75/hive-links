import { GameInstance } from "./game-instance";
import { GridContainer } from "./grid-container";
import { GameRenderer } from "./game-renderer";
import { HexLinkPuzzle } from "../../utils/hex-puzzle-components";
import { PuzzleGenerator } from "../../puzzle-generator/generator";

function getTestPuzzle(): HexLinkPuzzle {
    
    return new PuzzleGenerator(2).generate(); 
}

const gridContainer =  document.getElementById('hex-grid');

if (gridContainer) {
    const container = new GridContainer(gridContainer);
    container.instance = new GameInstance(getTestPuzzle(), container, true);
    window.addEventListener('resize', () => {
        if (container.instance) {
            GameRenderer.render(container.instance);
        }
    });
}
