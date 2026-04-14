# nightTabula -- a keyboard-first fork of nightTab

zombiefox's [nightTab](https://zombiefox.github.io/nightTab) is excellent.  I wanted something like that, but also where it let me keep my hands on the keyboard.  So, here we are.

Write more here if this ever becomes more than "just me."

# Development (original nightTab with tweaks)

When developing use:
- `npm start`

A development server will automatically open the project in your browser. Normally here: `http://localhost:8080`.


To build the project use:
- `npm run build` — production build. Output: `/dist/web/` and `/dist/extension/nightTabula_<version>.zip` with addon ID `nightTabula@sarahscheffler`.

To build a test version of the project use:
- `npm run build:test` — same build but with addon ID `nightTabula-test@sarahscheffler` and display name `nightTabula-test`. Output zip is named `nightTabula-test_<version>.zip`. This lets the test build be installed in Firefox alongside the signed release without replacing it. Source files are not modified; the name and ID are patched in-memory during the build.


# Support (original nightTab)

- [Project goals](https://github.com/zombieFox/nightTab/wiki/Project-goals)
- [Applying bookmark settings to all](https://github.com/zombieFox/nightTab/wiki/Applying-bookmark-settings-to-all)
- [Browser support](https://github.com/zombieFox/nightTab/wiki/Browser-support)
- [Cookies and cache](https://github.com/zombieFox/nightTab/wiki/Cookies-and-cache)
- [Data backup and restore](https://github.com/zombieFox/nightTab/wiki/Data-backup-and-restore)
- [Local background image](https://github.com/zombieFox/nightTab/wiki/Local-background-image)
- [Protected URLs](https://github.com/zombieFox/nightTab/wiki/Protected-URLs)
- [Recovering settings and bookmarks](https://github.com/zombieFox/nightTab/wiki/Recovering-settings-and-bookmarks)
- [Resetting when opening the browser](https://github.com/zombieFox/nightTab/wiki/Resetting-when-opening-the-browser)
- [Respecting your privacy](https://github.com/zombieFox/nightTab/wiki/Respecting-your-privacy)
- [Setting a background video or image](https://github.com/zombieFox/nightTab/wiki/Setting-a-background-video-or-image)
- [Setting nightTab as your Firefox homepage](https://github.com/zombieFox/nightTab/wiki/Setting-nightTab-as-your-Firefox-homepage)
