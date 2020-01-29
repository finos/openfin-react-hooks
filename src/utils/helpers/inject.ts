export const injectNode = (
    node: HTMLStyleElement | HTMLScriptElement | Node,
    document: HTMLDocument,
) => {
    if (document) {
        document
            .getElementsByTagName("head")[0]
            .appendChild(node.cloneNode(true));
    }
};

export const injectNodes = (
    nodes: HTMLCollectionOf<HTMLStyleElement | HTMLScriptElement>,
    document: HTMLDocument,
) => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < nodes.length; i++) {
        injectNode(nodes[i], document);
    }
};
