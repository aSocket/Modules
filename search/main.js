'use strict';

/**
 * @module Search
 * @type: aSocket Module
 * @desc: Browse the web in a private window.
 * 
 * Last Updated: 11/12/21
 * Last Edit By: default@asocket.net
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
    // NOTE: This module should be revisited and cleaned up.
    
    asoc.Module._var.windows = [];
    
    // Listen to window creation event.
    // Limit window creation to one at a time (for now).
    let creationBusy = false;
    asoc.Hermes.Server.CreateNetMessage('createNewBrowser', async (e, payload, callback) => {
        if (!asoc.Module._var.windows.includes(asoc.Genesis.GetWindow(payload.parentWindowName)) || creationBusy) { return; }
        creationBusy = true;
        await createSearchWindow();
        callback();
        creationBusy = false;
    });
    
    // Create original window.
    await createSearchWindow();

    asoc.Logger.Log('NONE', `Module ${asoc.Module.Name} has been loaded.`);
}

async function createSearchWindow() {

    const id = asoc.Module._var.windows.length;
    const window = await asoc.Genesis.CreateWindow( `Search-${id}`, 'Working', asoc.Meta.MainDisplaySettings );
    asoc.Module._var.windows.push(window);

    // Reset main display upon browser load to reduce animation costs.
    let resetMainDisplay = () => {
        asoc.Genesis.SetView(window.WindowName, 'Home')
        asoc.Hermes.Server.SendToClient('onFullyLoaded', searchBar);
        resetMainDisplay = undefined;
    }

    const searchBarHeight = 50;

    // Set display variable references.
    asoc.Genesis.SetDisplayVariable( `SearchBar-${id}`, 'parentWindowName', window.WindowName);
    asoc.Genesis.SetDisplayVariable( `SearchBar-${id}`, 'browserWindowName', `Browser-${id}`);

    // Create search bar browser view.
    const searchBar = await asoc.Genesis.CreateBrowserView( window.WindowName, `SearchBar-${id}`, 'SearchBar', {
        'bounds': {
            'x': 0,
            'y': asoc.Meta.titleBarSize,
            'width': window.Window.getSize()[0],
            'height': searchBarHeight
        },
        'resize': {
            'height': false
        }
    });
    
    // Create URL browser view.
    const browser = await asoc.Genesis.CreateBrowserView( window.WindowName, `Browser-${id}`, 'GenesisPreset', {
        'webPreferences': {
            'nodeIntegration': false,
            'enableRemoteModule': false,
            'contextIsolation': false
        },
        'useCore': false,
        'url': 'https://duckduckgo.com/',
        'bounds': {
            'x': 0,
            'y': asoc.Meta.titleBarSize + searchBarHeight,
            'width': window.Window.getSize()[0],
            'height': window.Window.getSize()[1] - asoc.Meta.titleBarSize - searchBarHeight
        }
    }, (browserView) => {
        // Reset main display if not called.
        if (resetMainDisplay) {resetMainDisplay();}

        // Notify of navigation.
        asoc.Hermes.Server.SendToClient('onNavigation', searchBar, { 
            'url': browserView.Window.webContents.getURL(), 
            'canGoForward': browserView.Window.webContents.canGoForward(),
            'canGoBack': browserView.Window.webContents.canGoBack() 
        }, asoc.Realm);

        // Inject custom css. (beautify in the future).
        browserView.Window.webContents.executeJavaScript(`

            let aSocketStyle = document.createElement('style');

            aSocketStyle.innerHTML = \`*::selection {
                background: #c9b670 !important;
            }
            
            *::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
                border-radius: 10px !important;
                background-color: #222222 !important;
            }
            
            *::-webkit-scrollbar {
                width: 11px !important;
            }
            
            *::-webkit-scrollbar-thumb {
                border-radius: 10px !important;
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3) !important;
                background-color: #484848 !important;
            }\`;

            document.head.appendChild(aSocketStyle);
        `);
    });

    // Listen to loading events.
    browser.Window.webContents.on( 'did-start-loading', () => {
        asoc.Hermes.Server.SendToClient('onNavigationStart', searchBar);
    });

    browser.Window.webContents.on( 'did-stop-loading', () => {
        asoc.Hermes.Server.SendToClient('onNavigationEnd', searchBar);
    });

    // Listen to window deletion.
    window.CreateListener( 'onDeletion', (targetWindow) => {
        asoc.Module._var.windows.splice(asoc.Module._var.windows.indexOf(targetWindow), 1);
        if (asoc.Module._var.windows.length === 0) {
            asoc.Deactivate();
        }
    } );

    return window;
}

/**
 * Module onUnload event.
 * Fired upon deactivation of a module.
 * NOTE: onUnload should reset the state of the client, and cleanse traces of the module. 
 * Please, be kind, leave it better than you found it! :)
 */
asoc.onUnload = () => {

    // Delete all windows.
    for (const window of asoc.Module._var.windows) {
        asoc.Genesis.DeleteWindow(window.WindowName);
    }

    // Remove all listeners for 'createNewBrowser' net message.
    asoc.Hermes.Server.RemoveAllListeners('createNewBrowser');

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