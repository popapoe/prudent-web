let pass = 0;
let fail = 0;

function run(test) {
	try {
		test();
		pass++;
	} catch(error) {
		console.error(error);
		fail++;
	}
}

function finish() {
	if(fail !== 0) {
		document.body.classList.add("fail");
	} else {
		document.body.classList.add("pass");
	}
	console.log(`${pass} out of ${pass + fail} tests passed.`);
}
