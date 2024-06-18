const canvas = document.getElementById('torusCanvas');
const ctx = canvas.getContext('2d');
const heightSlider = document.getElementById('heightSlider');
const heightSliderValue = document.getElementById('heightSliderValue');
const gridStepSlider = document.getElementById('gridStepSlider');
const gridStepSliderValue = document.getElementById('gridStepSliderValue');

// TODO replace by value inputs
const figureRadius = 62; // in blocks
const tubeRadius = 20; // in blocks


const r = tubeRadius - 1;  // radius of the tube
const R = figureRadius - ( tubeRadius - 1 ); // radius of the main circle

console.log("R: " + R.toString())

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
    // ctx.translate(canvas.width/2, canvas.height/2);

    // TODO
    // // Draw helping blocks
    // let flip = true;
    // for (let x = 0; x < Math.round(R) + r + 10; x++) {
    //     if (flip) ctx.fillStyle = 'darkgray';
    //     else ctx.fillStyle = 'lightgray';
    //     flip = !flip;

    //     ctx.fillRect(x*gridStep, 0, gridStep, gridStep);
    // }
    // flip = true;
    // for (let y = 0; y < Math.round(R) + r + 10; y++) {
    //     if (flip) ctx.fillStyle = 'darkgray';
    //     else ctx.fillStyle = 'lightgray';
    //     flip = !flip;

    //     ctx.fillRect(0, y*gridStep, gridStep, gridStep);
    // }

    // Process blocks
    const outerBlocks = [];
    const innerBlocks = [];
    const ROTATION_PRECISION = 0.0001 * Math.PI ;
    // starting before the 0° angle due to rounded values, because first block would be skipped elseway
    for (let u = (-0.5 * Math.PI) / 8; u < 0.5 * Math.PI + (0.5 * Math.PI) / 8; u += ROTATION_PRECISION) {
        const blockOuter = {
            x: Math.floor((R + r * Math.cos(Math.asin(z/r))) * Math.cos(u) - 0.5),
            y: Math.floor((R + r * Math.cos(Math.asin(z/r))) * Math.sin(u) - 0.5),
        }
        const blockInner = {
            x: Math.floor((R - r * Math.cos(Math.asin(z/r))) * Math.cos(u) - 0.5),
            y: Math.floor((R - r * Math.cos(Math.asin(z/r))) * Math.sin(u) - 0.5),
        }
        if (blockOuter.x == 0) {
            console.log(R + " and " + r);
            console.log(blockOuter);
        }
        
        if (outerBlocks.length == 0 || outerBlocks.length != 0 && !blockEquals(outerBlocks[outerBlocks.length - 1], blockOuter)) outerBlocks.push(blockOuter)
        if (innerBlocks.length == 0 || innerBlocks.length != 0 && !blockEquals(innerBlocks[innerBlocks.length - 1], blockInner)) innerBlocks.push(blockInner)
    }

    // Draw Torus surface
    flip = true;
    outerBlocks.forEach((block) => {
        if (flip) ctx.fillStyle = 'blue';
        else ctx.fillStyle = 'red';
        flip = !flip;
        
        ctx.fillRect(block.x*gridStep, block.y*gridStep, gridStep, gridStep)
    })
    flip = true;
    innerBlocks.forEach((block) => {
        if (flip) ctx.fillStyle = 'blue';
        else ctx.fillStyle = 'red';
        flip = !flip;

        ctx.fillRect(block.x*gridStep, block.y*gridStep, gridStep, gridStep)
    })

    ctx.restore();
}

// Initial draw
drawTorus(0);
