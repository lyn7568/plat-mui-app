//公共文件
mui.init();
//var baseUrl = "http://www.ekexiu.com",
var baseUrl = "http://192.168.3.233:81",
//var baseUrl = "http:192.168.3.8:80",    
	toastStyle = {
		'verticalAlign': 'top',
	}

function goHome() {
	mui.openWindow({
		url: '../index.html',
		id: '../index.html',
		show: {
			aniShow: "slide-in-right"
		}
	});
}

function goLoginFun() {
	mui.openWindow({
		url: '../html/login.html',
		id: '../html/login.html',
		show: {
			aniShow: "slide-in-bottom"
		}
	});
}


function goRegFun() {
	mui.openWindow({
		url: '../html/reg.html',
		id: '../html/reg.html',
		show: {
			aniShow: "slide-in-bottom"
		}
	});
}

/*校验下一步按钮显示状态*/
function hideButtn(oneName,twoName,threeName,fourName) {
	if(oneName.value == "" || twoName.value == "") {
		threeName.classList.remove(fourName);
		threeName.disabled = "disabled";
	} else {
		threeName.classList.add(fourName);
		threeName.disabled = "";
	}
}

function hideButtn2(oneName,twoName,threeName,fourName,fiveName) {
	if(oneName.value == "" || twoName.value == "" || fiveName.value == "") {
		threeName.classList.remove(fourName);
		threeName.disabled = "disabled";
	} else {
		threeName.classList.add(fourName);
		threeName.disabled = "";
	}
}

//设置系统状态栏背景
plusReady();
function plusReady(){
	mui.plusReady(function(){
		plus.navigator.setStatusBarBackground( "#FF9900" );
	})
}
//处理iOS下弹出软键盘后头部会随页面的滚动条消失问题
function iosheader(){
	mui.plusReady(function(){ 
		plus.webview.currentWebview().setStyle({ softinputMode:"adjustResize" });
	})
}
//判断设备是iOS或者Android系统
function ifiosAmdandroid(test){
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isAndroid){
		 return '0';
	}
	if(isiOS){
		 return '1';
	}
}

/*//遮罩模态框
var promptBlock = document.getElementsByClassName("promptBlock");
var model = mui.createMask(modelClose);//创建遮罩
function modelClose(){
	for(var i=0;i<promptBlock.length;i++){
		promptBlock[i].setAttribute("style","display:none");
	}
}*/

/*标志*/
function autho() {
	if(arguments[0] == 1) {
		return {
			"sty": "authicon-pro",
			"title": "科袖认证专家"
		}
	} else {
		if(arguments[1] == 1) {
			return {
				"sty": "authicon-staff-ok",
				"title": "企业认证员工"
			}
		} else {
			if(arguments[2] == 3) {
				return {
					"sty": "authicon-real",
					"title": "实名认证用户"
				}
			}
		}
	}
}

//用户分享专家到微信后增加积分
function shareAddIntegral(num) {
	var userId = plus.storage.getItem('userid');
	var burl,title;
	if(num==1){
		burl = "/ajax/growth/sharePro";
		title = "成功分享专家信息到微信";
	}else if(num==2){
		burl = "/ajax/growth/shareRes";
		title = "成功分享资源信息到微信";
	}else if(num==3){
		burl = "/ajax/growth/shareArticle";
		title = "成功分享文章信息到微信";
	}
	mui.ajax(baseUrl + burl, {
		dataType: 'json', //数据格式类型
		type: 'POST', //http请求类型
		timeout: 10000, //超时设置
		data: {
			"professorId": userId
		},
		//async: false,
		success: function(data) {
			console.log(data)
			if(data.success && data.data) {
				plus.nativeUI.toast(title, toastStyle);
			} else {
				plus.nativeUI.toast("分享超过10次，不能再获得积分和成长值", toastStyle);
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

