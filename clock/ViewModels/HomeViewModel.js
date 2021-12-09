'use strict';

/**
 * @name HomeViewModel - Clock
 * @type: Display ViewModel
 * @desc: Start a timer or stopwatch, create alarms, compare global times, view/convert to unix, etc. - HomeViewModel
 * 
 * Last Updated: 11/09/21
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

    // Load all clock components from file directory.
    Genesis._var.Clock = {}
    Genesis._var.Clock['Home'] = {} // Create Home directory so that it is displayed first in the clock menu.
    await Genesis.ComponentManager.LoadComponents( Genesis._var.Clock, Genesis.FileManager.joinPath(__dirname, '../ClockType'), './', ( componentName, component, target ) => {
        target[componentName] = component;
    } );

    // Create base timers.
    Genesis._var.Timers = { 
        'Main': new Genesis.Utility.Timer(),
        'Secondary': new Genesis.Utility.Timer(),
        'Unix': new Genesis.Utility.Timer(),
        'Stopwatch': new Genesis.Utility.Timer(),
        'Timer': new Genesis.Utility.Timer(),
        'Alarm': new Genesis.Utility.Timer(),
    }

    // Create menu.
    Genesis.VisualManager.Menu.CreateMenu( 
        'genesis-body', 
        Object.keys(Genesis._var.Clock),
        ...Object.values(Genesis._var.Clock)
    );
    
    // Emit "ready" event.
    Genesis.Hermes.SendToServerAsync( `onViewModelReady-${Genesis.eventKey}`, {}, () => {});

    // Create audio controllers. (To remove delay in between play/creation)
    Genesis._var.Audio = {
        'Alarm': Genesis.FileManager.joinPath(__dirname, '../assets/audio/alarm/Funkyard.ogg'),
        'Timer': Genesis.FileManager.joinPath(__dirname, '../assets/audio/timer/Note.ogg'),
    }

    // The audio files must be created one at a time, so the child window can be pushed into the parent's meta table.
    // Otherwise the naming convention (WindowName-${Length}-Audio) will be off, and duplicate (resulting in an error).
    for (const index in Genesis._var.Audio) {
        await new Promise(( resolve ) => {
            Genesis.Hermes.SendToServerAsync('createAudio', {'audioName': Genesis._var.Audio[index], 'options': {'volume': 0.25, 'loop': true, 'play': false}}, (payload) => {
                Genesis._var.Audio[index] = payload.windowName;
                resolve();
            });
        });
    }
}