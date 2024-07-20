// view/front.js view/select.js view/synchronize.js

let template_project = document.getElementById("project");
function make_project(model, switcher, set, back) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_project.content.cloneNode(true));
	let title_element = shadow_root.getElementById("title");
	let description_element = shadow_root.getElementById("description");
	let front_element = shadow_root.getElementById("front");
	let add_element = shadow_root.getElementById("add");
	let synchronize_element = shadow_root.getElementById("synchronize");
	let back_element = shadow_root.getElementById("back");
	title_element.textContent = set.title;
	description_element.textContent = set.description;
	front_element.appendChild(make_front(model, switcher, shadow_host, set));
	add_element.onclick = function(event) {
		switcher.switch(make_select(model, switcher, shadow_host, function(task) {
			model.project_add(set, task).then(function() {
				front_element.removeChild(front_element.firstChild);
				front_element.appendChild(make_front(model, switcher, shadow_host, set));
				switcher.switch(shadow_host);
			});
		}));
	};
	synchronize_element.onclick = function(event) {
		switcher.switch(make_synchronize(model, switcher, set, shadow_host, function() {
			front_element.removeChild(front_element.firstChild);
			front_element.appendChild(make_front(model, switcher, shadow_host, set));
			switcher.switch(shadow_host);
		}));
	};
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	return shadow_host;
}
