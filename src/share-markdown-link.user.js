// ==UserScript==
// @name			Share anonymous markdown links
// @namespace		https://github.com/PurpleMagick/
// @descriptionAdds a share button that produces markdown links. The user ID is trimmed from that link.
// @author			PurpleMagick
// @version			1.0.1
// @include			https://stackoverflow.com/questions/*
// @grant			none
// ==/UserScript==

const compose = (f,...fs) => x =>
	f === undefined ? x : compose(...fs)(f(x));

const escapeRegex = str =>
	str
		.replace("[", "\\[")
		.replace("]", "\\]");

const titleWordsFilter = [
	"[duplicate]",
	"[closed]"
]
	.map(escapeRegex)
	.join("|");


const retrieveTitle = () =>
	document.querySelector("#question-header a").textContent;

const retrieveLink = () =>
	document.querySelector(".js-share-link").href;


const formatTitle = title =>
	title.replace(new RegExp(titleWordsFilter), "").trim();

const formatLink = link =>
	link.slice(0, link.lastIndexOf("/"));


const retrieveFormattedTitle = compose(retrieveTitle, formatTitle);
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
	link.textContent = "share markdown";

	return link;
};

const addLink = el =>
	document.querySelector(".post-menu").appendChild(el);


const run = compose(createMarkdown, createLink, addLink);

run();