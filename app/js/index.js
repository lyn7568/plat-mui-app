//首页
var pageIndex = 1; // 页数
var allPages = 1; // 总页数
var table = document.body.querySelector('.list');
var search = document.getElementById("search");

mui.plusReady(function() {
	//plus.nativeUI.showWaiting();
	checkVersion();
})
document.addEventListener("resume", function() {
	checkVersion();
}, false)

function orName() {
	mui.ajax(baseUrl + "/ajax/professor/baseInfo/" + plus.storage.getItem('userid'), {
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000, //超时设置
		success: function(data) {
			if(data.success && data.data) {
				var $info = data.data || {};
				dem($info.id, $info.orgId)
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

function dem(uid, oid) {
	mui.ajax(baseUrl + "/ajax/demand/qc", {
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000, //超时设置
		data: {
			"state": [0, 1],
			"uid": uid,
			"oid": oid
		},
		traditional: true,
		success: function(data) {
			if(data.success) {
				var $data = data.data;
				if($data) {
					mui.openWindow({
						url: '../html/demandPublish.html',
						id: 'demandPublish.html',
						show: {
							autoShow: true,
							aniShow: "slide-in-right"
						}
					});
				} else {
					mui.openWindow({
						url: '../html/sureOrg.html',
						id: 'sureOrg.html',
						show: {
							autoShow: true,
							aniShow: "slide-in-right",
						}
					});
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}
document.getElementById("demandP").addEventListener("tap", function() {
	var userid = plus.storage.getItem('userid');
	if(userid == null) {
		mui.openWindow({
			url: '../html/login.html',
			id: 'login.html'
		})
		return;
	}
	orName()

})
document.getElementById("improfessor").addEventListener("tap", function() {
	var userid = plus.storage.getItem('userid');
	if(userid == null) {
		mui.openWindow({
			url: '../html/login.html',
			id: 'login.html'
		})
		return;
	}
	mui.ajax(baseUrl + "/ajax/professor/auth", {
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000, //超时设置
		data: {
			"id": userid
		},
		success: function(data) {
			if(data.success) {
				var $data = data.data;
				if($data.authType == 1) {
					mui.openWindow({
						url: '../html/needSearch.html',
						id: '../html/needSearch.html',
						show: {
							autoShow: false,
							aniShow: "slide-in-right",
						}
					});
				} else {
					if($data.authStatusExpert == 2) {
						plus.nativeUI.toast("我们正在对您的信息进行认证，请稍等片刻", {
							'verticalAlign': 'center'
						});
					} else if($data.authStatusExpert == 1) {
						plus.nativeUI.toast("我们将尽快对您的信息进行认证", {
							'verticalAlign': 'center'
						});
					} else if($data.authStatusExpert <= 0) {
						if($data.authStatus == 3) {
							mui.openWindow({
								url: '../html/expert-authentication.html',
								id: 'expert-authentication.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-right",
								}
							});
						} else if($data.authStatus == 2) {
							plus.nativeUI.toast("我们正在对您的信息进行认证，请稍等片刻", {
								'verticalAlign': 'center'
							});
						} else if($data.authStatus == 1) {
							plus.nativeUI.toast("我们将尽快对您的信息进行认证", {
								'verticalAlign': 'center'
							});
						} else {
							mui.openWindow({
								url: '../html/realname-authentication2.html',
								id: 'realname-authentication2.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-right",
								}
							});
						}
					}
				}

			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
})

proShow()
resShare()
ruZhuCmp()

mui('#hotPro').on('tap', 'li', function() {
	var id = this.getAttribute("data-id");
	plus.nativeUI.showWaiting(); //显示原生等待框
	webviewShow = plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
		proid: id
	}); 
})
mui('#resShare').on('tap', 'li', function() {
	var id = this.getAttribute("data-id");
	plus.nativeUI.showWaiting(); //显示原生等待框
	webviewShow = plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
		resourceId: id
	}); 
})
mui('#ruZhuCmp').on('tap', 'li', function() {
	var id = this.getAttribute("data-id");
	plus.nativeUI.showWaiting(); //显示原生等待框
	webviewShow = plus.webview.create("../html/cmpInforShow.html", 'cmpInforShow.html', {}, {
		cmpId: id
	}); 
})
document.getElementById("moreRcmp").addEventListener("tap",function(){//查看更多企业
	 plus.nativeUI.showWaiting();
	var web = plus.webview.create("../html/searchListNew2.html?content=2", "../html/searchListNew2.html", {}, {
		key:"",
		qiFlag:6
	}); 
})
document.getElementById("moreShare").addEventListener("tap",function(){//查看更多资源
	 plus.nativeUI.showWaiting();
	var web = plus.webview.create("../html/searchListNew2.html?content=3", "../html/searchListNew2.html", {}, {
		key:"",
		qiFlag:2
	}); 
})
document.getElementById("moreHotp").addEventListener("tap",function(){//查看更多专家
	 plus.nativeUI.showWaiting();
	var web = plus.webview.create("../html/searchListNew2.html?content=1", "../html/searchListNew2.html", {}, {
		key:"",
		qiFlag:1
	}); 
})
///*点击轮播图*/
//mui('.artical-scroll').on('tap', 'a', function() {
//	var articalNum = this.getAttribute("data-title");
//	mui.openWindow({
//		url: '../html/artical_' + articalNum + '.html',
//		id: '../html/artical_' + articalNum + '.html',
//		show: {
//			aniShow: "slide-in-right",
//		}
//	});
//})

/*点击热门领域*/
mui('.gridbg').on('tap', 'li', function() {
	var subject = this.getAttribute("data-title");
	//plus.nativeUI.showWaiting();//显示原生等待框
	//webviewShow = plus.webview.create("../html/search.html",'search.html',{},{subject:subject,bigClass:1});//后台创建webview并打开show.html
	mui.openWindow({
		url: '../html/searchListNew2.html?content=1',
		id: '../html/searchListNew2.html',
		show: {
			//autoShow:false,
			aniShow: "slide-in-right",
		},
		extras: {
			key: subject,
			qiFlag: 1
		}
	});
})

/*页面数据初始化*/
//getOnePase();

//mui.init({
//	pullRefresh: {
//		container: '#pullrefresh',
//		down: {
//			callback: pulldownRefresh
//		},
//		up: {
//			contentrefresh: '正在加载...',
//			//auto:true,
//			//height:100, 
//			callback: pullupRefresh
//		}
//	}
//});
//
//function pullupRefresh() {
//	pageIndex = ++pageIndex;
//	setTimeout(function() {
//		getaData()
//	}, 1000);
//}
//
//function pulldownRefresh() {
//	setTimeout(function() {
//		getOnePase();
//		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
//	}, 1000);
//}
//
//if(mui.os.plus) {
//	mui.plusReady(function() {
//		setTimeout(function() {
//			mui('#pullrefresh').pullRefresh().pulldownLoading();
//		}, 500);
//	});
//} else {
//	mui.ready(function() {
//		mui('#pullrefresh').pullRefresh().pulldownLoading();
//	});
//}

/*获取上拉加载更多数据*/
//function getaData() {
//	mui.plusReady(function() {
//		mui.ajax(baseUrl + '/ajax/professor/pqHot', {
//			data: {
//				"pageNo": pageIndex,
//				"pageSize": 10,
//			},
//			dataType: 'json', //数据格式类型
//			type: 'GET', //http请求类型
//			timeout: 10000,
//			async: false,
//			success: function(data) {
//				if(data.success) {
//					//console.log("成功");
//					var dice1 = data.data.total; //总条数
//					var dice2 = data.data.pageSize; //每页条数
//					var result = '';
//					if(pageIndex == 1) { //下拉刷新需要先清空数据
//						table.innerHTML = ''; // 在这里清空可以防止刷新时白屏
//					}
//					allPages = dice1 / dice2;
//					var datalist = data.data.data;
//					datalistEach(datalist);
//					if(pageIndex < allPages) {
//						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
//					} else {
//						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
//					}
//				}
//			},
//			error: function() {
//				plus.nativeUI.toast("服务器链接超时", toastStyle);
//				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
//			}
//		});
//	});
//}

/*获取第一页数据*/
//function getOnePase() {
//	mui.plusReady(function() {
//		mui.ajax(baseUrl + '/ajax/professor/pqHot', {
//			data: {
//				"pageNo": 1,
//				"pageSize": 10,
//			},
//			dataType: 'json', //数据格式类型
//			type: 'GET', //http请求类型
//			timeout: 10000,
//			async: false,
//			success: function(data) {
//				table.innerHTML = "";
//				if(data.success) {
//					plus.nativeUI.closeWaiting();
//					var datalist = data.data.data;
//					datalistEach(datalist);
//				}
//			},
//			error: function() {
//				plus.nativeUI.toast("服务器链接超时", {
//					'verticalAlign': 'center'
//				});
//			}
//		});
//	});
//}
//
///*数据遍历*/
//function datalistEach(datalist) {
//	mui.each(datalist, function(index, item) {
//
//		/*获取头像*/
//		if(item.hasHeadImage == 1) {
//			var img = baseUrl + "/images/head/" + item.id + "_l.jpg";
//		} else {
//			var img = "../images/default-photo.jpg";
//		}
//
//		/*获取研究方向信息*/
//		var researchAreas = item.researchAreas;
//		var rlist = '';
//		for(var n = 0; n < researchAreas.length; n++) {
//			//console.log(researchAreas[n].caption);
//			rlist += '<span>研究方向：' + researchAreas[n].caption
//			if(n < researchAreas.length - 1) {
//				rlist += " , "
//			}
//			rlist += '</span>';
//		}
//
//		/*获取资源信息*/
//		var resources = item.resources;
//		var zlist = '';
//		for(var m = 0; m < resources.length; m++) {
//			//console.log(resources[m].caption);
//			zlist += '<span>' + resources[m].resourceName
//			if(m < resources.length - 1) {
//				zlist += " , "
//			}
//			zlist += '</span>';
//		}
//
//		var otherIn = "";
//		if(item.title) {
//			if(item.orgName) {
//				otherIn = item.title + "，" + item.orgName;
//			} else {
//				otherIn = item.title;
//			}
//		} else {
//			if(item.office) {
//				if(item.orgName) {
//					otherIn = item.office + "，" + item.orgName;
//				} else {
//					otherIn = item.office;
//				}
//			} else {
//				if(item.orgName) {
//					otherIn = item.orgName;
//				}
//			}
//		}
//
//		var typeTname = '';
//		var oSty = autho(item.authType, item.orgAuth, item.authStatus);
//		typeTname = '<em class="authicon ' + oSty.sty + '"></em>'
//
//		var li = document.createElement('li');
//		li.className = 'mui-table-view-cell flexCenter OflexCenter';
//		li.setAttribute("data-id", item.id);
//		li.innerHTML =
//			'<div class="madiaHead useHead" style="background-image:url(' + img + ')"></div>' +
//			'<div class="madiaInfo">' +
//			'<p><span class="h1Font">' + item.name + typeTname + '</p>' +
//			'<p class="mui-ellipsis h2Font">' + otherIn + '</p>' +
//			'<p class="mui-ellipsis h2Font">' + rlist + '</p>' +
//			//						'<p class="mui-ellipsis h3Font">' + zlist + '</p>' +
//			'</div>';
//
//		table.appendChild(li, table.firstChild);
//
//	});
//}

function ruZhuCmp(){//入驻企业
	mui.ajax(baseUrl+"/ajax/org/find/pq",{
		type: "GET",
		timeout: 10000,
		dataType: "json",
		data:{
			"pageSize": 5,
			"pageNo": 1
		},
		success: function(data) {
			if(data.success) {
				var $info = data.data.data;
				for(var i = 0; i < $info.length; i++) {
					var liStr=document.createElement("li");
					liStr.className="mui-table-view-cell";
					liStr.setAttribute("data-id", $info[i].id);
					document.getElementById("ruZhuCmp").appendChild(liStr);
					var cmpname,imgurl='../images/default-icon.jpg'
					if($info[i].hasOrgLogo) {
						imgurl=baseUrl+'/images/org/' + $info[i].id + '.jpg';
					}
					if($info[i].forShort){
						cmpname = $info[i].forShort;
					}else{
						cmpname = $info[i].name;
					}
					var oSty={sty:"",tit:""};
					if($info[i].authStatus == 3) {
						oSty.sty="authicon-com-ok"
						oSty.tit="科袖认证企业"
					}
					var orgOther = "",orgType="";
					if($info[i].industry) {
						orgOther = $info[i].industry.replace(/,/gi, " | ");
					}
					if($info[i].orgType == "2") {
						orgType = orgTypeShow[$info[i].orgType] + "<span style='margin-right:16px;'></span>";
					}
					var strCon='';
					strCon += '<div class="flexCenter mui-clearfix">'
					strCon += '<div class="madiaHead cmpHead">'
					strCon += '<div class="boxBlock"><img class="boxBlockimg" src="'+imgurl+'"></div></div>'
					strCon += '<div class="madiaInfo OmadiaInfo">'
					strCon += '<div class="h1Font mui-ellipsis">'
					strCon += 	'<span class="qiyego">'+cmpname+'</span>'
					strCon += 	'<span class="authicon '+oSty.sty+'" title="'+oSty.tit+'"></span>'
					strCon += '</div>'
					strCon += '<div class="h2Font mui-ellipsis">'
					strCon += 	'<span>'+orgType+orgOther+'</span>'
					strCon += '</div>'
					strCon += '</div></div>'
					liStr.innerHTML = strCon;
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	})
}
function resShare(){//资源共享
	mui.ajax(baseUrl+"/ajax/resource/firstpq",{
		type: "GET",
		timeout: 10000,
		dataType: "json",
		data:{
			"pageSize":5,
			"pageNo": 1
		},
		success: function(data) {
			if(data.success) {
				var $info = data.data.data;
				for(var i = 0; i < $info.length; i++) {
					var liStr = document.createElement("li");
					liStr.setAttribute("data-id", $info[i].resourceId);
					liStr.className = "mui-table-view-cell";
					document.getElementById("resShare").appendChild(liStr);

					var cmpname,imgurl='../images/default-resource.jpg'
					var oSty={sty:"",tit:""};
					if($info[i].images.length > 0) {
						imgurl=baseUrl+'/data/resource/' + $info[i].images[0].imageSrc 
					}
					if($info[i].resourceType == 1) { //个人资源
						cmpname = $info[i].editProfessor.name;
						oSty = autho($info[i].editProfessor.authType, $info[i].editProfessor.orgAuth, $info[i].editProfessor.authStatus);
					} else if($info[i].resourceType == 2) { //企业资源
						if($info[i].organization.forShort) {
							cmpname = $info[i].organization.forShort;
						}else{
							cmpname = $info[i].organization.name;
						}
						if($info[i].organization.authStatus==3){
							oSty.sty="authicon-com-ok"
							oSty.tit="科袖认证企业"
						}
					}
					
					var strCon='';
					strCon += '<div class="flexCenter mui-clearfix">'
					strCon += '<div class="madiaHead resouseHead" style="background-image:url('+imgurl+')"></div>'
					strCon += '<div class="madiaInfo OmadiaInfo">'
					strCon += '<div class="h1Font mui-ellipsis-2">'+$info[i].resourceName+'</div>'
					strCon += '<div class="h3Font mui-ellipsis">'
					strCon += 	'<span class="qiyego">'+cmpname+'</span>'
					strCon += 	'<span class="authicon '+oSty.sty+'" title="'+oSty.tit+'"></span>'
					strCon += '<div class="mui-ellipsis h2Font">用途：' + $info[i].supportedServices + '</div>'
					strCon += '</div></div>'
					liStr.innerHTML = strCon;
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	})
}
function proShow(){//专家
	mui.ajax(baseUrl+"/ajax/professor/pqBaseInfo",{
		type: "GET",
		timeout: 10000,
		dataType: "json",
		data:{
			"pageSize":5,
			"pageNo": 1
		},
		success: function(data) {
			if(data.success) {
				var $info = data.data.data;
				for(var i = 0; i < $info.length; i++) {
					var liStr = document.createElement("li");
					liStr.setAttribute("data-id", $info[i].id);
					liStr.className = "mui-table-view-cell";
					document.getElementById("hotPro").appendChild(liStr);

					var cmpname,imgurl='../images/default-photo.jpg'
					var oSty=autho($info[i].authType, $info[i].orgAuth, $info[i].authStatus);
					cmpname = $info[i].name;
					if($info[i].hasHeadImage) {
						imgurl=baseUrl+'/images/head/' + $info[i].id + '_l.jpg';
					}
					var oTitle='';
					if($info[i].title) {
						oTitle = $info[i].title;
						if($info[i].orgName){
							oTitle = $info[i].title +'，'+ $info[i].orgName;
						}
					} else {
						if($info[i].office) {
							oTitle = $info[i].office;
							if($info[i].orgName){
								oTitle = $info[i].office +'，'+ $info[i].orgName;
							}
						}
					}
					var oResult=""
					if($info[i].researchAreas.length > 0){
						oResult = '研究方向：';
						for(var n = 0; n < $info[i].researchAreas.length; n++) {
							oResult += $info[i].researchAreas[n].caption
							if(n < $info[i].researchAreas.length - 1) {
								oResult += "；"
							}
						}
					}
					
					var strCon='';
					strCon += '<div class="flexCenter mui-clearfix">'
					strCon += '<div class="madiaHead useHead" style="background-image:url('+imgurl+')"></div>'
					strCon += '<div class="madiaInfo">'
					strCon += '<div class="h1Font mui-ellipsis">'
					strCon += 	'<span class="qiyego">'+cmpname+'</span>'
					strCon += 	'<span class="authicon '+oSty.sty+'" title="'+oSty.tit+'"></span>'
					strCon += '</div>'
					strCon += '<div class="h3Font mui-ellipsis" style="margin-top:0;">'+oTitle+'</div>'
					strCon += '<div class="h3Font mui-ellipsis">'+oResult+'</div>'
					strCon += '</div></div>'
					liStr.innerHTML = strCon;
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	})
}

document.addEventListener('plusready',function(){
    checkArguments();
},false);
// 判断启动方式
function checkArguments(){
    console.log("plus.runtime.launcher: "+plus.runtime.launcher);
    var args= plus.runtime.arguments;
    alert(args)
    if(args){ //处理args参数，如打开新页面等  ekexiu://
    	var argValue,arg_arr,sp_arr,url_sub;
        var url=args.substr(9);
		var n=url.indexOf("?");//使用indexOf()函数进行检索?，返回的是字符串的下标
		var aimPage=url.substring(0,n);//获取目标页面
		var aimPageId=aimPage.substr(8);//获取目标页面id
		//var aimArg=url.substring(n+1,url.indexOf("="));//获取目标参数
		if(n>=0){//使用substr进行截取
		  url_sub=url.substr(n); //表示从n这个位置一直截取到最后 
		  sp_arr=url_sub.split("&");//对截取到的字符串进行分割
		  arg_arr=sp_arr[0].split("=");//对第一个数组中的值进行分割
  		  argValue=arg_arr[1];//得到参数的值
  		  
  		  alert("aimPage="+aimPage+",aimPageId="+aimPageId+",argValue="+argValue)
  		  
  		  var webArg={
  		  	articleId:argValue,
  		  	proid:argValue,
  		  	resourceId:argValue,
  		  	paperId:argValue,
  		  	patentId:argValue,
  		  	cmpId:argValue
  		  };
  		  var aimWeb=plus.webview.create(aimPage, aimPageId, {}, webArg);
  		  	
		}
  
    }
}
// 处理从后台恢复
document.addEventListener('newintent',function(){
    console.log("addEventListener: newintent");
    checkArguments();
},false);


