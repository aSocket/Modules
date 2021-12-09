'use strict';

/**
 * @name SearchBar
 * @type: Component
 * @desc: Window search bar.
 * 
 * Last Updated: 11/21/21
 * Last Edit By: tfannin@asocket.net
 */

// - © 2021 aSocket LLC
// - Author: aSocket LLC
// ------------------------------

// - Class Declaration
// ------------------------------

class SearchBar {
    constructor(asoc) {
        this._asoc = asoc;

        // DOM Elements (for reference)
        this.Parent;
        this.SearchBar;

        // Other controllers. 
        this.Animation = {};
        this.IsNavigating = true;
    }
}

// - Prototype Functions
// ------------------------------

SearchBar.prototype.CreateSearchBar = async function() {

    // Create parent container.
    this.Parent = document.createElement('div');
    this.Parent.className = 'flex items-center';
    this._asoc.body.appendChild(this.Parent);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'w-6/12 mx-auto relative';
    this.Parent.appendChild(inputContainer);

    // Create search bar input.
    this.SearchBar = this._asoc.VisualManager.Input.Create(inputContainer, {
        'placeholder': 'https://aSocket.net', 
        'width': 'w-full',
        'margin': ' mx-auto my-auto', 
        'padding': 'px-3',
        'maxLength': -1,
        'background': 'bg-asoc-light',
        'rounded': 'rounded-full',
        'textColor': 'text-asoc-white',
        'custom': 'shadow-xl'

    }, undefined, (input) => {
        this._asoc.Hermes.SendToServer('loadURL', {'targetWindowName': this._asoc._var.browserWindowName, 'url': input});
        this.SearchBar.blur();
    });

    // Select text when focusing.
    let blockingUp = false;
    this.SearchBar.addEventListener('focus', (e) => {
        this.SearchBar.select();   

        // Temporarily block mouseUp event to allow selection.
        blockingUp = true;
        setTimeout( () => { blockingUp = false; }, 250);
    });

    // Temporarily block mouseUp event to allow selection.
    this.SearchBar.addEventListener('mouseup', (e) => {
        if (blockingUp) { e.preventDefault(); }
    });

    this.SearchBar.addEventListener('blur', () => { document.getSelection().collapseToEnd(); });

    const promises = [];

    // Create arrow controls.
    const leftControlContainer = document.createElement('div');
    leftControlContainer.className = 'absolute inset-y-0 left-0 flex items-center ml-2';
    this.Parent.appendChild(leftControlContainer);

    this.Arrow = {};

    // Left arrow control.
    this.Arrow.Left = {};
    this.Arrow.Left.element = document.createElement('div');
    this.Arrow.Left.element.className = 'w-7 fill-current text-asoc-white transform rotate-180 transition-opacity duration-200 ease-in-out';
    leftControlContainer.appendChild(this.Arrow.Left.element);
    promises.push(this._asoc.VisualManager.CreateSVG( this.Arrow.Left.element, this._asoc.FileManager.joinPath( __dirname, '../assets/svg/arrow-right.svg' ) ));

    // Right arrow control.
    this.Arrow.Right = {};
    this.Arrow.Right.element = document.createElement('div');
    this.Arrow.Right.element.className = 'w-7 fill-current text-asoc-white transition-opacity duration-200 ease-in-out';
    leftControlContainer.appendChild(this.Arrow.Right.element);
    promises.push(this._asoc.VisualManager.CreateSVG( this.Arrow.Right.element, this._asoc.FileManager.joinPath( __dirname, '../assets/svg/arrow-right.svg' ) ));

    // Create Hover States
    this._asoc.VisualManager.CreateHoverState(this.Arrow.Left.element, 0.5, 1, 0.75, 'opacity', () => {
        if (!this.Arrow.Left.canNavigate) { return; } 
        this._asoc.Hermes.SendToServer('webContentsGo', {'targetWindowName': this._asoc._var.browserWindowName, 'direction': 'back'});
    });

    this._asoc.VisualManager.CreateHoverState(this.Arrow.Right.element, 0.5, 1, 0.75, 'opacity', () => {
        if (!this.Arrow.Right.canNavigate) { return; } 
        this._asoc.Hermes.SendToServer('webContentsGo', {'targetWindowName': this._asoc._var.browserWindowName, 'direction': 'forward'});
    });

    // Create aSocket logo.
    const logoContainer = document.createElement('div');
    logoContainer.className = 'absolute inset-y-0 right-0 flex items-center w-7';
    inputContainer.appendChild(logoContainer);

    this.Logo = document.createElement('img');
    this.Logo.src = this._asoc.FileManager.joinPath(__dirname, '../assets/img/aSocketLogo.png');
    this.Logo.className = 'ml-10 opacity-0 transition-opacity duration-200 ease-in-out';
    logoContainer.appendChild(this.Logo);

    // Create refresh button.
    const refreshContainer = document.createElement('div');
    refreshContainer.className = 'absolute inset-y-0 right-0 flex items-center';
    inputContainer.appendChild(refreshContainer);

    const refreshParent = document.createElement('div');
    refreshParent.className = 'w-6 fill-current text-asoc-white';
    refreshContainer.appendChild(refreshParent);

    this.Refresh = document.createElement('div');
    this.Refresh.className = 'w-full ml-9 transition-opacity duration-200 ease-in-out';
    refreshParent.appendChild(this.Refresh);

    promises.push(this._asoc.VisualManager.CreateSVG( this.Refresh, this._asoc.FileManager.joinPath( __dirname, '../assets/svg/refresh.svg' ) ));

    this._asoc.VisualManager.CreateHoverState(this.Refresh, 1, 0.75, 0.5, 'opacity', () => {
        if (this.IsNavigating || this.Refresh.getAttribute('disabled')) { return; }
        this._asoc.Hermes.SendToServer('webContentsReload', {'targetWindowName': this._asoc._var.browserWindowName});
    });

    // Create copy button.
    const copyContainer = document.createElement('div');
    copyContainer.className = 'absolute inset-y-0 right-0 flex items-center';
    inputContainer.appendChild(copyContainer);

    const copyParent = document.createElement('div');
    copyParent.className = 'w-6 fill-current text-asoc-white';
    copyContainer.appendChild(copyParent);

    this.Copy = document.createElement('div');
    this.Copy.className = 'w-full ml-20 transition-opacity duration-200 ease-in-out';
    copyParent.appendChild(this.Copy);

    promises.push(this._asoc.VisualManager.CreateSVG( this.Copy, this._asoc.FileManager.joinPath( __dirname, '../assets/svg/copy.svg' ) ));

    this._asoc.VisualManager.CreateHoverState(this.Copy, 1, 0.75, 0.5, 'opacity', () => {
        if (this.Copy.getAttribute('disabled')) { return; }
        this.Copy.setAttribute('disabled', 'true');
        this._asoc.Hermes.SendToServerAsync('createNewBrowser', {'parentWindowName': this._asoc._var.parentWindowName}, () => {
            this.Copy.removeAttribute('disabled');
        });
    });

    await Promise.allSettled(promises);
}

SearchBar.prototype.DisableInput = function() {
    // Disable input by default until fully loaded.
    this.SearchBar.setAttribute('disabled', true);
    this.Refresh.setAttribute('disabled', true);
    this.Copy.setAttribute('disabled', true);
}

SearchBar.prototype.EnableInput = function() {
    this.SearchBar.removeAttribute('disabled');
    this.Refresh.removeAttribute('disabled');
    this.Copy.removeAttribute('disabled');
}

SearchBar.prototype.Spin = function(spinState) {

    if (this.Animation.Active) {
        clearTimeout(this.Animation.Timeout);
        this.Animation.Down();
    }

    this.Animation.Reset = () => {
        this._asoc.VisualManager.CreateHoverState(this.Refresh, 1, 0.75, 0.5, 'opacity');
        this.Animation.Active = false;
    }

    this.Animation.Active = true;
    this.IsNavigating = spinState;

    if (spinState) {
        this.Logo.classList.add('animate-spin')
        this.Refresh.classList.add('animate-spin')

        this.Animation.Down = () => {
            this._asoc.VisualManager.ElementFadeOut(this.Refresh, 200).then( () => {
                this._asoc.VisualManager.CreateHoverState(this.Refresh, 0, 0, 0, 'opacity');
                this.Refresh.style = "";   
                this._asoc.VisualManager.ElementFadeIn(this.Logo, 200);
            });
        }
        this.Animation.Timeout = setTimeout(this.Animation.Down, 400);
    } else {
        this.Animation.Down = () => {
            this._asoc.VisualManager.ElementFadeOut(this.Logo, 200).then( () => {
                this._asoc.VisualManager.ElementFadeIn(this.Refresh, 200);
                this.Refresh.classList.remove('animate-spin');
                this.Logo.classList.remove('animate-spin');
                this.Animation.Reset();
            });
        };
        this.Animation.Timeout = setTimeout(this.Animation.Down, 400);
    }
}

SearchBar.prototype.UpdateArrowControls = function(canGoBack, canGoForward) {
    if (canGoBack) {
        this._asoc.VisualManager.CreateHoverState(this.Arrow.Left.element, 1, 0.75, 0.5, 'opacity');
    } else {
        this._asoc.VisualManager.CreateHoverState(this.Arrow.Left.element, 0.5, 1, 0.75, 'opacity');
    }
    this.Arrow.Left.canNavigate = canGoBack;

    if (canGoForward) {
        this._asoc.VisualManager.CreateHoverState(this.Arrow.Right.element, 1, 0.75, 0.5, 'opacity');
    } else {
        this._asoc.VisualManager.CreateHoverState(this.Arrow.Right.element, 0.5, 1, 0.75, 'opacity');
    }
    this.Arrow.Right.canNavigate = canGoForward;
}

SearchBar.prototype.Update = function(payload) {
    this.SearchBar.value = payload.url;
    this.UpdateArrowControls(payload.canGoBack, payload.canGoForward);

    // Future use - 
    // let fURL = url.match(/^https?:\/\/([^/]+)/i);
    // if (!fURL) { fURL = url.match(/^http?:\/\/([^/]+)/i) };
    // if (!fURL) {this.SearchBar.value = url; return;}

    // const http = url.substring(0, url.indexOf(fURL[1]));
    // const domain = fURL[1];
    // const param = url.substring(url.indexOf(fURL[1]) + fURL[1].length + 1, url.length -1);
    // this.SearchBar.value = `<span class="placeholder-location-search">${http}</span>${domain}<span class="placeholder-location-search">${param}</span>`;
}

// - Module Export
// ------------------------------

module.exports = SearchBar;