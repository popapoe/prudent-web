// data/data.js

let template_snapshot = document.getElementById("snapshot");
function make_snapshot(model, switcher, back, callback) {
	let shadow_host = document.createElement("div");
	let shadow_root = shadow_host.attachShadow({ mode: "open" });
	shadow_root.appendChild(template_snapshot.content.cloneNode(true));
	let export_element = shadow_root.getElementById("export");
	let import_element = shadow_root.getElementById("import");
	let snapshot_element = shadow_root.getElementById("snapshot");
	let back_element = shadow_root.getElementById("back");
	export_element.onclick = function(event) {
		snapshot_element.value = JSON.stringify(Data.save(model.repository.data), null, 1);
	};
	back_element.hidden = back === null;
	back_element.onclick = function(event) {
		switcher.switch(back);
	};
	import_element.onclick = function(event) {
		model.repository.data = Data.restore(JSON.parse(snapshot_element.value));
		model.repository.materialize();
		callback();
	};
	return shadow_host;
}
