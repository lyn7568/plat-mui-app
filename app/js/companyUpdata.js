mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var oImg = document.getElementsByTagName("img")[0];
		var personalMaterial = document.getElementsByClassName('personalMaterial');
		var personSummary = document.getElementsByClassName("breifinfo")[0];
		var fl;
		window.addEventListener("newId", function(event) {
				fl = event.detail.rd;
				console.log(fl);
				personalMaterial[1].parentNode.style.display = "block";
				personalMaterial[2].parentNode.style.display = "block";
				personalMaterial[3].parentNode.style.display = "block";
				personalMaterial[4].parentNode.style.display = "block";
				personalMaterial[5].parentNode.style.display = "block";
				personalMaterial[6].parentNode.style.display = "block";
				personalMaterial[7].parentNode.style.display = "block";
				personalMessage();
			})
		//查询应用行业		
		var industryShow = function (data){
				if(data != undefined &&  data.length != 0 ){
					var subs = new Array();				
					if(data.indexOf(',')) {	
						subs = data.split(',');			
					}else {
						subs[0] = data;
					}
					if(subs.length>0) {   
						var html = [];
						for (var i = 0; i < subs.length; i++) {
							html.push("<li>"+subs[i]+"</li>");														
						};
						document.getElementsByClassName("infoapply")[0].innerHTML=html.join('');
					}	
				}			
			}
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
							plus.webview.currentWebview().show("slide-in-right", 150);
						}
						var $data = data.data;
						personalMaterial[0].innerText = $data.name;
						//头像					
						if($data.hasHeadImage) {
							var mun = Math.round(Math.random() * 99 + 1);
							oImg.src = baseUrl + "/images/head/" + $data.id + "_l.jpg?" + mun;
						}
						//基本信息
						if($data.title) {
							personalMaterial[2].innerText = $data.title
						} else {
							personalMaterial[2].parentNode.style.display = "none";
						}
						if($data.office) {
							personalMaterial[1].innerText = $data.office;
						} else {
							personalMaterial[1].parentNode.style.display = "none";
						}
						if($data.department) {
							personalMaterial[3].innerText = $data.department;
						} else {
							personalMaterial[3].parentNode.style.display = "none";
						}
						if($data.orgName) {
							personalMaterial[4].innerText = $data.orgName;
						} else {
							personalMaterial[4].parentNode.style.display = "none";
						}
						if($data.address) {
							personalMaterial[5].innerText = $data.province + " " + $data.address;
						} else {
							personalMaterial[5].parentNode.style.display = "none";
						}
						if($data.phone) {
							personalMaterial[6].innerText = $data.phone;
						} else {
							personalMaterial[6].parentNode.style.display = "none";
						}
						if($data.email) {
							personalMaterial[7].innerText = $data.email;
						} else {
							personalMaterial[7].parentNode.style.display = "none";
						}
						//个人简介
						personSummary.innerHTML="";
						if($data.descp) {
							personSummary.innerHTML = $data.descp;
						}
						//应用行业
						if($data.industry) {
							industryShow($data.industry);
						}else{
							document.getElementsByClassName("infoapply")[0].innerHTML=" ";
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
			var arr = {
				name: personalMaterial[0].innerText,
				office: personalMaterial[1].innerText,
				title: personalMaterial[2].innerText,
				orgName: personalMaterial[3].innerText,
				department: personalMaterial[4].innerText,
				address: personalMaterial[5].innerText
			}
			webviewShow = plus.webview.create("../html/companyUpdata1.html", "../html/companyUpdata1.html", {}, arr); //后台创建webview并打开show.html   	    	
			webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
				//				nwaiting.close(); //新webview的载入完毕后关闭等待框
				//				webviewShow.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		document.getElementsByClassName("updatebox")[1].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				descp: personSummary.innerText,
				flag: 1
			}
			webviewShow = plus.webview.create("../html/updateinfo2.html", "updateinfo2.html", {}, arr); //后台创建webview并打开show.html   	    	
			webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webviewShow.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		var page2 = mui.preload({
			url: "../html/updateinfo5.html",
			id: "updateinfo5.html",
			extras:{flag: 1}//自定义扩展参数
		})
		document.getElementsByClassName("updatebox")[2].addEventListener("tap", function() {
			page2.show("slide-in-right", 150);
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