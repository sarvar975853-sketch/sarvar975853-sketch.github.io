// ads.js — Banner 728x90 + Banner 300x250 (iframe) + Popunder
(function() {
    "use strict";

    // ── Ad Keys ───────────────────────────────────────────────────────
    var _banner728 = { key: "5a7b0a08c8d19f0201beca066b7c994a" };
    var _banner300 = { key: "5d6b20159bd5c960d515174e6fe72027" };
    var _popunderSrc = "https://pl30083381.effectivecpmnetwork.com/ac/44/8b/ac448bab40fa3ad3b352611f4e725982.js";

    // ── 1. Top Banner 728x90 ──────────────────────────────────────────
    function _renderBanner728() {
        var slot = document.getElementById("ad-top");
        if (!slot) return;
        window.atOptions = {
            key: _banner728.key,
            format: "iframe",
            height: 90,
            width: 728,
            params: {}
        };
        var s = document.createElement("script");
        s.src = "https://www.highperformanceformat.com/" + _banner728.key + "/invoke.js";
        s.async = true;
        slot.appendChild(s);
    }

    // ── 2. Sidebar Banner 300x250 (isolated iframe) ───────────────────
    function _renderBanner300() {
        var slot = document.getElementById("ad-sidebar-slot");
        if (!slot) return;

        // Create an iframe so atOptions doesn't collide with the 728x90 banner
        var iframe = document.createElement("iframe");
        iframe.width = 300;
        iframe.height = 250;
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";

        // srcdoc gives the iframe its own window, its own atOptions
        iframe.srcdoc =
            '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;">' +
            '<script>window.atOptions={' +
            "key:'" + _banner300.key + "'," +
            "format:'iframe'," +
            "height:250," +
            "width:300," +
            "params:{}" +
            '};</script>' +
            '<script src="https://www.highperformanceformat.com/' + _banner300.key + '/invoke.js" async></script>' +
            '</body></html>';

        slot.appendChild(iframe);
    }

    // ── 3. Popunder on first click ────────────────────────────────────
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
    
    // ── Override ad-blocking interference ──────────────────────────────
    function _bypassBlockers() {
        // Force bypass common blockers
        Object.defineProperty(window, "AdBlock", {
            get: function() { return false; },
            configurable: true
        });
        
        // Override adblock-detector if present
        window.__adblockDetector = null;
        
        // Force adblock-flag to false
        document.documentElement.className = document.documentElement.className.replace(/adblocker.*/g, "");
        
        // Create forced ad inventory (bypass blocker inventory checks)
        if (!window._adInventory) {
            window._adInventory = {
                ads: [{ key: _banner728.key, type: "banner" }],
                load: function() { return this.ads; }
            };
        }
    }

    // ── 4. Anti-adblock watcher ───────────────────────────────────────
    function _watch() {
        // Check for common adblocker properties
        if (window.hasOwnProperty("__adblockDetector") || 
            navigator.__proto__ && navigator.__proto__.hasOwnProperty("sendBeacon") && 
            document.body.style.display === "none") {
            console.log("[Aegis] Adblock detected, applying bypass ...");
        }

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                m.removedNodes.forEach(function(n) {
                    if (n.nodeType === 1) {
                        if ((n.id === "ad-top" || n.id === "ad-sidebar-slot")) {
                            console.log("[Aegis] Ad removed, re-attempting render...")
                            setTimeout(_renderBanner728, 500);
                            setTimeout(_renderBanner300, 500);
                            return;
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Preemptively bypass early adblock blocking
        setTimeout(function() {
            var adTop = document.getElementById("ad-top");
            if (!adTop) {
                console.log("[Aegis] Ad-blocker blocking detected (missing ad-top), forceful bypass...")
                var forceAd = document.createElement("div");
                forceAd.id = "ad-top";
                forceAd.className = "ad-slot";
                document.body.insertBefore(forceAd, document.body.firstChild);
                _renderBanner728();
                return;
            }
        }, 50);
    }

    // ── Boot ──────────────────────────────────────────────────────────
    function _boot() {
        _renderBanner728();
        _renderBanner300();
        _popunder();
        _watch();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", _boot);
    } else {
        _boot();
    }

})();
