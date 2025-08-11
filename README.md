# 🐝 Hive Links

A hexagonal logic puzzle game where players fill honeycomb grids with colors following constraint-based rules.

## 🎮 Game Rules

Fill the hexagonal grid with colors so that:
- **Each numbered cell has exactly that many neighbors of the same color**
- **All cells of each color form one connected group** 
- **No single cell is completely surrounded by different colors**

## 🎯 Current Status

**Visual Foundation Complete:**
- ✅ SVG hexagon grid with embossed glass effect
- ✅ Golden honeycomb aesthetic
- ✅ Responsive coordinate system
- ✅ Clean axial coordinate math

**In Progress:**
- 🔄 Puzzle generation and validation
- 🔄 Click interactions and game state
- 🔄 React migration for advanced UI

## 🛠️ Technology Stack

- **Frontend**: TypeScript, HTML5, CSS3, SVG
- **Build Tool**: Vite
- **Coordinate System**: Axial coordinates for hexagonal grids
- **Planned**: React for component architecture

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
git clone https://github.com/yourusername/hive-links.git
cd hive-links
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🏗️ Architecture

### Current Structure
```
src/
├── scripts/
│   ├── game-instance.ts      # Game state management
│   ├── game-renderer.ts      # SVG rendering logic
│   ├── puzzle-generator.ts   # Coordinate system & puzzle data
│   ├── grid-container.ts     # Container management
│   ├── utils.ts             # SVG helper functions
│   └── types.ts             # TypeScript definitions
├── styles.css               # Golden hive theme
└── index.html              # Entry point
```

### Planned Structure
```
project/
├── src/                    # React game application
├── puzzle-generator/       # Standalone puzzle creation tool
├── public/puzzles/         # Generated puzzle JSON files
└── ...
```

## 🎨 Design Philosophy

**Inspired by Conceptis Games:**
- Clean, minimal interface
- Hidden secondary controls in dropdown menus
- Focus on puzzle-solving experience
- Professional puzzle game aesthetics

**Visual Theme:**
- Golden honeycomb color palette
- Embossed glass hexagon effects
- Warm, inviting hive atmosphere

## 🔮 Roadmap

### Phase 1: Core Game Mechanics
- [ ] Manual test puzzle creation
- [ ] Click interactions for color selection
- [ ] Puzzle validation and win detection
- [ ] Basic game state management

### Phase 2: Advanced Features  
- [ ] React component migration
- [ ] Game selection page
- [ ] Instructions modal
- [ ] Undo/redo functionality
- [ ] Hint system

### Phase 3: Puzzle Generation
- [ ] Standalone puzzle generator tool
- [ ] Algorithmic puzzle creation
- [ ] Difficulty analysis
- [ ] Large puzzle library generation

### Phase 4: Polish & Distribution
- [ ] Mobile optimization
- [ ] Progressive Web App features
- [ ] Local storage for progress
- [ ] Accessibility improvements

## 🤝 Contributing

This is currently a personal learning project, but suggestions and feedback are welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by Conceptis puzzle games for UI/UX patterns
- Hexagonal grid math based on Red Blob Games hex grid guide
- SVG filter techniques for visual effects
