// view/front.js view/select.js view/synchronize.js

let template_project = document.getElementById("project");
function enter_project(model, switcher, set) {
	return new Promise(async function(resolve, reject) {
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
		add_element.onclick = async function(event) {
			let result = await enter_select(model, switcher);
			if(result.tag === "select") {
				let task = result.task;
				await model.project_add(set, task);
				front_element.removeChild(front_element.firstChild);
				front_element.appendChild(make_front(model, switcher, shadow_host, set));
			}
			switcher.switch(shadow_host);
		};
		synchronize_element.onclick = async function(event) {
			let result = await enter_synchronize(model, switcher, set);
			if(result.tag === "take") {
				front_element.removeChild(front_element.firstChild);
				front_element.appendChild(make_front(model, switcher, shadow_host, set));
			}
			switcher.switch(shadow_host);
		};
		back_element.onclick = async function(event) {
			resolve({ tag: "back" });
		};
		switcher.switch(shadow_host);
	});
}
