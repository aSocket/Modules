'use strict';

/**
 * @name SearchBarViewModel - Search
 * @type: Display ViewModel
 * @desc: Browse the web in a private window. - SearchBarViewModel
 * 
 * Last Updated: 11/12/21
 * Last Edit By: default@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - ViewModel
// ------------------------------

async function InitializeViewModel() {

    const searchBarClass = require(Genesis.FileManager.joinPath(__dirname, '../Components/SearchBar.js'));
    const SearchBar = new searchBarClass(Genesis);

    await SearchBar.CreateSearchBar();
    SearchBar.DisableInput();
    
    Genesis.Hermes.CreateNetMessage('onNavigation', (e, payload) => {
        SearchBar.Update(payload);
    });

    Genesis.Hermes.CreateNetMessage('onNavigationStart', () => { SearchBar.Spin(true); });
    Genesis.Hermes.CreateNetMessage('onNavigationEnd', () => { SearchBar.Spin(false); });
    Genesis.Hermes.CreateNetMessage('onFullyLoaded', () => { SearchBar.EnableInput(); });

    Genesis.Hermes.SendToServerAsync( `onViewModelReady-${Genesis.eventKey}`, {}, () => {});
}