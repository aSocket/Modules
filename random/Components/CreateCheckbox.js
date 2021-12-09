'use strict';

/**
 * @name CreateCheckbox
 * @type: Component
 * @desc: Creates check box input box.
 * 
 * Last Updated: 10/31/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

module.exports.CreateCheckbox = (container, text, args) => {
    const arg = {
        'checked': true,
        'customClass': '',
        ...args
    }

    const message = document.createElement('div');
    message.className = 'mt-2';
    message.innerText = text;
    container.appendChild(message);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = arg.checked;
    input.className = `form-checkbox h-5 w-5 ${arg.customClass}`;
    container.appendChild(input);

    return input;
}