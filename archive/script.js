// Cube coordinate system for hexagons
// This makes neighbor calculations much easier!
class CubeHex {
    constructor(q, r, s) {
        this.q = q;  // x-axis
        this.r = r;  // y-axis  
        this.s = s;  // z-axis
            
        // Cube coordinates must always sum to zero
        if (Math.abs(q + r + s) > 0.0001) {
            throw new Error(`Invalid cube coordinates: q=${q}, r=${r}, s=${s}`);
        }
    }
    
    // Create from axial coordinates (what we'll use for positioning)
    static fromAxial(q, r) {
        return new CubeHex(q, r, -q - r);
    }
    
    // Convert to screen coordinates for CSS positioning
    toPixel(size = 35) {
        const x = size * (3/2 * this.q);
        const y = size * (Math.sqrt(3)/2 * this.q + Math.sqrt(3) * this.r);
        return { x: x + 250, y: y + 200 }; // Center in our container
    }
    
    // Get all 6 neighbors
    neighbors() {
        const directions = [
            [+1, -1,  0], [+1,  0, -1], [ 0, +1, -1],
            [-1, +1,  0], [-1,  0, +1], [ 0, -1, +1]
        ];
        
        return directions.map(([dq, dr, ds]) => 
            new CubeHex(this.q + dq, this.r + dr, this.s + ds)
        );
    }
    
    // Distance between two hexes
    static distance(a, b) {
        return Math.max(
            Math.abs(a.q - b.q),
            Math.abs(a.r - b.r),
            Math.abs(a.s - b.s)
        );
    }
    
    // Convert to string key for maps/sets
    toString() {
        return `${this.q},${this.r},${this.s}`;
    }
    
    // Check if two hexes are equal
    equals(other) {
        return this.q === other.q && this.r === other.r && this.s === other.s;
    }
}

// Game state management
class HiveLinksGame {
    constructor() {
        this.hexes = new Map(); // coord string -> {hex: CubeHex, state: 'empty'|'light'|'dark', clue: number}
        this.gridElement = document.getElementById('hex-grid');
        this.statusElement = document.getElementById('status');
        this.interactionMode = 'paint'; // 'paint' or 'hint'
        this.selectedColorIndex = 0; 

        this.colors = [
            [76, 175, 80],   // Green  
            [33, 150, 243],  // Blue
            [244, 67, 54]    // Red
        ];
        this.init();
    }
    
    init() {
        this.generateColorStyles(this.colors);
        this.createGrid();
        this.render();
        this.updateStatus("Click hexagons to change their color!");
    }

    generateColorStyles(colors) {
        let css = '';
        colors.forEach((rgb, index) => {
            const [r, g, b] = rgb;
            css += `
                /******************************************/
                /* Color ${index} - rgb(${r}, ${g}, ${b}) */
                /******************************************/
                .hex[data-color="${index}"] .hex-shape {
                    background: rgb(${r}, ${g}, ${b});
                    color: white;
                }
                .hex.hinted[data-color="${index}"] .hex-shape {
                    background: transparent;
                    box-shadow: inset 0 0 10px 10px rgba(${r}, ${g}, ${b}, 0.5);
                }
            `;
        });

        // Update or create style tag
        let styleTag = document.getElementById('dynamic-colors');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-colors';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = css;

    }
    
    // Create a simple 7-hex flower pattern (center + 6 neighbors)
createGrid() {
    const center = CubeHex.fromAxial(0, 0);
    const positions = [center, ...center.neighbors()];
    
        positions.forEach((hex, index) => {
            let hexData = {
                hex: hex,
                state: 'empty',
                hinted: false,
                clueType: null,  // 'colored', 'numbered', 'prefilled', or null
                clue: null,      // number for numbered/colored clues
                locked: false    // true for colored/prefilled cells
            };
            
            // Example puzzle setup - you can change this
            if (index === 0) {
                // Center: colored clue (red with 2 neighbors)
                hexData.clueType = 'colored';
                hexData.clue = 2;
                hexData.state = '0';  // Red (index 0 in colors array)
                hexData.locked = true;
            } else if (index === 1) {
                // First neighbor: just numbered clue
                hexData.clueType = 'numbered';
                hexData.clue = 1;
            } else if (index === 3) {
                // Third neighbor: pre-filled blue
                hexData.clueType = 'prefilled';
                hexData.state = '1';  // Blue
                hexData.locked = true;
            }
            
            this.hexes.set(hex.toString(), hexData);
        });
    }

    // Render all hexagons to the DOM
    render() {
        this.gridElement.innerHTML = '';
        
        this.hexes.forEach((data, key) => {
            const hexElement = this.createHexElement(data);
            this.gridElement.appendChild(hexElement);
        });
    }
    
    // Create a single hex DOM element
    createHexElement(data) {
        const { hex, state, clue, hinted, clueType, locked } = data;
        const pixel = hex.toPixel();
        
        const hexDiv = document.createElement('div');
        
        // Build class string
        let classes = ['hex'];
        if (state === 'empty') classes.push('empty');
        if (hinted) classes.push('hinted');
        if (locked) classes.push('locked');
        if (clueType) classes.push(`clue-${clueType}`);
        
        hexDiv.className = classes.join(' ');
        
        // Set data-color for non-empty states
        if (state !== 'empty') {
            hexDiv.setAttribute('data-color', state);
        }

        hexDiv.style.left = `${pixel.x - 30}px`;
        hexDiv.style.top = `${pixel.y - 30}px`;
        
        const hexShape = document.createElement('div');
        hexShape.className = 'hex-shape';
        
        // Show clue number if it exists
        hexShape.textContent = clue !== null ? clue : '';
        
        hexDiv.appendChild(hexShape);
        hexDiv.addEventListener('click', () => this.handleHexClick(hex));
        
        return hexDiv;
    }
    
    // Handle clicking on a hex
    handleHexClick(hex) {
        console.log(hex);
        const key = hex.toString();
        const data = this.hexes.get(key);
        
        if (!data || data.locked) return;
        
        const states = ['empty', ...Array.from({length: this.colors.length}, (_, i) => i.toString())];
        if (this.interactionMode === 'hint' != data.hinted) {
            data.state = 'empty';
        }
        const currentIndex = states.indexOf(data.state);
        const nextIndex = (currentIndex + 1) % states.length;
        
        data.state = states[nextIndex];
        data.hinted = this.interactionMode === 'hint';
        
        this.render();
        this.checkNeighborCounts();
    }
    
    // Check if neighbor counts match clues
    checkNeighborCounts() {
        let allCorrect = true;
        let messages = [];
        
        this.hexes.forEach((data, key) => {
            if (data.clue !== null) {
                const neighborCount = this.countSameColorNeighbors(data.hex, data.state);
                const isCorrect = neighborCount === data.clue;
                
                if (!isCorrect) {
                    allCorrect = false;
                }
                
                messages.push(`${data.clue}-clue: ${neighborCount}/${data.clue} neighbors ${isCorrect ? '✓' : '✗'}`);
            }
        });
        
        this.updateStatus(messages.join(' | '));
        
        if (allCorrect && this.hasAnyColors()) {
            this.updateStatus("🎉 Clues satisfied! Now check connectivity rules...");
        }
    }
    
    // Count neighbors with same color as given hex
    countSameColorNeighbors(hex, state) {
        if (state === 'empty') return 0;
        
        const neighbors = hex.neighbors();
        let count = 0;
        
        neighbors.forEach(neighbor => {
            const neighborData = this.hexes.get(neighbor.toString());
            if (neighborData && neighborData.state === state) {
                count++;
            }
        });
        
        return count;
    }
    
    // Check if player has placed any colors
    hasAnyColors() {
        for (let [key, data] of this.hexes) {
            if (data.state !== 'empty') return true;
        }
        return false;
    }
    
    // Update status display
    updateStatus(message) {
        this.statusElement.textContent = message;
    }
    
    // Game controls
    newGame() {
        this.updateStatus("New game! Try to make the center hex have exactly 2 same-color neighbors.");
        // For now, just reset
        this.reset();
    }
    
    reset() {
        this.hexes.forEach(data => {
            data.state = 'empty';
            data.hinted = false;
        });
        this.render();
        this.updateStatus(`Grid reset! Mode: ${this.interactionMode === 'paint' ? 'Paint colors' : 'Mark hints'}`);
    }
    
    checkSolution() {
        this.checkNeighborCounts();
        // TODO: Add connectivity and no-holes checks
    }
    
    toggleMode() {
        this.interactionMode = this.interactionMode === 'paint' ? 'hint' : 'paint';
        const modeText = this.interactionMode === 'paint' ? 'Paint colors' : 'Mark hints';
        this.updateStatus(`Mode: ${modeText} - Click hexes to ${this.interactionMode === 'paint' ? 'change colors' : 'mark/unmark'}`);
    }
}

// Initialize the game when page loads
let game;

document.addEventListener('DOMContentLoaded', function() {
    console.log("Starting Hive Links...");
    game = new HiveLinksGame();
    console.log("Game initialized with cube coordinate system!");
});