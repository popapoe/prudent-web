// data/data.js

let template_synchronize = document.getElementById("synchronize");
function enter_synchronize(model, switcher, set) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_synchronize.content.cloneNode(true));
		let give_element = shadow_root.getElementById("give");
		let take_element = shadow_root.getElementById("take");
		let back_element = shadow_root.getElementById("back");
		give_element.onclick = async function(event) {
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
			resolve({ tag: "give" });
		};
		take_element.onclick = async function(event) {
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
			resolve({ tag: "take" });
		};
		back_element.onclick = async function(event) {
			resolve({ tag: "back" });
		};
		switcher.switch(shadow_host);
	});
}
