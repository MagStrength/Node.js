/*
    Ответ: 
    Record 1: простая синхронная операция - регистрируется таймер
    Record 5: простая синхронная операция - добавляется микрозадача в очередь
    Record 6: выполоняется микрозадача - переход к таймеру
    Record 2: простая синхронная операция - добавляется микрозадача в очередь
    - выполоняется микрозадача
    - регистрируется таймер
    - переход к таймеру
    Record 3: простая синхронная операция - добавляется микрозадача в очередь
    Record 4: выполоняется микрозадача
*/


console.log('Record 1');

setTimeout(() => {
    console.log('Record 2');
    Promise.resolve().then(() => {
        setTimeout(() => {
            console.log('Record 3');
            Promise.resolve().then(() => {
                console.log('Record 4');
            });
        });
    });
});

console.log('Record 5');

Promise.resolve().then(() => Promise.resolve()
    .then(() => console.log('Record 6')));