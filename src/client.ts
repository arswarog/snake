import { FixedMap } from './client/fixed-map';
import { SnakeClient } from './snake-client';

let game = new SnakeClient(new FixedMap('snake'), 200, 200);
game.view();
game.start();

document.addEventListener('keydown', (event) => game.keyboard(event.key), false);

let socket: any = new WebSocket('ws://javascript.ru/ws');
socket.onopen   = function() {
    alert('Соединение установлено.');
};

socket.onclose = function(event) {
    if (event.wasClean) {
        alert('Соединение закрыто чисто');
    } else {
        alert('Обрыв соединения'); // например, "убит" процесс сервера
    }
    alert('Код: ' + event.code + ' причина: ' + event.reason);
};

socket.onmessage = function(event) {
    alert('Получены данные ' + event.data);
};

socket.onerror = function(error) {
    alert('Ошибка ' + error.message);
};

socket.send({ move: 'Привет' });