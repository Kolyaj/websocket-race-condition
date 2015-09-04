# Удивительный race condition в браузере Firefox при использовании WebSocket

Удивителен прежде всего тем, что в силу однопоточности JavaScript, race condition в нём невозможен в принципе. Тем не менее, если запустить под NodeJS файл index.js (не забудьте запустить `npm i`), перейти в Firefox под MacOS по адресу http://localhost:3003/, то в консоли будет 
 
    socket opened
    start message #0
    start message #1
    start message #2
    start message #3
    start message #4
    end message #4
    end message #3
    end message #2
    end message #1
    end message #0

При этом обработка сообщения выглядит так

    console.log('start', message.data);
    var now = +new Date();
    while (+new Date() < now + 150) {
        new Function();
    }
    console.log('end', message.data);

Т.е. обработка следующего сообщения вклинивается в обработку предыдущего, и `new Function` здесь обязателен. Если быть более точным, то условия воспроизведения, как минимум, такие: если в процессе выполнения достаточно долгого куска кода пришло сообщение из сокета и в этом долгом куске кода встречается `new Function`, то в момент вызова `new Function()` вклинивается обработка пришедшего сообщения. Пришедшее сообщение обрабатывается, после чего продолжает обрабатываться прерванный кусок.
 
 Такая картина наблюдается только в Firefox под MacOS (проверялась только версия 40.0.3), в других браузерах и в Firefox под Windows это поведение не воспроизводится.
