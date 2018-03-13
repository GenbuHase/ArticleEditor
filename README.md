# Article Editor

[![Build Status](https://travis-ci.org/GenbuHase/ArticleEditor.svg?branch=AE-1.1.0)](https://travis-ci.org/GenbuHase/ArticleEditor)

A tool for bloggers without any blog services

## Other Languages
* [日本語 | Japanese](/README[Japanese].md)

## Description
You could create any articles easily if you used "Article Editor".

## Features
* Generates any articles with a template
* Manages a list of article ids
* Runs Smoothly

## Requirement
* [Node.js](https://nodejs.org/)
* [express](https://npmjs.com/package/express)
* [method-override](https://npmjs.com/package/method-override)
* [multer](https://npmjs.com/package/multer)

## How to Use
Some folders will be generated for the first time.

1.	Edit `template/index.html`(template).<Br />
	You can provide special variables in a template.

	* `${title}` ... Article's title
	* `${createdAt}` ... Article's date
	* `${content}` ... Article's content
	
2.	Execute `npm start` to run this tool.
3.	View [http://localhost:8005](http://localhost:8005) after running.
4.	Create your articles following instructions!

## Installation
Execute these commands.

```
$ git clone https://github.com/GenbuHase/ArticleEditor.git
$ cd ArticleEditor
$ npm install
```

## Author
[Genbu Hase](https://github.com/GenbuHase)

## License
[MIT License](https://github.com/GenbuHase/ArticleEditor/blob/master/LICENSE)