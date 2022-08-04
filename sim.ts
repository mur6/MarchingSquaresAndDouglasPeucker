
export interface Vector {
    x: number
    y: number
}
// interface Line {
//     x: Vector
//     y: Vector
// }
class Line {
    private p1: Vector;
    private p2: Vector;
    // var Line = function (p1, p2) {
    //     this.p1 = p1;
    //     this.p2 = p2;


    constructor(p1: Vector, p2: Vector) {
        this.p1 = p1
        this.p2 = p2
    }

    // distanceToPoint(treasure: string) {
    //   this.secretPlace = treasure;
    // }
    distanceToPoint(point: Vector): number {
        // slope
        let m = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x)
        // y offset
        let b = this.p1.y - (m * this.p1.x)
        let d: number[] = []
        // distance to the linear equation
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        // distance to p1
        d.push(Math.sqrt(Math.pow((point.x - this.p1.x), 2) + Math.pow((point.y - this.p1.y), 2)));
        // distance to p2
        d.push(Math.sqrt(Math.pow((point.x - this.p2.x), 2) + Math.pow((point.y - this.p2.y), 2)));
        // return the smallest distance
        return d.sort(function (a, b) {
            return (a - b); //causes an array to be sorted numerically and ascending
        })[0];
    }
}


export function douglasPeucker(points: Vector[], tolerance: number) : Vector[]{
    if (points.length <= 2) {
        return [points[0]];
    }
    let returnPoints: Vector[] = []
    // make line from start to end
    let line = new Line(points[0], points[points.length - 1]),
        // find the largest distance from intermediate poitns to this line
        maxDistance = 0,
        maxDistanceIndex = 0,
        p;
    for (var i = 1; i <= points.length - 2; i++) {
        var distance = line.distanceToPoint(points[i]);
        if (distance > maxDistance) {
            maxDistance = distance;
            maxDistanceIndex = i;
        }
    }
    // check if the max distance is greater than our tollerance allows
    if (maxDistance >= tolerance) {
        p = points[maxDistanceIndex];
        line.distanceToPoint(p);
        // include this point in the output
        returnPoints = returnPoints.concat(douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
        // returnPoints.push( points[maxDistanceIndex] );
        returnPoints = returnPoints.concat(douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
    } else {
        // ditching this point
        p = points[maxDistanceIndex];
        line.distanceToPoint(p);
        returnPoints = [points[0]];
    }
    return returnPoints;
}


