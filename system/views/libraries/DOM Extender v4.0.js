/*/
 *#######################################################################
 *DOM Extender v4.0
 *Copyright (C) 2016 Genbu Project All Rights Reversed.
 *#######################################################################
/*/
(() => {
	Object.defineProperties(Object.prototype, {
		getClassName: {
			/**
			 * Returns a type of this instance
			 * 
			 * @returns {String} An instance type
			 */
			value () {
				return Object.prototype.toString.call(this).slice(8, -1);
			}
		},
		
		isStrictObject: {
			/**
			 * Detects how it is type of Object
			 * 
			 * @param {Object} obj An object detected
			 * @returns {Boolean} How it is type of Object
			 */
			value (obj) {
				if (obj !== undefined) {
					return (obj.getClassName() !== "String" && obj.getClassName() !== "Number" && obj instanceof Object && !Array.isArray(obj));
				} else {
					return (this.getClassName() !== "String" && this.getClassName() !== "Number" && this instanceof Object && !Array.isArray(this));
				}
			}
		},

		isStrictArray: {
			/**
			 * Detects how it is type of Array
			 * 
			 * @param {Object} obj An object detected
			 * @returns {Boolean} How it is type of Array
			 */
			value (obj) {
				if (obj !== undefined) {
					return (obj.getClassName() !== "String" && obj.getClassName() !== "Number" && obj instanceof Array && Array.isArray(obj));
				} else {
					return (this.getClassName() !== "String" && this.getClassName() !== "Number" && this instanceof Array && Array.isArray(this));
				}
			}
		},

		connect: {
			/**
			 * Combines with separators
			 * 
			 * @param {String} [valueSeparator="="]
			 * @param {String} [paramSeparator="&"]
			 * 
			 * @returns {String} A combined data
			 */
			value (valueSeparator = "=", paramSeparator = "$") {
				let result = [];

				for (let i = 0; i < Object.entries(this).length; i++) {
					result.push(Object.entries(this)[i].join(valueSeparator));
				}
				
				return result.join(paramSeparator);
			}
		},

		toQueryString: {
			/**
			 * Converts an object to querys
			 * 
			 * @param {Object} obj An object converted
			 * @returns {String} A converted data
			 */
			value (obj) {
				return "?" + Object.prototype.connect.call(obj || this, "=", "&");
			}
		}
	});

	Object.defineProperties(String.prototype, {
		removeOverlay: {
			/**
			 * Removes same characters
			 * 
			 * @returns {String} A formatted sentence
			 */
			value () {
				let result = this.split("");
					result = result.filter((elem, index, parent) => {
						return parent.indexOf(elem) == index;
					});

				return result.join("");
			}
		},

		replaces: {
			/**
			 * Replaces with multi datas
			 * 
			 * @param {String[][]} replaceStrs A collection of replace arguments
			 * @returns {String} A formatted sentence
			 */
			value (replaceStrs) {
				let res = this;
				
				for (let i = 0; i < replaceStrs.length; i++) {
					res = res.replace(replaceStrs[i][0], replaceStrs[i][1]);
				}
				
				return res;
			}
		},

		hasUrlString: {
			/**
			 * Detects how it has any URLs
			 * 
			 * @returns {Boolean} How it has any URLs
			 */
			value () {
				return (this.match(/((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g) ? true : false);
			}
		}
	});

	Object.defineProperties(Window.prototype, {
		importScript: {
			/**
			 * Imports scripts
			 * 
			 * @param {String} [url=""] A script's url
			 * @param {function (Event)} [onLoad=function (event) {}] A callback, called when it'll have been loaded
			 */
			value (url = "", onLoad = (event) => {}) {
				if (!(() => {
					let scripts = document.getElementsByTagName("script");
					
					for (let i = 0; i < scripts.length; i++) {
						if (scripts[i].src == url) return true;
					}
				})()) {
					let elem = document.createElement("script");
						elem.src = url;

						elem.addEventListener("load", (event) => {
							onLoad(event);
						});

					document.head.appendChild(elem);
				}
			}
		},

		btoaAsUTF8: {
			/**
			 * Executes btoa with UTF-8
			 * 
			 * @param {String} [str=""] A plain data
			 * @returns {String} A base64 data
			 */
			value (str = "") {
				return btoa(unescape(encodeURIComponent(str)));
			}
		},

		atobAsUTF8: {
			/**
			 * Executes atob with UTF-8
			 * 
			 * @param {String} [base64Str=""] A base64 data
			 * @returns {String} A plain data
			 */
			value (base64Str = "") {
				return decodeURIComponent(escape(atob(base64Str)));
			}
		},

		urlSafe: {
			/**
			 * Formats an URL to safe one
			 * 
			 * @param {String} [url=""] An URL
			 * @returns {String} A safe URL
			 */
			value (url = "") {
				return url.replace(/\+/g, '-').replace(/\//g, '_');
			}
		},



		Script: {
			value: class Script {
				/**
				 * Creates an instance of Script
				 * 
				 * @param {String} [url=undefined] A script's url
				 * @param {Object} [option={}] A collection of options
				 * @param {Boolean} [option.async=false] How async is enabled
				 * @param {Boolean} [option.defer=false] How defer is enabled
				 * 
				 * @returns {HTMLScriptElement} A script element
				 */
				constructor (url = undefined, option = { async: false, defer: false }) {
					let elem = document.createElement("script");
						!url || (elem.src = url);
						elem.async = option.async;
						elem.defer = option.defer;
						
					return elem;
				}
			}
		},

		Style: {
			value: class Style {
				/**
				 * Creates an instance of Style
				 * 
				 * @param {Object} [data={}] A collection of composing style datas
				 * @returns {HTMLStyleElement} A style element
				 */
				constructor (data = {}) {
					let elem = document.createElement("style");
						elem.textContent = (() => {
							let mem = [];

							(function looper (currentData, currentLevel) {
								for (let elemName in currentData) {
									if (currentData[elemName].isStrictObject()) {
										mem.push("\t".repeat(currentLevel) + elemName + " {");
										looper(currentData[elemName], currentLevel + 1);
										mem.push("\t".repeat(currentLevel) + "}");
										mem.push("\t".repeat(currentLevel) + "");
									} else {
										mem.push("\t".repeat(currentLevel) + elemName + ": " + currentData[elemName] + ";");
									}
								}
							})(data, 1);

							return mem.join("\r\n");
						})();

					return elem;
				}
			}
		},

		InlineStyle: {
			/**
			 * Returns a style data for embedding
			 * 
			 * @param {Object} data A collection of composing style datas
			 * @returns {String} A style data for embedding
			 */
			value (data) {
				if (this.constructor.name == arguments.callee.prototype.constructor.name) throw new TypeError("it is not a constructor");
				
				let mem = [];
				
				for (let styleName in data) {
					mem.push(styleName + ": " + data[styleName] + ";");
				}
				
				return mem.join(" ");
			}
		},

		Canvas: {
			value: class Canvas {
				/**
				 * Creates an instance of Canvas
				 * 
				 * @param {Number} [width=0] The width of canvas
				 * @param {Number} [height=0] The height of canvas
				 * 
				 * @returns {HTMLCanvasElement} A canvas element
				 */
				constructor (width = 0, height = 0) {
					let elem = document.createElement("canvas");
						elem.width = width;
						elem.height = height;

					return elem;
				}
			}
		},

		Svg: {
			value: class Svg {
				/**
				 * Creates an instance of Svg
				 * 
				 * @param {Number} [width=0] The width of svg
				 * @param {Number} [height=0] The height of svg
				 * 
				 * @returns {SVGSVGElement} A svg element
				 */
				constructor (width = 0, height = 0) {
					let elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						elem.setAttribute("version", "1.1");
						elem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
						
						elem.setAttribute("width", width);
						elem.setAttribute("height", height);
						elem.setAttribute("viewBox", `0 0 ${width} ${height}`);
						
					return elem;
				}

				static get Rect () {
					return class Rect {
						/**
						 * Creates an instance of Rect
						 * 
						 * @param {Object} [option={}] A collection of options
						 * @param {Number} [option.x=0] A point of x-axis
						 * @param {Number} [option.y=0] A point of y-axis
						 * @param {Number} [option.width=0] Width of rect
						 * @param {Number} [option.height=0] Height of rect
						 * @param {String} [option.fill="#000000"] A color for filling
						 * @param {Object} option.params Other options
						 * 
						 * @returns {SVGRectElement} A rect element
						 */
						constructor (option = { x: 0, y: 0, width: 0, height: 0, fill: "#000000" }) {
							let elem = document.createElementNSWithParam("http://www.w3.org/2000/svg", "rect", option.params);
								elem.setAttribute("x", option.x);
								elem.setAttribute("y", option.y);
								
								elem.setAttribute("width", option.width);
								elem.setAttribute("height", option.height);
								elem.setAttribute("fill", option.fill);
								
							return elem;
						}
					}
				}

				static get Circle () {
					return class Circle {
						/**
						 * Creates an instance of Circle
						 * 
						 * @param {Object} [option={}] A collection of options
						 * @param {Number} [option.x=0] A point of x-axis
						 * @param {Number} [option.y=0] A point of y-axis
						 * @param {Number} [option.radius=0] A radius of circle
						 * @param {String} [option.fill="#000000"] A color for filling
						 * @param {Object} option.params Other options
						 * 
						 * @returns {SVGCircleElement} A circle element
						 */
						constructor (option = { x: 0, y: 0, radius: 0, fill: "#000000" }) {
							let elem = document.createElementNSWithParam("http://www.w3.org/2000/svg", "circle", option.params);
								elem.setAttribute("cx", option.x);
								elem.setAttribute("cy", option.y);
								elem.setAttribute("r", option.radius);

								elem.setAttribute("fill", option.fill);
								
							return elem;
						}
					}
				}

				static get Text () {
					return class Text {
						/**
						 * Creates an instance of Text
						 * 
						 * @param {Object} [option={}] A collection of options
						 * @param {Number} [option.x=0] A point of x-axis
						 * @param {Number} [option.y=0] A point of y-axis
						 * @param {Number} [option.rotate=0] Degree of characters
						 * @param {String} [option.value=""] An text
						 * @param {Object} option.params Other options
						 * 
						 * @returns {SVGTextElement} A text element
						 */
						constructor (option = { x: 0, y: 0, rotate: 0, value: "" }) {
							let elem = document.createElementNSWithParam("http://www.w3.org/2000/svg", "text", option.params);
								elem.textContent = option.value;
								
								elem.setAttribute("x", option.x);
								elem.setAttribute("y", option.y);
								elem.setAttribute("rotate", option.rotate);
								
							return elem;
						}
					}
				}

				/**
				 * Return a color
				 * 
				 * @param {Number} [r=0] Red
				 * @param {Number} [g=0] Green
				 * @param {Number} [b=0] Blue
				 * 
				 * @returns {String} A color
				 */
				static RGB (r = 0, g = 0, b = 0) {
					return `RGB(${r}, ${g}, ${b})`;
				}

				/**
				 * Returns a color
				 * 
				 * @param {Number} [r=0] Red
				 * @param {Number} [g=0] Green
				 * @param {Number} [b=0] Blue
				 * @param {Number} [a=1] Alpha
				 * 
				 * @returns {String} A color
				 */
				static RGBA (r = 0, g = 0, b = 0, a = 1) {
					return `RGBA(${r}, ${g}, ${b}, ${a})`;
				}
			}
		}
	});

	Object.defineProperties(Node.prototype, {
		appendTo: {
			/**
			 * Appends to selected element
			 * 
			 * @param {Node} [parent=document.body] The element
			 */
			value (parent = document.body) {
				parent.appendChild(this);
			}
		}
	});

	Object.defineProperties(Element.prototype, {
		applyProperties: {
			/**
			 * Dispatches options to element
			 * 
			 * @param {Object} [option={}] A collection of options
			 * @param {String} option.id The element's id
			 * @param {Object} option.classes A collection of the element's classes
			 * @param {String} option.text The element's text
			 * @param {String} option.html The element's html-text
			 * @param {Object} option.attributes A collection of the element's attributes
			 * @param {Object} option.dataset A collection of the element's datasets
			 * @param {Object} option.styles A collection of the element's styles
			 * @param {Node[]} option.children A collection of the element's children
			 * @param {Object} option.events A collection of events connected with the element
			 */
			value (option = {}) {
				(option.id != false && !option.id) || (this.id = option.id);
				
				!option.classes || (() => {
					for (let i = 0; i < option.classes.length; i++) {
						this.classList.add(option.classes[i]);
					}
				})();

				(option.text != false && !option.text) || (this.textContent = option.text);
				(option.html != false && !option.html) || (this.innerHTML = option.html);

				!option.attributes || (() => {
					for (let paramName in option.attributes) {
						this.setAttribute(paramName, option.attributes[paramName]);
					}
				})();

				!option.dataset || (() => {
					for (let dataName in option.dataset) {
						this.dataset[dataName] = option.dataset[dataName];
					}
				})();
				
				!option.styles || this.setAttribute("Style", InlineStyle(option.styles));

				!option.children || (() => {
					for (let i = 0; i < option.children.length; i++) {
						this.appendChild(option.children[i]);
					}
				})();
				
				!option.events || (() => {
					for (let eventName in option.events) {
						this.addEventListener(eventName, option.events[eventName]);
					}
				})();
			}
		}
	});

	Object.defineProperties(Document.prototype, {
		createElementWithParam: {
			/**
			 * Creates an element
			 * 
			 * @param {String} tagName An element's name
			 * @param {Object} [option={}] A collection of element options
			 * 
			 * @returns {HTMLElement} An element
			 */
			value (tagName, option = {}) {
				let elem = document.createElement(tagName);
					elem.applyProperties(option);
				
				return elem;
			}
		},

		createElementNSWithParam: {
			/**
			 * Creates an element with a namespace
			 * 
			 * @param {String} nameSpace An element's namespace
			 * @param {String} tagName An element's name
			 * @param {Object} [option={}] A collection of element options
			 * 
			 * @returns {HTMLElement} An element
			 */
			value (nameSpace, tagName, option = {}) {
				let elem = document.createElementNS(nameSpace, tagName);
					elem.applyProperties(option);
				
				return elem;
			}
		}
	});

	Object.defineProperties(Image.prototype, {
		getImageData: {
			/**
			 * Returns an ImageData of this image
			 * 
			 * @returns {ImageData} An ImageData of this image
			 */
			value () {
				this.crossOrigin = this.crossOrigin || "anonymous";

				let cvs = document.createElement("canvas");
					cvs.width = this.naturalWidth;
					cvs.height = this.naturalHeight;
					
				let ctx = cvs.getContext("2d");
					ctx.drawImage(this, 0, 0);
					
				return ctx.getImageData(0, 0, this.naturalWidth, this.naturalHeight);
			}
		},

		toSvg: {
			/**
			 * Converts to Svg data
			 * 
			 * @returns {SVGSVGElement} Svg data
			 */
			value () {
				this.crossOrigin = this.crossOrigin || "anonymous";
				
				let pixels = this.getImageData(),
					elem = new Svg(pixels.width, pixels.height);
					
				for (let y = 0; y < pixels.height; y++) {
					for (let x = 0; x < pixels.width; x++) {
						elem.appendChild(
							new Svg.Rect({
								width: 1,
								height: 1,
								
								x: x,
								x: y,
								fill: Svg.RGBA(pixels.data[(x + y * pixels.width) * 4], pixels.data[(x + y * pixels.width) * 4 + 1], pixels.data[(x + y * pixels.width) * 4 + 2], pixels.data[(x + y * pixels.width) * 4 + 3])
							})
						);
					}
				}
				
				return elem;
			}
		}
	});

	Object.defineProperties(Location.prototype, {
		querySort: {
			/**
			 * Returns current querys
			 * 
			 * @returns {Object} A formatted collection of querys
			 */
			value () {
				let querys = {};
				
				for (var i = 0; i < this.search.substr(1).split("&").length; i++) {
					querys[this.search.substr(1).split("&")[i].split("=")[0].toUpperCase()] = this.search.substr(1).split("&")[i].split("=")[1];
				}
				
				return querys;
			}
		},

		getIPs: {
			/**
			 * Gets IPs
			 * 
			 * @param {function (Object)} [onLoad=function (res) {}] A callback, called when it'll have finished
			 */
			value (onLoad = (res) => {}) {
				let iframe = document.createElement("iframe");
					iframe.style.display = "None";
					
				document.body.appendChild(iframe);
				
				let ip_dups = {};
				
				let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
				let useWebKit = !!window.webkitRTCPeerConnection;
				
				if (!RTCPeerConnection) {
					let win = iframe.contentWindow;
					
					RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
					useWebKit = !!win.webkitRTCPeerConnection;
				}
				
				let pc = new RTCPeerConnection({
					iceServers: [{
						urls: "stun:stun.services.mozilla.com"
					}],
					
					optional: [{
						RtpDataChannels: true
					}]
				});
				
				function handleCandidate(candidate) {
					let ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
					let ip_addr = ip_regex.exec(candidate)[1];
					
					if (ip_dups[ip_addr] === undefined) {
						onLoad({
							type: ip_addr.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/) ? "v4" : ip_addr.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/) ? "v6" : "private",
							value: ip_addr
						});
					}
					
					ip_dups[ip_addr] = true;
				}
				
				pc.onicecandidate = (ice) => {
					if (ice.candidate) handleCandidate(ice.candidate.candidate);
				}
				
				pc.createDataChannel("");
				
				pc.createOffer((result) => {
					pc.setLocalDescription(result, () => {}, () => {});
				}, () => {
					
				});
				
				setTimeout(() => {
					let lines = pc.localDescription.sdp.split('\n');
						lines.forEach((line) => {
							if (line.indexOf('a=candidate:') === 0) handleCandidate(line);
						});
						
					iframe.parentElement.removeChild(iframe);
				}, 1000);
			}
		}
	});

	Object.defineProperties(Navigator.prototype, {
		isMobile: {
			/**
			 * Detects how the user is visiting with mobile
			 * 
			 * @returns {Boolean} How the user is visiting with mobile
			 */
			value () {
				let checker = new MobileDetect(window.navigator.userAgent);

				return (checker.mobile() || checker.phone() || checker.tablet()) ? true : false;
			}
		}
	});

	

	Object.defineProperties(Math.random, {
		randomInt: {
			/**
			 * Returns any integer
			 * 
			 * @returns {Number} Any integer
			 */
			value () {
				let result = 0;

				if (arguments.length >= 2) {
					result = Math.round(Math.random() * (arguments[1] - arguments[0]) + arguments[0]);
				} else {
					result = Math.round(Math.random() * arguments[0]);
				}

				return result;
			}
		}
	});

	Object.defineProperties(URL, {
		filter: {
			/**
			 * Returns a collection of URLs in a sentence
			 * 
			 * @param {String} [str=""] A sentence
			 * @returns {String[] | []} A collection of URLs
			 */
			value (str = "") {
				let res = str.match(/((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g);
					!res || (res = res.filter((elem, index, parent) => {
						return parent.indexOf(elem) == index;
					}));

				return res || [];
			}
		}
	});
})();




class DOM {
	/**
	 * セレクタ($1)に応じてDOM要素を返す
	 * 
	 * ($1) セレクタ
	 * => {:elemName} … elemName要素を生成
	 * => #{:elemName} … IDがelemNameの要素を返す
	 * => .{:elemName} … elemNameクラスの要素を返す
	 * => *{:elemName} … NameがelemNameの要素を返す
	 * => :{:elemName} … elemName要素を返す
	 * => ${:elemName} … elemNameセレクタの1要素を返す
	 * => @{:elemName} … elemNameセレクタの要素を返す
	 * 
	 * @param {String} [selectorStr=""] A selector
	 * @param {Object} [option={}] An element's option(See document.createElementWithParam)
	 * @param {String} option.id
	 * @param {Object} option.classes
	 * @param {String} option.text
	 * @param {String} option.html
	 * @param {Object} option.attributes
	 * @param {Object} option.dataset
	 * @param {Object} option.styles
	 * @param {Node[]} option.children
	 * @param {Object} option.events
	 * 
	 * @returns {HTMLElement} An element
	 */
	constructor (selectorStr = "", option = {}) {
		let elem = null;

		switch (selectorStr.substr(0, 1)) {
			default:
				try {
					elem = document.createElementWithParam(selectorStr, option);
				} catch (err) {
					throw new SyntaxError("The selector includes invalid characters.");
				}

				break;

			case "#":
				elem = document.getElementById(selectorStr.slice(1));
				break;

			case ".":
				elem = document.getElementsByClassName(selectorStr.slice(1));
				break;

			case "*":
				elem = document.getElementsByName(selectorStr.slice(1));
				break;

			case ":":
				elem = document.getElementsByTagName(selectorStr.slice(1));
				break;

			case "$":
				elem = document.querySelector(selectorStr.slice(1));
				break;

			case "@":
				elem = document.querySelectorAll(selectorStr.slice(1));
				break;
		}

		if (!elem) {
			throw new EvalError("No elements matched.");
		}

		return elem;
	}



	/**
	 * Connects to the URL
	 * 
	 * @param {Object} [option={}] A collection of connecting options
	 * @param {String} [option.type="GET"] A connecting method
	 * @param {String} [option.url=location.href] Where the connector will connect
	 * @param {Boolean} [option.doesSync=false] How the connector will connect asynchronously
	 * @param {String} option.resType A response type
	 * @param {Object} option.headers the connector's headers
	 * @param {Object} option.params A collection of query strings
	 * @param {Object} option.data A data for sending
	 * @param {function (ProgressEvent)} [option.onLoad=function (event) {}] A callback, called when the connector will have connected
	 * 
	 * @returns {Promise} The connector
	 */
	static xhr (option = { type: "GET", url: location.href, doesSync: false, onLoad: (event) => {} }) {
		let connector = new XMLHttpRequest();
			!option.resType || (connector.responseType = option.resType);
			
			connector.open(option.type, option.url + (option.params ? "?" + (() => {
				let param = [];

				for (let paramName in option.params) {
					param.push(paramName + "=" + option.params[paramName]);
				}

				return param.join("&");
			})() : ""), option.doesSync);

			!option.headers || (() => {
				for (let headerName in option.headers) {
					connector.setRequestHeader(headerName, option.headers[headerName]);
				}
			})();

			connector.addEventListener("load", option.onLoad);
			connector.send(option.data);

		return connector;
	}

	/**
	 * Does a Jsonp request
	 * 
	 * @param {Object} [option={}] A collection of requesting options
	 * @param {String} [option.url=location.href] Where it will connect
	 * @param {Object} option.params A collection of query strings
	 */
	static jsonp (option = { url: location.href }) {
		let param = [];

		!option.params || (() => {
			for (let paramName in option.params) {
				param.push(paramName + "=" + option.params[paramName]);
			}
		})();

		let elem = document.createElement("script");
			elem.src = option.url + (option.params ? "?" + param.join("&") : "");
			
			elem.onload = (event) => {
				elem.parentElement.removeChild(elem);
			}
			
		document.head.appendChild(elem);
	}


	/**
	 * Utilizes
	 */
	static get Util () {
		const Util = {
			/**
			 * Converts a degree to radian
			 * 
			 * @param {Number} degree A degree
			 * @returns {Number} A radian
			 */
			degToRad (degree) {
				return degree * Math.PI / 180;
			},

			/**
			 * Converts a radian to degree
			 * 
			 * @param {Number} radian A radian
			 * @returns {Number} A degree
			 */
			radToDeg (radian) {
				return radian * 180 / Math.PI;
			},

			/**
			 * Initializes with a value
			 * 
			 * @param {any} obj A parameter
			 * @param {any} initValue A value for init
			 * 
			 * @returns {any} An initialized object
			 */
			paramInit (obj, initValue) {
				return (obj != false && !obj) ? initValue : obj;
			},

			/**
			 * Gets a centered client rect
			 * 
			 * @param {Number} [width=0] Width of an area
			 * @param {Number} [height=0] Height of an area
			 * @param {Number} [basisWidth=window.outerWidth] A point of base width
			 * @param {Number} [basisHeight=window.outerHeight] A point of base height
			 * 
			 * @returns {ClientRect} An area
			 */
			getCenteredBoundingClientRect (width = 0, height = 0, basisWidth = window.outerWidth, basisHeight = window.outerHeight) {
				return Object.create(ClientRect.prototype, {
					width: { value: width },
					height: { value: height },

					left: { value: (basisWidth - width) / 2},
					right: { value: (basisWidth + width) / 2},
					top: { value: (basisHeight - height) / 2},
					bottom: { value: (basisHeight + height) / 2}
				});
			}
		};	Util[Symbol.toStringTag] = "DOM Utility";

		return Util;
	}

	/**
	 * Watcher Class
	 */
	static get Watcher () {
		let watchers = [];

		return class Watcher {
			/**
			 * Creates an instance of Watcher
			 * 
			 * @param {Object} [option={}] An collection of watching options
			 * @param {{ value: Object }} [option.target={ value: null }] A watched target
			 * @param {Number} [option.tick=1] A time between one to one
			 * @param {function ()} [option.onGet=function () {}] A callback, will be called when it'll get
			 * @param {function (Watcher)} [option.onChange=function (watcher) {}] A callback, will be called when the target will have changed
			 */
			constructor (option = { target: { value: null }, tick: 1, onGet: () => {}, onChange: (watcher) => {} }) {
				this.watcherID = [];
				
				this.setTarget(option.target);
				this.setWatchTick(option.tick);
				this.onGet = option.onGet;
				this.onChange = option.onChange;
			}

			/**
			 * Sets a time between one to one
			 * 
			 * @param {Number} tick A time between one to one
			 */
			setWatchTick (tick) {
				this.watchTick = tick;
			}

			/**
			 * Sets a target to watch
			 * 
			 * @param {{ value: Object }} target A target to watch
			 */
			setTarget (target) {
				this.target = target;
			}



			/**
			 * Adds a watcher to tasks
			 * 
			 * @param {Watcher} watcher A watcher
			 * @returns {Watcher} A provided watcher
			 */
			static addWatcher (watcher) {
				watcher.watcherID[0] = setInterval(() => {
					watcher.newValue = watcher.target.value;
					
					if (watcher.oldValue !== watcher.newValue) {
						watcher.onChange(watcher);
						watcher.oldValue = watcher.newValue;
					}
				}, watcher.watchTick);
				
				watcher.oldValue = watcher.target.value,
				watcher.newValue = watcher.target.value;
				
				watchers.push(watcher);
				watchers[watchers.length - 1].watcherID[1] = watchers.length - 1;
				
				watcher.watcherID[810] = setInterval(watcher.onGet || (() => {}), watcher.watchTick);
				
				return watcher;
			}

			/**
			 * Removes a watcher from tasks
			 * 
			 * @param {Watcher} watcher A watcher
			 */
			static removeWatcher (watcher) {
				clearInterval(watcher.watcherID[0]);
				clearInterval(watcher.watcherID[810]);
				
				watchers.slice(watcher.watcherID[1], 1);
			}
		}
	}

	/**
	 * Randomizer Class
	 */
	static get Randomizer () {
		return class Randomizer {
			/**
			 * A collection of generating types
			 */
			static get TYPE () {
				const TYPE = {
					LEVEL1: Symbol.for("LEVEL1"),	//Only Numbers
					LEVEL2: Symbol.for("LEVEL2"),	//Only Alphabets
					LEVEL3: Symbol.for("LEVEL3"),	//Numbers & Alphabets
					LEVEL4: Symbol.for("LEVEL4"),	//Numbers & Alphabets & Some Symbols

					LEVEL101: Symbol.for("LEVEL101"),	//ひらがな
					LEVEL102: Symbol.for("LEVEL102"),	//真夏(まなつ)の夜(よる)の淫夢(いんむ)
					LEVEL103: Symbol.for("LEVEL103"),	//唐澤弁護士(からさわべんごし) & 尊師(そんし)
					LEVEL104: Symbol.for("LEVEL104"),	//かすてら。じゅーしー & ちんかすてら & 珠照(すてら) & 未定義(みていぎ)さん
					LEVEL105: Symbol.for("LEVEL105"),	//イサト & 望月(もちづき) & モッチー & もっちー & もちもちゃん
					LEVEL106: Symbol.for("LEVEL106"),	//魂魄妖夢(こんぱくようむ) & 魂魄妖夢Channel & ValkyrieChannel & Durandal.Project & VC.Project & DCProject & Object & 黐麟(ちりん) & 氏名(しめい)
					LEVEL107: Symbol.for("LEVEL107"),	//勿論偽名(もちろんぎめい) & 偽名ちゃん(ぎめいちゃん)
					LEVEL108: Symbol.for("LEVEL108"),	//てぃお
					LEVEL109: Symbol.for("LEVEL109"),	//Mr.Taka & Takaチャンネル & タカチャンネル
					LEVEL110: Symbol.for("LEVEL110")	//ナイキ & Nike(ないき) & にけ & にけにけ(にけみん)
				};	TYPE[Symbol.toStringTag] = "RandomizeType";

				return TYPE;
			}

			/**
			 * A collection of generating characters
			 */
			static get CHARMAP () {
				const CHARMAP = {
					LEVEL1: "1234567890".split(""),
					LEVEL2: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
					LEVEL3: "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
					LEVEL4: "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".split(""),

					LEVEL101: "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split(""),
					LEVEL102: ["真夏の夜の淫夢", "まなつのよるのいんむ"].join("").removeOverlay().split(""),
					LEVEL103: ["唐澤弁護士", "からさわべんごし", "尊師", "そんし"].join("").removeOverlay().split(""),
					LEVEL104: ["かすてら。じゅーしー", "ちんかすてら", "珠照", "すてら", "未定義さん", "みていぎさん"].join("").removeOverlay().split(""),
					LEVEL105: ["イサト", "望月", "もちづき", "モッチー", "もっちー", "もちもちゃん"].join("").removeOverlay().split(""),
					LEVEL106: ["魂魄妖夢", "こんぱくようむ", "魂魄妖夢Channel", "ValkyrieChannel", "Durandal.Project", "VC.Project", "DCProject", "Object", "黐麟", "ちりん", "氏名", "しめい"].join("").removeOverlay().split(""),
					LEVEL107: ["勿論偽名", "もちろんぎめい", "偽名ちゃん", "ぎめいちゃん"].join("").removeOverlay().split(""),
					LEVEL108: ["てぃお"].join("").removeOverlay().split(""),
					LEVEL109: ["Mr.Taka", "Takaチャンネル", "タカチャンネル"].join("").removeOverlay().split(""),
					LEVEL110: ["ナイキ", "Nike", "ないき", "にけ", "にけにけ", "にけみん"].join("").removeOverlay().split("")
				};	CHARMAP[Symbol.toStringTag] = "RandomizeMap";

				return CHARMAP;
			}
			
			/**
			 * RandomizeType Class
			 */
			static get RamdomizeType () {
				return class RandomizeType {
					/**
					 * Creates an instance of RandomizeType
					 * 
					 * @param {String} [name="Untitled Type"] A name of the randomize type
					 * @param {String} [usedChars=""] A collection of characters to use
					 */
					constructor (name = "Untitled Type", usedChars = "") {
						this.name = name,
						this.charMap = usedChars.removeOverlay().split("");

						this.type = Symbol.for(this.name);
					}
				}
			}



			/**
			 * Creates an instance of Randomizer
			 * 
			 * @param {Symbol} [usedType=DOM.Randomizer.TYPE.LEVEL3] A randomize type
			 */
			constructor (usedType = DOM.Randomizer.TYPE.LEVEL3) {
				this.TYPE = Randomizer.TYPE,
				this.CHARMAP = Randomizer.CHARMAP;
				
				this.setType(usedType);
			}
			
			/**
			 * Sets a randomize type
			 * 
			 * @param {Symbol} usedType A randomize type
			 */
			setType (usedType) {
				!usedType || (this.currentType = this.TYPE[Symbol.keyFor(usedType)]);
			}

			/**
			 * Adds a randomize type to the randomizer
			 * 
			 * @param {Randomizer.RandomizeType} randomizeType A randomize type to add
			 */
			addRandomizeType (randomizeType) {
				if (randomizeType) {
					this.TYPE[randomizeType.name] = randomizeType.type,
					this.CHARMAP[randomizeType.name] = randomizeType.charMap;

					this.currentType = randomizeType.type;
				}
			}

			/**
			 * Removes a randomize type from the randomizer
			 * 
			 * @param {Randomizer.RandomizeType} randomizeType A randomize type to be remove
			 */
			removeRandomizeType (randomizeType) {
				if (randomizeType) {
					this.TYPE[randomizeType.name] = undefined,
					this.CHARMAP[randomizeType.name] = undefined;
					
					this.currentType = null;
				}
			}

			/**
			 * Resets current randomize types
			 */
			resetRandomizeType () {
				this.TYPE = DOM.Randomize.TYPE,
				this.CHARMAP = DOM.Randomize.CHARMAP;

				this.currentType = null;
			}
			
			/**
			 * Generates a randomized string
			 * 
			 * @param {Number} [strLength=8] A length of a randomized string
			 * @returns {String} A randomized string
			 */
			generate (strLength = 8) {
				let result = "";

				for (let i = 0; i < strLength; i++) {
					try {
						result += this.CHARMAP[Symbol.keyFor(this.currentType)][Math.random.randomInt(this.CHARMAP[Symbol.keyFor(this.currentType)].length - 1)];
					} catch (err) {
						throw new TypeError("Do not {:generate} before using {:setType}");
					}
				}

				return result;
			}
		}
	}

	/**
	 * AudioPlayer Class
	 */
	static get AudioPlayer () {
		return class AudioPlayer extends AudioContext {
			/**
			 * Creates an instance of AudioPlayer
			 * 
			 * @param {String} [url=""] A media's URL
			 */
			constructor (url = "") {
				super();

				this.src = url;
			}

			get src () { return this._src }

			set src (val = "") {
				this._src = val;

				if (this._src) {
					DOM.xhr({
						type: "GET",
						url: this._src,
						doesSync: true,
						resType: "arraybuffer",

						onLoad: (event) => {
							this.decodeAudioData(event.target.response, (audioBuffer) => {
								this.buffer = audioBuffer;
							});
						}
					});
				}
			}

			/**
			 * Starts to play a media
			 */
			play () {
				let source = this.createBufferSource();
					source.buffer = this.buffer;
					source.connect(this.destination);

					source.start(0);
			}
		}
	}

	/**
	 * ComponentLoader Class
	 */
	static get ComponentLoader () {
		return class ComponentLoader {
			/**
			 * Creates an instance of ComponentLoader
			 * 
			 * @param {String} [documentUrl=location.href] A template's URL
			 */
			constructor (documentUrl = location.href) {
				let doc = this.doc = new DOM("HTML");
					doc.innerHTML = DOM.xhr({
						type: "GET",
						url: documentUrl,
						doesSync: false
					}).response;
			}

			/**
			 * Gets a component from a provided selector
			 * 
			 * @param {String} [componentSelector=""] A selector
			 * @returns {HTMLElement} A component
			 */
			load (componentSelector = "") {
				let component = this.doc.querySelector(componentSelector);

				if (!component) {
					throw new Error("The selector is invalid or the component isn't exist");
				}

				return component;
			}
		}
	}


	
	static get width () { return window.innerWidth }
	static get height () { return window.innerHeight }
	static get vw () { return window.innerWidth / 100 }
	static get vh () { return window.innerHeight / 100 }
	static get vmin () { return Math.min(window.innerWidth, window.innerHeight) / 100 }
	static get vmax () { return Math.max(window.innerWidth, window.innerHeight) / 100 }
}