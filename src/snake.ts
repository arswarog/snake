import { Direction, IMap, ItemType, Point } from './common';

export class Snake {
    public snake: Point[]       = [];
    public direction: Direction = Direction.Up;
    public timer: number        = null;
    public level: number        = 4;

    constructor(public pole: IMap, public width: number, public height: number) {
        pole.init(width, height);
        // получаем случайные координаты для головы змеи
        // но делаем отступ от края на 2 ячейки
        // что бы она сразу не врезалась в стену
        let x          = Math.floor(Math.random() * (this.width - 4)) + 2;
        let y          = Math.floor(Math.random() * (this.height - 4)) + 2;
        this.snake[0]  = { x: x, y: y };
        this.snake[1]  = { x: x, y: y };
        this.direction = [
            Direction.Up,
            Direction.Right,
            Direction.Down,
            Direction.Left,
        ][Math.floor(Math.random() * 4)];
        this.iteration();

        this.addFood(1000);
    }

    addFood(count: number = 1) {
        for (let i = 0; i < count; i++) {
            let fail, x, y;
            do {
                fail = false;
                x    = Math.floor(Math.random() * this.width);
                y    = Math.floor(Math.random() * this.height);
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
        this.pole.display(this.snake);
    }

    keyboard(key) {
        switch (key) {
            case 'ArrowUp':
                this.direction = Direction.Up;
                break;
            case 'ArrowRight':
                this.direction = Direction.Right;
                break;
            case 'ArrowDown':
                this.direction = Direction.Down;
                break;
            case 'ArrowLeft':
                this.direction = Direction.Left;
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

    move(reversed = false) {
        // создаем новую голову с координатами старой
        let head: Point = new Point(this.snake[0]);

//        console.log(head);

        // пересчитываем координаты головы с учетом направления движения
        switch (this.direction) {
            case Direction.Up:
                head.y--;
                break;
            case Direction.Right:
                head.x++;
                break;
            case Direction.Down:
                head.y++;
                break;
            case Direction.Left:
                head.x--;
                break;
        }

        if (head.x === this.width) head.x = 0;
        if (head.x < 0) head.x = this.width - 1;
        if (head.y === this.height) head.y = 0;
        if (head.y < 0) head.y = this.height - 1;

        if (head.x === this.snake[1].x && head.y === this.snake[1].y) {
            if (reversed) {
                switch (this.direction) {
                    case Direction.Up:
                        this.direction = Direction.Down;
                        break;
                    case Direction.Right:
                        this.direction = Direction.Left;
                        break;
                    case Direction.Down:
                        this.direction = Direction.Up;
                        break;
                    case Direction.Left:
                        this.direction = Direction.Right;
                        break;
                }

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

        this.pole.map[head.x][head.y].type                   = ItemType.Head;
        this.pole.map[this.snake[1].x][this.snake[1].y].type = ItemType.Snake;
    }

    start() {
        if (this.timer)
            clearInterval(this.timer);

        this.timer = setInterval(() => this.iteration(), Math.round(500 / this.level));
    }
}
