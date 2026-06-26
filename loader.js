// loader.js — Stealth ad injection layer
// Renames DOM elements, injects content via non-standard paths,
// and re-injects ads if removed by blockers.

(function() {
    "use strict";

    var _0xarr = [];
    var _created = {};

    // Random container IDs — avoids adblock filter pattern matching
    function _rid() {
        var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var id = "_";
        for (var i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
        return id;
    }

    // Create a hidden container with a random ID
    function _makeBox(w, h, parent) {
        var el = document.createElement("div");
        var id = _rid();
        el.setAttribute("id", id);
        el.style.cssText = "width:" + w + "px;height:" + h + "px;overflow:hidden;margin:0 auto;position:relative;";
        if (parent) parent.appendChild(el);
        else document.body.appendChild(el);
        _created[id] = { w: w, h: h };
        return id;
    }

    // Inject raw HTML string into a container by ID — bypasses innerHTML filters
    function _fill(id, html) {
        var el = document.getElementById(id);
        if (!el) return;
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        while (tmp.firstChild) el.appendChild(tmp.firstChild);
    }

    // Expose globally for ads.js to use
    window.__ad = {
        makeBox: _makeBox,
        fill: _fill,
        rid: _rid,
        boxes: _created
    };

})();
