import { Page } from "./page";

export class Canvas {
    tracks: Page[];

    constructor(tracks: Page[]) {
        this.tracks = tracks;
    }

    updatePage(newPage: Page) {
        const index = this.tracks.findIndex(page => page.id === newPage.id);
        if (index === -1) {
            this.tracks.push(newPage);
        } else {
            this.tracks[index] = newPage;
        }
    }

    getNewPage(): Page {
        // Generate unqiue default title
        let i = 1; let title = ""; while (title === "") {
          if (this.tracks.some(page => page.title === "Page #" + i)) i++;
          else title = "Page #" + i;
        }

        // Generate unique id, then save and return page
        i = 0; while(true) {
            if (this.tracks.some(page => page.id === i)) i++;
            else {
                const page = new Page(i, title, [], false)
                this.tracks.push(page);
                return page;
            }
        }
    }
}