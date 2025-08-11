type PuzzleDifficulty = "easy" | "medium" | "hard";

type HexLinkColor = [number, number, number]

type PuzzleColorOptions = [HexLinkColor, HexLinkColor, ...HexLinkColor[]];

type NormalizedPixelLocation = {
    x: number;
    y: number;
}

type ElementDimensions = {
    width: number;
    height: number;
}
type PuzzleClue = {
    color?: HexLinkColor;
    matches?: number;
}