// ads.js — Ad injection with proper script element creation
(function() {
    "use strict";

    var _k = "5a7b0a08c8d19f0201beca066b7c994a";
    var _src = "https://www.highperformanceformat.com/" + _k + "/invoke.js";
    var _popunderSrc = "https://pl30083381.effectivecpmnetwork.com/ac/44/8b/ac448bab40fa3ad3b352611f4e725982.js";
    var _injected = [];

    function _createContainer(w, h) {
        var el = document.createElement("div");
        el.style.cssText = "width:" + w + "px;height:" + h + "px;overflow:hidden;margin:0 auto;position:relative;";
        return el;
    }

    function _createBanner(w, h) {
        var container = _createContainer(w, h);

        // Create the atOptions config script
        var configScript = document.createElement("script");
        configScript.text = "atOptions={key:'" + _k + "',format:'iframe',height:" + h + ",width:" + w + ",params:{}}";
        container.appendChild(configScript);

        // Create the invoke script
        var invokeScript = document.createElement("script");
        invokeScript.src = _src;
        invokeScript.async = true;
        container.appendChild(invokeScript);

        return container;
    }

    function _inject() {
        // Top banner (728x90)
        var topBanner = _createBanner(728, 90);
        topBanner.style.marginBottom = "15px";
        document.body.insertBefore(topBanner, document.body.firstChild);
        _injected.push(topBanner);

        // Sidebar banner (300x250)
        var adRow = document.querySelector(".ad-row");
        var sideBanner = _createBanner(300, 250);
        sideBanner.style.marginRight = "20px";
        sideBanner.style.flexShrink = "0";
        if (adRow) {
            adRow.insertBefore(sideBanner, adRow.firstChild);
        } else {
            document.querySelector(".content").insertBefore(sideBanner, document.querySelector(".content").firstChild);
        }
        _injected.push(sideBanner);

        // Bottom banner (728x90)
        var botBanner = _createBanner(728, 90);
        botBanner.style.marginTop = "15px";
        var footer = document.querySelector("footer");
        if (footer) {
            footer.parentNode.insertBefore(botBanner, footer);
        } else {
            document.body.appendChild(botBanner);
        }
        _injected.push(botBanner);
    }

    function _popunder() {
        var clicked = false;
        document.addEventListener("click", function() {
            if (clicked) return;
            clicked = true;
            var s = document.createElement("script");
            s.src = _popunderSrc;
            document.head.appendChild(s);
        }, { once: true });
    }

    function _watch() {
        var observer = new MutationObserver(function(mutations) {
            var removed = false;
            mutations.forEach(function(m) {
                m.removedNodes.forEach(function(n) {
                    if (n.nodeType === 1 && _injected.indexOf(n) !== -1) {
                        removed = true;
                    }
                });
            });
            if (removed) {
                setTimeout(_inject, 2000);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            _inject();
            _popunder();
            _watch();
        });
    } else {
        _inject();
        _popunder();
        _watch();
    }

})();
