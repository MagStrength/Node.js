const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

// валидация аргументов
const validateDate = (arg) => {
    let arr = arg.split('-');
    let timer = new Date(arr[3], arr[2] - 1, arr[1], arr[0]);
    if (timer.getFullYear() == arr[3] && timer.getMonth() == arr[2] - 1 && timer.getDate() == arr[1] && timer.getHours() == arr[0]) {
        return timer;
    } else {
        console.log(`Некорректный аргумент ${arg}`);
        console.log('Аргумент должен быть в формате час-день-месяц-год');
        process.exit(1);
    }
};

// возвращает массив объектов на основе
const getTimers = (arguments) => {
    let timers = [];
    for (let i = 0; i < arguments.length; i++) {
        let timer = validateDate(arguments[i]);
        timers.push({
            time: timer,
            title: 'Таймер ' + timer.toLocaleString(),
            id: i   // индекс в массиве setInterval
        });
    }
    return timers;
}

const handler = (payload) => {
    const rest = Math.round((payload.time.getTime() - new Date().getTime()) / 1000);
    if (rest >= 0) {
        console.log(payload.title, rest, ' seconds');
    } else {
        clearInterval(timerId[payload.id]);
        console.log(payload.title, ' stopped');
    }

};

// аргументы в формате 'час-день-месяц-год'
const timers = getTimers(process.argv.slice(2)); //массив таймеров
const timerId = []; // массив setInterval

timers.forEach((timer) => {
    eventEmitter.on(timer.title, handler);
    timerId[timer.id] = setInterval(() => eventEmitter.emit(timer.title, timer), 1000);
});

