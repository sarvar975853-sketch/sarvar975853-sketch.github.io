// ads.js — Adsterra Ad Integration
// Replace the placeholder IDs below with your actual Adsterra ad codes

(function() {
    "use strict";

    // ─── Adsterra Configuration ────────────────────────────────────────
    // Get your ad codes from https://publishers.adsterra.com
    // Paste them in the AD_UNITS object below

    const AD_UNITS = {
        // Top banner (728x90)
        top_banner: `
            <script>
              atOptions = {
                'key' : '5a7b0a08c8d19f0201beca066b7c994a',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/5a7b0a08c8d19f0201beca066b7c994a/invoke.js"></script>
        `,

        // Sidebar banner (300x250)
        sidebar_banner: `
            <script>
              atOptions = {
                'key' : '5a7b0a08c8d19f0201beca066b7c994a',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/5a7b0a08c8d19f0201beca066b7c994a/invoke.js"></script>
        `,

        // Bottom banner (728x90)
        bottom_banner: `
            <script>
              atOptions = {
                'key' : '5a7b0a08c8d19f0201beca066b7c994a',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/5a7b0a08c8d19f0201beca066b7c994a/invoke.js"></script>
        `,

        // In-Page Push (native-style notifications)
        in_page_push: "",

        // Popunder (opens on first click)
        popunder: '<script src="https://pl30083381.effectivecpmnetwork.com/ac/44/8b/ac448bab40fa3ad3b352611f4e725982.js"></script>',
    };

    // ─── Load Adsterra Script ──────────────────────────────────────────
    function loadAdsterra() {
        // Adsterra main script — replace with your publisher script
        // Format: <script src="https://pl26494746.profitableratecpm.com/..."></script>

        if (AD_UNITS.top_banner) {
            injectScript(AD_UNITS.top_banner, "ad-top");
        }
        if (AD_UNITS.sidebar_banner) {
            injectScript(AD_UNITS.sidebar_banner, "ad-sidebar");
        }
        if (AD_UNITS.bottom_banner) {
            injectScript(AD_UNITS.bottom_banner, "ad-bottom");
        }
        if (AD_UNITS.in_page_push) {
            injectScript(AD_UNITS.in_page_push, "ad-push");
        }
        if (AD_UNITS.popunder) {
            injectScript(AD_UNITS.popunder, "ad-popunder");
        }
    }

    // ─── Helper: Inject Script into Container ──────────────────────────
    function injectScript(scriptCode, containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        // Parse and inject all script tags from the code
        var wrapper = document.createElement("div");
        wrapper.innerHTML = scriptCode;
        container.appendChild(wrapper);
    }

    // ─── Helper: Inject Adsterra Smartlink ─────────────────────────────
    // Smartlinks are self-contained — just paste the URL
    function addSmartlink(containerId, smartlinkUrl) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var link = document.createElement("a");
        link.href = smartlinkUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Visit Sponsor";
        link.className = "smartlink";
        container.appendChild(link);
    }

    // ─── Initialize on DOM Ready ───────────────────────────────────────
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadAdsterra);
    } else {
        loadAdsterra();
    }

})();
