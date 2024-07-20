// data/data.js

let template_synchronize = document.getElementById("synchronize");
function make_synchronize(model, switcher, set, back, callback) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_synchronize.content.cloneNode(true));
	let give_element = shadow_root.getElementById("give");
	let take_element = shadow_root.getElementById("take");
	let back_element = shadow_root.getElementById("back");
	give_element.onclick = function(event) {
		model.give(set, async function() {
			return prompt();
		}, function(line) {
			alert(line);
		});
		model.give(model.repository.data.completed, async function() {
			return prompt();
		}, function(line) {
			alert(line);
		});
		callback();
	};
	take_element.onclick = function(event) {
		model.take(set, async function() {
			return prompt();
		}, function(line) {
			alert(line);
		});
		model.take(model.repository.data.completed, async function() {
			return prompt();
		}, function(line) {
			alert(line);
		});
		callback();
	};
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	return shadow_host;
}
