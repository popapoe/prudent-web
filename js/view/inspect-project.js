// view/inspect-task.js

let template_inspect_project = document.getElementById("inspect-project");
function enter_inspect_project(model, switcher, set, select) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_inspect_project.content.cloneNode(true));
		let title_element = shadow_root.getElementById("title");
		let description_element = shadow_root.getElementById("description");
		let completion_front_element = shadow_root.getElementById("completion");
		let uncompletion_front_element = shadow_root.getElementById("uncompletion");
		let key_element = shadow_root.getElementById("key");
		let back_element = shadow_root.getElementById("back");
		let cancel_element = shadow_root.getElementById("cancel");
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
				task_link_element.onclick = async function(event) {
					let result = await enter_inspect_task(model, switcher, task, select);
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
		for(let task of model.repository.data.uncompletion_front) {
			if(!set.set.is_definitely_out(task)) {
				let task_element = document.createElement("li");
				uncompletion_front_element.appendChild(task_element);
				let task_link_element = document.createElement("a");
				task_element.appendChild(task_link_element);
				task_link_element.textContent = task.title;
				task_link_element.href = "javascript:void(0);";
				task_link_element.title = "Inspect this task.";
				task_link_element.onclick = async function(event) {
					let result = await enter_inspect_task(model, switcher, task, select);
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
		cancel_element.onclick = async function(event) {
			resolve({ tag: "cancel" });
		};
		switcher.switch(shadow_host);
	});
}
