// view/inspect-task.js

let template_select = document.getElementById("select");
function make_select(model, switcher, back, callback) {
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
		task_link_element.onclick = function(event) {
			switcher.switch(make_inspect_task(model, switcher, task, shadow_host, [
				new InspectTaskAction("cancel", "Stop selecting.", function(task, screen) {
					switcher.switch(back);
				}),
				new InspectTaskAction("select", "Select this task.", function(task, screen) {
					callback(task);
				}),
			]));
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
		task_link_element.onclick = function(event) {
			switcher.switch(make_inspect_task(model, switcher, task, shadow_host, [
				new InspectTaskAction("cancel", "Stop selecting.", function(task, screen) {
					switcher.switch(back);
				}),
				new InspectTaskAction("select", "Select this task.", function(task, screen) {
					callback(task);
				}),
			]));
		};
	}
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	return shadow_host;
}
