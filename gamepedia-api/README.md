### Unofficial Gamepedia API

# DOCUMENTATION
1. How to install
2. Classes
3. Functions

# 1. How to install
In the command-line use: npm install gamepedia-api --save

# 2. Classes
- Wiki
  - constructor(url_, imageURL_, summary_, edits_, contributors_, articles_)
	- [STRING] url_ is the url of the wiki page
	- [STRING] imageURL_ is the thumbnail url of the wiki page
	- [STRING] summary_ is the summary of the wiki page
	- [NUMBER] edits_ is the edits of the wiki page
	- [NUMBER] contributors_ is the contributors of the wiki page
	- [NUMBER] articles_ is the articles of the wiki page

# 3. Functions
- search(search_term, page, timeout [optional])
  - Description: Returns a Promise which resolves in an array of wikis matching the search term from the specified page.
  - Parameters:
	- [STRING] search_term
	- [NUMBER] page the page number which is searched, e.g: 1
	- [NUMBER] [OPTIONAL] timeout in seconds, defaults to 10
  - example:
	```javascript
	let search = require('gamepedia-api').search;
	search("Cuphead", 1).then(result => { console.log(result) }).catch(err => { console.log("ERROR: "+err) });
	```
	OR
	```javascript
	let search = require('gamepedia-api').search;
	search("Cuphead", 1, 15).then(result => { console.log(result) }).catch(err => { console.log("ERROR: "+err) });
	```

- searchPages(search_term, pageStart, pageEnd, timeout [optional])
  - Description: Returns a Promise which resolves in an array of wikis matching the search term from the specified page-range.
  - Parameters:
	- [STRING] search_term
	- [NUMBER] pageStart the page to start at
	- [NUMBER] pageEnd the page to end at (inclusive)
	- [NUMBER] [OPTIONAL] timeout -in seconds, defaults to 10
  - example:
	```javascript
	let searchPages = require('gamepedia-api').searchPages;
	searchPages("RPG", 1, 10).then(result => { console.log(result) }).catch(err => { console.log("ERROR: "+err) });
	```
	OR
	```javascript
	let searchPages = require('gamepedia-api').searchPages;
	searchPages("RPG", 1, 10, 20).then(result => { console.log(result) }).catch(err => { console.log("ERROR: "+err) });
	```