// ads.js — Adsterra Ad Integration
// Replace the placeholder IDs below with your actual Adsterra ad codes

(function() {
    "use strict";

    // ─── Adsterra Configuration ────────────────────────────────────────
    // Get your ad codes from https://publishers.adsterra.com
    // Paste them in the AD_UNITS object below

    const AD_UNITS = {
        // Top banner (728x90)
        top_banner: "",

        // Sidebar banner (300x250)
        sidebar_banner: "",

        // Bottom banner (728x90)
        bottom_banner: "",

        // In-Page Push (native-style notifications)
        in_page_push: "",
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
    }

    // ─── Helper: Inject Script into Container ──────────────────────────
    function injectScript(scriptCode, containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        // If it's a full <script> tag string, inject directly
        if (scriptCode.indexOf("<script") !== -1) {
            container.innerHTML = scriptCode;
            return;
        }

        // If it's just a URL, create a script element
        var script = document.createElement("script");
        script.src = scriptCode;
        script.async = true;
        container.appendChild(script);
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
