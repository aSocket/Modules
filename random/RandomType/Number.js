'use strict';

/**
 * @name Number - Random
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
    Genesis._func.DisplayBody(body, componentName, Genesis.Utility.Random.GetRandomNumber, [
        {
            'type': 'number',
            'create': Genesis._func.CreateInput,
            'args': ['Mininum:', {'customClass': 'w-2/12', 'value': 10, 'placeholder': 10, 'maxLength': -1}]
        },
        {
            'type': 'number',
            'create': Genesis._func.CreateInput,
            'args': ['Maximum:', {'customClass': 'w-2/12', 'value': 100, 'placeholder': 100, 'maxLength': -1}]
        },
        {
            'type': 'boolean',
            'create': Genesis._func.CreateCheckbox,
            'args': ['Rounded:']
        }
    ]);
}

module.exports = Entry;