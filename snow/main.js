'use strict';

/**
 * @module Snow
 * @type aSocket Module
 * @desc Add a seasonal snow effect to the client.
 * 
 * Last Updated: 12/13/21
 * Last Edit By: tfannin@asocket.net
 */
    
// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Module Events
// ------------------------------

/**
 * @name injectSnow
 * @desc Injects snow into the client window.
 * @param {string} windowName - The name of the window to inject snow into.
 * @param {string} realm - The realm the window belongs to.
 */
function injectSnow(windowName, realm) {
    const { Genesis } = asoc.Module._functions.GetCore(realm);
    Genesis._displays[windowName].Window.webContents.executeJavaScript(`
        if (typeof(aSocketSnow) === 'undefined') {
            const snow = document.createElement('script');
            snow.src = '${asoc.Module._var.snowPath}';
            document.body.prepend(snow);
        } else {
            aSocketSnow.command('start');
        }
    `);
}

/**
 * Module onLoad event.
 * Fired upon successful instantiation of a module.
 */
asoc.onLoad = async () => {

    // Retrieve snow path.
    asoc.Module._var.snowPath = asoc.FileManager.joinPath(asoc.dirname, './assets/snow.js').replaceAll('\\', '\\\\');

    // Create listener to inject snow.
    asoc.Module._var.key = asoc.Hermes.Server.CreateInternalMessage('onViewChanged', (e, payload) => {
        injectSnow(payload.windowName, payload.realm);
    });
    
    // Inject snow on all current views.
    for (const realm of asoc.Module._functions.GetAllRealms()) {
        asoc.Module._functions.GetCore( realm ).Genesis.GetAllDisplays((windowName) => {
            injectSnow(windowName, realm);
        });
    }

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
    // Remove the internal event listener.
    asoc.Hermes.Server.RemoveInternalMessage('onViewChanged', asoc.Module._var.key);
    
    // Clear all snow effects.
    for (const realm of asoc.Module._functions.GetAllRealms()) {
        asoc.Module._functions.GetCore(realm).Genesis.GetAllDisplays((_, displayObj) => {
            displayObj.Window.webContents.executeJavaScript(`
                if (typeof(aSocketSnow) !== 'undefined') {  
                    aSocketSnow.command('clear');
                    aSocketSnow.command('stop');
                }
            `);
        });
    }

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
// - If you'd like to submit your module for public use, make a pull request on our GitHub repository! https://aSocket.net/GitHub