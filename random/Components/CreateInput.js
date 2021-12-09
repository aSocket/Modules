'use strict';

/**
 * @name CreateInput
 * @type: Component
 * @desc: Creates input box.
 * 
 * Last Updated: 10/31/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

module.exports.CreateInput = (container, text, args) => {
    const arg = {
        'customClass': 'w-3/12',
        'value': 12,
        'placeholder': '12',
        ...args
    }

    const message = document.createElement('div');
    message.className = 'mt-2';
    message.innerText = text;
    container.appendChild(message);

    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = arg.maxLength ? arg.maxLength == -1 ? 524288 : arg.maxLength : 4;
    input.spellcheck = false;
    input.value = arg.value;
    input.placeholder = arg.placeholder;
    input.className = `inline-block h-8 bg-asoc-medium rounded focus:outline-none focus:ring-2 focus:ring-asoc-gold-light placeholder-location-search text-center transition-all duration-200 ease-in-out ${arg.customClass}`;
    container.appendChild(input);

    return input;
}