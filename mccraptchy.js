// ==UserScript==
// @name        McCraptchy
// @description Remove crap from the McClatchy newspaper web sites.
// @match       *://*.newsobserver.com/*
// @match       *://*.heraldsun.com/*
// @match       *://*.charlotteobserver.com/*
// ==/UserScript==

const href = window.location.href;
if (href.startsWith("https://account.newsobserver.com/paywall/stop?resume=")) {
    const schemeAndDomain = href.substring(0, href.indexOf("/", 8));
    const ampSchemeAndDomain = schemeAndDomain.replace("account", "amp");
    const articleID = href.substring(href.lastIndexOf("=") + 1);
    window.location.href = ampSchemeAndDomain + "/article" + articleID + ".html";
}
// https://account.newsobserver.com/paywall/stop?resume=267522628
// https://amp.newsobserver.com/article267522628.html

// Kill new AMP paywall
for (element of document.querySelectorAll("[subscriptions-section=content]")) {
    element.removeAttribute("subscriptions-section");
}
const style = document.createElement("style");
style.textContent = "amp-subscriptions-dialog { visibility: hidden; }";
document.head.appendChild(style);

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
        try {
            const url = new URL(href);
            const lastComponent = url.pathname.substring(url.pathname.lastIndexOf("/"));

            if (lastComponent.startsWith("/article")) {
                url.hostname = url.hostname.replace("www", "amp");
                url.pathname = lastComponent;
                url.hash = "";
                anchor.href = url.href;
            }
        } catch (e) {}
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
