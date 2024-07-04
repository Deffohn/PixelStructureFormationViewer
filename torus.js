const canvas = document.getElementById('torusCanvas');
const ctx = canvas.getContext('2d');
const heightSlider = document.getElementById('heightSlider');
const heightSliderValue = document.getElementById('heightSliderValue');
const gridStepSlider = document.getElementById('gridStepSlider');
const gridStepSliderValue = document.getElementById('gridStepSliderValue');

// TODO replace by value inputs
const figureRadius = 18; // in blocks
const tubeRadius = 7; // in blocks


const r = tubeRadius - 1;  // radius of the tube
const R = figureRadius - tubeRadius; // radius of the main circle

let gridStep = 4;
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

function customFloor(value) {
    let floor = Math.floor(value);
    if (value > 0 && floor === value) return Math.floor(value - 1);
    return floor;
}

function getPracticalHeight(height) {
// consider height to be an integer
    if (height === 0) return 0;
    else if (height > 0) return height - 0.5;
    else return height + 0.5;
}

function getTestPracticalHeight(height) {
// consider height to be an integer
    console.log(height);
    if (height === 0) return 0;
    else if (height > 0) return height - 0.5;
    else return height + 0.5;
}

function drawTorus() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    // Draw helping blocks
    let flip = true;
    for (let x = 0; x < Math.round(R) + r + 10; x++) {
        if (flip) ctx.fillStyle = 'darkgray';
        else ctx.fillStyle = 'lightgray';
        flip = !flip;

        ctx.fillRect(x*gridStep, 0, gridStep, gridStep);
    }
    flip = true;
    for (let y = 0; y < Math.round(R) + r + 10; y++) {
        if (flip) ctx.fillStyle = 'darkgray';
        else ctx.fillStyle = 'lightgray';
        flip = !flip;

        ctx.fillRect(0, y*gridStep, gridStep, gridStep);
    }

    // Process blocks
    const outerBlocks = [];
    const innerBlocks = [];
    // ROTATION_PRECISION should perfectly divide MAXIMAL_ROTATION_ANGLE
    const MAXIMAL_ROTATION_ANGLE = 0.5 * Math.PI;
    const ROTATION_PRECISION = MAXIMAL_ROTATION_ANGLE / 2500 ;
    for (let u = 0; u < MAXIMAL_ROTATION_ANGLE; u += ROTATION_PRECISION) {

        let gapToTubeCenter = r * Math.sqrt(1 - Math.pow(getPracticalHeight(z)/ r, 2));

        if (!gapToTubeCenter || gapToTubeCenter <= 0) continue;
        const blockOuter = {
            x: customFloor((R + gapToTubeCenter) * Math.cos(u) + 0.5),
            y: customFloor((R + gapToTubeCenter) * Math.sin(u) + 0.5),
        }
        const blockInner = {
            x: customFloor((R - gapToTubeCenter) * Math.cos(u) + 0.5),
            y: customFloor((R - gapToTubeCenter) * Math.sin(u) + 0.5),
        }
        
        if (outerBlocks.length == 0 || outerBlocks.length != 0 && !blockEquals(outerBlocks[outerBlocks.length - 1], blockOuter)) outerBlocks.push(blockOuter);
        if (innerBlocks.length == 0 || innerBlocks.length != 0 && !blockEquals(innerBlocks[innerBlocks.length - 1], blockInner)) innerBlocks.push(blockInner);
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
