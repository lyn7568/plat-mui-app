//咨询确认
var ctTitle = document.getElementById("ctTitle");
var ctTime = document.getElementById("ctTime");
var ctType = document.getElementById("ctType");
var ctCent = document.getElementById("ctCent");
var proHead = document.getElementById("proHead");
var proName = document.getElementById("proName");
var nameli = document.getElementById("nameli");
var proOffice = document.getElementById("proOffice");
var proTitle = document.getElementById("proTitle");
var userDepartment = document.getElementById("userDepartment");
var orgName = document.getElementById("orgName");
var address = document.getElementById("address");
var gouser = document.getElementById("gouser");
var acceptAdvice = document.getElementById("acceptAdvice");
var declined = document.getElementById("declined");

mui.plusReady(function(){
 	var self = plus.webview.currentWebview();
 	var consultId = self.consultId;
 	var consultantId = self.consultantId;
 	var id;
 	/*获取咨询内容*/
 	mui.ajax(baseUrl + '/ajax/consult/qapro', {
		data: {
			"consultId": consultId
		}, //咨询ID
		dataType: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		async:false,
		success: function(data) {
			if(data.success){
				console.log(JSON.stringify(data));
				ctTitle.innerText=data.data.consultTitle;
				var Month = data.data.createTime.substr(4, 2);
				var Date = data.data.createTime.substr(6, 2);
				ctTime.innerText=Month.replace(/\b(0+)/gi,"")+"月"+Date.replace(/\b(0+)/gi,"")+"日";
				ctType.innerText=data.data.consultType; 
				ctCent.innerText=data.data.consultContant;
				id = data.data.professor.id;
			}
		},
		error: function() { 
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
	
	/*获取咨询者内容*/
 	mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + id, {
		dataType: 'json', //服务器返回json格式数据
		type: 'GET', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒 ； 
		async:false,
		success: function(data) {
			if(data.success && data.data) {
				//console.log(JSON.stringify(data));
				var $info = data.data || {};
				proName.innerText = $info.name;
				if($info.title) {
					if($info.office) {
						proTitle.innerText = $info.title + "，"
					} else {
						proTitle.innerText = $info.title 
					}
				}
				($info.office) ? proOffice.innerText = $info.office: proOffice.innerText = '';
				if($info.hasHeadImage == 1) {
					var mun = Math.round(Math.random() * 99 + 1);
					proHead.setAttribute("src", baseUrl + "/images/head/" + $info.id + "_l.jpg?" + mun);
				} else {
					proHead.setAttribute("src", baseUrl + "/images/default-photo.jpg");
				}
				if($info.authType) {
					nameli.classList.add('icon-vip');
					nameli.classList.add('authicon-cu');
					nameli.style.margin = "-4px 0 0 -2px";
				} else {
					if($info.authStatus==3) {
						if($info.authentication == 1) {
							nameli.classList.add('icon-renzheng');
							nameli.classList.add('authicon-mana');
						} else if($info.authentication == 2) {
							nameli.classList.add('icon-renzheng');
							nameli.classList.add('authicon-staff');
						} else {
							nameli.classList.add('icon-renzheng');
							nameli.classList.add('authicon-stu');
						}
					}	
				}
			}
			if($info.department) {
				if($info.orgName) {
					userDepartment.innerText = $info.department + "，"
				} else {
					if($info.address) {
						userDepartment.innerText = $info.department + " | "
					} else {
						userDepartment.innerText = $info.department;
					}
				}
			}
			if($info.orgName) {
				if($info.address) {
					orgName.innerText = $info.orgName + " | "
				} else {
					orgName.innerText = $info.orgName;
				}
			}
			($info.address) ? address.innerText = $info.address: address.innerText = '';
			
			gouser.addEventListener("tap",function(){
				plus.nativeUI.showWaiting();//显示原生等待框
				plus.webview.create("../html/proinforbrow.html",'proinforbrow.html',{},{proid:$info.id});
			})
			
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
 	
 	/*确认接受咨询*/
 	acceptAdvice.addEventListener("tap",function(){
		mui.ajax(baseUrl + '/ajax/consult/agree', {
			data: {
				"consultId": consultId
			}, //咨询ID
			dataType: 'json', //服务器返回json格式数据
			type: 'POST', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			async:false,
			success: function(data) {
				if(data.success){
					console.log(JSON.stringify(data));
					var consultlistPage = plus.webview.getWebviewById('consultlist.html');
						mui.fire(consultlistPage, 'consid', {});	
					plus.nativeUI.showWaiting();//显示原生等待框
					plus.webview.create("../html/chats.html", 'chats.html',{},{'consultId': consultId,'consultantId': consultantId,'num': 1,});
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	})
 	
 	/*婉言谢绝按钮*/
 	declined.addEventListener("tap",function(){
		plus.nativeUI.showWaiting();//显示原生等待框
		plus.webview.create("../html/rejectReason.html", 'rejectReason.html',{},{'consultId': consultId,'consultantId': consultantId});
	})
 	
	plus.nativeUI.closeWaiting();
	plus.webview.currentWebview().show("slide-in-right",150);
})