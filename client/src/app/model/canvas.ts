import { Page } from "./page";
import { Phrase } from "./phrase";

export class Canvas {
    tracks: Page[];

    constructor(tracks: Page[]) {
        this.tracks = tracks;
        if(tracks.length === 0) this.addNewPage();
    }

    /** Pushes new page to tracks: Page[] and returns the new page */
    addNewPage(): Page {
        // Generate unqiue default title
        let i = 1; let title = ""; while (title === "") {
          if (this.tracks.some(page => page.title === "Page #" + i)) i++;
          else title = "Page #" + i;
        }

        // Generate unique id, then save and return page
        i = 0; while(true) {
            if (this.tracks.some(page => page.id === i)) i++;
            else {
                const page = new Page(i, title, [])
                this.tracks.push(page);
                return page;
            }
        }
    }
}