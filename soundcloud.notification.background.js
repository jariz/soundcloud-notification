var ports = new Array();
var activePort = undefined;
var SCNRCV = {
    "connect": function () {
        chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
            if(typeof ports[notificationId] == "undefined") {
                console.error("Port of this notification was not found :(");
                return;
            }
            var port = ports[notificationId];
            switch(buttonIndex) {
                case 0:
                    port.postMessage({
                        action: "previous"
                    });
                    break;
                case 1:
                    port.postMessage({
                        action: "next"
                    });
                    break;
            }
        })

        chrome.commands.onCommand.addListener(function(command) {
            var action = "";
            switch(command) {
                case "playback-playpause":
                    action = "pause";
                    break;
                case "playback-next":
                    action = "next";
                    break;
                case "playback-prev":
                    action = "previous";
                    break;
                default:
                    throw "wut";
            }

            if(typeof activePort != "undefined") {
                activePort.postMessage({
                    action: action
                });
            } else {
                console.warn("Couldn't post message cuz active port isn't set (yet).");
            }
        })

        chrome.runtime.onConnectExternal.addListener(function (portt) {
            activePort = portt;
            console.log(portt);

            portt.onMessage.addListener(function (msg) {
                var id = "scn" + Math.random();
                ports[id] = portt;
                var artwork =
                    typeof msg.artwork_url == "string" ?
                        msg.artwork_url :
                        msg.user.avatar_url;
                artwork = artwork.replace("-large", "-t200x200");

                chrome.notifications.create(
                    id,
                    {
                        type: "basic",
                        title: msg.title,
                        message: msg.user.username,
                        iconUrl:  artwork,
                        buttons: [
                            {
                                title: "Previous",
                                iconUrl : chrome.extension.getURL("previous.png")
                            },
                            /*{
                                title: "Pause",
                                iconUrl : chrome.extension.getURL("pause.png")
                            },*/
                            {
                                title: "Next",
                                iconUrl : chrome.extension.getURL("next.png")
                            }
                        ]
                    },
                    function () {

                    }
                );
            })
        });
    }
}

//and away we go
console.log("Soundcloud Notifications server-side initializing...");
SCNRCV.connect();