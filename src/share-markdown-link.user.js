// ==UserScript==
// @name			Stack Exchange - share anonymous markdown links
// @namespace		https://github.com/PurpleMagick/
// @description		Adds a share button that produces markdown links. The user ID is trimmed from that link.
// @author			VLAZ
// @version			1.2.1
//
// @include			/^https:\/\/(?:meta\.)?stackoverflow\.com\/questions\/\d+\/.*$/
// @include			/^https:\/\/(?:meta\.)?serverfault\.com\/questions\/\d+\/.*$/
// @include			/^https:\/\/(?:meta\.)?superuser\.com\/questions\/\d+\/.*$/
// @include			/^https:\/\/(?:meta\.)?askubuntu\.com\/questions\/\d+\/.*$/
// @include			/^https:\/\/(?:meta\.)?mathoverflow\.net\/questions\/\d+\/.*$/
// @include			/^https:\/\/(?:meta\.)?stackapps\.com\/questions\/\d+\/.*$/
// @include			/^https:\/\/(?:[^\/.]+\.)(?:meta\.)?stackexchange\.com\/questions\/\d+\/.*$/
//
// @exclude			https://chat.stackexchange.com
// @exclude			https://chat.meta.stackexchange.com
// @exclude			https://api.stackexchange.com
// @exclude			https://data.stackexchange.com
//
// @grant			none
// ==/UserScript==

const compose = (f,...fs) => x =>
	f === undefined ? x : compose(...fs)(f(x));

const escapeSquareBrackets = str =>
	str
		.replace(/\[/g, "\\[")
		.replace(/\]/g, "\\]");

const titleWordsFilter = [
	"[duplicate]",
	"[closed]"
]
	.map(escapeSquareBrackets)
	.join("|");


const retrieveTitle = () =>
	document.querySelector("#question-header a").textContent;

const retrieveLink = () =>
	document.querySelector(".js-share-link").href;


const formatTitle = title =>
	title.replace(new RegExp(titleWordsFilter), "").trim();

const formatLink = link =>
	link.slice(0, link.lastIndexOf("/"));


const retrieveFormattedTitle = compose(retrieveTitle, formatTitle, escapeSquareBrackets);
const retrieveFormattedLink = compose(retrieveLink, formatLink);


const formatMarkdown = (title, link)	=>
	`[${title}](${link})`;

const createMarkdown = () =>
	formatMarkdown(retrieveFormattedTitle(), retrieveFormattedLink());


const createLink = text => {
  const link = document.createElement("a");
  link.classList.add("js-share-link");
	link.href = "#";
	link.addEventListener("click", (event) => {
		event.preventDefault();
		prompt("copy from here", text);
	});
  link.textContent = "Share markdown";
  
  const wrapper = document.createElement("div");
  wrapper.classList.add("flex--item");
  wrapper.appendChild(link);
	
  return wrapper;
};

const addLink = el =>
	document.querySelector(".js-post-menu .s-anchors").appendChild(el);

const run = compose(createMarkdown, createLink, addLink);

run();
