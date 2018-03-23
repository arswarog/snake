let ItemType = {
	None: 'none',
	Head: 'head',
	Snake: 'snake',
	Portal: 'portal',
	Food: 'food',
}

class MapItem {
	constructor(map, td) {
		this._element = td;
		this._type = ItemType.None;
	}
	
	set type(value) {
		this._type = value;
		this._element.className = value;
	}
	
	get type() {
		return this._type;
	}
}

class Map {
	constructor(id, width, height) {
		this.width = width;
		this.height = height;
			
		this._map = document.createElement('table');
		let parent = document.getElementById(id);
		parent.appendChild(this._map);
		
		this.table();
	}

    // создаем поле
    table() {
		let tbody = document.createElement('tbody');
		this._map.appendChild(tbody);
		
		this.map = [];
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
}
class Game {
	constructor(id, width, height) {
		this.pole      = null;
		this.snake     = [];
		this.width     = 20;
		this.height    = 20;
		this.direction = 0;
		this.timer     = null;
		this.level     = 1;
		
		this.init(id);
	}

    init(id) {		
		this.pole = new Map(id, this.width, this.height);
		
        // получаем случайные координаты для головы змеи
        // но делаем отступ от края на 2 ячейки
        // что бы она сразу не врезалась в стену
        let x          = Math.floor(Math.random() * (this.width - 4)) + 2;
        let y          = Math.floor(Math.random() * (this.height - 4)) + 2;
        this.snake[0]  = {x: x, y: y};
        this.snake[1]  = {x: x, y: y};
        this.direction = Math.floor(Math.random() * 4);
        this.iteration();
		
		this.addFood(30);
    }
	
	addFood(count) {
		if (count == void 0) count = 1;
		
		for (let i = 0; i < count; i++) {
			let fail, x, y;
			do {
				fail = false;
				x = Math.floor(Math.random() * this.width);
				y = Math.floor(Math.random() * this.height);
				if (this.pole.map[x][y].type !== ItemType.None) continue;
				this.snake.forEach(item => {
					if (item.x === x && item.y === y) fail = true;
				});
			} while (fail);
			this.pole.map[x][y].type = ItemType.Food;
		}
    }

    // отображение тела змейки
    view() {
		return;
        // перерисовываем поле
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let type = ItemType.None;
                if (this.pole.map[x][y].type === ItemType.Food)
                    type = ItemType;
                if (this.pole.map[x][y].type === ItemType.Portal)
                    type = 'portal';
                this.pole.map[x][y].type = type;
            }
        }

        // обрабатываем змейку
        for (let i in this.snake) {
            let item = this.snake[i];
            if (i > 0)
            // Тело змейки
                this.setColor(item.x, item.y, 'snake');
            else
            // Голова змейки
                this.setColor(item.x, item.y, 'head');
        }
    }

    keyboard(key) {
        switch (key) {
            case 'ArrowUp':
                this.direction = 0;
                break;
            case 'ArrowRight':
                this.direction = 1;
                break;
            case 'ArrowDown':
                this.direction = 2;
                break;
            case 'ArrowLeft':
                this.direction = 3;
                break;
        }
    }

    iteration() {
		this.move();
		
		if (this.snake.length > 10) {
			//this.snake.length = 5;
			//this.levelUp();
		}
		
        this.view();
	}
	
	levelUp() {
		this.level++;
		console.log('Level up to level ' + this.level);
		this.start();
	}
	
	move(reversed) {
        // создаем новую голову с координатами старой
        let head = {
            x: this.snake[0].x,
            y: this.snake[0].y
        }
		
		console.log(head);

        // пересчитываем координаты головы с учетом направления движения
        switch (this.direction) {
            case 0:
                head.y--;
                break;
            case 1:
                head.x++;
                break;
            case 2:
                head.y++;
                break;
            case 3:
                head.x--;
                break;
        }
		
		if (head.x === this.width) head.x = 0;
		if (head.x < 0) head.x = this.width - 1;
		if (head.y === this.height) head.y = 0;
		if (head.y < 0) head.y = this.height - 1;
		
		if (head.x === this.snake[1].x && head.y === this.snake[1].y) {
			if (reversed) {
				console.log(1, this.direction);
				this.direction = (this.direction + 2) % 4;
				console.log(2, this.direction);
				return this.move();
			} else {
				this.snake.reverse();
				return this.move(true);
			}
		}
		
		if (this.pole.map[head.x][head.y].type === ItemType.Food) {
			this.pole.map[head.x][head.y].type = ItemType.None;
			this.addFood();
			this.snake.push(null);
		}

        this.snake.unshift(head);
		let tail = this.snake.pop();
		if (tail)
			this.pole.map[tail.x][tail.y].type = ItemType.None;
		
		this.pole.map[head.x][head.y].type = ItemType.Head;
		this.pole.map[this.snake[1].x][this.snake[1].y].type = ItemType.Snake;
    }
	
	start() {
		if (this.timer)
			clearInterval(this.timer);
		
		this.timer = setInterval(() => this.iteration(), Math.round(500 / this.level));
	}
};

let game = new Game('snake', 10, 10);
game.view();
game.start();

document.addEventListener('keydown', (event) => game.keyboard(event.key), false);
