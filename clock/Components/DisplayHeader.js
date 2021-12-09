'use strict';

/**
 * @name DisplayHeader
 * @type: Component
 * @desc: Creates a header for the clock module.
 * 
 * Last Updated: 11/09/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Export
// ------------------------------

module.exports.DisplayHeader = (body, componentName) => {
    const container = document.createElement('div');
    container.className = 'w-full mx-auto px-8 text-center';
    body.appendChild(container);

    const logo = document.createElement('img');
    logo.src = Genesis.FileManager.joinPath(__dirname, '../assets/img/aSocketLogo.png');
    logo.className = 'w-24 mx-auto';
    container.appendChild(logo);

    const title = document.createElement('div');
    title.className = 'mt-1 text-3xl font-medium';
    title.innerText = `Clock - ${componentName}`;
    container.appendChild(title);

    const divider = document.createElement('div');
    divider.className = 'mt-2 border-t-2 border-asoc-gold-light';
    container.appendChild(divider);
}