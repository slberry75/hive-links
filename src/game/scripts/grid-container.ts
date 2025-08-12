import { GameInstance } from "./game-instance";

export class GridContainer {

    // properties
    instance?: GameInstance
    element:HTMLElement
    ringContainer: HTMLElement|null = null;
    cellContainers: HTMLElement[]|null = null;
    
    // computed properties
    get widthHeight(): number {
        const clientRect = this.element.getBoundingClientRect(); 
        return Math.max(clientRect.width, clientRect.height);
    }
    

    get origin():number {
        return this.widthHeight/2;
    }

    constructor(element:HTMLElement) {
        this.element = element;
    }

} 