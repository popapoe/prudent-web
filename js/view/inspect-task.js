let template_inspect_task = document.getElementById("inspect-task");
function make_inspect_task(model, switcher, task, back) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_inspect_task.content.cloneNode(true));
	let title_element = shadow_root.getElementById("title");
	let description_element = shadow_root.getElementById("description");
	let dependencies_element = shadow_root.getElementById("dependencies");
	let dependents_element = shadow_root.getElementById("dependents");
	let back_element = shadow_root.getElementById("back");
	title_element.textContent = task.title;
	description_element.textContent = task.description;
	for(let dependency of model.repository.data.registry.get_relation().get_preimage(task)) {
		let task_element = document.createElement("li");
		dependencies_element.appendChild(task_element);
		let task_link_element = document.createElement("a");
		task_element.appendChild(task_link_element);
		task_link_element.textContent = dependency.title;
		task_link_element.href = "javascript:void(0);";
		task_link_element.title = "Inspect this task.";
		task_link_element.onclick = function(event) {
			switcher.switch(make_inspect_task(model, switcher, dependency, shadow_host));
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
			switcher.switch(make_inspect_task(model, switcher, dependent, shadow_host));
		};
	}
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	return shadow_host;
}
