export const AxialOffsets =  [
    [1, 0, -1], // Right        
    [1, -1, 0], // Top Right  
    [0, -1, 1], // Top Left
    [-1, 0, 1], // Left   
    [-1, 1, 0], // Bottom Left
    [0, 1, -1]  // Bottom Right
];

export class AxialCoordinates {
    // properties
    readonly q: number;
    readonly r: number;
    readonly s: number;

    constructor(coords:[number,number,number]);
    constructor(q:number,r:number,s:number);
    constructor(qOrCoords:[number,number,number]|number, r?: number, s?: number) {
        if (Array.isArray(qOrCoords)) 
        {
            r = qOrCoords[1];
            s = qOrCoords[2];
            qOrCoords = qOrCoords[0];
        }
          
        if (r === undefined || s === undefined)  
        {
            throw new Error("Invalid instantiation of Axial Coordinates");
        }
        else if (Math.abs(qOrCoords + r + s) > 0.0001)
        {
            throw new Error(`Invalid axial coordinates: ${[qOrCoords, r, s]}`);
        }
        else
        {
            this.q = qOrCoords;
            this.r = r;
            this.s = s;   
        }
    }

    toArray():[number,number,number] {
        return [this.q, this.r, this.s]
    }

    toString():string {
        return JSON.stringify(this.toArray());
    }
}