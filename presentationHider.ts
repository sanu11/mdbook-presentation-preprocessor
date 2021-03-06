
/**
 * The presentation mode enum
 */
enum PresentationMode {
    /**
     * Presenting
     */
    Slides = 0,
    /**
     * Not presenting
     */
    Web = 1,
}
/**
 * The object that will handle all of the
 * presentation mode activities
 */
class PresentationModeHider {
    /**
     * The current mode
     */
    private mode: PresentationMode;
    /**
     * A constant value for the localStorage
     * Key
     */
    private readonly queryKey = 'presentation_mode';
    /**
     * A constant value for web-only elements class
     */
    private readonly webClass = 'article-content';
    /**
     * A constant value for slides-only elements class
     */
    private readonly preClass = 'presentation-only';

    constructor() {
        this.mode = this.getMode();
        this.setMode(); // we do this here to make sure there is a value
        this.assignClassesViaComments();
        this.tryMoveToFirstChapter();
        window.addEventListener('keyup', ev => {
            if (!ev.altKey) {
                return;
            }
            if (ev.key == 'p' || ev.key == 'P' || ev.code == 'KeyP') {
                this.toggle();
            }
        });
    }
    /**
     * If in presentation mode and at the root, left and right
     * buttons do not page through the presentation. This will
     * check for presentation mode and root, if both are true
     * it will attempt to move to the first chapter (which is always the same)
     */
    tryMoveToFirstChapter() {
        if (this.mode === PresentationMode.Slides 
            && (location.pathname === ''
            || location.pathname === '/')) {
            let chList = document.querySelector('.sidebar .chapter') as HTMLUListElement;
            if (!chList) {
                return console.error('unable to find chapter 1 link for paging. Please manually click into chapter 1');;
            }
            let firstLi = chList.firstChild as HTMLLIElement;
            let firstLink = firstLi.firstChild as HTMLAnchorElement;
            firstLink.click();
        }
    }
    /**
     * This loops though the DOM and finds any comments with the value
     * 'web-only' or 'slides-only'. It then applies the correct class
     * to all elements between this comment and the corresponding end
     * comment
     * ```html
     * <div>
     * <!--slides-only-->
     * <div>
     * </div>
     * <!--slides-only-end-->
     * </div>
     * ```
     *
     * becomes
     *
     * ```html
     * <div>
     * <!--slides-only-->
     * <div class="presentation-only">
     * </div>
     * <!--slides-only-end-->
     * </div>
     * ```
     */
    assignClassesViaComments() {
        let iter = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT, null);
        let node;
        let modeClass = this.mode === PresentationMode.Web ? 'not-presenting' : 'presenting';
        let cls = null;
        while (node = iter.nextNode()) {
            if (node.nodeType === 8) { // comment
                let value = node.nodeValue.trim();
                if (value === "web-only") {
                    cls = this.webClass;
                } else if (value === "slides-only") {
                    cls = this.preClass;
                } else if (value.startsWith('notes')) { 
                    this.processNotes(value);
                } else if (value === "web-only-end" 
                    || value === "slides-only-end"
                    || value === "notes-end") {
                    cls = null;
                }
            } else if (node.nodeType === 1 && cls !== null) { // element
                node.classList.add(cls, modeClass);
            }
        }
    }
    /**
     * Get the current presentation mode from storage
     * @returns The last known presentation mode or the default (Web)
     */
    private getMode(): PresentationMode {
        let mode = localStorage.getItem(this.queryKey);
        if (mode === null) {
            return PresentationMode.Web
        }
        try {
            let ret = parseInt(mode);
            if (ret > 1 || ret < 0) {
                console.error('presentation_mode was out of range', ret);
                return PresentationMode.Web;
            }
            return ret;
        } catch (e) {
            console.error('presentation_mode present in localStorage but value is not an integer', mode, e);
            return PresentationMode.Web;
        }
    }
    /**
     * Update the storage to have the same value as `this.mode`
     */
    private setMode() {
        localStorage.setItem(this.queryKey, this.mode.toString());
    }
    /**
     * Find all of the `.presentation-only` and `.article-content` items
     * and update them to have either a `presenting` or `not-presenting` class
     */
    private updatePage() {
        this.updateElements(document.querySelectorAll('.presentation-only'));
        this.updateElements(document.querySelectorAll('.article-content'))
    }
    /**
     * Update a list of `HTMLDivElement`s to have either the `presenting`
     * or `not-presenting` class
     * @param elements A list of `HTMLDivElement`s to be updated
     */
    private updateElements(elements: NodeListOf<HTMLDivElement>) {
        for (var i = 0; i < elements.length; i++) {
            let el = elements[i];
            if (this.mode === PresentationMode.Slides) {
                el.classList.replace('not-presenting', 'presenting');
            } else {
                el.classList.replace('presenting', 'not-presenting');
            }
        }
    }

    /**
     * Toggle between`Web` and `Slides` presentation mode
     * @remarks
     * This will update localStorage and the view
     */
    private toggle() {
        switch (this.mode) {
            case PresentationMode.Slides:
                this.mode = PresentationMode.Web;
                break;
            case PresentationMode.Web:
                this.mode = PresentationMode.Slides;
                break;
        }
        this.setMode();
        this.updatePage();
    }

    processNotes(text: string) {
        let startIdx = text.indexOf('\n');
        console.log(`%c${text.substr(startIdx+1)}`, 'font-size: 14pt;');
    }
}

const ___presentationModeHider = new PresentationModeHider();