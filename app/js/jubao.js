mui.ready(function() {
	mui.plusReady(function() {
		var professorId = plus.webview.currentWebview().professorId;
		userFun();
		function userFun() {
		
			mui.ajax(baseUrl + '/ajax/professor/baseInfo/' + professorId, {
				"type": "get",
				"async": true,
				"success": function(data) {
					if(data.success && data.data) {
						document.getElementById("name").innerHTML = data.data.name;
						if(data.data.hasHeadImage == 1) {
							document.getElementById("img").style.backgroundImage = "url(" + baseUrl + "/images/head/" + data.data.id + "_m.jpg)";
						}
						var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
						document.getElementById("authicon").classList.add(userType.sty);
						var te = ''
						if(data.data.title) {
							if(data.data.orgName) {
								te = data.data.title + "," + data.data.orgName
							} else {
								te = data.data.title
							}
						} else {
							if(data.data.office) {
								if(data.data.orgName) {
									te = data.data.office + "," + data.data.orgName
								} else {
									te = data.data.office
								}
							} else {
								if(data.data.orgName) {
									te = data.data.orgName
								}
							}
						}
						document.getElementById("title").innerHTML=te;
					}
				},
				"error": function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		mui('#table').on('tap', 'li', function() {
	
	plus.nativeUI.showWaiting(); //显示原生等待框
	webviewShow = plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
		proid: professorId
	}); 
})
		document.getElementById("breif").addEventListener("tap",function(){
			mui.openWindow({
				url: '../html/jubao1.html',
				id: 'jubao1.html',
				show: {
					autoShow: true,
					aniShow: "slide-in-right",
				},
				extras: {
					professorId: professorId
				}
			})
		})
	})
})