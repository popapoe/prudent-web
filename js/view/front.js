// view/inspect-task.js

let template_front = document.getElementById("front");
let template_first_task = document.getElementById("first-task");
function make_front(model, switcher, parent, set) {
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
		let completion_front = [];
		let uncompletion_front = [];
		for(let index = 0; index < model.repository.data.completion_front.length; index++) {
			let task = model.repository.data.completion_front[index];
			if(set === null || !set.set.is_definitely_out(task)) {
				completion_front.push({ index: index, task: task });
			}
		}
		for(let index = 0; index < model.repository.data.uncompletion_front.length; index++) {
			let task = model.repository.data.uncompletion_front[index];
			if(set === null || !set.set.is_definitely_out(task)) {
				uncompletion_front.push({ index: index, task: task });
			}
		}
		if(completion_front.length !== 0) {
			let first_task = completion_front[0].task;
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
				switcher.switch(make_inspect_task(model, switcher, first_task, parent, [
					new InspectTaskAction("cancel", "Stop inspecting.", function(task, screen) {
						switcher.switch(parent);
					}),
				], [
					new InspectProjectAction("cancel", "Stop inspecting.", function(set, screen) {
						switcher.switch(parent);
					}),
				]));
			};
			first_task_description_element.textContent = first_task.description;
			first_task_complete_element.onclick = function(event) {
				model.complete(completion_front[0].index).then(function() {
					update();
				});
			};
			first_task_cycle_element.onclick = function(event) {
				model.cycle(completion_front[0].index).then(function() {
					update();
				});
			};
			for(let index = 1; index < completion_front.length; index++) {
				let task = completion_front[index].task;
				let task_element = document.createElement("li");
				completion_front_element.appendChild(task_element);
				let task_link_element = document.createElement("a");
				let task_complete_element = document.createElement("button");
				task_element.appendChild(task_link_element);
				task_element.appendChild(document.createTextNode(" "));
				task_element.appendChild(task_complete_element);
				task_link_element.textContent = task.title;
				task_link_element.href = "javascript:void(0);";
				task_link_element.title = "Inspect this task.";
				task_link_element.onclick = function(event) {
					switcher.switch(make_inspect_task(model, switcher, task, parent, [
						new InspectTaskAction("cancel", "Stop inspecting.", function(task, screen) {
							switcher.switch(parent);
						}),
					], [
						new InspectProjectAction("cancel", "Stop inspecting.", function(set, screen) {
							switcher.switch(parent);
						}),
					]));
				};
				task_complete_element.textContent = "complete";
				task_complete_element.title = "Complete this task.";
				task_complete_element.onclick = function(event) {
					model.complete(completion_front[index].index).then(function() {
						update();
					});
				};
			}
		}
		for(let index = 0; index < uncompletion_front.length; index++) {
			let task = uncompletion_front[index].task;
			let task_element = document.createElement("li");
			uncompletion_front_element.appendChild(task_element);
			let task_link_element = document.createElement("a");
			let task_uncomplete_element = document.createElement("button");
			task_element.appendChild(task_link_element);
			task_element.appendChild(document.createTextNode(" "));
			task_element.appendChild(task_uncomplete_element);
			task_link_element.textContent = task.title;
			task_link_element.href = "javascript:void(0);";
			task_link_element.title = "Inspect this task.";
			task_link_element.onclick = function(event) {
				switcher.switch(make_inspect_task(model, switcher, task, parent, [
					new InspectTaskAction("cancel", "Stop inspecting.", function(task, screen) {
						switcher.switch(parent);
					}),
				], [
					new InspectProjectAction("cancel", "Stop inspecting.", function(set, screen) {
						switcher.switch(parent);
					}),
				]));
			};
			task_uncomplete_element.textContent = "uncomplete";
			task_uncomplete_element.title = "Uncomplete this task.";
			task_uncomplete_element.onclick = function(event) {
				model.uncomplete(uncompletion_front[index].index).then(function() {
					update();
				});
			};
		}
	}
	update();
	return shadow_host;
}
