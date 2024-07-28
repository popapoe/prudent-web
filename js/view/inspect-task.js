// view/inspect-project.js

let template_inspect_task = document.getElementById("inspect-task");
function enter_inspect_task(model, switcher, task, select) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_inspect_task.content.cloneNode(true));
		let title_element = shadow_root.getElementById("title");
		let description_element = shadow_root.getElementById("description");
		let dependencies_element = shadow_root.getElementById("dependencies");
		let dependents_element = shadow_root.getElementById("dependents");
		let projects_element = shadow_root.getElementById("projects");
		let key_element = shadow_root.getElementById("key");
		let back_element = shadow_root.getElementById("back");
		let select_element = shadow_root.getElementById("select");
		let cancel_element = shadow_root.getElementById("cancel");
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
			task_link_element.onclick = async function(event) {
				let result = await enter_inspect_task(model, switcher, dependency, select);
				if(result.tag === "back") {
					switcher.switch(shadow_host);
				} else if(result.tag === "select") {
					let task = result.task;
					resolve({ tag: "select", task: task });
				} else if(result.tag === "cancel") {
					resolve({ tag: "cancel" });
				}
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
			task_link_element.onclick = async function(event) {
				let result = await enter_inspect_task(model, switcher, dependent, select);
				if(result.tag === "back") {
					switcher.switch(shadow_host);
				} else if(result.tag === "select") {
					let task = result.task;
					resolve({ tag: "select", task: task });
				} else if(result.tag === "cancel") {
					resolve({ tag: "cancel" });
				}
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
				project_link_element.onclick = async function(event) {
					let result = await enter_inspect_project(model, switcher, set, select);
					if(result.tag === "back") {
						switcher.switch(shadow_host);
					} else if(result.tag === "select") {
						let task = result.task;
						resolve({ tag: "select", task: task });
					} else if(result.tag === "cancel") {
						resolve({ tag: "cancel" });
					}
				};
			}
		}
		back_element.onclick = async function(event) {
			resolve({ tag: "back" });
		};
		select_element.hidden = !select;
		select_element.onclick = async function(event) {
			resolve({ tag: "select", task: task });
		};
		cancel_element.onclick = async function(event) {
			resolve({ tag: "cancel" });
		};
		switcher.switch(shadow_host);
	});
}
