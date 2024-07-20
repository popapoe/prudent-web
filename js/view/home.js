// view/project.js view/global.js view/create-project.js view/snapshot.js

let template_home = document.getElementById("home");
function make_home(model, switcher) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_home.content.cloneNode(true));
	let projects_element = shadow_root.getElementById("projects");
	let create_element = shadow_root.getElementById("create");
	let global_element = shadow_root.getElementById("global");
	let snapshot_element = shadow_root.getElementById("snapshot");
	let materialize_element = shadow_root.getElementById("materialize");
	function update() {
		while(projects_element.firstChild !== null) {
			projects_element.removeChild(projects_element.firstChild);
		}
		for(let set of model.repository.data.sets.values()) {
			if(set.key !== "completed") {
				let project_element = document.createElement("li");
				projects_element.appendChild(project_element);
				let project_link_element = document.createElement("a");
				project_element.appendChild(project_link_element);
				project_link_element.textContent = set.title;
				project_link_element.href = "javascript:void(0);";
				project_link_element.title = "Visit this project.";
				project_link_element.onclick = function(event) {
					switcher.switch(make_project(model, switcher, set, shadow_host));
				};
			}
		}
	}
	update();
	create_element.onclick = function(event) {
		switcher.switch(make_create_project(model, switcher, shadow_host, function(set) {
			model.register_set(set).then(function() {
				update();
				switcher.switch(shadow_host);
			});
		}));
	};
	global_element.onclick = function(event) {
		switcher.switch(make_global(model, switcher, shadow_host));
	};
	snapshot_element.onclick = function(event) {
		switcher.switch(make_snapshot(model, switcher, shadow_host, function() {
			switcher.switch(shadow_host);
		}));
	};
	materialize_element.onclick = function(event) {
		model.repository.materialize();
	};
	return shadow_host;
}
