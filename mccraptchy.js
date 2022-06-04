// ==UserScript==
// @name        McCraptchy
// @description Remove crap from the McClatchy newspaper web sites.
// @match       *://*.newsobserver.com/*
// @match       *://*.heraldsun.com/*
// ==/UserScript==

const existingOnLoad = window.onload;
window.onload = function() {
    if (existingOnLoad != null) {
        existingOnLoad();
    }

    purgeCrap();
}
purgeCrap();
purgeCrapRepeatedly();

function purgeCrap() {
    if (typeof AMP === "object" && typeof AMP.setState === "function") {
        AMP.setState({visible: true});
    }

    for (anchor of document.getElementsByTagName("a")) {
        const href = anchor.href;
        const lastComponent = href.substring(href.lastIndexOf("/"));

        if (lastComponent.startsWith("/article")) {
            const schemeAndDomain = href.substring(0, href.indexOf("/", 8));
            const ampSchemeAndDomain = schemeAndDomain.replace("www", "amp");
            const newHREF = ampSchemeAndDomain + lastComponent;
            anchor.href = newHREF;
        }
    }
}

function purgeCrapRepeatedly() {
    for (ad of document.getElementsByClassName("ad")) {
        ad.remove();
    }

    for (ad of document.getElementsByTagName("zeus-ad")) {
        ad.remove();
    }

    for (element of document.getElementsByTagName("amp-connatix-player")) {
        element.remove();
    }

    // Bottom bar
    for (element of document.getElementsByTagName("amp-sticky-ad")) {
        element.remove();
    }

    // Taboola ads
    const taboola = document.getElementById("Taboola")
    if (taboola != null) taboola.remove();

    // actually ads
    const latestNews = document.getElementById("latest-news")
    if (latestNews != null) latestNews.remove();

    setTimeout(purgeCrapRepeatedly, 500);
}
