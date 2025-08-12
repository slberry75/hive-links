import { GameInstance } from "./game-instance";
import { GridContainer } from "./grid-container";
import { GameRenderer } from "./game-renderer";
import { HexLinkPuzzle } from "./puzzle-generator";

function getTestPuzzle(): HexLinkPuzzle {
    
    return new HexLinkPuzzle(
        [
            [93,0,255],
            [255,166,0],
            [255,0,153]
        ], 'easy',
        2
    );
}

const gridContainer =  document.getElementById('hex-grid');

if (gridContainer) {
    const container = new GridContainer(gridContainer);
    container.instance = new GameInstance(getTestPuzzle(), container);
    window.addEventListener('resize', () => {
        if (container.instance) {
            GameRenderer.render(container.instance);
        }
    });
}
