'use strict';

/**
 * @name DisplayBody
 * @type: Component
 * @desc: Creates the body for the clock module.
 * 
 * Last Updated: 11/09/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

module.exports.DisplayBody = (body, componentName, getRandomType, input) => {
    const container = document.createElement('div');
    container.className = 'w-full flex flex-col items-center mt-4';
    body.appendChild(container);

    const reqInput = [];
    for (const key in input) {
        reqInput.push({
            'type': input[key].type,
            'element': input[key].create(container, ...input[key].args)
        })
    }

    const button = document.createElement('button');
    button.className = 'block w-3/12 mt-4 mb-6 rounded-lg bg-asoc-gold-light border-2 border-asoc-white text-asoc-gold-light text-center focus:outline-none transition-color duration-150 ease-in-out';
    button.innerText = 'Generate';
    container.appendChild(button);

    const resultText = document.createElement('span');
    resultText.innerText = `Random ${componentName}: `;
    resultText.className = 'opacity-0';
    container.appendChild(resultText);

    const result = document.createElement('span');
    result.className = 'opacity-0 text-asoc-gold-light';
    container.appendChild(result);

    Genesis.VisualManager.CreateHoverState(result, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
        navigator.clipboard.writeText(result.innerText);
        Genesis.Hermes.SendToServer( 'createNotification', { 'message': `Random ${componentName} copied to clipboard!`, 'options': { 'parent': 'category-container', 'time': '4' } } );
    });

    Genesis.VisualManager.CreateHoverState(button, Genesis.Meta.Color.asoc.medium, Genesis.Meta.Color.asoc.secondary, Genesis.Meta.Color.asoc.dark, undefined, () => {
        const input = [];
        for (const key in reqInput) {
            switch (reqInput[key].type) {
                case 'number':
                    input.push(Number(reqInput[key].element.value))
                    if (isNaN(input[key]) || input[key] <= 0) {
                        Genesis.Hermes.SendToServer( 'createNotification', { 'message': `Input ${key} is invalid!`, 'options': { 'parent': 'category-container', 'time': '4', 'color': Genesis.Meta.Color.ping.high, 'textColor': '#ffffff' } } );
                        return;
                    }
                    break;
                case 'boolean':
                    input.push(reqInput[key].element.checked)
                    break;
            }
        }

        result.innerText = `${getRandomType(...input)}`;
        Genesis.VisualManager.ElementFadeIn(resultText, 200);
        Genesis.VisualManager.ElementFadeIn(result, 200);
    });
}