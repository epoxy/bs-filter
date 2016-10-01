function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
    //Genuine
    v = v.replace(/\bGenuin(e|t|a)\b/g, "Pretto");
    v = v.replace(/\bGenuin\b/g, "Pretto");
    v = v.replace(/\bgenuin(e|t)\b/g, "pretto");
    v = v.replace(/\bgenuin\b/g, "pretto");

    //Premium
    v = v.replace(/\b(Premium)|(Deluxe)\b/g, "Helt okej");
    v = v.replace(/\b(premium)|(deluxe)\b/g, "helt okej");

    //Absolut
    v = v.replace(/\bAbsolut\b/g, "");
    v = v.replace(/\babsolut\b/g, "");

    //Glass
    v = v.replace(/\bGelato\b/g, "Glass");
    v = v.replace(/\bgelato\b/g, "glass");

    //Piazza
    v = v.replace(/\bPiazza\b/g, "Torg");
    v = v.replace(/\bpiazza\b/g, "torg");

    //Local
    v = v.replace(/\bLocal\b/g, "Svenne");
    v = v.replace(/\blocal\b/g, "svenne");

    //Ananas
    v = v.replace(/\bMango\b/g, "Ananas");
    v = v.replace(/\bmango\b/g, "ananas");

    //Håkan
    v = v.replace(/\b(Håkan)|(Håkan Hellström)|(håkan)|(håkan hellström)\b/g, "Svenne Banan");

    //TODO
    //Low hanging
    // v = v.replace(/\bLow hanging\b/g, "");
    // v = v.replace(/\blow hanging\b/g, "");

    return v;
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
