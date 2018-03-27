import { IMap, IMapItem, ItemType, Point } from '../common';

export class MapItem implements IMapItem {
    private _element: any;
    private _type: ItemType;

    constructor(map, td) {
        this._element = td;
        this._type    = ItemType.None;
    }

    set type(value: ItemType) {
        if (value === this._type)
            return;
        this._type              = value;
        this._element.className = value;
    }

    get type(): ItemType {
        return this._type;
    }
}

export class ClientMap implements IMap {
    public width: number;
    public height: number;
    public map: MapItem[][];
    private _map: any;

    constructor(id: string) {
        this._map  = document.createElement('table');
        let parent = document.getElementById(id);
        parent.appendChild(this._map);
    }

    init(width, height) {
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
        for (let i = 0; i < this.width; i++)
            this.map[i] = [];

        for (let y = 0; y < this.height; y++) {
            let tr = document.createElement('tr');
            tbody.appendChild(tr);
            for (let x = 0; x < this.width; x++) {
                let td = document.createElement('td');
                tr.appendChild(td);
                this.map[x][y] = new MapItem(this, td);
            }
        }
    }

    display(snake: Point[]) {
        // обрабатываем змейку
        snake.forEach((item, index) => {
            if (index > 0)
            // Тело змейки
                this.map[item.x][item.y].type = ItemType.Snake;
        });
        // Голова змейки
        this.map[snake[0].x][snake[0].y].type = ItemType.Head;
    }
}
