'use strict';

/**
 * @name Clock - Home
 * @type: Component
 * @desc: Home component.
 * 
 * Last Updated: 11/12/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

function Entry(body, componentName) {
    Genesis._func.DisplayHeader(body, componentName);

    // Main container.
    const container = document.createElement('div');
    container.className = 'mt-6 text-center';
    body.appendChild(container);

    // Title.
    const title = document.createElement('div');
    title.className = 'text-2xl'
    title.innerHTML = 'Welcome to the <b>Clock Module</b>!';
    container.appendChild(title);

    // Description container.
    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'mt-2';
    container.appendChild(descriptionContainer);

    // Description text.
    const description = document.createElement('span');
    description.className = 'italic';
    description.innerText = 'You can interact with the ';
    descriptionContainer.appendChild(description);

    // Display all available modules with clickable links.
    const keys = Object.keys(Genesis._var.Clock);

    // Get last and second to last entry for formatting.
    const lastEntry = keys[keys.length - 1];
    const secondToLastEntry = keys[keys.length - 2]

    for (const key in Genesis._var.Clock) {
        if (key == 'Home') { continue; }
        const clockType = document.createElement('span');
        clockType.className = 'italic font-medium transition-color duration-200 ease-in-out'
        clockType.innerText = key;
        descriptionContainer.appendChild(clockType);

        const keyIndex = Genesis.Utility.Object.GetKeyFromValue(keys, key);
        Genesis.VisualManager.CreateHoverState(clockType, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
            Genesis.VisualManager.Menu.DisplayCategory(keyIndex);
        });

        // Display comma if not last entry.
        if (key == secondToLastEntry) {
            const comma = document.createElement('span');
            comma.innerText = ', or ';
            descriptionContainer.appendChild(comma);
        } else if (key !== lastEntry) {
            const comma = document.createElement('span');
            comma.innerText = ', ';
            descriptionContainer.appendChild(comma);
        }
    }

    // Display period.
    const period = document.createElement('span');
    period.innerText = '.';
    descriptionContainer.appendChild(period);

    // Display current screen time. 
    const visitTimeText = document.createElement('div');
    visitTimeText.className = 'mt-4 font-bold';
    visitTimeText.innerText = 'You\'ve been on this page for: ';
    descriptionContainer.appendChild(visitTimeText);

    // Set visit time.
    const visitTime = document.createElement('div');
    visitTime.className = 'text-asoc-gold-light';
    visitTime.innerText = '0ms';
    descriptionContainer.appendChild(visitTime);

    // Main Timer (Time on page.)
    Genesis._var.Timers.Main.Reset();
    Genesis._var.Timers.Main.RemoveAllListeners();
    Genesis._var.Timers.Main.AddListener((_, __, ___, formattedTime) => {
        visitTime.innerText = '~' + formattedTime;
    });
    Genesis._var.Timers.Main.Start();

    // Display time since legal birth.
    const birthTimeText = document.createElement('div');
    birthTimeText.className = 'mt-4 font-bold';
    birthTimeText.innerText = 'Time since aSocket LLC\'s legal birth: ';
    descriptionContainer.appendChild(birthTimeText);

    // Set birth time.
    const birthTime = document.createElement('div');
    birthTime.className = 'text-asoc-gold-light';
    birthTime.innerText = '0ms';
    descriptionContainer.appendChild(birthTime);

    const legalBirthTime = 1621602000000;
    // Secondary Timer (Time since legal birth.)
    Genesis._var.Timers.Secondary.Reset();
    Genesis._var.Timers.Secondary.RemoveAllListeners();
    Genesis._var.Timers.Secondary.AddListener((now) => {
        birthTime.innerText = '~' + Genesis._var.Timers.Secondary.FormatTime(now - legalBirthTime)
    });
    Genesis._var.Timers.Secondary.Start();

    // Display current unix time.
    const unixTimeText = document.createElement('div');
    unixTimeText.className = 'mt-4 font-bold';
    unixTimeText.innerText = 'Unix Time: ';
    descriptionContainer.appendChild(unixTimeText);

    // Set unix time.
    const unixTime = document.createElement('span');
    unixTime.className = 'text-asoc-gold-light transition-color duration-150 ease-in-out';
    unixTime.innerText = '0ms';
    descriptionContainer.appendChild(unixTime);

    Genesis.VisualManager.CreateHoverState(unixTime, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
        navigator.clipboard.writeText(unixTime.innerText.replace('~', ''));
        Genesis.Hermes.SendToServer( 'createNotification', { 'message': `Unix time copied to clipboard!`, 'options': { 'parent': 'category-container', 'time': '4' } } );
    });

    // Unix Timer (Time since epoch.)
    Genesis._var.Timers.Unix.Reset();
    Genesis._var.Timers.Unix.RemoveAllListeners();
    Genesis._var.Timers.Unix.AddListener((now) => {
        unixTime.innerText = '~' + Math.floor(now/1000);
    });
    Genesis._var.Timers.Unix.Start();
}

module.exports = Entry;