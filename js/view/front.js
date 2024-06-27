// view/inspect-task.js

let template_front = document.getElementById("front");
let template_first_task = document.getElementById("first-task");
function make_front(model, switcher) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_front.content.cloneNode(true));
	let completion_front_element = shadow_root.getElementById("completion");
	let uncompletion_front_element = shadow_root.getElementById("uncompletion");
	function update() {
		while(completion_front_element.firstChild !== null) {
			completion_front_element.removeChild(completion_front_element.firstChild);
		}
		while(uncompletion_front_element.firstChild !== null) {
			uncompletion_front_element.removeChild(uncompletion_front_element.firstChild);
		}
		if(model.repository.data.completion_front.length !== 0) {
			let first_task = model.repository.data.completion_front[0];
			let first_task_element = document.createElement("li");
			completion_front_element.appendChild(first_task_element);
			let first_task_shadow_host = document.createElement("div");
			first_task_element.appendChild(first_task_shadow_host);
			let first_task_shadow_root = first_task_shadow_host.attachShadow({ mode: "open" });
			first_task_shadow_root.appendChild(template_first_task.content.cloneNode(true));
			let first_task_title_element = first_task_shadow_root.getElementById("title");
			let first_task_description_element = first_task_shadow_root.getElementById("description");
			let first_task_complete_element = first_task_shadow_root.getElementById("complete");
			let first_task_cycle_element = first_task_shadow_root.getElementById("cycle");
			let first_task_link_element = document.createElement("a");
			first_task_title_element.appendChild(first_task_link_element);
			first_task_link_element.textContent = first_task.title;
			first_task_link_element.href = "javascript:void(0);";
			first_task_link_element.title = "Inspect this task.";
			first_task_link_element.onclick = function(event) {
				switcher.switch(make_inspect_task(model, switcher, first_task, shadow_host));
			};
			first_task_description_element.textContent = first_task.description;
			first_task_complete_element.onclick = function(event) {
				model.complete();
				update();
			};
			first_task_cycle_element.onclick = function(event) {
				model.cycle();
				update();
			};
			for(let index = 1; index < model.repository.data.completion_front.length; index++) {
				let task = model.repository.data.completion_front[index];
				let task_element = document.createElement("li");
				completion_front_element.appendChild(task_element);
				let task_link_element = document.createElement("a");
				task_element.appendChild(task_link_element);
				task_link_element.textContent = task.title;
				task_link_element.href = "javascript:void(0);";
				task_link_element.title = "Inspect this task.";
				task_link_element.onclick = function(event) {
					switcher.switch(make_inspect_task(model, switcher, task, shadow_host));
				};
			}
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
				switcher.switch(make_inspect_task(model, switcher, task, shadow_host));
			};
		}
	}
	update();
	return shadow_host;
}
