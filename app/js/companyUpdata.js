mui.ready(function() {		
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var oImg=document.getElementsByTagName("img")[0];
		var personalMaterial=document.getElementsByClassName('personalMaterial');
		var personSummary=document.getElementsByClassName("breifinfo")[0];
		var fl;
		window.addEventListener("newId",function(event){
			fl=event.detail.rd;
			personalMaterial[1].parentNode.style.display = "block";
			personalMaterial[2].parentNode.style.display = "block";
			personalMaterial[3].parentNode.style.display = "block";
			personalMaterial[4].parentNode.style.display = "block";
			personalMaterial[5].parentNode.style.display = "block";	
			personalMaterial[6].parentNode.style.display = "block";
			personalMaterial[7].parentNode.style.display = "block";
			personalMessage();
		})
		//获取个人的信息
		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					
					if(!fl){
						plus.nativeUI.closeWaiting(); 
					plus.webview.currentWebview().show("slide-in-right", 150);
					}
					var $data = data.data;
					personalMaterial[0].innerText = $data.name;
					//头像					
					if($data.hasHeadImage) {						
						oImg.src = baseUrl + "/images/head/" + $data.id + "_l.jpg";						
					}
					//基本信息
//					if(!$data.authType) {						
//						document.getElementsByClassName('authword')[0].innerText = "未认证";
//						document.getElementsByClassName('authword')[0].style.backgroundColor = "#cccccc";
//					}
					if($data.office) {
						personalMaterial[2].innerText = $data.office;
					} else {
						personalMaterial[2].parentNode.style.display = "none";
					}
					if($data.title) {
						personalMaterial[1].innerText = $data.title;
					} else {
						personalMaterial[1].parentNode.style.display = "none";
					}
					if($data.orgName) {
						personalMaterial[3].innerText = $data.orgName;
					} else {
						personalMaterial[3].parentNode.style.display = "none";
					}
					if($data.department) {
						personalMaterial[4].innerText = $data.department;
					} else {
						personalMaterial[4].parentNode.style.display = "none";
					}
					if($data.address) {
						personalMaterial[5].innerText =$data.province+" "+$data.address;
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

						if($data.descp) {
							personSummary.innerHTML = $data.descp;
						}						
						//我的资源
						if($data.resources.length) {
						resource($data.resources, $data.resources.length);
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				});
			}
			//我的所有资源、
		function resource(oDa, n) {
			var $data = oDa;
			var html = [];
			for(var i = 0; i < n; i++) {
				var string = '<li class="mui-table-view-cell mui-media" resouId=' + $data[i].resourceId + '>'
				string += '<a class="proinfor" href="resinforupdate.html">'
				if($data[i].images.length) {
					string += '<img class="mui-media-object mui-pull-left resimg" src="'+baseUrl+'/images/resource/' + $data[i].resourceId + '.jpg">'					
				} else {

						string += '<img class="mui-media-object mui-pull-left resimg" src="../images/default-resource.jpg">'
					}
					string += '<div class="mui-media-body">'
					string += '<span class="listtit">' + $data[i].resourceName + '<div class="updatebox updatebox2" style="top:6px;right:6px;"><em class="mui-icon mui-icon-compose updatebtn"></em></div></span>'
					string += '<p class="listtit2">' + $data[i].supportedServices + '</p>'
					string += '<p class="listtit3 resbrief">'
					if($data[i].descp) {
						string += $data[i].descp;
					}
					string += '</p></div></a></li>'
					html.push(string);
				}
				document.getElementById("resourceList").innerHTML = html.join('');
			
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
				flag:1
			}
			webviewShow = plus.webview.create("../html/updateinfo2.html", "updateinfo2.html", {}, arr); //后台创建webview并打开show.html   	    	
			webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webviewShow.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		
		//添加我的资源
		document.getElementsByClassName("addinfobox")[0].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateinfo-res01.html", "updateinfo-res01.html",{},{reFlag:1}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {
				plus.nativeUI.closeWaiting();
				web.show("slide-in-right", 150);
			}, false);
		});
		//修改我的资源
		mui("#resourceList").on("tap", "li", function() {
				var resouId = this.getAttribute("resouId");
				var nwaiting = plus.nativeUI.showWaiting();
				var web = plus.webview.create("../html/resinforupdate.html", "resinforupdate.html", {}, {
					resourceId: resouId,
					reFlag:1
				}); //后台创建webview并打开show.html   	    	
				web.addEventListener("loaded", function() {

				}, false);
			})
			//修改详细页面
		document.getElementsByClassName("gotonext2")[0].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/proinforupdate-more.html", "proinforupdate-more.html"); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		personalMessage();		
	});
});

  