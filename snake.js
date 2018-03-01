let game = {
    pole     : [],
    snake    : [],
    width    : 20,
    height   : 20,
    direction: 0,

    init: function () {
        // Обнуляем все поле
        for (let x = 0; x < this.width; x++) {
            this.pole[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.pole[x][y] = 0;
            }
        }

        // получаем случайные координаты для головы змеи
        // но делаем отступ от края на 2 ячейки
        // что бы она сразу не врезалась в стену
        let x          = Math.floor(Math.random() * (this.width - 4)) + 2;
        let y          = Math.floor(Math.random() * (this.height - 4)) + 2;
        this.snake[0]  = {x: x, y: y};
        this.snake[1]  = {x: x, y: y};
        this.direction = Math.floor(Math.random() * 4);
        this.iteration();
    },

    // создаем поле
    table: function () {
        document.write('<table>');
        for (let x = 0; x < this.width; x++) {
            document.write('<tr>')
            for (let y = 0; y < this.height; y++) {
                document.write(`<td id="${x}-${y}"></td>`);
            }
            document.write('</tr>');
        }
        document.write('</table>');
    },

    // функция для задания цвета отдельной ячейки
    setColor: function (x, y, color) {
        $(`#${x}-${y}`).css('background-color', color);
    },

    // отображение тела змейки
    view: function () {
        // перерисовываем поле
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                let color = '#f5f5f5';
                if (this.pole[x][y])
                    color = '#097054';
                this.setColor(x, y, color);
            }
        }

        // обрабатываем змейку
        for (let i in this.snake) {
            let item = this.snake[i];
            if (i > 0)
            // Тело змейки
                this.setColor(item.x, item.y, '#ff9900');
            else
            // Голова змейки
                this.setColor(item.x, item.y, '#6599ff');
        }
    },

    iteration: function () {
        // создаем новую голову с координатами старой
        let head = {
            x: this.snake[0].x,
            y: this.snake[0].y
        }

        // пересчитываем координаты головы с учетом направления движения
        switch (this.direction) {
            case 0:
                head.x--;
                break;
            case 1:
                head.x++;
                break;
            case 2:
                head.y--;
                break;
            case 3:
                head.y++;
                break;
        }

        // поочередно сдвигаем координаты в теле
        for (let i = this.snake.length-1; i > 0; i--)
            this.snake[i] = this.snake[i - 1];

        // и теперь устанавливаем "новую" голову
        this.snake[0] = head;

        // вот и все. пора отображать
        this.view();
    }
};
game.init();
game.table();
game.view();
setInterval(function () {
    game.iteration()
}, 500);
