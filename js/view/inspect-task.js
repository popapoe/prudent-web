let template_inspect_task = document.getElementById("inspect-task");
function make_inspect_task(model, task) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_inspect_task.content.cloneNode(true));
	let title_element = shadow_root.getElementById("title");
	let description_element = shadow_root.getElementById("description");
	let dependencies_element = shadow_root.getElementById("dependencies");
	let dependents_element = shadow_root.getElementById("dependents");
	title_element.textContent = task.title;
	description_element.textContent = task.description;
	for(let dependency of model.repository.data.registry.get_relation().get_preimage(task)) {
		let task_element = document.createElement("li");
		dependencies_element.appendChild(task_element);
		task_element.textContent = dependency.title;
	}
	for(let dependent of model.repository.data.registry.get_relation().get_image(task)) {
		let task_element = document.createElement("li");
		dependents_element.appendChild(task_element);
		task_element.textContent = dependent.title;
	}
	return shadow_host;
}
