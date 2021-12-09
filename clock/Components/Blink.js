'use strict';

/**
 * @name Blink
 * @type: Component
 * @desc: Manages blinking effect.
 * 
 * Last Updated: 11/15/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

module.exports.Blink = (element, rate = 500) => {
    const control = {'blink': false, 'status': false}
    // Create blinking effect when timer is stopped.
    let blinkTimer = setInterval(() => {
        // Remove interval when not in use.
        if (!Genesis.body.contains(element)) {
            clearInterval(blinkTimer);
            return;
        }

        // Confirm status. 
        if (control.status) {
            control.blink = true;
            element.style.visibility = 'visible';
            return;
        }

        // Blink effect.
        control.blink = !control.blink;
        element.style.visibility = control.blink ? 'hidden' : 'visible';
    }, rate);
    return control;
}