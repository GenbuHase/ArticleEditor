# Article Editor

[![Build Status](https://travis-ci.org/GenbuHase/ArticleEditor.svg)](https://travis-ci.org/GenbuHase/ArticleEditor)

An assistant for bloggers without blog services


## Languages
* [日本語 | Japanese](/README[Japanese].md)


## Description
You could publish articles without a lot of inconvenience if you used "Article Editor".


## Features
* Generate any articles with a template
* Manage a list of article ids
* Run smoothly


## Requirement
* [Node.js](https://nodejs.org/)


## How to Use
Some folders will be generated for the first time.

1.	Edit `template/index.html`(template).<Br />
	Special variables are available in the template.

	* `${title}` ... Article's title
	* `${createdAt}` ... Article's date
	* `${content}` ... Article's content
	
2.	Execute `npm start` to launch.
3.	View [http://localhost:8005](http://localhost:8005) after running.
4.	Feel free to create your articles following instructions!


## Installation
Execute these commands.

```Bash
$ git clone https://github.com/GenbuHase/ArticleEditor.git
$ cd ArticleEditor
$ npm install
```


## Config
`system/config.js` is editable.

```JavaScript
{
	PORT: An used port(Number),

	PATH: {
		ARTICLE: A directory, containing a collection of articles(String),
		PUBLISH: A directory, containing generated html of articles(String),
		MEDIA: A directory, containing medias of each articles(String),
		COMMONMEDIA: A directory, containing common medias(String),
		TEMPLATE: A directory, containing a template(String)
	},

	onCreate: A callback, called when any articles are created(Function),
	onDelete: A callback, called when any articles are deleted(Function),
	onSave: A callback, called when any articles are drafted(Function),
	onPublish: A callback, called when any pages are generated(Function),
	onUpload: A callback, called when any medias are uploaded(Function)
}
```


## Author
* Genbu Hase
  * [Github](https://github.com/GenbuHase)
  * [Mastodon(itabashi.0j0.jp)](https://itabashi.0j0.jp/@ProgrammerGenboo)
  * [Mastodon(knzk.me)](https://knzk.me/@ProgrammerGenboo)
  * [Google+](https://plus.google.com/106666684430101995501)


## License
[MIT License](/LICENSE)