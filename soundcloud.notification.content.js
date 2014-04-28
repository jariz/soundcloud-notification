
var SCNWeb = {
    "injectFile" : function(res) {
        var scr = document.createElement("script"); scr.type="text/javascript"; scr.src=chrome.extension.getURL(res); document.body.appendChild(scr);
    },
    "injectCode" : function(code) {
        var scr = document.createElement("script"); scr.type="text/javascript"; scr.text = code; document.body.appendChild(scr);
    },
    "init" : function() {
        this.injectCode("var SCNID = \""+chrome.i18n.getMessage("@@extension_id")+"\";");
        this.injectFile("soundcloud.notification.web.js");
    }
}

//and away we go
SCNWeb.init();