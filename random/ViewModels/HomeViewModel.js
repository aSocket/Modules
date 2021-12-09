'use strict';

/**
 * @name HomeViewModel - Random
 * @type: Display ViewModel
 * @desc: Creates a plethora of different random types. (Strings, integers, passwords, etc.) - HomeViewModel
 * 
 * Last Updated: 10/24/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - ViewModel
// ------------------------------

async function InitializeViewModel() {

    // Load all visual components from file directory.
    await Genesis.ComponentManager.LoadComponents( Genesis._func, Genesis.FileManager.joinPath(__dirname, '../Components'), './', ( componentName, component, target ) => {
        target[componentName] = component[componentName];
    } );

    // Load all random components from file directory.
    Genesis._var.Random = {}
    await Genesis.ComponentManager.LoadComponents( Genesis._var.Random, Genesis.FileManager.joinPath(__dirname, '../RandomType'), './', ( componentName, component, target ) => {
        target[componentName] = component;
    } );

    // Load JSON quotes.
    Genesis._var.Quotes = require( Genesis.FileManager.joinPath(__dirname, '../assets/json/quotes.json') ).quotes;

    // Create menu.
    Genesis.VisualManager.Menu.CreateMenu( 
        'genesis-body', 
        Object.keys(Genesis._var.Random),
        ...Object.values(Genesis._var.Random)
    );

    // Emit "Ready".
    Genesis.Hermes.SendToServerAsync( `onViewModelReady-${Genesis.eventKey}`, {}, () => {});
}