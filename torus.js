const canvas = document.getElementById('torusCanvas');
const ctx = canvas.getContext('2d');
const heightSlider = document.getElementById('heightSlider');
const heightSliderValue = document.getElementById('heightSliderValue');
const gridStepSlider = document.getElementById('gridStepSlider');
const gridStepSliderValue = document.getElementById('gridStepSliderValue');

const R = 59.5; // radius of the main circle
const r = 18.5;  // radius of the tube

let gridStep = 2;
let z = 0;

heightSlider.addEventListener('input', () => {
    heightSliderValue.textContent = heightSlider.value;
    z = parseInt(heightSlider.value);
    drawTorus();
});

gridStepSlider.addEventListener('input', () => {
    gridStepSliderValue.textContent = gridStepSlider.value;
    gridStep = parseInt(gridStepSlider.value);
    drawTorus();
});

function blockEquals(block1, block2) {
    return block1.x == block2.x && block1.y == block2.y
}

function drawTorus() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Translate canvas origin to the center
    ctx.save();
    ctx.translate(- gridStep, - gridStep);

    // Process blocks
    const outerBlocks = [];
    const innerBlocks = [];
    for (let u = 0; u < 0.5 * Math.PI; u += 0.0002) {
        const blockOuter = {
            x: Math.round((R + r * Math.cos(Math.asin(z/r))) * Math.cos(u)),
            y: Math.round((R + r * Math.cos(Math.asin(z/r))) * Math.sin(u)),
        }
        const blockInner = {
            x: Math.round((R - r * Math.cos(Math.asin(z/r))) * Math.cos(u)),
            y: Math.round((R - r * Math.cos(Math.asin(z/r))) * Math.sin(u)),
        }
        
        if (outerBlocks.length == 0 || outerBlocks.length != 0 && !blockEquals(outerBlocks[outerBlocks.length - 1], blockOuter)) outerBlocks.push(blockOuter)
        if (innerBlocks.length == 0 || innerBlocks.length != 0 && !blockEquals(innerBlocks[innerBlocks.length - 1], blockInner)) innerBlocks.push(blockInner)
    }

    let flip = true;
    outerBlocks.forEach((block) => {
        if (flip) ctx.fillStyle = 'blue';
        else ctx.fillStyle = 'red';
        flip = !flip
        
        ctx.fillRect(block.x*gridStep, block.y*gridStep, gridStep, gridStep)
    })

    flip = true;
    innerBlocks.forEach((block) => {
        if (flip) ctx.fillStyle = 'blue';
        else ctx.fillStyle = 'red';
        flip = !flip
        ctx.fillRect(block.x*gridStep, block.y*gridStep, gridStep, gridStep)
    })


    // Draw the torus

    ctx.restore();
}

// Initial draw
drawTorus(0);
