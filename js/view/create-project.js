// data/objects.js

let template_create_project = document.getElementById("create-project");
function make_create_project(model, switcher, back, callback) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_create_project.content.cloneNode(true));
	let title_element = shadow_root.getElementById("title");
	let description_element = shadow_root.getElementById("description");
	let back_element = shadow_root.getElementById("back");
	let create_element = shadow_root.getElementById("create");
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	create_element.onclick = function(event) {
		callback(Set_.create(title_element.value, description_element.value, new DistributedLowerSet(model.repository.data.registry)));
	};
	return shadow_host;
}
