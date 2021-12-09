'use strict';

/**
 * @name Clock - Time
 * @type: Component
 * @desc: Time component.
 * 
 * Last Updated: 11/12/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

function updateTime(timezones, now) {
    for (const timezone in timezones) {
        const date = Genesis._var.Timers.Main.FormatDate(now + timezones[timezone].offset * 3600000, false).date;
        timezones[timezone].element.innerText = date;
    }
}

function Entry(body, componentName) {
    Genesis._func.DisplayHeader(body, componentName);

    // Timezone list.
    const timezones = {
        'SELF': {'offset':  new Date().getTimezoneOffset() / 60 * -1},
        'UTC': {'offset': 0},
        'CST': {'offset': -6},
        'CDT': {'offset': -5},
        'EST': {'offset': -5},
        'EDT': {'offset': -4},
        'PST': {'offset': -8},
        'PDT': {'offset': -7},
        'MST': {'offset': -7}, 
        'MDT': {'offset': -6},
        'AEST':{'offset': 10},
        'ACST':{'offset': 9.5},
        'AWST':{'offset': 8}
    }

    // Main container.
    const container = document.createElement('div');
    container.className = 'mt-6 text-center';
    body.appendChild(container);

    // Title.
    const title = document.createElement('div');
    title.className = 'text-2xl mb-1'
    title.innerHTML = 'Global Times:';
    container.appendChild(title);

    // Create initial elements.
    for (const timezone in timezones) {
        const timeContainer = document.createElement('div');
        timeContainer.className = 'text-asoc-gold-light';
        container.appendChild(timeContainer);

        const timeText = document.createElement('span');
        timeText.className = 'font-bold text-white';
        timeText.innerText = timezone + ' | ';
        timeContainer.appendChild(timeText);

        const time = document.createElement('span');
        time.innerText = '00/00/00 - 00:00:00:00 XX'
        timeContainer.appendChild(time);
        timezones[timezone].element = time;
    }
    
    Genesis._var.Timers.Main.RemoveAllListeners();
    Genesis._var.Timers.Main.AddListener((now) => {
        updateTime(timezones, now);
    });
    Genesis._var.Timers.Main.Start();
}

module.exports = Entry;