'use strict';

/**
 * @name Home - Random
 * @type: Component
 * @desc: Creates a plethora of different random types. (Strings, integers, passwords, etc.) - HomeViewModel
 * 
 * Last Updated: 10/31/21
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
    title.innerHTML = 'Welcome to the <b>Random Module</b>!';
    container.appendChild(title);

    // Description container.
    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'mt-2';
    container.appendChild(descriptionContainer);

    // Description text.
    const description = document.createElement('span');
    description.className = 'italic';
    description.innerText = 'You can generate a random ';
    descriptionContainer.appendChild(description);

    // Display all available modules with clickable links.
    const keys = Object.keys(Genesis._var.Random);

    // Get last and second to last entry for formatting.
    const lastEntry = keys[keys.length - 1];
    const secondToLastEntry = keys[keys.length - 2]

    for (const key in Genesis._var.Random) {
        if (key == 'Home') { continue; }
        const randomType = document.createElement('span');
        randomType.className = 'italic font-medium transition-color duration-200 ease-in-out'
        randomType.innerText = key;
        descriptionContainer.appendChild(randomType);

        const keyIndex = Genesis.Utility.Object.GetKeyFromValue(keys, key);
        Genesis.VisualManager.CreateHoverState(randomType, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
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

    // Display random quote.
    const randomQuoteTitle = document.createElement('div');
    randomQuoteTitle.className = 'mt-4 font-bold';
    randomQuoteTitle.innerText = 'Random quote:';
    descriptionContainer.appendChild(randomQuoteTitle);

    const randomQuote = Genesis.Utility.Object.GetRandomEntry(Genesis._var.Quotes);

    const randomQuoteText = document.createElement('div');
    randomQuoteText.className = 'w-6/12 mx-auto';
    randomQuoteText.innerHTML = `"<i>${randomQuote.quote}</i>"<br>- ${randomQuote.author}`;
    descriptionContainer.appendChild(randomQuoteText);

    // Display random text.
    const randomModuleText = document.createElement('div');
    randomModuleText.className = 'mt-4 font-bold';
    randomModuleText.innerText = 'Random Module: ';
    descriptionContainer.appendChild(randomModuleText);

    // Get random module key.
    let randomKey = Genesis.Utility.Object.GetRandomEntry(keys);

    // Unfortunately we can not simply remove the 'Home' key from the keys list because
    // the indexes will be offset and the Menu will not be able to call the correct category index.
    while (randomKey == 'Home') {
        randomKey = Genesis.Utility.Object.GetRandomEntry(keys);
    }

    // Display random module.
    const randomModule = document.createElement('div');
    randomModule.className = 'transition-color duration-200 ease-in-out'
    randomModule.innerText = randomKey;

    const randomKeyIndex = Genesis.Utility.Object.GetKeyFromValue(keys, randomKey);
    Genesis.VisualManager.CreateHoverState(randomModule, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
        Genesis.VisualManager.Menu.DisplayCategory(randomKeyIndex);
    });
    descriptionContainer.appendChild(randomModule);
}

module.exports = Entry;