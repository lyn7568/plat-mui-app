//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});
var subject = "",
	industry = "",
	address = "",
	pageSize = 20,
	pageNo = {
		ex: 1,
		co: 1,
		rs: 1,
		pt: 1,
		pp: 1,
		ar: 1
	},
	authType = 1,
	flag = 1,
	key1 = [],
	key2 = [1, 1, 1, 1, 1, 1],
	key3 = {
		subject: subject,
		industry: industry,
		address: address,
	};
mui.ready(function() {
	mui.plusReady(function() {
		var oWidth=getViewportSize ().width;
function getViewportSize () {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}
for(var n=0;n<6;n++) {
	document.getElementsByClassName("mui-control-item")[n].style.paddingLeft=(oWidth-4.5*45)/9+"px";
	document.getElementsByClassName("mui-control-item")[n].style.paddingRight=(oWidth-4.5*45)/9+"px";
}

		document.getElementById("searchval").value = plus.webview.currentWebview().key;
		var inputVlue = document.getElementById("searchval").value;
		var baseValue = plus.webview.currentWebview().key
		var obj = {
			ex: baseValue,
			co: baseValue,
			rs: baseValue,
			pt: baseValue,
			pp: baseValue,
			ar: baseValue
		}
		var webview = plus.webview.currentWebview();
		var tabFlag = webview.qiFlag;
		var search = {
			oAjaxGet: function(url, obj, oType, oFun) {
				mui.plusReady(function() {
					mui.ajax(url, {
						data: obj,
						dataType: 'json', //服务器返回json格式数据
						type: oType, //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						traditional: true,
						async: false,
						success: function(data) {
							if(data.success) {
								oFun(data.data);
							}
						},
						error: function(xhr, type, errorThrown) {
							//异常处理；
							plus.nativeUI.toast("服务器链接超时", toastStyle);
						}
					});
				})

			},
			oExeprt: function(data) {
				if(key2[0] == 1) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == 0) {
							key1[0] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == 0) {
												search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
													"key": obj.ex,
													"subject": subject,
													"industry": industry,
													"address": address,
													"authType": authType,
													"pageSize": pageSize,
													"pageNo": ++pageNo.ex
												}, "get", search.oExeprt, self);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[0] = 2;
				}
				document.getElementById('noSearch').classList.add("displayNone");
				if(flag == 1) {
					document.getElementById("list").innerHTML = "";
					if(data.data.length == 0) {
						key1[0].endPullUpToRefresh(true);
						document.getElementById("list").innerHTML = "";
						document.getElementById('noSearch').classList.remove("displayNone");
						return;
					}
					if(pageNo.ex < Math.ceil(data.total / data.pageSize)) {
						key1[0].endPullUpToRefresh(false);
					} else {
						key1[0].endPullUpToRefresh(true);
					}
					flag = 2;

				} else {
					if(data.data.length == 0) {
						key1[0].endPullupToRefresh(true);
						return;
					}
					if(pageNo.ex < Math.ceil(data.total / data.pageSize)) {
						key1[0].endPullUpToRefresh(false);
					} else {
						key1[0].endPullUpToRefresh(true);
					}
				}
				for(var i = 0; i < data.data.length; i++) {
					var li = document.createElement("li");
					var userType = autho(data.data[i].authType, data.data[i].orgAuth, data.data[i].authStatus);
					var os = "";
					if(data.data[i].title) {
						if(data.data[i].orgName) {
							os = data.data[i].title + "，" + data.data[i].orgName;
						} else {
							os = data.data[i].title;
						}
					} else {
						if(data.data[i].office) {
							if(data.data[i].orgName) {
								os = data.data[i].office + "，" + data.data[i].orgName;
							} else {
								os = data.data[i].office;
							}
						} else {
							if(data.data[i].orgName) {
								os = data.data[i].orgName;
							}
						}
					}
					var baImg = "../images/default-photo.jpg";
					if(data.data[i].hasHeadImage == 1) {
						baImg = baseUrl + "/images/head/" + data.data[i].id + "_l.jpg";
					}
					var oSub = "";
					if(data.data[i].researchAreas.length) {
						var arr = [];
						for(var n = 0; n < data.data[i].researchAreas.length; n++) {
							arr[n] = data.data[i].researchAreas[n].caption;
						}
						oSub = "研究方向：" + arr.join(",");
					}
					li.setAttribute("data-id", data.data[i].id);
					li.setAttribute("data-flag", 1);
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter mui-clearfix">' +
						' <div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
						'<div class="madiaInfo">' +
						'<p><span class="h1Font">' + data.data[i].name + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
						'<p class="mui-ellipsis h2Font">' + os + '</p>' +
						'<p class="mui-ellipsis h2Font">' + oSub + '</p>' +
						'</div>' +
						'</div>'
					document.getElementById("list").appendChild(li);
				}
			},
			createWin: function() {
				mui.openWindow({
					url: '../html/searchFilters.html',
					id: '../html/searchFilters.html',
					show: {
						autoShow: false,
						aniShow: "fade-in",
					},
					extras: {
						subject: subject,
						industry: industry,
						address: address
					}
				});
			},
			resource: function(data) {
				if(key2[2] == 1) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == 2) {
							key1[2] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == 2) {
												search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
													"key": obj.rs,
													"pageSize": pageSize,
													"pageNo": ++pageNo.rs
												}, "get", search.resource);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[2] = 2;
				}
				document.getElementById('reNoSearch').classList.add("displayNone");
				var $da = data.data;
				if(flag == 1) {
					document.getElementById("resourceList").innerHTML = ""
					if(data.data.length == 0) {
						//key1[2].endPullupToRefresh(true);
						key1[2].endPullUpToRefresh(true);
						document.getElementById('reNoSearch').classList.remove("displayNone");
						return;
					}
					if(pageNo.rs < Math.ceil(data.total / data.pageSize)) {
						//key1[2].endPullupToRefresh(false);
						key1[2].endPullUpToRefresh(false);
					} else {
						key1[2].endPullUpToRefresh(true);
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('reNoSearch').classList.remove("displayNone");
						key1[2].endPullupToRefresh(true);
						return;
					}
					if(pageNo.rs < Math.ceil(data.total / data.pageSize)) {
						key1[2].endPullUpToRefresh(false);
					} else {
						key1[2].endPullUpToRefresh(true);
					}
				}
				for(var i = 0; i < $da.length; i++) {
					var $data = $da[i];
					var namepo, userType;
					if($data.resourceType == 1) {
						namepo = $data.editProfessor.name;
						userType = autho($data.editProfessor.authType, $data.editProfessor.orgAuth, $data.editProfessor.authStatus);
					} else {
						userType = {};
						if($data.organization.forShort){
							namepo = $data.organization.forShort;
						}else{
							namepo = $data.organization.name;
						}
						if($data.organization.authStatus == 3) {
							userType.sty = "authicon-com-ok"
						} else {
							userType.sty = "e"
						}
					}
					var rImg = "../images/default-resource.jpg";
					if($data.images.length) {
						rImg = baseUrl + "/data/resource/" + $data.images[0].imageSrc;
					}
					var li = document.createElement("li");
					li.setAttribute("data-id", $data.resourceId);
					li.setAttribute("data-flag", 2);
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + $data.resourceName + '</p>' +
						'<p class="mui-ellipsis h2Font">用途：' + $data.supportedServices + '</p>' +
						'<p><span class="h2Font">' + namepo + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
						'</div>' +
						'</div>'
					document.getElementById("resourceList").appendChild(li);
				}

			},
			article: function(data) {
				if(key2[5] == 1) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == 5) {
							key1[5] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == 5) {
												search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
													"key": obj.ar,
													"pageSize": pageSize,
													"pageNo": ++pageNo.ar
												}, "get", search.article);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[5] = 2;
				}
				document.getElementById('arNoSearch').classList.add("displayNone");
				var $data = data.data;
				if(flag == 1) {
					document.getElementById("articleList").innerHTML = ""
					if(data.data.length == 0) {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[5].endPullUpToRefresh(true);
						document.getElementById('arNoSearch').classList.remove("displayNone");
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[5].endPullUpToRefresh(false);

					} else {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[5].endPullUpToRefresh(true);
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('arNoSearch').classList.remove("displayNone");
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[5].endPullUpToRefresh(true);
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[5].endPullUpToRefresh(false);
					} else {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[5].endPullUpToRefresh(false);
					}
				}
				for(var i = 0; i < $data.length; i++) {
					var of ;
					if($data[i].articleType == 1) { of = 1;
					} else { of = 2;
					}
					var arImg = "../images/default-artical.jpg";
					if($data[i].articleImg) {
						arImg = baseUrl + "/data/article/" + $data[i].articleImg
					}
					var title = $data[i].articleTitle;
					var name = ""
					var li = document.createElement("li");
					if( of == 1) {
						var userType = autho($data[i].professor.authType, $data[i].professor.orgAuth, $data[i].professor.authStatus);
						li.setAttribute("owner-id", $data[i].professor.id);
						li.setAttribute("data-type", 1);
						name = $data[i].professor.name;
					} else {
						var userType = {};
						if($data[i].editOrganization.authStatus == 3) {
							userType.sty = 'authicon-com-ok'
						} else {
							userType.sty = "e"
						}
						li.setAttribute("owner-id", $data[i].editOrganization.id);
						li.setAttribute("data-type", 2);
						if($data[i].editOrganization.forShort){
							name = $data[i].editOrganization.forShort;
						}else{
							name = $data[i].editOrganization.name;
						}
					}
					li.setAttribute("data-id", $data[i].articleId);
					li.setAttribute("data-flag", 3);
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						'<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis-2 h1Font">' + title + '</p>' +
						'<p><span class="h2Font">' + name + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
						'</div>' +
						'</div>'
					document.getElementById("articleList").appendChild(li);

				}
			},
			patent: function(data) {
				
				if(key2[3] == 1) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == 3) {
							key1[3] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == 3) {
												search.oAjaxGet(baseUrl + "/ajax/ppatent/pq", {
													"qw": obj.pt,
													"pageSize": pageSize,
													"pageNo": ++pageNo.pt
												}, "get", search.patent);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[3] = 2;
				}
				document.getElementById('ptNoSearch').classList.add("displayNone");
				var $data = data.data;
				if(flag == 1) {
					document.getElementById("patentList").innerHTML = ""
					if(data.data.length == 0) {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[3].endPullUpToRefresh(true);
						document.getElementById('ptNoSearch').classList.remove("displayNone");
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[3].endPullUpToRefresh(false);

					} else {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[3].endPullUpToRefresh(true);
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('ptNoSearch').classList.remove("displayNone");
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[3].endPullUpToRefresh(true);
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[3].endPullUpToRefresh(false);
					} else {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[3].endPullUpToRefresh(false);
					}
				}
				for(var i = 0; i < $data.length; i++) {
					var li = document.createElement("li");
					li.setAttribute("data-id", $data[i].id);
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						'<div class="madiaHead patentHead"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + $data[i].name + '</p>' +
						'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
						'</div>' +
						'</div>'
					document.getElementById("patentList").appendChild(li);
				}
			},
			paper: function(data) {
				if(key2[4] == 1) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == 4) {
							key1[4] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == 4) {
												search.oAjaxGet(baseUrl + "/ajax/ppaper/pq", {
													"qw": obj.pp,
													"pageSize": pageSize,
													"pageNo": ++pageNo.pp
												}, "get", search.paper);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[4] = 2;
				}
				document.getElementById('ppNoSearch').classList.add("displayNone");
				var $data = data.data;
				if(flag == 1) {
					document.getElementById("paperList").innerHTML = ""
					if(data.data.length == 0) {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[4].endPullUpToRefresh(true);
						document.getElementById('ppNoSearch').classList.remove("displayNone");
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[4].endPullUpToRefresh(false);

					} else {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[4].endPullUpToRefresh(true);
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('ppNoSearch').classList.remove("displayNone");
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[4].endPullUpToRefresh(true);
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[4].endPullUpToRefresh(false);
					} else {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[4].endPullUpToRefresh(false);
					}
				}
				for(var i = 0; i < $data.length; i++) {
					var li = document.createElement("li");
					li.setAttribute("data-id", $data[i].id);
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						'<div class="madiaHead artHead"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + $data[i].name + '</p>' +
						'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
						'</div>' +
						'</div>'
					document.getElementById("paperList").appendChild(li);
				}
			},
			company: function(data) {
				if(key2[1] == 1) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == 1) {
							key1[1] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == 1) {
												search.oAjaxGet(baseUrl + "/ajax/org/find/pq", {
													"kw": obj.co,
													"pageSize": pageSize,
													"pageNo": ++pageNo.co
												}, "get", search.company);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[1] = 2;
				}
				document.getElementById('coNoSearch').classList.add("displayNone");
				var $data = data.data;
				if(flag == 1) {
					document.getElementById("companyList").innerHTML = ""
					if(data.data.length == 0) {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[1].endPullUpToRefresh(true);
						document.getElementById('coNoSearch').classList.remove("displayNone");
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[1].endPullUpToRefresh(false);

					} else {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						key1[1].endPullUpToRefresh(true);
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('coNoSearch').classList.remove("displayNone");
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[1].endPullUpToRefresh(true);
						return;
					}
					if(data.pageNo < Math.ceil(data.total / data.pageSize)) {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)
						key1[1].endPullUpToRefresh(false);
					} else {
						//mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
						key1[1].endPullUpToRefresh(false);
					}
				}
				for(var i = 0; i < $data.length; i++) {
					var li = document.createElement("li");
					li.setAttribute("data-id", $data[i].id);
					var oimg = ($data[i].hasOrgLogo) ? baseUrl + "/images/org/" + $data[i].id + ".jpg" : "../images/default-icon.jpg";
					var oAuth = ($data[i].authStatus == 3) ? 'authicon-com-ok' : '';
					var orgName = ($data[i].forShort) ? $data[i].forShort : $data[i].name;
					var orgType = ($data[i].orgType == '2') ? "上市企业" : "";
					var orgOther = ($data[i].industry) ? $data[i].industry.replace(/,/gi, " | ") : "";
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						'<div class="madiaHead companyHead">' +
						'<div class="boxBlock"><img class="boxBlockimg companyImg" src="' + oimg + '"></div>' +
						'</div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + orgName + '<em class="authicon ' + oAuth + '" title="科袖认证企业"></em></p>' +
						'<p class="mui-ellipsis h2Font"><span id="">' + orgType + '</span> <span id="">' + orgOther + '</span></p>' +
						'</div>' +
						'</div>'

					document.getElementById("companyList").appendChild(li);
				}
			}
		}
		if(webview.qiFlag == 1) {
			document.getElementById("searchval").setAttribute("placeholder", "请输入专家姓名、机构、研究方向");
			document.getElementById("sele").classList.remove("displayNone");
			document.getElementById("searB").classList.add("searchboxNewT");
			search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
				"key": obj.ex,
				"subject": subject,
				"industry": industry,
				"address": address,
				"authType": authType,
				"pageSize": pageSize,
				"pageNo": pageNo.ex
			}, "get", search.oExeprt);
		} else if(webview.qiFlag == 2) {
			document.getElementById("searchval").setAttribute("placeholder", "输入资源名称、用途、机构或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");
			search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
				"key": obj.rs,
				"pageSize": pageSize,
				"pageNo": pageNo.rs
			}, "get", search.resource);
		} else if(webview.qiFlag == 3) {
			document.getElementById("searchval").setAttribute("placeholder", "输入文章标题、作者或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");
			search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
				"key": obj.ar,
				"pageSize": pageSize,
				"pageNo": pageNo.ar
			}, "get", search.article);
		} else if(webview.qiFlag == 4) {
			document.getElementById("searchval").setAttribute("placeholder", "输入专利名称、发明人、专利号或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");	
			
			search.oAjaxGet(baseUrl + "/ajax/ppatent/pq", {
				"qw": obj.pt,
				"pageSize": pageSize,
				"pageNo": pageNo.pt
			}, "get", search.patent);
		} else if(webview.qiFlag == 5) {
			document.getElementById("searchval").setAttribute("placeholder", "输入论文题目、作者或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");	
			search.oAjaxGet(baseUrl + "/ajax/ppaper/pq", {
				"qw": obj.pp,
				"pageSize": pageSize,
				"pageNo": pageNo.pp
			}, "get", search.paper);
		} else if(webview.qiFlag == 6) {
			document.getElementById("searchval").setAttribute("placeholder", "输入企业名称、产品名称或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");	
			search.oAjaxGet(baseUrl + "/ajax/org/find/pq", {
				"kw": obj.co,
				"pageSize": pageSize,
				"pageNo": pageNo.co
			}, "get", search.company);
		}

		//跳转专家浏览页面
		mui("#list").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
				proid: id
			});
		})
		mui("#resourceList").on("tap", "li", function() {
			var resouId = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
				resourceId: resouId
			});
		})
		mui("#articleList").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			var datatype = this.getAttribute("data-type");
			var ownerid = this.getAttribute("owner-id");
			if(datatype == 1) {
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id,
					ownerid: ownerid,
				});
			} else if(datatype == 2) {
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id,
					ownerid: ownerid,
					oFlag: 1
				});
			}
		})
		mui("#paperList").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/paperShow.html", 'paperShow.html', {}, {
				"paperId": id
			});
		})
		mui("#patentList").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/patentShow.html", 'patentShow.html', {}, {
				"patentId": id
			});
		})
		mui("#companyList").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/cmpInforShow.html", 'cmpInforShow.html', {}, {
				"cmpId": id
			});
		})
		//找专家搜索条件及自定义事件
		document.getElementById("sele").addEventListener("tap", function() {
			search.createWin();
		})
		/*自定义事件*/
		window.addEventListener("newId", function(event) {
			var arry = event.detail.arry;
			var m=0;
			for(var i in arry) {
				if(arry[i]){
					m++;
				}
			}
			if(m){
				document.getElementById('seler').style.display="block";
				document.getElementById("sele").getElementsByTagName("span")[0].innerHTML=m;
			}else{
				document.getElementById('seler').style.display="none";
			}
				
			if(key3.subject == arry[1] && key3.industry == arry[2] && key3.address == arry[0]) {
				return;
			}
			subject = arry[1],
				key3.subject = arry[1],
				industry = arry[2],
				key3.industry = arry[2],
				address = arry[0],
				key3.address = arry[0],
				pageNo.ex = 1,
				flag = 1;
			key1[0].refresh(true);
			search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
				"key": obj.ex,
				"subject": subject,
				"industry": industry,
				"address": address,
				"authType": authType,
				"pageSize": pageSize,
				"pageNo": pageNo.ex
			}, "get", search.oExeprt);
		})
		document.getElementById("searchval").addEventListener("keyup", function() {
			var e = event || window.event || arguments.caller.arguments[0];
			if(e.keyCode == 13) {
				var searchval = document.getElementById("searchval").value;
				if(tabFlag == 1) {
					if(obj.ex != searchval) {
						flag = 1;
						obj.ex = searchval;
						key1[0].refresh(true);
						pageNo.ex = 1,
							search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
								"key": obj.ex,
								"subject": subject,
								"industry": industry,
								"address": address,
								"authType": authType,
								"pageSize": pageSize,
								"pageNo": pageNo.ex
							}, "get", search.oExeprt);
					}
				} else if(tabFlag == 2) {
					if(obj.rs != searchval) {
						key1[2].refresh(true);
						obj.rs = searchval
						pageNo.rs = 1;
						flag = 1;
						obj.rs = searchval;
						search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
							"key": obj.rs,
							"pageSize": pageSize,
							"pageNo": pageNo.rs
						}, "get", search.resource);
					}
				} else if(tabFlag == 3) {
					if(obj.ar != searchval) {
						key1[5].refresh(true);
						obj.ar = searchval
						pageNo.ar = 1;
						flag = 1;
						obj.ar = searchval;
						search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
							"key": obj.ar,
							"pageSize": pageSize,
							"pageNo": pageNo.ar
						}, "get", search.article);
					}
				} else if(tabFlag == 4) {
					
					if(obj.pt != searchval) {
						key1[3].refresh(true);
						pageNo.pt = 1;
						flag = 1;
						obj.pt = searchval;
						search.oAjaxGet(baseUrl + "/ajax/ppatent/pq", {
							"qw": obj.pt,
							"pageSize": pageSize,
							"pageNo": pageNo.pt
						}, "get", search.patent);
					}

				} else if(tabFlag == 5) {
					if(obj.pp != searchval) {
						key1[4].refresh(true);
						pageNo.pp = 1;
						flag = 1;
						obj.pp = searchval;
						search.oAjaxGet(baseUrl + "/ajax/ppaper/pq", {
							"qw": obj.pp,
							"pageSize": pageSize,
							"pageNo": pageNo.pp
						}, "get", search.paper);
					}

				}else if(tabFlag == 6) {
					if(obj.co != searchval) {
						key1[1].refresh(true);
						pageNo.co = 1;
						flag = 1;
						obj.co = searchval;
						search.oAjaxGet(baseUrl + "/ajax/org/find/pq", {
							"kw": obj.co,
							"pageSize": pageSize,
							"pageNo": pageNo.co
						}, "get", search.company);
					}

				}
			}

		});
		//左滑及右滑
		document.querySelector('#slider').addEventListener('slide', function(event) {
			var $this = document.querySelector(".mui-scroll .mui-active");
			var searchval = document.getElementById("searchval").value;
			if($this.innerHTML == "找专家") {
				tabFlag = 1;
				document.getElementById("searchval").setAttribute("placeholder", "请输入专家姓名、机构、研究方向");
				document.getElementById("sele").classList.remove("displayNone");
				document.getElementById("searB").classList.add("searchboxNewT");
				if(key2[0] == 1) {
					if(obj.ex != searchval) {
						obj.ex = searchval;
					}
					flag = 1;
					pageNo.ex = 1;
					search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
						"key": obj.ex,
						"subject": subject,
						"industry": industry,
						"address": address,
						"authType": authType,
						"pageSize": pageSize,
						"pageNo": pageNo.ex
					}, "get", search.oExeprt);
				} else {
					if(obj.ex != searchval) {
						pageNo.ex = 1;
						key1[0].refresh(true);
						obj.ex = searchval;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
							"key": obj.ex,
							"subject": subject,
							"industry": industry,
							"address": address,
							"authType": authType,
							"pageSize": pageSize,
							"pageNo": pageNo.ex
						}, "get", search.oExeprt);

					} else {
						return;
					}
				}
			} else if($this.innerHTML == "找资源") {
				tabFlag = 2;
				document.getElementById("searchval").setAttribute("placeholder", "输入资源名称、用途、机构或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[2] == 1) {
					if(obj.rs != searchval) {
						obj.rs = searchval;
					}
					flag = 1;
					pageNo.rs = 1;
					search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
						"key": obj.rs,
						"pageSize": pageSize,
						"pageNo": pageNo.rs
					}, "get", search.resource);
				} else {
					if(obj.rs != searchval) {
						pageNo.rs = 1;
						key1[2].refresh(true);
						obj.rs = searchval;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
							"key": obj.rs,
							"pageSize": pageSize,
							"pageNo": pageNo.rs
						}, "get", search.resource);
					} else {
						return;
					}
				}
			} else if($this.innerHTML == "找文章") {
				tabFlag = 3;
				document.getElementById("searchval").setAttribute("placeholder", "输入文章标题、作者或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[5] == 1) {
					if(obj.ar != searchval) {
						obj.ar = searchval;
					}
					flag = 1;
					pageNo.ar = 1;
					search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
						"key": obj.ar,
						"pageSize": pageSize,
						"pageNo": pageNo.ar
					}, "get", search.article);
				} else {
					if(obj.ar != searchval) {
						pageNo.ar = 1;
						key1[5].refresh(true);
						obj.ar = searchval;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
							"key": obj.ar,
							"pageSize": pageSize,
							"pageNo": pageNo.ar
						}, "get", search.article);
					} else {
						return;
					}
				}
			} else if($this.innerHTML == "找专利") {
				tabFlag = 4;
				document.getElementById("searchval").setAttribute("placeholder", "输入专利名称、发明人、专利号或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[3] == 1) {
					if(obj.pt != searchval) {
						obj.pt = searchval;
					}
					flag = 1;
					pageNo.pt = 1;
					search.oAjaxGet(baseUrl + "/ajax/ppatent/pq", {
						"qw": obj.pt,
						"pageSize": pageSize,
						"pageNo": pageNo.pt
					}, "get", search.patent);
				} else {
					if(obj.pt != searchval) {
						pageNo.pt = 1;
						key1[3].refresh(true);
						obj.pt = searchval;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/ppatent/pq", {
							"qw": obj.pt,
							"pageSize": pageSize,
							"pageNo": pageNo.pt
						}, "get", search.patent);
					} else {
						return;
					}
				}
			} else if($this.innerHTML == "找论文") {
				tabFlag = 5;
				document.getElementById("searchval").setAttribute("placeholder", "输入论文题目、作者或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[4] == 1) {
					if(obj.pp != searchval) {
						obj.pp = searchval; 
					}
					flag = 1;
					pageNo.pp = 1;
					search.oAjaxGet(baseUrl + "/ajax/ppaper/pq", {
						"qw": obj.pp,
						"pageSize": pageSize,
						"pageNo": pageNo.pp
					}, "get", search.paper);
				} else {
					if(obj.pp != searchval) {
						pageNo.pp = 1;
						key1[4].refresh(true);
						obj.pp = searchval;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/ppaper/pq", {
							"qw": obj.pt,
							"pageSize": pageSize,
							"pageNo": pageNo.pp
						}, "get", search.paper);
					} else {
						return;
					}
				}
			}else if($this.innerHTML == "找企业") {
				tabFlag = 6;
				document.getElementById("searchval").setAttribute("placeholder", "输入企业名称、产品名称或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[1] == 1) {
					if(obj.co != searchval) {
						obj.co = searchval;
					}
					flag = 1;
					pageNo.co = 1;
					search.oAjaxGet(baseUrl + "/ajax/org/find/pq", {
						"kw": obj.co,
						"pageSize": pageSize,
						"pageNo": pageNo.co
					}, "get", search.company);
				} else {
					if(obj.co != searchval) {
						pageNo.co = 1;
						key1[1].refresh(true);
						obj.co = searchval;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/org/find/pq", {
							"kw": obj.co,
							"pageSize": pageSize,
							"pageNo": pageNo.co
						}, "get", search.company);
					} else {
						return;
					}
				}
			}
		});

	})
});