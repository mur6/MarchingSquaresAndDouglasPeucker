export function getBlobOutlinePoints(source_array: Uint8Array, width, height) {
    // Note: object should not be on the border of the array, since there is
    //       no padding of 1 pixel to handle points which touch edges

    // if (source_array instanceof HTMLCanvasElement){
    //     width = source_array.width;
    //     height = source_array.height;
    //     const data4 = source_array.getContext('2d').getImageData(0, 0, width, height).data,  // Uint8ClampedArray
    //     len = width * height,
    //     data = new Uint8Array(len);
    //     for (let i = 0; i < len; ++i){
    //         data[i] = data4[i << 2];
    //     }
    //     source_array = data;
    // } else if (0 == height){
    //     height = (source_array.length / width)|0;
    // }
    //height = (source_array.length / width)

    // find the starting point
    const startingPoint = getFirstNonTransparentPixelTopDown(source_array, width, height);
    if (null === startingPoint) {
        console.log('[Warning] Marching Squares could not find an object in the given array');
        return [];
    }
    console.log(`getFirstNonTransparentPixelTopDown: ${startingPoint}`)

    // return list of w and h positions
    return walkPerimeter(source_array, width, height, startingPoint.w, startingPoint.h);
};

const getFirstNonTransparentPixelTopDown = (source_array, width, height): { w: number, h: number } | null => {
    let idx;
    for (let h = 0 | 0; h < height; ++h) {
        idx = (h * width) | 0;
        for (let w = 0 | 0; w < width; ++w) {
            if (source_array[idx] > 0) {
                return { w: w, h: h };
            }
            ++idx;
        }
    }
    return null;
}

function walkPerimeter(source_array, width, height, start_w: number, start_h: number): number[] {
    // const width = width|0;
    // const height = height|0;

    // Set up our return list
    let point_list: number[] = []
    let up = 1 | 0, left = 2 | 0, down = 3 | 0, right = 4 | 0;
    const step_func = step;

    let idx: number = 0// = 0 | 0  // Note: initialize it with an integer, so the JS interpreter optimizes for this type.

    // our current x and y positions, initialized
    // to the init values passed in
    let w = start_w
    let h = start_h

    // the main while loop, continues stepping until
    // we return to our initial points
    let next_step;
    console.log("walkPerimeter: start")
    do {
        // evaluate our state, and set up our next direction
        idx = (h - 1) * width + (w - 1);
        next_step = step_func(idx, source_array, width);

        // if our current point is within our image
        // add it to the list of points
        if (w >= 0 && w < width && h >= 0 && h < height) {
            point_list.push(w - 1, h);
        }

        switch (next_step) {
            case up: --h; break;
            case left: --w; break;
            case down: ++h; break;
            case right: ++w; break;
            default:
                break;
        }
        //console.log(w, start_w, "  : ", h, start_h)
    } while (w != start_w || h != start_h);
    console.log("walkPerimeter: end")

    point_list.push(w, h);

    return point_list;
}

// determines and sets the state of the 4 pixels that
// represent our current state, and sets our current and
// previous directions

function step(idx, source_array, width) {
    //console.log('Sakri.step()');
    // Scan our 4 pixel area
    //Sakri.imageData = Sakri.sourceContext.getImageData(x-1, y-1, 2, 2).data;

    const up_left = 0 < source_array[idx + 1],
        up_right = 0 < source_array[idx + 2],
        down_left = 0 < source_array[idx + width + 1],
        down_right = 0 < source_array[idx + width + 2],
        none = 0 | 0, up = 1 | 0, left = 2 | 0, down = 3 | 0, right = 4 | 0;

    // Determine which state we are in
    let state = 0 | 0;

    if (up_left) { state |= 1; }
    if (up_right) { state |= 2; }
    if (down_left) { state |= 4; }
    if (down_right) { state |= 8; }

    // State now contains a number between 0 and 15
    // representing our state.
    // In binary, it looks like 0000-1111 (in binary)

    // An example. Let's say the top two pixels are filled,
    // and the bottom two are empty.
    // Stepping through the if statements above with a state
    // of 0b0000 initially produces:
    // Upper Left == true ==>  0b0001
    // Upper Right == true ==> 0b0011
    // The others are false, so 0b0011 is our state
    // (That's 3 in decimal.)

    // Looking at the chart above, we see that state
    // corresponds to a move right, so in our switch statement
    // below, we add a case for 3, and assign Right as the
    // direction of the next step. We repeat this process
    // for all 16 states.

    // So we can use a switch statement to determine our
    // next direction based on
    let next_step;
    switch (state) {
        case 1: next_step = up; break;
        case 2: next_step = right; break;
        case 3: next_step = right; break;
        case 4: next_step = left; break;
        case 5: next_step = up; break;
        case 6:
            if (next_step == up) {  // info from previous_step
                next_step = left;
            } else {
                next_step = right;
            }
            break;
        case 7: next_step = right; break;
        case 8: next_step = down; break;
        case 9:
            if (next_step == right) {  // info from previous_step
                next_step = up;
            } else {
                next_step = down;
            }
            break;
        case 10: next_step = down; break;
        case 11: next_step = down; break;
        case 12: next_step = left; break;
        case 13: next_step = up; break;
        case 14: next_step = left; break;
        default:
            next_step = none;  // this should never happen
            break;
    }
    return next_step;
}
