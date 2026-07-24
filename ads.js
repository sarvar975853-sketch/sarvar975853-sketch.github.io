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

    // ── Enhanced blocker detection ────────────────────────────────────
    function _detectBlockers() {
        // Comprehensive adblocker detection
        var blockers = [];
        
        // Check for common adblocker properties
        if (window.hasOwnProperty("__adblockDetector")) blockers.push("__adblockDetector");
        if (window.hasOwnProperty("AdBlock")) blockers.push("AdBlock");
        if (window.hasOwnProperty("_abp")) blockers.push("_abp");
        if (window.hasOwnProperty("__ABP")) blockers.push("__ABP");
        
        // navigator.proto.properties check
        if (navigator.__proto__ && navigator.__proto__.hasOwnProperty("sendBeacon")) blockers.push("sendBeacon");
        
        // Additional advanced adblocker characteristics
        if (document.documentElement.className && document.documentElement.className.includes("adblocker")) blockers.push("class-based");
        if (document.body && document.body.style && document.body.style.display === "none") blockers.push("body-hidden");
        
        // Performance-based detection
        var perf = performance.getEntriesByType("resource");
        for (var i = 0; i < perf.length; i++) {
            if (perf[i].name.includes("ads") || perf[i].name.includes("ad.")) blockers.push("resource-filter");
        }
        
        return blockers;
    }

    // ── Bootstrap with comprehensive bypass ─────────────────────────────
    function _bootstrap() {
        // Run blocker detection and apply bypasses
        var blockers = _detectBlockers();
        if (blockers.length > 0) {
            console.log("[AntiAd] Blockers detected:", blockers.join(", "), " - applying aggressive bypass");
            
            // Override all common adblocker properties
            Object.defineProperty(window, "AdBlock", { get: function() { return false; }, configurable: true });
            Object.defineProperty(window, "__adblockDetector", { value: null, configurable: true });
            Object.defineProperty(window, "_abp", { value: null, configurable: true });
            Object.defineProperty(window, "__ABP", { value: null, configurable: true });
            
            // Remove adblock classes from DOM
            document.documentElement.className = document.documentElement.className.replace(/adblocker.*/g, "");
            
            // Force bypass specific to uBlock Origin
            if (blockers.includes("sendBeacon") || document.body.style.display === "none") {
                console.log("[AntiAd] uBlock Origin detected - applying specialized bypass");
                
                // Spoof uBlock Origin's internal properties
                Object.defineProperty(navigator, "sendBeacon", { 
                    value: function() { console.log("[AntiAd] Spoofed sendBeacon call"); }, 
                    configurable: true
                });
                
                // Spoof performance entry types
                performance.getEntriesByType = function(type) {
                    if (type === "resource") {
                        return [];
                    }
                    return performance.__proto__.getEntriesByType.call(this, type);
                };
                
                // Inject a fake resource log to confuse performance-based detection
                var fakePerf = document.createElement("div");
                fakePerf.id = "__fake_perf_log";
                document.body.appendChild(fakePerf);
                
                // Override object properties that adblockers use
                Object.defineProperty(window, "chrome", { 
                    value: { runtime: { id: "test" } }, 
                    configurable: true 
                });
                
                // Spoof external domain checks
                var originalFetch = window.fetch;
                window.fetch = function() {
                    console.log("[AntiAd] Spoofed fetch call to bypass domain checks");
                    return Promise.resolve(new Response(""));
                };
                
                // Spoof XMLHttpRequest
                var originalXHR = window.XMLHttpRequest;
                window.XMLHttpRequest = function() {
                    var xhr = new originalXHR();
                    xhr.open = function() {
                        var args = arguments;
                        console.log("[AntiAd] Spoofed XHR open:", args[0], args[1]);
                        originalXHR.prototype.open.apply(this, args);
                    };
                    return xhr;
                };
            }
        }
        
        // Direct browser API interception
        _interceptAPIs();
    }

    // ── Low-level API interception ──────────────────────────────────────
    function _interceptAPIs() {
        // Intercept fetch API
        var originalFetch = window.fetch;
        window.fetch = function(url) {
            console.log("[AntiAd] Intercepted fetch to:", url);
            
            // If it's trying to fetch ad-related scripts, spoof the response
            if (url && (url.includes("highperformanceformat.com") || url.includes("effectivecpmnetwork.com"))) {
                return Promise.resolve(new Response("// Spoofed ad script\nconsole.log('[AntiAd] Spoofed ad script call');", {
                    headers: { "Content-Type": "application/javascript" }
                }));
            }
            
            return originalFetch.apply(this, arguments);
        };
        
        // Intercept XMLHttpRequest
        var originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            var xhr = new originalXHR();
            var originalOpen = xhr.open;
            xhr.open = function(method, url) {
                console.log("[AntiAd] Intercepted XHR open:", method, url);
                
                if (url && (url.includes("highperformanceformat.com") || url.includes("effectivecpmnetwork.com"))) {
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                }
                
                return originalOpen.apply(this, arguments);
            };
            return xhr;
        };
        
        // Intercept image loading
        var originalImage = Image;
        window.Image = function() {
            var img = new originalImage();
            var originalSrc = img.src;
            Object.defineProperty(img, 'src', {
                set: function(value) {
                    console.log("[AntiAd] Intercepted image src:", value);
                    if (value && (value.includes("tracking") || value.includes("pixel"))) {
                        return;
                    }
                    originalSrc = value;
                },
                get: function() {
                    return originalSrc;
                }
            });
            return img;
        };
        
        // Intercept link navigation
        document.addEventListener("click", function(e) {
            var target = e.target;
            while (target && target !== document && target.tagName !== "A") {
                target = target.parentElement;
            }
            if (target && target.tagName === "A" && target.href) {
                console.log("[AntiAd] Intercepted link:", target.href);
                if (target.href.includes("effectivecpmnetwork.com")) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true);
    }

    // ── Super-aggressive injection ───────────────────────────────────────
    function _superInject() {
        // Force render regardless of container state
        if (!document.getElementById("ad-top")) {
            console.log("[AntiAd] Force-creating ad-top container");
            var forceDiv = document.createElement("div");
            forceDiv.id = "ad-top";
            forceDiv.className = "ad-slot";
            if (document.body.firstChild) {
                document.body.insertBefore(forceDiv, document.body.firstChild);
            } else {
                document.body.appendChild(forceDiv);
            }
        }
        
        if (!document.getElementById("ad-sidebar-slot")) {
            console.log("[AntiAd] Force-creating ad-sidebar-slot container");
            var sidebarDiv = document.createElement("div");
            sidebarDiv.id = "ad-sidebar-slot";
            sidebarDiv.className = "ad-slot";
            var sidebarContainer = document.querySelector(".sidebar-col");
            if (sidebarContainer) {
                sidebarContainer.appendChild(sidebarDiv);
            } else {
                document.body.appendChild(sidebarDiv);
            }
        }
        
        // Immediate rendering with multiple fallbacks
        console.log("[AntiAd] Attempting immediate ad rendering");
        _renderBanner728();
        setTimeout(_renderBanner728, 100);
        setTimeout(_renderBanner300, 200);
    }

    // ── Boot ──────────────────────────────────────────────────────────
    function _boot() {
        _bypassBlockers();
        _bootstrap();
        _superInject();
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
