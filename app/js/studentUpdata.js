mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var oImg = document.getElementsByTagName("img")[0];
		var personalMaterial = document.getElementsByClassName('personalMaterial');
		var personSummary = document.getElementsByClassName("breifinfo")[0];
		var fl;
		window.addEventListener("newId", function(event) {
				fl = event.detail.rd;				
				personalMaterial[1].parentNode.style.display = "block";
				personalMaterial[2].parentNode.style.display = "block";
				personalMaterial[3].parentNode.style.display = "block";
				personalMaterial[4].parentNode.style.display = "block";
				personalMaterial[5].parentNode.style.display = "block";
				personalMessage();
			})
			//获取个人的信息
		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						plus.nativeUI.closeWaiting();
						if(!fl) {
							plus.webview.currentWebview().show("slide-in-right", 300);
						}
						var $data = data.data;
						personalMaterial[0].innerText = $data.name;
						//头像					
						if($data.hasHeadImage) {
							var mun = Math.round(Math.random() * 99 + 1);
							oImg.src = baseUrl + "/images/head/" + $data.id + "_l.jpg?" + mun;
						}
						//基本信息
						//					if(!$data.authentication) {
						//						document.getElementsByClassName('authword')[0].innerText = "未认证";
						//						document.getElementsByClassName('authword')[0].style.backgroundColor = "#cccccc";
						//					}

						if($data.department) {
							personalMaterial[1].innerText = $data.department;
						} else {
							personalMaterial[1].parentNode.style.display = "none";
						}
						if($data.orgName) {
							personalMaterial[2].innerText = $data.orgName;
						} else {
							personalMaterial[2].parentNode.style.display = "none";
						}
						if($data.address) {
							personalMaterial[3].innerText = $data.province + " " + $data.address;
						} else {
							personalMaterial[3].parentNode.style.display = "none";
						}
						if($data.phone) {
							personalMaterial[4].innerText = $data.phone;
						} else {
							personalMaterial[4].parentNode.style.display = "none";
						}
						if($data.email) {
							personalMaterial[5].innerText = $data.email;
						} else {
							personalMaterial[5].parentNode.style.display = "none";
						}
						//个人简介
						personSummary.innerHTML=""
						if($data.descp) {
							personSummary.innerHTML = $data.descp;
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		//个人信息修改
		document.getElementsByClassName("updatebox")[0].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			webviewShow = plus.webview.create("../html/studentUpdate1.html", "../html/studentUpdate1.html", {}, {
				flag: 0
			}); //后台创建webview并打开show.html   	    	
			webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
				//				nwaiting.close(); //新webview的载入完毕后关闭等待框
				//				webviewShow.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		document.getElementsByClassName("updatebox")[1].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				descp: personSummary.innerText,
				flag: 0
			}
			webviewShow = plus.webview.create("../html/updateinfo2.html", "updateinfo2.html", {}, arr); //后台创建webview并打开show.html   	    	
			webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webviewShow.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
			//修改详细页面
		document.getElementById("updateDetailProfessor").addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/proinforupdate-more.html", "proinforupdate-more.html"); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		personalMessage();
	});
});