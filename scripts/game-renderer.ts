import { GameCell, GameInstance } from "./game-instance";
import { createElementNSWithAttributes } from "./utils";

export class GameRenderer {

    static render(instance:GameInstance):void {
        instance.container.ringContainer = null; 
        
        if (instance.debugLayout) {
            this.renderLayoutDebug(instance);
        }
        if (instance.cells) {
            Object.values(instance.cells)
                .forEach(cell => {
                    const realCoords = cell.scaleCoordinates(instance);
                    const el = document.createElement('div');
                    el.dataset.axialCoordinates = cell.axialCoordinates.toString();
                    el.className = 'hex-cell-container';
                    el.style.width = `${instance.cellSize}px`;
                    el.style.top = `${realCoords.y}px`
                    el.style.left = `${realCoords.x}px`
                    el.appendChild(this.getCellHexagon(cell));
                    instance.container.cellContainers?.push(el);
                    instance.container.element.appendChild(el)
                }
            )
        }
    }

    static getCellHexagon(cell:GameCell):SVGElement {
        const svg = createElementNSWithAttributes('svg', {
                class:'game-cell',
                viewBox: '0 0 1 .866'    
            }); 
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
 
        const path = createElementNSWithAttributes('path', {
                d: 'M 0, .433 L .25, .866 L .75, .866 L 1, .433 L .75, 0 L .25, 0 Z',
                fill: 'currentColor'
            });
        
        svg.appendChild(path);
        return svg;
    }

    private static renderLayoutDebug(instance:GameInstance):void {
        const ringPercent = 100 / instance.rings;
        const ringContainer = document.createElement("div");
        ringContainer.className = "ring-container";
        ringContainer.style.margin = `${instance.cellSize/2}px`;
        ringContainer.style.width = `calc(100%-${instance.cellSize}px)`;

        instance.container.ringContainer = ringContainer;

        for(let i = 1; i <= instance.rings; i++) {
            const thisRingSize = ringPercent*i
            const ring = document.createElement("div");
            ring.className = "grid-ring";
            ring.style.width = `${thisRingSize}%`;
            ringContainer.appendChild(ring);
        }

        instance.container.element.appendChild(ringContainer);
    }

}