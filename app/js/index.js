//首页
var pageIndex = 1; // 页数
var allPages = 1; // 总页数
var table = document.body.querySelector('.list');
var search = document.getElementById("search");

mui.plusReady(function() {
	plus.nativeUI.showWaiting();
	checkVersion();
})
function checkVersion(){
		mui.plusReady(function(){
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
						console.log(JSON.stringify(data));
						if (data.version > wgtVer) {
							var btn = ["确定更新", "取消更新"];
							mui.confirm("检测到新版本，是否更新？", "提示", btn, function(e) {
								if(e.index == 0) {
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
							plus.nativeUI.toast("您使用的是最新版本，请放心使用！", toastStyle);
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
document.getElementById("demandP").addEventListener("tap", function() {
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
				if($data.authStatus == 3) {
					var oDa = {};
					oDa.flag = ($data.orgAuth == 0) ? 1 : 0;
					mui.openWindow({
						url: '../html/needIssue.html',
						id: '../html/needIssue.html',
						show: {
							autoShow: false,
							aniShow: "slide-in-right",
						},
						extras: oDa
					});
				} else {
					if($data.orgAuth == 1) {
						mui.openWindow({
							url: '../html/needIssue.html',
							id: '../html/needIssue.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-right",
							}
						});
					} else {
						if($data.authStatus == 2) {
							plus.nativeUI.toast("我们正在对您的信息进行认证，请稍等片刻", {
								'verticalAlign': 'center'
							});
						} else if($data.authStatus == 1) {
							plus.nativeUI.toast("我们将尽快对您的信息进行认证", {
								'verticalAlign': 'center'
							});
						} else if($data.authStatus <= 0) {
							mui.openWindow({
								url: '../html/realname-authentication.html',
								id: 'realname-authentication.html',
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
mui('.list').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		var userid = plus.storage.getItem('userid');
		console.log(id);
		plus.nativeUI.showWaiting(); //显示原生等待框
		webviewShow = plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
			proid: id
		}); //后台创建webview并打开show.html
	})
	/*点击轮播图*/
mui('.artical-scroll').on('tap', 'a', function() {
	var articalNum = this.getAttribute("data-title");
	mui.openWindow({
		url: '../html/artical_' + articalNum + '.html',
		id: '../html/artical_' + articalNum + '.html',
		show: {
			aniShow: "slide-in-right",
		}
	});
})

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
getOnePase();

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			//auto:true,
			//height:100, 
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	pageIndex = ++pageIndex;
	setTimeout(function() {
		getaData()
	}, 1000);
}

function pulldownRefresh() {
	setTimeout(function() {
		getOnePase();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}, 1000);
}

if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pulldownLoading();
		}, 500);
	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pulldownLoading();
	});
}

/*获取上拉加载更多数据*/
function getaData() {
	mui.plusReady(function() {
		mui.ajax(baseUrl + '/ajax/professor/pqHot', {
			data: {
				"pageNo": pageIndex,
				"pageSize": 10,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success) {
					//console.log("成功");
					var dice1 = data.data.total; //总条数
					var dice2 = data.data.pageSize; //每页条数
					var result = '';
					if(pageIndex == 1) { //下拉刷新需要先清空数据
						table.innerHTML = ''; // 在这里清空可以防止刷新时白屏
					}
					allPages = dice1 / dice2;
					var datalist = data.data.data;
					datalistEach(datalist);
					if(pageIndex < allPages) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}
		});
	});
}

/*获取第一页数据*/
function getOnePase() {
	mui.plusReady(function() {
		mui.ajax(baseUrl + '/ajax/professor/pqHot', {
			data: {
				"pageNo": 1,
				"pageSize": 10,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				table.innerHTML = "";
				if(data.success) {
					plus.nativeUI.closeWaiting();
					var datalist = data.data.data;
					datalistEach(datalist);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", {
					'verticalAlign': 'center'
				});
			}
		});
	});
}

/*数据遍历*/
function datalistEach(datalist) {
	mui.each(datalist, function(index, item) {

		/*获取头像*/
		if(item.hasHeadImage == 1) {
			var img = baseUrl + "/images/head/" + item.id + "_l.jpg";
		} else {
			var img = "../images/default-photo.jpg";
		}

		/*获取研究方向信息*/
		var researchAreas = item.researchAreas;
		var rlist = '';
		for(var n = 0; n < researchAreas.length; n++) {
			//console.log(researchAreas[n].caption);
			rlist += '<span>' + researchAreas[n].caption
			if(n < researchAreas.length - 1) {
				rlist += " , "
			}
			rlist += '</span>';
		}

		/*获取资源信息*/
		var resources = item.resources;
		var zlist = '';
		for(var m = 0; m < resources.length; m++) {
			//console.log(resources[m].caption);
			zlist += '<span>' + resources[m].resourceName
			if(m < resources.length - 1) {
				zlist += " , "
			}
			zlist += '</span>';
		}

		var otherIn = "";
		if(item.title) {
			if(item.orgName) {
				otherIn = item.title + "，" + item.orgName;
			} else {
				otherIn = item.title;
			}
		} else {
			if(item.office) {
				if(item.orgName) {
					otherIn = item.office + "，" + item.orgName;
				} else {
					otherIn = item.office;
				}
			} else {
				if(item.orgName) {
					otherIn = item.orgName;
				}
			}
		}

		var typeTname = '';
		var oSty = autho(item.authType, item.orgAuth, item.authStatus);
		typeTname='<em class="authicon ' + oSty.sty + '"></em>'


		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.setAttribute("data-id", item.id);
		li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">'+
					'<div class="madiaHead useHead" style="background-image:url(' + img + ')"></div>'+
					'<div class="madiaInfo">'+
						'<p><span class="h1Font">' + item.name + typeTname + '</p>'+
						'<p class="mui-ellipsis h2Font">'+ otherIn +'</p>'+
						'<p class="mui-ellipsis h3Font">' + rlist + '</p>' +
						'<p class="mui-ellipsis h3Font">' + zlist + '</p>' +
					'</div></div>';

		table.appendChild(li, table.firstChild);

	});
}