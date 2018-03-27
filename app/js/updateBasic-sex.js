mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		var sexRadio = document.getElementById("sexRadio");
		function person() {
			plus.nativeUI.closeWaiting();
			if(web.sex==1){
				sexRadio.getElementsByTagName('li')[0].classList.add("mui-selected")
			}else if(web.sex==2){
				sexRadio.getElementsByTagName('li')[1].classList.add("mui-selected")
			}
		}
		person();
		document.getElementById("login").addEventListener("tap",function(){
			savePro();
		})
		function savePro() {
			var mess = {};
			mess.sex=sexRadio.getElementsByClassName("mui-selected")[0].getAttribute("data-val");
			mess.birthday=web.birthday;
			mess.name = web.name;
			mess.orgName = web.orgName;
			mess.department =web.department;
			mess.title = web.title;
			mess.office =web.office;	
			mess.address = web.address;
			mess.province=web.province;
			mess.email = web.email;
			mess.phone =web.phone;			
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
					console.log(JSON.stringify(data))
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