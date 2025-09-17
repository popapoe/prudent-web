// view/project.js view/global.js view/create-project.js view/snapshot.js

let template_home = document.getElementById("home");
function enter_home(model, switcher) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_home.content.cloneNode(true));
		let projects_element = shadow_root.getElementById("projects");
		let create_element = shadow_root.getElementById("create");
		let global_element = shadow_root.getElementById("global");
		let snapshot_element = shadow_root.getElementById("snapshot");
		let materialize_element = shadow_root.getElementById("materialize");
		async function update() {
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
					project_link_element.onclick = async function(event) {
						await enter_project(model, switcher, set);
						switcher.switch(shadow_host);
					};
				}
			}
		}
		await update();
		create_element.onclick = async function(event) {
			let result = await enter_create_project(model, switcher);
			if(result.tag === "create") {
				let set = result.set;
				await model.register_set(set);
				await update();
			}
			switcher.switch(shadow_host);
		};
		global_element.onclick = async function(event) {
			await enter_global(model, switcher);
			switcher.switch(shadow_host);
		};
		snapshot_element.onclick = async function(event) {
			let result = await enter_snapshot(model, switcher);
			if(result.tag === "import") {
				await update();
			}
			switcher.switch(shadow_host);
		};
		materialize_element.onclick = async function(event) {
			model.repository.materialize();
		};
		switcher.switch(shadow_host);
	});
}
