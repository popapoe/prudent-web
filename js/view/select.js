// view/inspect-task.js

let template_select = document.getElementById("select");
function enter_select(model, switcher) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_select.content.cloneNode(true));
		let completion_front_element = shadow_root.getElementById("completion");
		let uncompletion_front_element = shadow_root.getElementById("uncompletion");
		let back_element = shadow_root.getElementById("back");
		for(let task of model.repository.data.completion_front) {
			let task_element = document.createElement("li");
			completion_front_element.appendChild(task_element);
			let task_link_element = document.createElement("a");
			task_element.appendChild(task_link_element);
			task_link_element.textContent = task.title;
			task_link_element.href = "javascript:void(0);";
			task_link_element.title = "Inspect this task.";
			task_link_element.onclick = async function(event) {
				let result = await enter_inspect_task(model, switcher, task, true);
				if(result.tag === "back") {
					switcher.switch(shadow_host);
				} else if(result.tag === "select") {
					let task = result.task;
					resolve({ tag: "select", task: task })
				} else if(result.tag === "cancel") {
					switcher.switch(shadow_host);
				}
			};
		}
		for(let task of model.repository.data.uncompletion_front) {
			let task_element = document.createElement("li");
			uncompletion_front_element.appendChild(task_element);
			let task_link_element = document.createElement("a");
			task_element.appendChild(task_link_element);
			task_link_element.textContent = task.title;
			task_link_element.href = "javascript:void(0);";
			task_link_element.title = "Inspect this task.";
			task_link_element.onclick = async function(event) {
				let result = await enter_inspect_task(model, switcher, task, true);
				if(result.tag === "back") {
					switcher.switch(shadow_host);
				} else if(result.tag === "select") {
					let task = result.task;
					resolve({ tag: "select", task: task })
				} else if(result.tag === "cancel") {
					switcher.switch(shadow_host);
				}
			};
		}
		back_element.onclick = async function(event) {
			resolve({ tag: "back" });
		};
		switcher.switch(shadow_host);
	});
}
