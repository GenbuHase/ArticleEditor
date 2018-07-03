# Article Editor

[![Build Status](https://travis-ci.org/GenbuHase/ArticleEditor.svg)](https://travis-ci.org/GenbuHase/ArticleEditor)

ブログ形式サイトのための記事編集ツール


## 言語 | Languages
* [English | 英語](/README.md)


## 概要 | Description
このツールを使うと、簡単にブログ形式サイトの記事を執筆することが出来ます。


## 主な機能 | Features
* テンプレートHTMLを利用した記事生成
* 記事のID管理
* 軽快な動作


## 動作環境・開発環境 | Requirement
* [Node.js](https://nodejs.org/)


## 使用方法 | How to Use
初回実行時、必要なディレクトリが自動で生成されます。

1.	`template/index.html`(以下テンプレートHTML)を編集します。<Br />
	テンプレートHTML内では、以下の特殊変数が利用できます。

	* `${title}` ... 記事タイトル
	* `${createdAt}` ... 記事作成日
	* `${content}` ... 記事内容
	
2.	Article Editorを起動するために`npm start`を実行します。
3.	起動後、[http://localhost:8005](http://localhost:8005)にアクセスします。
4.	ページの指示に従って執筆しましょう！


## インストール方法 | Installation
以下のコマンドを実行してください。

```Bash
$ git clone https://github.com/GenbuHase/ArticleEditor.git
$ cd ArticleEditor
$ npm install
```


## 設定 | Config
`system/config.js`はコンフィグファイルとなっております。

```JavaScript
{
	PORT: 起動ポート(Number),

	PATH: {
		ARTICLE: 記事データ格納ディレクトリ(String),
		PUBLISH: 生成記事格納ディレクトリ(String),
		MEDIA: 記事別メディア格納ディレクトリ(String),
		COMMONMEDIA: ブログ内メディア格納ディレクトリ(String),
		TEMPLATE: テンプレートHTML格納ディレクトリ(String)
	},

	onCreate: 新規作成時に呼ばれるコールバック関数(Function),
	onDelete: 記事削除時に呼ばれるコールバック関数(Function),
	onSave: 記事保存時に呼ばれるコールバック関数(Function),
	onPublish: 記事生成時に呼ばれるコールバック関数(Function),
	onUpload: メディアアップロード時に呼ばれるコールバック関数(Function)
}
```


## 作者 | Author
* Genbu Hase
  * [Github](https://github.com/GenbuHase)
  * [Mastodon(itabashi.0j0.jp)](https://itabashi.0j0.jp/@ProgrammerGenboo)
  * [Mastodon(knzk.me)](https://knzk.me/@ProgrammerGenboo)
  * [Google+](https://plus.google.com/106666684430101995501)


## ライセンス | License
[MIT License](/LICENSE)