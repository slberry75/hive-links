import { GameInstance } from "./game-instance";

export class GridContainer {

    // properties
    instance?: GameInstance
    element:HTMLElement
    ringContainer: HTMLElement|null = null;
    cellContainers: HTMLElement[]|null = null;
    
    // computed properties
    get width():number {
        return this.element.getBoundingClientRect().width;
    }
    get height():number {
        return this.element.getBoundingClientRect().height;
    }

    get origin():NormalizedPixelLocation {
        return {x: this.width/2, y: this.height/2};//this.height/2;
    }

    constructor(element:HTMLElement) {
        this.element = element;
    }

} 