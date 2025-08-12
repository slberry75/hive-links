import { GameCell, GameInstance } from "./game-instance";
import { createElementNSWithAttributes } from "./utils";

export class GameRenderer {

    static render(instance:GameInstance):void {
        instance.container.element.replaceChildren();
        instance.container.cellContainers = [];

        instance.container.ringContainer = null; 
        
        if (instance.debugLayout) {
            this.renderLayoutDebug(instance);
        }
        if (instance.cells.length) {
            instance.cells.forEach((cell,idx) => {
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
            }) as SVGPathElement;
        
        const defs = createElementNSWithAttributes('defs');
        svg.appendChild(defs);

        const filterId = `emboss-${cell.axialCoordinates.toArray().join('_')}`;
        const filter = createElementNSWithAttributes('filter', {id: filterId});
        defs.appendChild(filter);

        let filterChildren:SVGElement[] = [
            createElementNSWithAttributes('feGaussianBlur', {in:'SourceAlpha', stdDeviation: '0.02', result: 'blur'} ),
            createElementNSWithAttributes('feOffset', {in:'blur', dx: '-0.01', dy: '-0.01', result: 'lightShadow'}),
            createElementNSWithAttributes("feFlood", {'flood-color':'rgba(255, 255, 255, 1)',result: 'lightColor'}),
            createElementNSWithAttributes("feComposite", {in:'lightColor', in2:'lightShadow', operator:'in', result:'lightHighlight'} ),
            createElementNSWithAttributes('feOffset', {in:'blur', dx:'0.01', dy: '0.01', result: 'darkShadow'}),
            createElementNSWithAttributes('feFlood', {'flood-color':'rgba(0, 0, 0, 0.1)', result: 'darkColor'} ),
            createElementNSWithAttributes('feComposite', {in:'darkColor', in2:'darkShadow', 'operator':'in',result:'darkHighlight'} ),
        ]
        
        filter.append(...filterChildren);

        const faMerge = createElementNSWithAttributes('feMerge');
        faMerge.append(
            createElementNSWithAttributes('feMergeNode', {in: 'darkHighlight'}),
            createElementNSWithAttributes('feMergeNode', {in: 'lightHighlight'}),
            createElementNSWithAttributes('feMergeNode', {in: 'SourceGraphic'}),
        )
        filter.appendChild(faMerge);

        path.setAttribute('filter', `url(#${filterId})`);
        
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