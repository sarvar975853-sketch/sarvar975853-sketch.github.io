// ads.js — Ad integration with anti-adblock stealth injection
(function() {
    "use strict";

    if (!window.__ad) return;

    // ─── Ad codes (non-obvious variable names) ────────────────────────
    var _k = "5a7b0a08c8d19f0201beca066b7c994a";
    var _u = "https://www.highperformanceformat.com/" + _k + "/invoke.js";

    function _bannerCode(w, h) {
        return '<scr' + 'ipt>atOptions={key:"' + _k + '",format:"iframe",height:' + h + ",width:" + w + ',params:{}}</scr' + 'ipt><scr' + 'ipt src="' + _u + '"></scr' + 'ipt>';
    }

    // ─── Create containers with random IDs and inject ads ──────────────
    var _pos = [
        { p: document.body, w: 728, h: 90, t: "prepend" },
        { p: document.querySelector(".content"), w: 300, h: 250, t: "append" },
        { p: document.body, w: 728, h: 90, t: "append" }
    ];

    function _inject() {
        // Top banner
        var topId = window.__ad.makeBox(728, 90, null);
        var topEl = document.getElementById(topId);
        if (topEl && document.body.firstChild) {
            document.body.insertBefore(topEl, document.body.firstChild);
        }
        window.__ad.fill(topId, _bannerCode(728, 90));

        // Sidebar
        var sideId = window.__ad.makeBox(300, 250, null);
        var adRow = document.querySelector(".ad-row");
        if (adRow) adRow.insertBefore(document.getElementById(sideId), adRow.firstChild);
        window.__ad.fill(sideId, _bannerCode(300, 250));

        // Bottom banner
        var botId = window.__ad.makeBox(728, 90, null);
        var footer = document.querySelector("footer");
        if (footer) footer.parentNode.insertBefore(document.getElementById(botId), footer);
        window.__ad.fill(botId, _bannerCode(728, 90));
    }

    // ─── Popunder ──────────────────────────────────────────────────────
    function _popunder() {
        var _pUrl = "https://pl30083381.effectivecpmnetwork.com/ac/44/8b/ac448bab40fa3ad3b352611f4e725982.js";
        var _clicked = false;
        document.addEventListener("click", function() {
            if (_clicked) return;
            _clicked = true;
            var f = document.createElement("iframe");
            f.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;";
            f.src = "about:blank";
            document.body.appendChild(f);
            var s = f.contentDocument.createElement("script");
            s.src = _pUrl;
            f.contentDocument.body.appendChild(s);
        }, { once: true });
    }

    // ─── Anti-adblock: MutationObserver re-injection ───────────────────
    // If an adblocker removes our containers, re-inject after 2 seconds
    function _watch() {
        var observer = new MutationObserver(function(mutations) {
            var removed = false;
            mutations.forEach(function(m) {
                m.removedNodes.forEach(function(n) {
                    if (n.nodeType === 1 && Object.keys(window.__ad.boxes).indexOf(n.id) !== -1) {
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

    // ─── Init ──────────────────────────────────────────────────────────
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
