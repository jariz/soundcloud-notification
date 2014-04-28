var ports = new Array();
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
        chrome.runtime.onConnectExternal.addListener(function (portt) {
            console.log(portt);

            portt.onMessage.addListener(function (msg) {
                var id = "scn" + Math.random();
                ports[id] = portt;
                chrome.notifications.create(
                    id,
                    {
                        type: "basic",
                        title: msg.title,
                        message: msg.user.username,
                        //imageUrl: resp.artwork_url.replace("-large", "-t500x500"),
                        iconUrl: msg.artwork_url.replace("-large", "-t200x200"),
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