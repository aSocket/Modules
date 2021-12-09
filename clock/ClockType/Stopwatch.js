'use strict';

/**
 * @name Stopwatch - Clock
 * @type: Component
 * @desc: Stopwatch component.
 * 
 * Last Updated: 11/12/21
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

    // Title.
    const title = document.createElement('div');
    title.className = 'text-2xl'
    title.innerHTML = 'Timer:';
    container.appendChild(title);

    // Stopwatch Timer
    const stopwatchTime = document.createElement('div');
    stopwatchTime.className = 'text-xl text-asoc-gold-light';
    stopwatchTime.innerText = '0ms';
    container.appendChild(stopwatchTime);

    // Stopwatch Timer (Stopwatch)
    Genesis._var.Timers.Stopwatch.RemoveAllListeners();
    Genesis._var.Timers.Stopwatch.AddListener((_, __, ___, formattedTime) => {
        stopwatchTime.innerText = formattedTime;
    });

    const control = Genesis._func.Blink(stopwatchTime);
    control.status = Genesis._var.Timers.Stopwatch.GetStatus();

    const toggleButton = document.createElement('button');
    toggleButton.className = 'inline-block mx-auto mr-4 w-2/12 mt-4 mb-6 rounded-lg bg-asoc-gold-light border-2 border-asoc-white text-asoc-gold-light text-center focus:outline-none transition-color duration-150 ease-in-out';
    toggleButton.innerText = status ? 'Stop' : 'Start';
    container.appendChild(toggleButton);

    Genesis.VisualManager.CreateHoverState(toggleButton, Genesis.Meta.Color.asoc.medium, Genesis.Meta.Color.asoc.secondary, Genesis.Meta.Color.asoc.dark, undefined, () => {
        control.status = !control.status;
        if (control.status) {
            // Start timer.
            Genesis._var.Timers.Stopwatch.Start();
            toggleButton.innerText = 'Stop';
        } else {
            // Stop timer.
            Genesis._var.Timers.Stopwatch.Pause();
            toggleButton.innerText = 'Start';
        }
    });

    const resetButton = document.createElement('button');
    resetButton.className = 'inline-block mx-auto w-2/12 mt-4 mb-6 rounded-lg bg-asoc-gold-light border-2 border-asoc-white text-asoc-gold-light text-center focus:outline-none transition-color duration-150 ease-in-out';
    resetButton.innerText = 'Reset';
    container.appendChild(resetButton);

    Genesis.VisualManager.CreateHoverState(resetButton, Genesis.Meta.Color.asoc.medium, Genesis.Meta.Color.asoc.secondary, Genesis.Meta.Color.asoc.dark, undefined, () => {
        Genesis._var.Timers.Stopwatch.Reset();
        stopwatchTime.innerText = '0ms';
        toggleButton.innerText = 'Start';
        control.status = false;
    });
}

module.exports = Entry;