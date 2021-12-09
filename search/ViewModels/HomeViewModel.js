'use strict';

/**
 * @name HomeViewModel - Search
 * @type: Display ViewModel
 * @desc: Browse the web in a private window. - HomeViewModel
 * 
 * Last Updated: 11/12/21
 * Last Edit By: default@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - ViewModel
// ------------------------------

function InitializeViewModel() {
    Genesis.Hermes.SendToServerAsync( `onViewModelReady-${Genesis.eventKey}`, {}, () => {});
}