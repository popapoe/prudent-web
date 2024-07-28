// data/data.js

let template_snapshot = document.getElementById("snapshot");
function enter_snapshot(model, switcher) {
	return new Promise(async function(resolve, reject) {
		let shadow_host = document.createElement("div");
		let shadow_root = shadow_host.attachShadow({ mode: "open" });
		shadow_root.appendChild(template_snapshot.content.cloneNode(true));
		let export_element = shadow_root.getElementById("export");
		let import_element = shadow_root.getElementById("import");
		let snapshot_element = shadow_root.getElementById("snapshot");
		let back_element = shadow_root.getElementById("back");
		export_element.onclick = async function(event) {
			snapshot_element.value = JSON.stringify(Data.save(model.repository.data), null, 1);
		};
		back_element.onclick = async function(event) {
			resolve({ tag: "back" });
		};
		import_element.onclick = async function(event) {
			model.repository.data = Data.restore(JSON.parse(snapshot_element.value));
			await model.repository.materialize();
			resolve({ tag: "import" });
		};
		switcher.switch(shadow_host);
	});
}
