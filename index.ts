import { getBlobOutlinePoints as getBlobOutlinePointsOpt } from './marching-sq'
import { douglasPeucker, type Vector } from './sim'

function getRandomItemFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

//let canvas
//, context;
//let gitHubPreviewHack = false;

export function init() {
    console.log("Init: ")
    //not sure why but this code just kept executing over and over again at
    //http://htmlpreview.github.io/?https://github.com/sakri/MarchingSquaresJS/blob/master/marchingSquaresTest.html
    //probably something with the readyStateCheckInterval?
    // if (gitHubPreviewHack) {
    //     return;
    // }
    // gitHubPreviewHack = true;

    //CREATE CANVAS
    let canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    let context = canvas.getContext("2d")!;
    var canvasContainer = document.getElementById("canvasContainer")!;
    canvasContainer.appendChild(canvas);
    canvas.width = 300;
    canvas.height = 300;

    //FILL CANVAS WITH A BLOB MADE OF RANDOM LETTERS
    var weights = ["normal", "bold", "bolder", "lighter"];
    var styles = ["normal", "italic", "oblique"];
    var fonts = ["serif", "sans-serif", "cursive", "fantasy"];
    context.textBaseline = "top";
    context.fillStyle = "#CCCCCC";

    var characters = ("ABCDEFGHIJKLMNOPQRSTUVXYZ1234567890").split("");
    var i, character;
    var numCharacters = 10;
    var radianIncrement = (Math.PI * 2) / numCharacters;

    var grifa = getRandomItemFromArray;
    for (i = 0; i < numCharacters; i++) {
        context.font = grifa(weights) + " " + grifa(styles) + " " + 80 + "px " + grifa(fonts);
        context.save();
        context.translate(150, 150);
        context.rotate(i * radianIncrement);
        character = grifa(characters);
        context.fillText(character, 0, 0);
        context.restore();
    }

    runMarchingSquaresOpt(canvas)
}

// function runMarchingSquaresOld() {
//     var start = new Date();
//     outlinePoints = MarchingSquaresOld.getBlobOutlinePoints(canvas);  // returns [x1,y1,x2,y2,x3,y3... etc.]
//     var result = document.getElementById("result");
//     result.innerHTML = "March (Old) took : " + (new Date() - start);
//     renderOutline();
// }

// function runMarchingSquares() {
//     var start = new Date();
//     outlinePoints = MarchingSquares.getBlobOutlinePoints(canvas);  // returns [x1,y1,x2,y2,x3,y3... etc.]
//     var result = document.getElementById("result");
//     result.innerHTML = "March (new) took : " + (new Date() - start);
//     renderOutline();
// }

function runMarchingSquaresOpt(canvas) {
    let start = new Date();
    let context = canvas.getContext('2d')!
    const width = canvas.width,
        height = canvas.height,
        data4 = context.getImageData(0, 0, width, height).data,  // Uint8ClampedArray
        len = width * height,
        data = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
        data[i] = data4[i << 2];
    }
    const outlinePoints = getBlobOutlinePointsOpt(data, width, height);  // returns [x1,y1,x2,y2,x3,y3... etc.]
    let result = document.getElementById("result")!;
    result.innerHTML = "March (new opt) took : " + (new Date().getTime() - start.getTime());
    renderOutline(context, outlinePoints);
}

// function runMarchingSquaresBenchmarks(ntimes = 20) {
//     var res = null;
//     // warm up
//     for (let i = 0; i < 5; ++i) {
//         res = MarchingSquaresOld.getBlobOutlinePoints(canvas);
//     }
//     // test
//     let time_old = performance.now();
//     for (let i = 0; i < ntimes; ++i) {
//         res = MarchingSquaresOld.getBlobOutlinePoints(canvas);
//     }
//     time_old = performance.now() - time_old;

//     // warm up
//     for (let i = 0; i < 5; ++i) {
//         res = MarchingSquares.getBlobOutlinePoints(canvas);
//     }
//     // test
//     let time_new = performance.now();
//     for (let i = 0; i < ntimes; ++i) {
//         res = MarchingSquares.getBlobOutlinePoints(canvas);
//     }
//     time_new = performance.now() - time_new;

//     // warm up
//     for (let i = 0; i < 5; ++i) {
//         res = MarchingSquaresOpt.getBlobOutlinePoints(canvas);
//     }
//     // test
//     let time_opt = performance.now();
//     for (let i = 0; i < ntimes; ++i) {
//         res = MarchingSquaresOpt.getBlobOutlinePoints(canvas);
//     }
//     time_opt = performance.now() - time_opt;

//     var result = document.getElementById("result");
//     result.innerHTML = '<table><tr><td>old</td><td>new</td><td>opt</td></tr>' +
//         '<tr><td>' + parseInt(time_old) + '</td><td>' + parseInt(time_new) + '</td><td>' +
//         parseInt(time_opt) + '</td></tr>' +
//         '<tr><td>' + parseInt(100 * time_old / time_new) + '%</td><td>100%</td><td style="font-weight: bold;">' +
//         parseInt(100 * time_opt / time_new) + '%</td></tr>' +
//         '<table>';
// }

// var timesRun = 0;
function* toVector(outlinePoints) {
    for (var i = 0; i < outlinePoints.length; i += 2) {
        const p: Vector = { x: outlinePoints[i], y: outlinePoints[i + 1] }
        yield p
    }
}

function renderOutline(context, outlinePoints) {
    //THIS IS IT, MARCHING SQUARES SAMPLE :
    context.fillStyle = "#FF0000"// : "#0000FF";
    // timesRun++;
    const points = Array.from(toVector(outlinePoints))

    //console.log(outlinePoints)
    const tolerance = 0.9
    let arr = douglasPeucker(points, tolerance)
    arr.push(points[points.length - 1]);
    //console.log(arr)

    for (let p of arr) {
        //context.fillRect(outlinePoints[i], outlinePoints[i + 1], 1, 1);
        context.fillRect(p.x, p.y, 1, 1);
    }
}

init();
// document!.getElementById("runMarchingSquaresOpt")!.addEventListener(
//     "click",
//     () => {
//         console.log("[キャプチャ]div要素のaddEventListener")
//         runMarchingSquaresOpt()
//     })
