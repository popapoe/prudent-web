// view/inspect-task.js

let template_inspect_project = document.getElementById("inspect-project");
function make_inspect_project(model, switcher, set, back, task_actions, project_actions) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_inspect_project.content.cloneNode(true));
	let title_element = shadow_root.getElementById("title");
	let description_element = shadow_root.getElementById("description");
	let completion_front_element = shadow_root.getElementById("completion");
	let uncompletion_front_element = shadow_root.getElementById("uncompletion");
	let key_element = shadow_root.getElementById("key");
	let actions_element = shadow_root.getElementById("actions");
	let back_element = shadow_root.getElementById("back");
	title_element.textContent = set.title;
	description_element.textContent = set.description;
	key_element.textContent = set.key;
	for(let task of model.repository.data.completion_front) {
		if(!set.set.is_definitely_out(task)) {
			let task_element = document.createElement("li");
			completion_front_element.appendChild(task_element);
			let task_link_element = document.createElement("a");
			task_element.appendChild(task_link_element);
			task_link_element.textContent = task.title;
			task_link_element.href = "javascript:void(0);";
			task_link_element.title = "Inspect this task.";
			task_link_element.onclick = function(event) {
				switcher.switch(make_inspect_task(model, switcher, task, shadow_host, task_actions, project_actions));
			};
		}
	}
	for(let task of model.repository.data.uncompletion_front) {
		if(!set.set.is_definitely_out(task)) {
			let task_element = document.createElement("li");
			uncompletion_front_element.appendChild(task_element);
			let task_link_element = document.createElement("a");
			task_element.appendChild(task_link_element);
			task_link_element.textContent = task.title;
			task_link_element.href = "javascript:void(0);";
			task_link_element.title = "Inspect this task.";
			task_link_element.onclick = function(event) {
				switcher.switch(make_inspect_task(model, switcher, task, shadow_host, task_actions, project_actions));
			};
		}
	}
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	for(let action of project_actions) {
		actions_element.appendChild(document.createTextNode(" "));
		let action_element = document.createElement("button");
		actions_element.appendChild(action_element);
		action_element.textContent = action.name;
		action_element.title = action.title;
		action_element.onclick = function(event) {
			action.callback(set, shadow_host);
		};
	}
	return shadow_host;
}

class InspectProjectAction {
	constructor(name, title, callback) {
		this.name = name;
		this.title = title;
		this.callback = callback;
	}
}
