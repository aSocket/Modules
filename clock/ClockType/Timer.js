'use strict';

/**
 * @name Timer - Clock
 * @type: Component
 * @desc: Timer component.
 * 
 * Last Updated: 11/15/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

function formatTimerEntry(timerEntry, num) {

    if (num !== -1) {
        timerEntry.shift();
        timerEntry.push(num);
    }

    const t = [];
    for (var i = 0; i <= 5; i++) {
        t.push(timerEntry[i]);
        if ((i + 1) % 2 === 0) {
            t.push(':');
        }
    }
    t.pop();
    return t;
}

function startTimer(timerEntry) {
    // Start timer.
    Genesis._var.Timers.Timer.Start()

    const h = Number(timerEntry[0].toString() + timerEntry[1].toString()) * 3600000;
    const m = Number(timerEntry[2].toString() + timerEntry[3].toString()) * 60000;
    const s = Number(timerEntry[4].toString() + timerEntry[5].toString()) * 1000;

    Genesis._var.TimerTime = h + m + s;

    Genesis._var.TimerFinished = false;

    // Reset category body.
    Genesis.VisualManager.Menu.DisplayCategory(Object.keys(Genesis._var.Clock).indexOf('Timer'));
}

function displayTimer(container) {
    
    // Timer display.
    const timerController = document.createElement('div');
    timerController.className = 'text-3xl font-medium text-asoc-gold-light mb-4';
    timerController.innerText = '00:00:00';
    container.appendChild(timerController);

    const control = Genesis._func.Blink(timerController);
    control.status = Genesis._var.Timers.Timer.GetStatus();;

    const obj = ['Pause', 'Start']
    // Create button controller.
    Genesis.VisualManager.Button.Create(container, {'display': 'inline-block', 'text': 'Pause', 'margin': 'mr-4'}, (element, payload) => {
        if (!Genesis._var.TimerFinished) { control.status = !control.status; }
        const name = obj[Number(!obj.indexOf(element.innerText))];
        Genesis._var.Timers.Timer[element.innerText]();
        element.innerText = name;
    });

    // Create cancel button.
    Genesis.VisualManager.Button.Create(container, {'display': 'inline-block', 'text': 'Cancel'}, (element) => {
        // Delete timer.
        Genesis._var.Timers.Timer.Destroy();

        // Stop sound if applicable.
        Genesis.Hermes.SendToServer('pauseAudio', {'targetWindowName': Genesis._var.Audio.Timer } );
        Genesis.Hermes.SendToServer('resetAudio', {'targetWindowName': Genesis._var.Audio.Timer } );

        // Reset category body.
        Genesis.VisualManager.Menu.DisplayCategory(Object.keys(Genesis._var.Clock).indexOf('Timer'));
    });

    // Stopwatch Timer (Stopwatch)
    Genesis._var.Timers.Timer.RemoveAllListeners();
    Genesis._var.Timers.Timer.AddListener((now, elapsed) => {
        const remaining = Genesis._var.TimerTime - elapsed;

        let text = '';
        if (now > Date.now() + remaining) {
            if (!Genesis._var.TimerFinished) { 
                Genesis._var.TimerFinished = true;
                Genesis.Hermes.SendToServer('sendToastNotification', {'content': 'Timer finished!'});
                Genesis.Hermes.SendToServer('playAudio', {'targetWindowName': Genesis._var.Audio.Timer } );
            }
            control.status = false;
            text +='Timer Finished!\n-'; 
        }
        text += Genesis._var.Timers.Timer.FormatTime(Math.abs(remaining));
        timerController.innerText = text
    });
}

function getInput(container) {
    // Create timer controller entry.
    const timerEntry = [0, 0, 0, 0, 0, 0]; // Limit: hh:mm::ss
    const timerController = document.createElement('div');
    timerController.className = 'text-3xl font-medium text-asoc-gold-light mb-2';
    timerController.innerText = '00:00:00';
    container.appendChild(timerController);

    const specialButtons = {
        10: { 'value': 0, 'text': 0 },
        11: {
            'value': -1,
            'text': 'X',
            'func': (value) => {
                timerEntry.pop();
                timerEntry.unshift(0);
                timerController.innerText = formatTimerEntry(timerEntry, value).join('');
            }
        },
        12: {
            'text': '>',
            'func': (index) => {
                startTimer(timerEntry);
            }
        },
        'DEFAULT': {
            'func': (value) => { timerController.innerText = formatTimerEntry(timerEntry, value).join(''); }            
        }
    }

    // Create buttons to 0-9.
    for (var i = 1; i <= 12; i++) {
        Genesis.VisualManager.Button.Create(container, {
            'text': specialButtons[i]?.hasOwnProperty('text') ? specialButtons[i].text : i, 
            'display': 'inline-block',
            'width': 'w-16', 
            'height': 'h-16',
            'margin': 'm-1',
            'rounded': 'rounded-full',
            'payload': {'index': i, 'value': specialButtons[i]?.hasOwnProperty('value') ? specialButtons[i].value : i}
        }, (element, payload) => {
            // Update timer controller.
            if (timerEntry[0] !== 0 && !specialButtons[payload.index]) { return; }
            specialButtons[payload.index]?.func ? specialButtons[payload.index].func(payload.value) : specialButtons['DEFAULT'].func(payload.value);
        });
        if (i% 3 === 0) {
            container.appendChild(document.createElement('br'));
        }
    }
}

function Entry(body, componentName) {
    Genesis._func.DisplayHeader(body, componentName);

    // Main container.
    const container = document.createElement('div');
    container.className = 'mt-6 text-center';
    body.appendChild(container);

    if (Genesis._var.Timers.Timer.GetStatus()) {
        displayTimer(container);
    } else {
        getInput(container);
    }
}

module.exports = Entry;