GitHub issues search and export
===============================

A simple "client-only" app for searching and exporting issues. Settings are stored in the local browser storage.
- run `npm install` to fetch dependencies
- run `npm run watch` to compile via watch task from `./src` to `./dist`
- run `npm run build` for production build
- open `./dist/index.html` to test application. No server/ backend needed

Each push to `master` triggers the `./github/main.workflow` to compile the app and push to the `gh-pages` branch. Try the app [here](https://thojansen.github.io/issue-export-v2).