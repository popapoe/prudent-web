// data/objects.js view/inspect-task.js view/select.js

let template_create_task = document.getElementById("create-task");
function make_create_task(model, switcher, back, callback) {
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
	add_element.onclick = function(event) {
		switcher.switch(make_select(model, switcher, shadow_host, function(task) {
			if(!dependencies.has(task)) {
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
				task_link_element.onclick = function(event) {
					switcher.switch(make_inspect_task(model, switcher, task, shadow_host, [
						new InspectTaskAction("cancel", "Stop inspecting.", function(task, screen) {
							switcher.switch(shadow_host);
						}),
					], [
						new InspectProjectAction("cancel", "Stop inspecting.", function(set, screen) {
							switcher.switch(shadow_host);
						}),
					]));
				};
				task_remove_element.textContent = "remove";
				task_remove_element.title = "Remove this dependency.";
				task_remove_element.onclick = function(event) {
					dependencies.delete(task);
					dependencies_element.removeChild(task_element);
				};
			}
			switcher.switch(shadow_host);
		}));
	};
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	create_element.onclick = function(event) {
		callback(Task.create(title_element.value, description_element.value, Array.from(dependencies)));
	};
	return shadow_host;
}
