import { IMap, IMapItem, ItemType, Point } from '../common';

export class ViewItem implements IMapItem {
    private _map: FixedMap;
    private _element: any;
    private _type: ItemType;

    constructor(map: FixedMap, td: any) {
        this._map     = map;
        this._element = td;
        this._type    = ItemType.None;
    }

    set type(value: ItemType) {
        if (value === this._type)
            return;
        this._map.changes++;
        this._type              = value;
        this._element.className = value;
    }

    get type(): ItemType {
        return this._type;
    }
}

export class MapItem implements IMapItem {
    type: ItemType = ItemType.None;
}

export class FixedMap implements IMap {
    public width: number;
    public height: number;
    public map: MapItem[][];
    private _map: any;
    private _viewport: ViewItem[][];
    public changes: number = 0;

    private _left: number;
    private _right: number;
    private _top: number;
    private _bottom: number;

    constructor(id: string, public wpWidth: number = 21, public wpHeight: number = 21) {
        this._right  = Math.ceil((wpWidth - 1) / 2);
        this._left   = -Math.floor((wpWidth - 1) / 2);
        this._bottom = Math.ceil((wpWidth - 1) / 2);
        this._top    = -Math.floor((wpWidth - 1) / 2);

        this._map  = document.createElement('table');
        let parent = document.getElementById(id);
        parent.appendChild(this._map);
    }

    init(width: number, height: number) {
        this.width  = width;
        this.height = height;

        this.generate();
    }

    // создаем поле
    generate() {
        let tbody = document.createElement('tbody');
        this._map.appendChild(tbody);

        this.map        = [];
        this.map.length = this.width;
        for (let x = 0; x < this.width; x++) {
            this.map[x] = [];
            for (let y = 0; y < this.height; y++)
                this.map[x][y] = new MapItem();
        }

        this._viewport        = [];
        this._viewport.length = this.wpWidth;
        for (let i = 0; i < this.wpWidth; i++)
            this._viewport[i] = [];

        for (let y = 0; y < this.wpHeight; y++) {
            let tr = document.createElement('tr');
            tbody.appendChild(tr);
            for (let x = 0; x < this.wpWidth; x++) {
                let td = document.createElement('td');
                tr.appendChild(td);
                this._viewport[x][y] = new ViewItem(this, td);
            }
        }

//        console.log(this.map, this._viewport);
    }

    display(snake: Point[]) {
        this.changes = 0;
        // обрабатываем змейку
        snake.forEach((item, index) => {
            if (index > 0)
            // Тело змейки
                this.map[item.x][item.y].type = ItemType.Snake;
        });
        // Голова змейки
        this.map[snake[0].x][snake[0].y].type = ItemType.Head;

        let center = new Point(snake[0]);
        for (let dx = this._left; dx < this._right; dx++) {
            for (let dy = this._top; dy < this._bottom; dy++) {
                let x  = dx + center.x;
                let y  = dy + center.y;
                let vx = dx - this._left;
                let vy = dy - this._top;
//                console.log(x, y, dx, dy, vx, vy);
                if (x < 0) x += this.width;
                if (x >= this.width) x -= this.width;
                if (y < 0) y += this.height;
                if (y >= this.height) y -= this.height;
//                console.log(x, y);
//                console.log(this.map[x]);
//                console.log(this.map[x][y]);
                this._viewport[vx][vy].type = this.map[x][y].type;
            }
        }

        console.log('changes', this.changes);
    }
}