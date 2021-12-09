'use strict';

/**
 * @module Random
 * @type: aSocket Module
 * @desc: Creates a plethora of different random types. (Strings, integers, passwords, etc.)
 *
 * Last Updated: 10/24/21
 * Last Edit By: tfannin@asocket.net
 */
    
// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Events
// ------------------------------

/**
 * Module onLoad event.
 * Fired upon successful instantiation of a module.
 */
asoc.onLoad = async () => {

    // - Setting a display variable allows you to pass data to the display 
    // - without using the Hermes networking library (must be set prior to window creation).
    asoc.Genesis.SetDisplayVariable( 'Random', 'Module', asoc.UtilityManager.DeepCopy.DeepCopy(asoc.Module));

    // - Creating a window is as easy as supplying the window name (must be unique),
    // - the view to set on the display (see Views/ ViewModels/ Designs/ directories), 
    // - and optionally, window settings (in this case, we use the default aSocket window settings).
    // - Genesis window creation returns the display object.
    asoc.Module._var.window = await asoc.Genesis.CreateWindow( 'Random', 'Home', asoc.Meta.MainDisplaySettings )
    
    // - Using the newly created window object, we want to set a listener event on the window for deletion.
    // - Upon deletion we will deactivate the module, and clean up excess data created by said module.
    asoc.Module._var.window.CreateListener( 'onDeletion', asoc.Deactivate ); // - Deactivates the current module, resulting in onUnload being called.
    
    // - Simple pretty-print logging.
    asoc.Logger.Log('NONE', `Module ${asoc.Module.Name} has been loaded.`);
}

/**
 * Module onUnload event.
 * Fired upon deactivation of a module.
 * NOTE: onUnload should reset the state of the client, and cleanse traces of the module. 
 * Please, be kind, leave it better than you found it! :)
 */
asoc.onUnload = () => {
    // - Delete the created window if applicable.
    asoc.Genesis.DeleteWindow(asoc.Module._var.window.WindowName);

    // - Simple pretty-print logging.
    asoc.Logger.Log('NONE', `Module ${asoc.Module.Name} has been unloaded.`);
}

// - Other Information
// ------------------------------
// - I'd like to say thank you for taking part in our newly introduced modules program!
// - Modules enable individuals to create whatever they may dream of by utilizing our foundation for a desktop application.
// ------------------------------
// - Please take a look at our simple "wiki" regarding module creation, and the aSocket client foundation. https://aSocket.net/wiki
// - If you have any questions, feel free to join the community within the discord! https://aSocket.net/discord
// - If you'd like to submit your module for public use, make a pull request on our GitHub repository! https://aSocket.net/GitHub`