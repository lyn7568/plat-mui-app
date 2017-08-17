//公共文件
mui.init();
var baseUrl = "http://www.ekexiu.com",
//var baseUrl = "http://192.168.3.233",
//var baseUrl = "http:192.168.3.233:81",    
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
			aniShow: "slide-in-right"
		}
	});
}


function goRegFun() {
	mui.openWindow({
		url: '../html/reg.html',
		id: '../html/reg.html',
		show: {
			aniShow: "slide-in-right"
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
			}else{
					return {
						"sty": "e",
						"title": " "
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
		title = "成功分享专家信息";
	}else if(num==2){
		burl = "/ajax/growth/shareRes";
		title = "成功分享资源信息";
	}else if(num==3){
		burl = "/ajax/growth/shareArticle";
		title = "成功分享文章信息";
	}else if(num==4){
		burl = "/ajax/growth/shareOrg";
		title = "成功分享企业信息";
	}
	else if(num==5){
		burl = "/ajax/growth/sharePatent";
		title = "成功分享专利信息";
	}
	else if(num==6){
		burl = "/ajax/growth/sharePaper";
		title = "成功分享论文信息";
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
				plus.nativeUI.toast(title, toastStyle);
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

//时间显示规则
function commenTime(startTime){
	var nowTimg =  new Date();
	var startdate = new Date(); 
	startdate.setFullYear(parseInt(startTime.substring(0,4)));
	startdate.setMonth(parseInt(startTime.substring(4,6))-1);
	startdate.setDate(parseInt(startTime.substring(6,8)));
	startdate.setHours(parseInt(startTime.substring(8,10)));
	startdate.setMinutes(parseInt(startTime.substring(10,12)));
	startdate.setSeconds(parseInt(startTime.substring(12,14)));
	var date3=nowTimg.getTime()-startdate.getTime();  //时间差的毫秒数
    var hours = parseInt((date3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((date3 % (1000 * 60 * 60)) / (1000 * 60));
    if(date3 < 60000){
    	return "刚刚";
    }else if(date3 >= 60000 && date3 < 3600000){
    	return minutes + "分钟前";
    }else if(date3 >= 3600000 && date3 < 86400000){
    	return hours + "小时前";
    }else if(date3 >= 86400000) {

		if(nowTimg.getFullYear() == startTime.substring(0, 4)) {

			return startTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + startTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
		} else {

			return startTime.substring(0, 4) + "年" + startTime.substring(4, 6).replace(/\b(0+)/gi, "") + "月" + startTime.substring(6, 8).replace(/\b(0+)/gi, "") + "日 " + startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
		}
	}
  
}
/*时间转换*/
function TimeTr(dealtime) {
	var myDate = new Date();
	var s = dealtime;
	var y = s.substr(0, 4);
	var m = s.substr(4, 2);
	var d = s.substr(6, 2);
	var h = s.substr(8, 2);
	var minute = s.substr(10, 2);
	var formatTime;
	if(s.length <= 6) {
		formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月";
	} else if(s.length > 6 && s.length <= 8) {
		formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 ";
	} else {
		formatTime = m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 " + h + ":" + minute;
		if(y != myDate.getFullYear()) {
			formatTime = y + "年" + m.replace(/\b(0+)/gi, "") + "月" + d.replace(/\b(0+)/gi, "") + "日 " + h + ":" + minute;
		}
	}
	return formatTime;
}
//企业规模
var orgSizeShow = {
	'1': '50人以内',
	'2': '50-100人',
	'3': '100-200人',
	'4': '200-500人',
	'5': '500-1000人',
	'6': '1000人以上'
}
//企业类型
var orgTypeShow = {
	"2": "上市企业",
	"3": "外资企业",
	"4": "合资企业",
	"5": "独资企业",
	"6": "个体经营",
	"7": "政府机构",
	"8": "公益组织",
	"9": "协会学会",
	"10": "新闻媒体",
	"11": "教育机构",
	"undefined":""
}
//学位
var eduDegree = {
	"1": "博士",
	"2": "硕士",
	"3": "学士",
	"4": "大专",
	"5": "其他"
}

/*判断是否收藏资源文章或者是否关注专家*/
function ifcollectionAbout(watchObject,sel, num,flag) {
	var that=sel;
	console.log(JSON.stringify(that))
	mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
		data: {
			"professorId": plus.storage.getItem('userid'),
			"watchObject": watchObject
		},
		dataType: 'json', //数据格式类型
		type: 'get', //http请求类型
		timeout: 10000,
		async: false,
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.success && data.data != null) {
				if(num=="1" || num == "6"){//已关注专家
					if(flag==1){
						that.classList.add("attenedSpan");
						that.innerText="已关注";
					}else{
						that.classList.remove("icon-shoucang");
						that.classList.add("icon-yishoucang");
					}
				}else{//已收藏资源或文章
					that.classList.remove("icon-shoucang");
					that.classList.add("icon-yishoucang");
				}
			} else {
				if(num=="1" || num == "6"){//关注专家
					if(flag==1){
						that.classList.remove("attenedSpan");
						that.innerText="关注";
					}else{
						that.classList.add("icon-shoucang");
						that.classList.remove("icon-yishoucang");
					}
				}else{//收藏资源或文章
					that.classList.add("icon-shoucang");
					that.classList.remove("icon-yishoucang");
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}

/*收藏资源、文章或者关注专家*/
function collectionAbout(watchObject,sel, num,flag) {
	var that=sel;
	mui.ajax(baseUrl + '/ajax/watch', {
		data: {
			"professorId": plus.storage.getItem('userid'),
			"watchObject": watchObject,
			"watchType": num
		},
		dataType: 'json', //数据格式类型
		type: 'POST', //http请求类型
		timeout: 10000,
		async: false,
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.success) {
				if(num=="1" || num == "6"){//关注专家
					if(flag==1){
						that.classList.add("attenedSpan");
						that.innerText="已关注";
					}else{
						that.classList.remove("icon-shoucang");
						that.classList.add("icon-yishoucang");
					}
					plus.nativeUI.toast("关注成功", toastStyle);
				}else{//收藏资源或文章
					that.classList.remove("icon-shoucang");
					that.classList.add("icon-yishoucang");
					plus.nativeUI.toast("收藏成功", toastStyle);
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}

/*取消收藏资源、文章或者取消关注专家*/
function cancelCollectionAbout(watchObject,sel, num,flag) {
	var that=sel;
	mui.ajax({
		url: baseUrl + '/ajax/watch/delete',
		data: {
			professorId: plus.storage.getItem('userid'),
			watchObject: watchObject
		},
		dataType: 'json', //数据格式类型
		type: 'post', //http请求类型
		timeout: 10000,
		async: true,
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.success) {
				if(num=="1" || num == "6"){//关注专家
					if(flag==1){
						that.classList.remove("attenedSpan");
						that.innerText="关注";
					}else{
						that.classList.add("icon-shoucang");
						that.classList.remove("icon-yishoucang");
					}
					plus.nativeUI.toast("已取消关注", toastStyle);
				}else{//收藏资源或文章
					that.classList.add("icon-shoucang");
					that.classList.remove("icon-yishoucang");
					plus.nativeUI.toast("已取消收藏", toastStyle);
				}
				
			}
		},
		error: function(data) {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});

}
function checkVersion(){
		mui.plusReady(function(){
			if(!plus.webview.currentWebview()) return;
			// 获取本地应用资源版本号
		    plus.runtime.getProperty(plus.runtime.appid,function(inf){
			    wgtVer=inf.version;
			    console.log("当前应用版本："+wgtVer);
			    mui.ajax(baseUrl + "/data/manager/version.json", {
					dataType: 'json', //数据格式类型
					type: 'GET', //http请求类型
					timeout: 10000, //超时设置
					async: false,
					success: function(data) {
						if (data.version > wgtVer) {
							var btn = ["立即更新", "取消更新"];
							mui.confirm("新版本上线了，为了不影响您的正常使用，赶快更新吧", "提示", btn, function(e) {
								if(e.index == 0) {
									if(mui.os.ios) {
										plus.runtime.openURL('https://itunes.apple.com/cn/app/ke-xiu-da-jian-qi-ye-yu-zhuan/id1197110983?l=en&mt=8');
										return;
									}
								try {
									     plus.nativeUI.showWaiting("检测更新...");
									     //var d="http://192.168.3.233/download/app1.0.6.apk";
										 plus.downloader.createDownload( data.wgt, {filename:"_doc/update/"}, function(d,status){
									        if ( status == 200 ) { 
									            plus.runtime.install(d.filename, {}, function() {
													console.log("安装新版本文件成功！");
													/*plus.nativeUI.alert("应用资源更新完成,程序需要立即重启", function() {
														plus.runtime.restart();
													});*/
												}, function(e) {
													console.log("安装新版文件失败[" + e.code + "]：" + e.message);
													plus.nativeUI.toast("安装新版文件失败[" + e.code + "]：" + e.message);
												});
									            
									        } else {
									            console.log("下载新版本失败！");
									            plus.nativeUI.toast("下载新版本失败！");
									        }
							       			plus.nativeUI.closeWaiting();
							    		}).start();
						    		} catch (e) {
										console.log(e.message);
									}	
								}
							});
						}else{
							//plus.nativeUI.toast("您使用的是最新版本，请放心使用！", toastStyle);
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				});
			});
		})
	}

