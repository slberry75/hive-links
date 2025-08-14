import { HexLinkPuzzle } from "../utils/hex-puzzle-components";

const colorList = document.getElementById('color-list')! as HTMLDivElement;
function builderParams() {
    return {
        rings: Number((document.getElementById('rings-input') as HTMLInputElement).value) ,
        colors: includedColors()
    }
}
document.getElementById('export-puzzle')?.addEventListener('click', e => {
    console.log(builderParams());
});
 
function includedColors ():HexLinkColor[] {
    return JSON.parse(colorList.dataset.puzzleColors??'[]');
}
const initializeColorWidget = ():void =>
{
    const defaultColors:HexLinkColor[] = [
        [255, 87, 51],   // Coral red
        [153, 102, 255], // Purple
        [75, 192, 192],  // Teal
        [255, 206, 84],  // Golden yellow
        [255, 159, 64]   // Orange
    ];

    const colorControls = document.getElementById('color-controls')! as HTMLDivElement;
    const addColorBtn = document.getElementById("add-color")! as HTMLButtonElement;
    const saveColorBtn = document.getElementById('save-color')! as HTMLButtonElement;
    const cancelColorBtn = document.getElementById("cancel-color")! as HTMLButtonElement;
    const colorPicker = document.getElementById('color-picker')! as HTMLInputElement;
    let colorTimer = null;
    const warnStaleAfterSeconds = 5;


    colorList.replaceChildren();
    let defaultColorCount = 3;

    for(var i = 0; i<defaultColorCount; i++) {
        addColorItem(nextDefaultColor() ?? '')
    }

    function removeColorClickEvent(e:Event):void {
        const btn = e.currentTarget as HTMLButtonElement;
        const usedColors = includedColors()
        colorList.dataset.puzzleColors = JSON.stringify(usedColors.filter(c => c.toString() !== (JSON.parse(btn.dataset.puzzleColor ?? '[]') as []).join(',')));
        btn.parentElement?.remove();
    }

    function nextDefaultColor():HexLinkColor|undefined {
        let usedColors = includedColors().map(c => c.toString()) ?? [];
        return defaultColors.filter(c => !usedColors.includes(c.toString())).shift();
    }

    function addColorItem(color:string|[number,number,number]):void {
        if (typeof color === 'string') {
            color = color.replace('#','');
            if (color) {
                color = [
                    parseInt(color.substring(0, 2), 16),
                    parseInt(color.substring(2, 4), 16),
                    parseInt(color.substring(4, 6), 16)
                ]
            } else {
                color = nextDefaultColor() ?? [0, 0, 0]
            }
        }
        const newColors = includedColors()
        newColors.push(color)
        const bgColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        const colorItem = document.createElement('div');
        colorItem.innerHTML = `<div class="color-preview" style="background-color:${bgColor}"></div>`
        colorItem.classList.add('color-item');
        const removeBtn = document.createElement('button');
        removeBtn.dataset.puzzleColor=JSON.stringify(color)
        removeBtn.classList.add('remove-color');
        removeBtn.innerText = 'x';
        removeBtn.addEventListener('click', removeColorClickEvent);
        colorItem.append(removeBtn);
        colorList.append(colorItem);
        colorList.dataset.puzzleColors = JSON.stringify(newColors)
    }

    for (const btn of document.querySelectorAll('.remove-color:not(#cancel-color)')) {
        btn.addEventListener('click', removeColorClickEvent);
    }

    addColorBtn.addEventListener('click', (e) => {
        const btn = e.currentTarget as HTMLButtonElement
        colorControls.classList.add('active');
        colorTimer = setTimeout(() => {
            if (colorControls.classList.contains('active')) {
                colorControls.classList.add('stale');
            }
        },warnStaleAfterSeconds*1000)
        btn.innerHTML = 'Add Color'
    });

    saveColorBtn.addEventListener('click', e => {
            /// add the selected color to the colors
            const color = colorPicker.value;
            addColorItem(colorPicker.value);
            colorControls.classList.remove('active', 'stale');
            colorTimer = null;
    });    

    cancelColorBtn.addEventListener('click', e => {
        colorPicker.value = '';
        colorControls.classList.remove('active', 'stale');
        colorTimer = null;
    })
}

initializeColorWidget();
