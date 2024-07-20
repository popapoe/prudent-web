// view/front.js view/create-task.js view/synchronize.js

let template_global = document.getElementById("global");
function make_global(model, switcher, back) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_global.content.cloneNode(true));
	let front_element = shadow_root.getElementById("front");
	let create_element = shadow_root.getElementById("create");
	let back_element = shadow_root.getElementById("back");
	front_element.appendChild(make_front(model, switcher, shadow_host, null));
	create_element.onclick = function(event) {
		switcher.switch(make_create_task(model, switcher, shadow_host, function(task) {
			model.register_task(task).then(function() {
				front_element.removeChild(front_element.firstChild);
				front_element.appendChild(make_front(model, switcher, shadow_host, null));
				switcher.switch(shadow_host);
			});
		}));
	};
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	return shadow_host;
}
