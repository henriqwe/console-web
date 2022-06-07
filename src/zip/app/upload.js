// define URL and for element
const url = api.endpoint.backend.ds.data_restore.url;
const form = document.querySelectorById('form');

// add event listener
form.addEventListener('submit', e => {
	// disable default action
	e.preventDefault();

	// collect files
	const files = document.getElementById('formToRestoreBackup').files;
	const formData = new FormData();
	formData.append('dump', files[0]);

	// post form data
	const xhttp = new XMLHttpRequest();

	// log response
	xhttp.onload = function() {
		if (this.status == 200 || this.status == 201) {
			console.log(xhttp.responseText);
		} else console.log(this.status);
	};

	// create and send the reqeust
	xhttp.open('POST', url);
	xhttp.setRequestHeader('X-TenantID', tenantID);
	xhttp.setRequestHeader('Content-Type', api.endpoint.backend.ds.data_backup.headers['Content-Type']);
	xhttp.send(formData);
});
