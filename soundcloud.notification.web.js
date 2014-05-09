define("vendor/jariz/events", ["require", "event-bus", "lib/play-manager", "vendor/jariz/core", "exports"], function (require, eventbus, playmanager, core, exports) {

    eventbus.on("audio:play", function () {
        var currentSound = playmanager.getCurrentSound();
        core.port.postMessage(currentSound.attributes);
    })

    exports.processAction = function(action) {
        switch(action) {
            case "pause":
                playmanager.toggleCurrent();
                break;
            case "next":
                playmanager.playNext();
                break;
            case "previous":
                playmanager.playPrev();
                break;
        }
    };
})

define("vendor/jariz/core", [], {
    "port": null,
    "init": function () {
        console.log("Soundcloud Notifications client-side initializing....")

        this.events = require("vendor/jariz/events");
        var events = this.events;

        //checks
        if (!"Notification" in window) {
            console.error("FAILED, Notification object not found(?)");
            return;
        }

        if(!"runtime" in window.chrome) {
            console.error("FAILED, chrome runtime not found");
            return;
        }

        //connect to our background script
        this.port = chrome.runtime.connect(SCNID);
        this.port.onMessage.addListener(function(msg) {
            events.processAction(msg.action);
        })
    }
})

//bootstrappp
require("vendor/jariz/core").init();