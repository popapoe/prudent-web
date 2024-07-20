// view/inspect-project.js

let template_inspect_task = document.getElementById("inspect-task");
function make_inspect_task(model, switcher, task, back, task_actions, project_actions) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_inspect_task.content.cloneNode(true));
	let title_element = shadow_root.getElementById("title");
	let description_element = shadow_root.getElementById("description");
	let dependencies_element = shadow_root.getElementById("dependencies");
	let dependents_element = shadow_root.getElementById("dependents");
	let projects_element = shadow_root.getElementById("projects");
	let key_element = shadow_root.getElementById("key");
	let actions_element = shadow_root.getElementById("actions");
	let back_element = shadow_root.getElementById("back");
	title_element.textContent = task.title;
	description_element.textContent = task.description;
	key_element.textContent = task.key;
	for(let dependency of model.repository.data.registry.get_relation().get_preimage(task)) {
		let task_element = document.createElement("li");
		dependencies_element.appendChild(task_element);
		let task_link_element = document.createElement("a");
		task_element.appendChild(task_link_element);
		task_link_element.textContent = dependency.title;
		task_link_element.href = "javascript:void(0);";
		task_link_element.title = "Inspect this task.";
		task_link_element.onclick = function(event) {
			switcher.switch(make_inspect_task(model, switcher, dependency, shadow_host, task_actions, project_actions));
		};
	}
	for(let dependent of model.repository.data.registry.get_relation().get_image(task)) {
		let task_element = document.createElement("li");
		dependents_element.appendChild(task_element);
		let task_link_element = document.createElement("a");
		task_element.appendChild(task_link_element);
		task_link_element.textContent = dependent.title;
		task_link_element.href = "javascript:void(0);";
		task_link_element.title = "Inspect this task.";
		task_link_element.onclick = function(event) {
			switcher.switch(make_inspect_task(model, switcher, dependent, shadow_host, task_actions, project_actions));
		};
	}
	for(let set of model.repository.data.sets.values()) {
		if(set.key !== "completed" && !set.set.is_definitely_out(task)) {
			let project_element = document.createElement("li");
			projects_element.appendChild(project_element);
			let project_link_element = document.createElement("a");
			project_element.appendChild(project_link_element);
			project_link_element.textContent = set.title;
			project_link_element.href = "javascript:void(0);";
			project_link_element.title = "Inspect this project.";
			project_link_element.onclick = function(event) {
				switcher.switch(make_inspect_project(model, switcher, set, shadow_host, task_actions, project_actions));
			};
		}
	}
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	for(let action of task_actions) {
		actions_element.appendChild(document.createTextNode(" "));
		let action_element = document.createElement("button");
		actions_element.appendChild(action_element);
		action_element.textContent = action.name;
		action_element.title = action.title;
		action_element.onclick = function(event) {
			action.callback(task, shadow_host);
		};
	}
	return shadow_host;
}

class InspectTaskAction {
	constructor(name, title, callback) {
		this.name = name;
		this.title = title;
		this.callback = callback;
	}
}
