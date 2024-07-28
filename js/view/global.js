// view/front.js view/create-task.js view/synchronize.js

let template_global = document.getElementById("global");
function enter_global(model, switcher) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_global.content.cloneNode(true));
		let front_element = shadow_root.getElementById("front");
		let create_element = shadow_root.getElementById("create");
		let back_element = shadow_root.getElementById("back");
		front_element.appendChild(make_front(model, switcher, shadow_host, null));
		create_element.onclick = async function(event) {
			let result = await enter_create_task(model, switcher, shadow_host);
			if(result.tag === "create") {
				let task = result.task;
				await model.register_task(task);
				front_element.removeChild(front_element.firstChild);
				front_element.appendChild(make_front(model, switcher, shadow_host, null));
			}
			switcher.switch(shadow_host);
		};
		back_element.onclick = async function(event) {
			resolve({ tag: "back" });
		};
		switcher.switch(shadow_host);
	});
}
