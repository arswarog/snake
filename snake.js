let game = {
    pole  : [],
    snake : [],
    width : 20,
    height: 20,

    init: function () {
        for (let x = 0; x < this.width; x++) {
            this.pole[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.pole[x][y] = 0;
            }
        }

        // получаем случайные координаты для головы змеи
        // но делаем отступ от края на 2 ячейки
        // что бы она сразу не врезалась в стену
        let x         = Math.floor(Math.random() * (this.width - 4)) + 2;
        let y         = Math.floor(Math.random() * (this.height - 4)) + 2;
        this.snake[0] = {x: x, y: y};
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                this.snake[1] = {x: x - 1, y: y};
                break;
            case 1:
                this.snake[1] = {x: x + 1, y: y};
                break;
            case 2:
                this.snake[1] = {x: x, y: y + 1};
                break;
            case 3:
                this.snake[1] = {x: x, y: y - 1};
                break;
        }
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
            console.log(i, typeof i)
            if (i > 0)
            // Тело змейки
                this.setColor(item.x, item.y, '#ff9900');
            else
            // Голова змейки
                this.setColor(item.x, item.y, '#6599ff');
        }
    }
};
game.init();
game.table();
game.view();
