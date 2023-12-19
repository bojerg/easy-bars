# easy-bars
Digital Lyrics Workstation

## Goal
A lightweight and multiplatform application which aids in writing lyrics. Sync syllables to beats and pitch, provide spellchecking, real-time collaboration, and synchronized playback of music and lyrics.

### Editor Components
The #1 goal for the editor is to be as simple and intuitive as possible. If a user simply wants a notepad with a built in instrumental, they can use it that way. If a user wants to compose a four-part harmony with various lyrics and rythmns, they can do that also. Ideally, nothing stands in the way of writing when creativity strikes, and nothing holds you back when its time to iron out the details and practice.
#### Canvas
An empty project begins with a blank canvas. Well, mostly blank. It has grid lines just like a DAW has in it's playback screen. There should be a few other controls, like start & play, a BPM (tempo) setting, track title/info, and instrumental info panel (either track info or add track button). Below, there is a track to place lyric "pages" for the vocalist (or multiple tracks for multiple vocalists).
#### Pages
In the previous section, I mention pages. These "pages" are meant to be like a block of vocals which extend for a certain amount of bars. The amount of bars and/or beats a page extends for can be altered on the go. A good example of how to split a track of lyrics is into verses, but you could go line by line or use one page for the whole track. Pages may be placed multiple times, like if a lyricist would like a chorus which repeats periodically. This page gets placed into the Canvas on the beat which it is intended to begin.
When editing a page's contents, it's just like a notepad. The user can then toggle "Edit Flow" to split a word or group of words into it's own "note". Just like a musical note, this note is held for a specific amount of beats and/or sub-beats, and may also be assigned a pitch.
If the project survives through all of these features, perhaps I will add intuitive word suggestions via GPT or something similar.
#### Synchronized Playback
Sychronized playback is envisioned as being just like karaoke. A user provides an instrumental, writes lyrics, and hits play. If programmed, each syllable/word is highlighted at the precise moment it should be vocalized. See the previous section for details on programming your "flow".

## About
easy-bars is an application I have wanted to develop for some time now. It's based on what I've affectionatedly named the mango stack. It's not a thing, I think.
- MongoDB
- Angular
- Node
- Go (utilizing Gin in this case)
