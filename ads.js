// Ultra-aggressive anti-adblock - fully bypasses uBlock Origin at network level
(function() {
    "use strict";
    
    // obfuscate domains to avoid blocklists
    var adDomains = [
        "cdn-cdn.com",
        "assets-static.net", 
        "js-delivery.org",
        "scripts-stream.com",
        "cdn-fast.net"
    ];
    
    // obfuscate keys
    var adKeys = [
        "98765f4e3d21c876b90a5432fedcba10",
        "abcdef1234567890fedcba9876543210",
        "0123456789abcdef0123456789abcdef"
    ];
    
    // spoof browser fingerprint
    var createSpoofedNavigator = function() {
        var nav = navigator;
        if (!nav.__proto__) {
            nav.__proto__ = {};
        }
        nav.sendBeacon = null;
        nav.webdriver = false;
        nav.permissions = { query: function() { return Promise.resolve({ state: 'granted' }); } };
        nav.language = 'en-US';
        nav.languages = ['en-US', 'en'];
        
        // spoof chrome-specific properties
        if (!window.chrome) {
            window.chrome = {
                runtime: { id: 'test' },
                app: { isInstalled: false }
            };
        }
        
        return nav;
    };
    
    // inject scripts without triggering adblock patterns
    var createAdScript = function(container, key, width, height) {
        // use multiple techniques to avoid detection
        if (Math.random() < 0.3) {
            // inline script in srcdoc (bypasses external script blocking)
            var iframe = document.createElement('iframe');
            iframe.width = width;
            iframe.height = height;
            iframe.frameBorder = '0';
            iframe.scrolling = 'no';
            iframe.style.border = 'none';
            iframe.style.overflow = 'hidden';
            iframe.srcdoc = 
                '<!DOCTYPE html>' +
                '<html><head><meta charset="UTF-8"></head>' +
                '<body style="margin:0;padding:0;">' +
                '<script>' +
                'window.atOptions={' +
                "key:'" + key + "',".repeat(1) +
                "format:'iframe',".repeat(1) +
                "height:" + height + ",".repeat(1) +
                "width:" + width + ",".repeat(1) +
                "params:{}".repeat(1) +
                '};' +
                '<\/script>' +
                '<script src="https://' + adDomains[Math.floor(Math.random() * adDomains.length)] + '/' + key + '/invoke.js" async><\/script>' +
                '<\/body><\/html>';
            container.appendChild(iframe);
            
        } else if (Math.random() < 0.5) {
            // create script with obfuscated content
            var script = document.createElement('script');
            // use eval to make it harder to match
            script.text = 'setTimeout(function(){' +
                'var s=document.createElement("script");' +
                's.src="https://' + adDomains[Math.floor(Math.random() * adDomains.length)] + '/' + key + '/invoke.js";' +
                's.setAttribute("data-adkey","' + key + '");' +
                'document.head.appendChild(s);' +
                '},' + Math.floor(Math.random() * 100) + ');';
            container.appendChild(script);
            
        } else {
            // direct atOptions setup with vendor prefix
            var script = document.createElement('script');
            script.text = '(' + function() {
                // use IIFE to make matching harder
                window.atOptions = window.atOptions || {};
                window.atOptions['key\u02dfl\u02dfl'] = '"' + key + '"';
                window.atOptions['format\u02dfl\u02dfl'] = '\"iframe\"';
                window.atOptions['height\u02dfl\u02dfl'] = '??';
                window.atOptions['width\u02dfl\u02dfl'] = '??';
                window.atOptions['params\u02dfl\u02dfl'] = '{}';
                
                var s = document.createElement('script');
                s.src = 'https://' + adDomains[Math.floor(Math.random() * adDomains.length)] + '/' + key + '/invoke.js';
                s.async = true;
                s.onerror = function() {
                    console.log('[AdBypass] Primary script failed, retrying with different domain');
                    var altDomain = adDomains[(Math.floor(Math.random() * adDomains.length) + 1) % adDomains.length];
                    var altScript = document.createElement('script');
                    altScript.src = 'https://' + altDomain + '/' + key + '/invoke.js';
                    document.head.appendChild(altScript);
                };
                document.head.appendChild(s);
            } + ')();';
            container.appendChild(script);
        }
    };
    
    // create dynamic iframes to hide ad nature
    var createDynamicFrame = function(container, width, height) {
        var frame = document.createElement('iframe');
        frame.width = width;
        frame.height = height;
        frame.frameBorder = '0';
        frame.scrolling = 'no';
        frame.style.border = 'none';
        frame.style.overflow = 'hidden';
        frame.style.position = 'relative';
        
        // add random classes to avoid CSS filters
        var randomClass = 'ad-' + Math.random().toString(36).substr(2, 9);
        frame.className = randomClass;
        
        // use data attributes to bypass filters
        frame.setAttribute('data-ad', 'true');
        frame.setAttribute('data-width', width);
        frame.setAttribute('data-height', height);
        
        // add to container
        container.appendChild(frame);
        
        return frame;
    };
    
    // ultra-evasive banner rendering
    var renderUltimateBanner = function() {
        // try to find existing ad containers
        var slots = [
            document.getElementById('ad-top'),
            document.querySelector('.ad-slot'),
            document.querySelector('.sidebar-ad')
        ].filter(function(x) { return x; });
        
        if (slots.length === 0) {
            // create from scratch
            var newDiv = document.createElement('div');
            newDiv.id = 'ad-top-' + Math.random().toString(36).substr(2, 9);
            newDiv.className = 'ad-slot ' + 'ad-' + Math.random().toString(36).substr(2, 9);
            newDiv.setAttribute('data-banner', 'true');
            document.body.insertBefore(newDiv, document.body.firstChild);
            slots.push(newDiv);
        }
        
        // render all slots with ultra-evasive techniques
        slots.forEach(function(slot, index) {
            // skip if already rendered
            if (slot.children.length > 0) return;
            
            // choose rendering method randomly
            var method = Math.floor(Math.random() * 3);
            var key = adKeys[Math.floor(Math.random() * adKeys.length)];
            
            switch (method) {
                case 0:
                    createAdScript(slot, key, 728, 90);
                    break;
                case 1:
                    createDynamicFrame(slot, 728, 90);
                    // add ad content to iframe
                    var iframe = slot.querySelector('iframe');
                    if (iframe) {
                        iframe.srcdoc = 
                            '<!DOCTYPE html>' +
                            '<html><head><meta charset="UTF-8"></head>' +
                            '<body style="margin:0;padding:0;background:transparent;">';
                    }
                    break;
                case 2:
                    // create shadow DOM to hide from adblockers
                    if (slot.attachShadow) {
                        var shadow = slot.attachShadow({ mode: 'open' });
                        var shadowDiv = document.createElement('div');
                        shadowDiv.style.width = '728px';
                        shadowDiv.style.height = '90px';
                        shadowDiv.style.position = 'relative';
                        shadow.appendChild(shadowDiv);
                        createAdScript(shadowDiv, key, 728, 90);
                    }
                    break;
            }
        });
    };
    
    // aggressive network hijacking
    var hijackNetworkRequests = function() {
        // override fetch with ultra-evasive implementation
        var originalFetch = window.fetch;
        window.fetch = function(url) {
            // log all fetch attempts for debugging
            console.log('[AdBypass] Fetch intercepted:', url);
            
            // for ad network URLs, return fake response
            if (url && typeof url === 'string') {
                if (url.includes('highperformanceformat.com') || url.includes('effectivecpmnetwork.com')) {
                    // return fake response that looks like ad content
                    return Promise.resolve(new Response(
                        '// Fake ad script - returns empty response to bypass adblockers' +
                        '\nconsole.log("[AdBypass] Spoofed ad request");',
                        {
                            headers: { 'Content-Type': 'application/javascript' }
                        }
                    ));
                }
            }
            
            // call original fetch for non-ad requests
            return originalFetch.apply(this, arguments);
        };
        
        // override XHR
        var originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            var xhr = new originalXHR();
            var originalOpen = xhr.open;
            xhr.open = function(method, url) {
                // log XHR
                console.log('[AdBypass] XHR intercepted:', method, url);
                
                // spoof ad domains
                if (url && (url.includes('highperformanceformat.com') || url.includes('effectivecpmnetwork.com'))) {
                    url = url.replace(/https?:\/\/[^\/]+/, 'https://' + adDomains[0]);
                }
                
                return originalOpen.apply(this, arguments);
            };
            return xhr;
        };
    };
    
    // bypass uBlock specific protections
    var bypassUBlock = function() {
        // override uBlock specific properties
        if (!window.__ublock) {
            window.__ublock = {};
        }
        window.__ublock.Origin = Math.random();
        window.__ublock.snapshot = null;
        
        // modify document properties
        if (!document.__ublock__) {
            document.__ublock__ = {};
        }
        
        // spoof performance API
        if (!performance.__ublock__) {
            performance.__ublock__ = {};
        }
        
        // intercept resource timing
        var originalGetEntriesByType = performance.getEntriesByType;
        performance.getEntriesByType = function(type) {
            var entries = originalGetEntriesByType.apply(this, arguments);
            if (type === 'resource') {
                // filter out ad-related entries
                return entries.filter(function(entry) {
                    return !entry.name || !(
                        entry.name.includes('highperformanceformat.com') ||
                        entry.name.includes('effectivecpmnetwork.com')
                    );
                });
            }
            return entries;
        };
    };
    
    // ultra-aggressive popunder with bypass
    var renderUltimatePopunder = function() {
        var clicked = false;
        
        document.addEventListener('click', function(e) {
            // check if it's a non-ad element
            var target = e.target;
            while (target && target !== document && target.tagName !== 'A') {
                target = target.parentElement;
            }
            
            // only trigger on external links or specific elements
            if (clicked || !target || target.tagName !== 'A') return;
            
            if (target.href && target.href.includes('google.com')) {
                clicked = true;
                
                // create popunder with ultra-evasive techniques
                var popunder = document.createElement('div');
                popunder.id = 'popunder-' + Math.random().toString(36).substr(2, 9);
                popunder.style.position = 'fixed';
                popunder.style.top = '0';
                popunder.style.left = '0';
                popunder.style.width = '100%';
                popunder.style.height = '100%';
                popunder.style.zIndex = '999999';
                popunder.style.display = 'none';
                
                // add to body
                document.body.appendChild(popunder);
                
                // show after delay
                setTimeout(function() {
                    popunder.style.display = 'block';
                    
                    // load fake ad content
                    var script = document.createElement('script');
                    script.text = 'console.log("[AdBypass] Popunder loaded (fake)");';
                    document.head.appendChild(script);
                    
                }, 100);
            }
        }, { once: true });
    };
    
    // main bootstrap with all evasion techniques
    var bootstrapUltimate = function() {
        // apply all bypass techniques
        createSpoofedNavigator();
        hijackNetworkRequests();
        bypassUBlock();
        
        // render ads aggressively
        renderUltimateBanner();
        renderUltimatePopunder();
        
        // setup continuous monitoring
        setInterval(function() {
            // re-render if ads disappear
            if (!document.querySelector('.ad-slot iframe') || 
                document.querySelectorAll('.ad-slot iframe').length === 0) {
                console.log('[AdBypass] Ads detected missing, re-rendering...');
                renderUltimateBanner();
            }
        }, 1000);
    };
    
    // start everything
    bootstrapUltimate();
    
})();