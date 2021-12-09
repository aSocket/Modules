'use strict';

/**
 * @name Alarm - Clock
 * @type: Component
 * @desc: Alarm component.
 * 
 * Last Updated: 11/09/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

function displayTimer(container) {
    
    // Alarm set display.
    const alarmSet = document.createElement('div');
    alarmSet.className = 'text-2xl font-medium mb-4';
    alarmSet.innerText = `Alarm set for ${Genesis._var.Timers.Alarm.FormatDate(Genesis._var.AlarmTime, true, false).date}`;
    container.appendChild(alarmSet);

    // Timer display.
    const alarmController = document.createElement('div');
    alarmController.className = 'text-3xl font-medium text-asoc-gold-light mb-4';
    alarmController.innerText = '00:00:00';
    container.appendChild(alarmController);

    const control = Genesis._func.Blink(alarmController);
    control.status = Genesis._var.Timers.Alarm.GetStatus();;

    // Create cancel button.
    Genesis.VisualManager.Button.Create(container, {'display': 'inline-block', 'text': 'Cancel'}, (element) => {
        // Delete alarm.
        Genesis._var.Timers.Alarm.Destroy();

        // Stop sound if applicable.
        Genesis.Hermes.SendToServer('pauseAudio', {'targetWindowName': Genesis._var.Audio.Alarm } );
        Genesis.Hermes.SendToServer('resetAudio', {'targetWindowName': Genesis._var.Audio.Alarm } );
        
        // Reset category body.
        Genesis.VisualManager.Menu.DisplayCategory(Object.keys(Genesis._var.Clock).indexOf('Alarm'));
    });

    // Alarm Timer
    Genesis._var.Timers.Alarm.RemoveAllListeners();
    Genesis._var.Timers.Alarm.AddListener((now) => {
        const remaining = (Genesis._var.AlarmTime - now); // Do not allow pausing to update time missing.
        let text = '';
        if (now > now + remaining) {
            if (!Genesis._var.AlarmFinished) { 
                Genesis._var.AlarmFinished = true;
                Genesis.Hermes.SendToServer('sendToastNotification', {'content': 'Alarm finished!'}); 
                Genesis.Hermes.SendToServer('playAudio', {'targetWindowName': Genesis._var.Audio.Alarm } );
            }
            control.status = false;
            text +='Alarm Finished!\n-'; 
        }

        text += Genesis._var.Timers.Alarm.FormatTime(Math.abs(remaining));
        alarmController.innerText = text
    });
}

function startAlarm(unixTime) {

    // Start alarm timer.
    Genesis._var.Timers.Alarm.Start()

    if (unixTime < Date.now()) { unixTime += 86400000; } // Add 1 day.
    
    Genesis._var.AlarmTime = unixTime;
    Genesis._var.AlarmFinished = false;

    // Reset category body.
    Genesis.VisualManager.Menu.DisplayCategory(Object.keys(Genesis._var.Clock).indexOf('Alarm'));
}

function getInput(container) {
    // Time input.
    const timeText = document.createElement('div');
    timeText.className = 'mt-4 font-bold';
    timeText.innerText = 'Enter Time: ';
    container.appendChild(timeText);

    // Input container.
    const inputContainer = document.createElement('div');
    container.appendChild(inputContainer);

    const DateInput = new Genesis.VisualManager.DateInput(Genesis, inputContainer, {'set': 'time'} );
    let unixTime = 0;
    DateInput.AddListener((_, __, unix) => { unixTime = unix; });
    
    // Start button.
    Genesis.VisualManager.Button.Create(container, {
        'text': 'Start',
        'margin': 'mx-auto mt-4'
    }, () => {
        // Start timer.
        startAlarm(unixTime * 1000)
    });
}

function Entry(body, componentName) {
    Genesis._func.DisplayHeader(body, componentName);

    // Main container.
    const container = document.createElement('div');
    container.className = 'mt-6 text-center';
    body.appendChild(container);

    if (Genesis._var.Timers.Alarm.GetStatus()) {
        displayTimer(container);
    } else {
        getInput(container);
    }
}

module.exports = Entry;