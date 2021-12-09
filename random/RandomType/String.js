'use strict';

/**
 * @name String - Random
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
    Genesis._func.DisplayBody(body, componentName, Genesis.Utility.Random.GetRandomString, [
        {
            'type': 'number',
            'create': Genesis._func.CreateInput,
            'args': ['Length:']
        },
        {
            'type': 'boolean',
            'create': Genesis._func.CreateCheckbox,
            'args': ['Random case:']
        },
        {
            'type': 'boolean',
            'create': Genesis._func.CreateCheckbox,
            'args': ['All uppercase:', {'checked': false}]
        },
    ]);
}

module.exports = Entry;