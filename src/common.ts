export enum ItemType {
    None   = 'none',
    Head   = 'head',
    Snake  = 'snake',
    Portal = 'portal',
    Food   = 'food',
}

export interface IMap {
    width: number;
    height: number;
    map: IMapItem[][];

    init(width, height);
    display(snake: Point[]);
}

export interface IMapItem {
    type: ItemType;
}

export class Point {
    public x: number;
    public y: number;

    constructor(point: Point);
    constructor(x: number, y: number);
    constructor(x: any, y?: number) {
        if (typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }
}

export enum Direction {
    Up    = 'up',
    Right = 'right',
    Down  = 'down',
    Left  = 'left',
}