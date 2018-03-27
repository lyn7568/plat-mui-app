mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview();
		console.log(JSON.stringify(web));
		plus.nativeUI.closeWaiting();
		web.show("slide-in-right", 150);
		
		var userid = plus.storage.getItem('userid');
		var dateResult = document.getElementById('dateResult');
		
		if(web.birthday) {
			dateResult.innerText = web.birthday;
		}
		
		var showDatePickerButton = document.getElementById('showDatePicker');

		showDatePickerButton.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				dateResult.innerText = rs.text;
				picker.dispose();
			});
		}, false);
		
		document.getElementById("login").addEventListener("tap", function() {
			savePro();
		})

		function savePro() {
			var mess = {};
			mess.sex=web.sex;
			mess.birthday= dateResult.innerText;
			mess.name = web.name;
			mess.orgName = web.orgName;
			mess.department = web.department;
			mess.title = web.title;
			mess.office = web.office;
			mess.address = web.city;
			mess.email = web.email;
			mess.province = web.province;
			mess.phone = web.phone;
			mess.id = userid;
			var mess1 = JSON.stringify(mess);
			console.log(JSON.stringify(mess))
			mui.ajax({
				"url": baseUrl + '/ajax/professor',
				"type": "PUT",
				"async": true,
				"data": mess1,
				"contentType": "application/json",
				"success": function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateBasic.html");
						mui.fire(web, "newId", {
							rd: 1
						});
						mui.back();
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		}
	})
})