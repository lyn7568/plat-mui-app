//公共文件
mui.init();
var baseUrl = "http://www.ekexiu.com",
//var baseUrl = "http://192.168.3.233",
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

