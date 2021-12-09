'use strict';

/**
 * @name Clock - Unix
 * @type: Component
 * @desc: Unix component.
 * 
 * Last Updated: 11/16/21
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

    // Display current unix time.
    const unixTimeText = document.createElement('div');
    unixTimeText.className = 'mt-4 font-bold';
    unixTimeText.innerText = 'Unix Time: ';
    container.appendChild(unixTimeText);
    
    // Set unix time.
    const unixTime = document.createElement('span');
    unixTime.className = 'text-asoc-gold-light transition-color duration-150 ease-in-out';
    unixTime.innerText = '0';
    container.appendChild(unixTime);

    // Click to copy.
    Genesis.VisualManager.CreateHoverState(unixTime, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
        navigator.clipboard.writeText(unixTime.innerText);
        Genesis.Hermes.SendToServer( 'createNotification', { 'message': `Unix time copied to clipboard!`, 'options': { 'parent': 'category-container', 'time': '4' } } );
    });

    // Display current date.
    const dateText = document.createElement('div');
    dateText.className = 'mt-2 font-bold';
    dateText.innerText = 'Current Date: ';
    container.appendChild(dateText);
    
    // Set current date.
    const date = document.createElement('span');
    date.className = 'text-asoc-gold-light';
    date.innerText = 'xx/xx/xx xx:xx:xx:xx';
    container.appendChild(date);

    // Convert unix to date.
    const unixConvertText = document.createElement('div');
    unixConvertText.className = 'mt-4 font-bold';
    unixConvertText.innerText = 'Unix to Date: ';
    container.appendChild(unixConvertText);

    // Create unix input
    const unixInput = Genesis.VisualManager.Input.Create(container, {'placeholder': 'Unix Time', 'margin': 'mx-auto mb-2', 'maxLength': -1}, (e) => {
        const val = e.target.value;
        if (val === '') { 
            Genesis.VisualManager.ElementFadeOut(unixConverted, 200).then(() => { unixConverted.setAttribute('hidden', true); }); 
            return; 
        } else { 
            unixConverted.removeAttribute( 'hidden' );
            // When removing the hidden attribute, it appears the DOM updates both the style and the attribute at the same time.
            // To remedy this issue, we will delay the fade in slightly. 
            Genesis.Utility.Delay.Delay(50).then(() => {Genesis.VisualManager.ElementFadeIn(unixConverted, 200); })
        }
        unixConverted.innerText = Genesis._var.Timers.Unix.FormatDate(Number(val*1000), true, false).date;
    });

    // Converted unix date.
    const unixConverted = document.createElement('span');
    unixConverted.className = 'font-bold text-asoc-gold transition-color duration-150 ease-in-out opacity-0';
    unixConverted.innerText = '';
    container.appendChild(unixConverted);

    // Click to copy.
    Genesis.VisualManager.CreateHoverState(unixConverted, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
        navigator.clipboard.writeText(unixConverted.innerText);
        Genesis.Hermes.SendToServer( 'createNotification', { 'message': `Date copied to clipboard!`, 'options': { 'parent': 'category-container', 'time': '4' } } );
    });

    // Unix Timer (Time since epoch.)
    Genesis._var.Timers.Unix.Reset();
    Genesis._var.Timers.Unix.RemoveAllListeners();
    Genesis._var.Timers.Unix.AddListener((now) => {

        // Display unix time. 
        const unix = Math.floor(now/1000);
        unixTime.innerText = unix;

        // Update unix placeholder.
        unixInput.placeholder = unix;

        // Display current date.
        const time = Genesis._var.Timers.Unix.FormatDate(now, true);
        date.innerText = time.date;
    });
    Genesis._var.Timers.Unix.Start();

    // Convert date to unix.
    const dateConvertText = document.createElement('div');
    dateConvertText.className = 'mt-4 font-bold';
    dateConvertText.innerText = 'Date to Unix: ';
    container.appendChild(dateConvertText);

    const inputContainer = document.createElement('div');
    container.appendChild(inputContainer);

    const DateInput = new Genesis.VisualManager.DateInput(Genesis, inputContainer );
    DateInput.AddListener((sentInput, isEmpty, unix, ampm, index) => {
        if (isEmpty) {
            Genesis.VisualManager.ElementFadeOut(dateConverted, 200);
            return; 
        }
        Genesis.VisualManager.ElementFadeIn(dateConverted, 200)
        dateConverted.innerText = unix;
    });

    // Converted unix date.
    const dateConverted = document.createElement('span');
    dateConverted.className = 'block font-bold text-asoc-gold mt-2 transition-color duration-150 ease-in-out opacity-0';
    dateConverted.innerText = '';
    inputContainer.appendChild(dateConverted);

    // Click to copy.
    Genesis.VisualManager.CreateHoverState(dateConverted, Genesis.Meta.Color.asoc.gold.light, Genesis.Meta.Color.asoc.white, Genesis.Meta.Color.asoc.secondary, 'color', () => {
        navigator.clipboard.writeText(dateConverted.innerText);
        Genesis.Hermes.SendToServer( 'createNotification', { 'message': `Unix time copied to clipboard!`, 'options': { 'parent': 'category-container', 'time': '4' } } );
    });
}

module.exports = Entry;