// data/objects.js view/inspect-task.js view/select.js

let template_create_task = document.getElementById("create-task");
function enter_create_task(model, switcher) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_create_task.content.cloneNode(true));
		let title_element = shadow_root.getElementById("title");
		let description_element = shadow_root.getElementById("description");
		let dependencies_element = shadow_root.getElementById("dependencies");
		let add_element = shadow_root.getElementById("add");
		let back_element = shadow_root.getElementById("back");
		let create_element = shadow_root.getElementById("create");
		let dependencies = new Set();
		add_element.onclick = async function(event) {
			let result = await enter_select(model, switcher);
			if(result.tag === "select") {
				let task = result.task;
				if(!dependencies.has(result.task)) {
					dependencies.add(task);
					let task_element = document.createElement("li");
					dependencies_element.appendChild(task_element);
					let task_link_element = document.createElement("a");
					let task_remove_element = document.createElement("button");
					task_element.appendChild(task_link_element);
					task_element.appendChild(document.createTextNode(" "));
					task_element.appendChild(task_remove_element);
					task_link_element.textContent = task.title;
					task_link_element.href = "javascript:void(0);";
					task_link_element.title = "Inspect this task.";
					task_link_element.onclick = async function(event) {
						await enter_inspect_task(model, switcher, task, false);
						switcher.switch(shadow_host);
					};
					task_remove_element.textContent = "remove";
					task_remove_element.title = "Remove this dependency.";
					task_remove_element.onclick = async function(event) {
						dependencies.delete(task);
						dependencies_element.removeChild(task_element);
					};
				}
			}
			switcher.switch(shadow_host);
		};
		back_element.onclick = async function(event) {
			resolve({ tag: "back" });
		};
		create_element.onclick = async function(event) {
			let task = Task.create(title_element.value, description_element.value, Array.from(dependencies));
			resolve({ tag: "create", task: task });
		};
		switcher.switch(shadow_host);
	});
}
