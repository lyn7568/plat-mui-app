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
		ex: {},
		co: {},
		rs: {},
		pt: {},
		pp: {},
		ar: {},
		se:{}
	},
	authType = 1,
	flag = 1,
	key1 = [],
	key2 = [1, 1, 1, 1, 1, 1,1],
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
			ar: baseValue,
			se:baseValue
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
								oFun(data);
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
												search.oAjaxGet(baseUrl + "/ajax/professor/index/search", {
													"key": obj.ex,
													"subject": subject,
													"industry": industry,
													"address": address,
													"authType": authType,
													"rows": pageSize,
													"sortFirst":pageNo.ex.sortFirst,
													"starLevel":pageNo.ex.starLevel,
													"id":pageNo.ex.id,
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
					flag = 2;

				} else {
					if(data.data.length == 0) {
						key1[0].endPullupToRefresh(true);
						return;
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
						oSub = "研究方向：" + arr.join("；");
					}
					li.setAttribute("data-id", data.data[i].id);
					li.setAttribute("data-flag", 1);
					li.className = "mui-table-view-cell flexCenter";
					li.innerHTML = ' <div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
						'<div class="madiaInfo">' +
						'<p><span class="h1Font">' + data.data[i].name + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
						'<p class="mui-ellipsis h2Font">' + os + '</p>' +
						'<p class="mui-ellipsis h2Font">' + oSub + '</p>' +
						'</div>'
						
					document.getElementById("list").appendChild(li);
				}
				if(data.data.length==20) {
					key1[0].endPullUpToRefresh(false);
					pageNo.ex={
						sortFirst:data.data[19].sortFirst,
						starLevel:data.data[19].starLevel,
						id:data.data[19].id
					};
				} else {
					key1[0].endPullUpToRefresh(true);
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
			bus: function(pId, p1) {
			mui.ajax(baseUrl+"/ajax/org/"+pId, {
						dataType: 'json', //服务器返回json格式数据
						type: "get", //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						traditional: true,
						async: true,
						success: function(data) {
							if(data.success) {
								var $data = data.data;
									p1.querySelector(".pName").innerHTML = ($data.forShort) ? $data.forShort : $data.name;
									if($data.authStatus == 3){
										p1.querySelector(".authicon").classList.add("authicon-com-ok");
									}
							}
						},
						error: function(xhr, type, errorThrown) {
							//异常处理；
							plus.nativeUI.toast("服务器链接超时", toastStyle);
						}
				});
			
		},
		person: function(pId, p1) {
			mui.ajax(baseUrl+"/ajax/professor/baseInfo/"+pId, {
						dataType: 'json', //服务器返回json格式数据
						type: "get", //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						traditional: true,
						async: true,
						success: function(data) {
							if(data.success) {
								var $data = data.data;
								var professorFlag = autho($data.authType, $data.orgAuth, $data.authStatus);
									p1.querySelector(".pName").innerHTML = $data.name;
									p1.querySelector(".authicon").classList.add(professorFlag.sty);
							}
						},
						error: function(xhr, type, errorThrown) {
							//异常处理；
							plus.nativeUI.toast("服务器链接超时", toastStyle);
						}
				});
		},
			service:function(data) {
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
												search.oAjaxGet(baseUrl + "/ajax/ware/index/search", {
													"key": obj.rs,
													"rows": pageSize,
													"sortFirst": pageNo.se.sortFirst,
													"time":pageNo.se.modifyTime,
													"id":pageNo.se.id
												}, "get", search.service);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[1] = 2;
				}
				document.getElementById('seNoSearch').classList.add("displayNone");
				var $da = data.data;
				if(flag == 1) {
					document.getElementById("serviceList").innerHTML = ""
					if(data.data.length == 0) {
						key1[1].endPullUpToRefresh(true);
						document.getElementById('seNoSearch').classList.remove("displayNone");
						return;
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('seNoSearch').classList.remove("displayNone");
						key1[1].endPullupToRefresh(true);
						return;
					}
				}
				for(var i = 0; i < $da.length; i++) {
					var $data = $da[i];
					var namepo='';
					if($data.cnt) {
						namepo='内容：'+$data.cnt;
					}
					var rImg = "../images/default-service.jpg";
					if($data.images) {
						rImg = baseUrl + "/data/ware" + $data.images.split(",")[0];
					}
					var li = document.createElement("li");
					li.setAttribute("data-id", $data.id);
					li.className = "mui-table-view-cell flexCenter OflexCenter";
					li.innerHTML = ' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + $data.name + '</p>' +
						'<p><span class="h2Font pName"></span><em class="authicon " title="科袖认证专家"></em></p>' +
						'<p class="mui-ellipsis h2Font">' + namepo + '</p>' +
						'</div>'
						
					document.getElementById("serviceList").appendChild(li);
					if($data.category==1) {
						search.person($data.owner,li)
					}else{
						search.bus($data.owner,li)
					}
				}
				if($da.length>=20) {
					key1[1].endPullUpToRefresh(false);
					pageNo.se={
						"sortFirst": $da[19].sortFirst,
						"modifyTime":$da[19].modifyTime,
						"id":$da[19].id
					}
							
				} else {
					key1[1].endPullUpToRefresh(true);
				}
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
												search.oAjaxGet(baseUrl + "/ajax/resource/index/search", {
													"key": obj.rs,
													"rows": pageSize,
													"sortNum": pageNo.rs.sortNum,
													"publishTime":pageNo.rs.publishTime,
													"id":pageNo.rs.id
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
						key1[2].endPullUpToRefresh(true);
						document.getElementById('reNoSearch').classList.remove("displayNone");
						return;
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('reNoSearch').classList.remove("displayNone");
						key1[2].endPullupToRefresh(true);
						return;
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
					li.className = "mui-table-view-cell flexCenter OflexCenter";
					li.innerHTML = ' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + $data.resourceName + '</p>' +
						'<p><span class="h2Font">' + namepo + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
						'<p class="mui-ellipsis h2Font">用途：' + $data.supportedServices + '</p>' +
						'</div>'
						
					document.getElementById("resourceList").appendChild(li);
				}
				if($da.length>=20) {
					key1[2].endPullUpToRefresh(false);
					pageNo.rs={
						"sortNum": $da[19].sortNum,
						"publishTime":$da[19].publishTime,
						"id":$da[19].id
					}
							
				} else {
					key1[2].endPullUpToRefresh(true);
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
												search.oAjaxGet(baseUrl + "/ajax/article/index/search", {
													"key": obj.ar,
													"rows": pageSize,
													"sortNum": pageNo.ar.sortNum,
													"publishTime": pageNo.ar.publishTime,
													"id": pageNo.ar.id
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
						key1[5].endPullUpToRefresh(true);
						document.getElementById('arNoSearch').classList.remove("displayNone");
						return;
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('arNoSearch').classList.remove("displayNone");
						key1[5].endPullUpToRefresh(true);
						return;
					}
				}
				for(var i = 0; i < $data.length; i++) {
					var of ;
					if($data[i].articleType == 1) { of = 1;
					} else if($data[i].articleType == 2){ of = 2;
					} else if($data[i].articleType == 3){ of = 3;
					}
					var arImg = "../images/default-artical.jpg";
					if($data[i].articleImg) {
						arImg = baseUrl + "/data/article/" + $data[i].articleImg
					}
					var title = $data[i].articleTitle;
					var name = ""
					var li = document.createElement("li");
					if( of == 1) {
						li.setAttribute("owner-id", $data[i].professor.id);
						li.setAttribute("data-type", 1);
						name = $data[i].professor.name;
					} else if( of == 2){
						li.setAttribute("owner-id", $data[i].editOrganization.id);
						li.setAttribute("data-type", 2);
						if($data[i].editOrganization.forShort){
							name = $data[i].editOrganization.forShort;
						}else{
							name = $data[i].editOrganization.name;
						}
					} else if( of == 3){
						li.setAttribute("owner-id", $data[i].editOrganization.id);
						li.setAttribute("data-type", 3);
						name = $data[i].editOrganization.name;
					}
					li.setAttribute("data-id", $data[i].articleId);
					li.setAttribute("data-flag", 3);
					li.className = "mui-table-view-cell flexCenter OflexCenter";
					li.innerHTML = '<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis-2 h1Font">' + title + '</p>' +
						'<p class="h2Font mui-ellipsis">'+
						'<span class="nameSpan" style="margin-right:10px">' + name + '</span>'+
						'<span class="time">'+commenTime($data[i].publishTime)+'</span>'+
						'</p>'+
						'</div>'
					document.getElementById("articleList").appendChild(li);

				}
				if($data.length>=20) {
					key1[5].endPullUpToRefresh(false);
					pageNo.ar={
						"sortNum":$data[$data.length-1].sortNum,
						"publishTime":$data[$data.length-1].publishTime,
						"id":$data[$data.length-1].id
					}
				} else {
					key1[5].endPullUpToRefresh(true);
				}
			},
			patent: function(data) {
				console.log(JSON.stringify(data))
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
												search.oAjaxGet(baseUrl + "/ajax/ppatent/index/search", {
													"key": obj.pt,
													"rows": pageSize,
													"sortNum":pageNo.pt.sortNum,
													"createTime":pageNo.pt.createTime,
													"id":pageNo.pt.id
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
						key1[3].endPullUpToRefresh(true);
						document.getElementById('ptNoSearch').classList.remove("displayNone");
						return;
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('ptNoSearch').classList.remove("displayNone");
						key1[3].endPullUpToRefresh(true);
						return;
					}
				}
				for(var i = 0; i < $data.length; i++) {
					var li = document.createElement("li");
					li.setAttribute("data-id", $data[i].id);
					li.className = "mui-table-view-cell flexCenter OflexCenter";
					li.innerHTML ='<div class="madiaHead patentHead"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis-2 h1Font">' + $data[i].name + '</p>' +
						'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
						'</div>'
					document.getElementById("patentList").appendChild(li);
				}
				if($data.length>=20) {
					key1[3].endPullUpToRefresh(false);
					pageNo.pt={
						"sortNum":$data[$data.length-1].sortNum,
						"createTime":$data[$data.length-1].createTime,
						"id":$data[$data.length-1].id
					}
					
				} else {
					key1[3].endPullUpToRefresh(true);
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
												search.oAjaxGet(baseUrl + "/ajax/ppaper/index/search", {
													"key": obj.pp,
													"rows": pageSize,
													sortNum:pageNo.pp.sortNum,
													createTime:pageNo.pp.createTime,
													id:pageNo.pp.id
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
						key1[4].endPullUpToRefresh(true);
						document.getElementById('ppNoSearch').classList.remove("displayNone");
						return;
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('ppNoSearch').classList.remove("displayNone");
						key1[4].endPullUpToRefresh(true);
						return;
					}
				}
				for(var i = 0; i < $data.length; i++) {
					var li = document.createElement("li");
					li.setAttribute("data-id", $data[i].id);
					li.className = "mui-table-view-cell flexCenter OflexCenter";
					li.innerHTML = '<div class="madiaHead paperHead"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis-2 h1Font">' + $data[i].name + '</p>' +
						'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
						'</div>'
					document.getElementById("paperList").appendChild(li);
				}
				if($data.length>=20) {
					key1[4].endPullUpToRefresh(false);
					pageNo.pp={
						sortNum:$data[$data.length-1].sortNum,
						createTime:$data[$data.length-1].createTime,
						id:$data[$data.length-1].id
					}
					
				} else {
					key1[4].endPullUpToRefresh(false);
				}
			},
			company: function(data) {
				if(key2[6] == 1) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					//循环初始化所有下拉刷新，上拉加载。
					mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						if(index == 6) {
							key1[6] = mui(pullRefreshEl).pullToRefresh({
								up: {
									callback: function() {
										var self = this;
										setTimeout(function() {
											var ul = self.element.querySelector('.mui-table-view')
											if(index == 6) {
												search.oAjaxGet(baseUrl + "/ajax/org/index/search", {
													"key": obj.co,
													"rows": pageSize,
													"sortNum":pageNo.co.sortNum,
													"modifyTime":pageNo.co.modifyTime
												}, "get", search.company);
											}
										}, 1000);
									}
								}
							});
						}
					});
					key2[6] = 2;
				}
				document.getElementById('coNoSearch').classList.add("displayNone");
				var $data = data.data;
				if(flag == 1) {
					document.getElementById("companyList").innerHTML = ""
					if(data.data.length == 0) {
						key1[6].endPullUpToRefresh(true);
						document.getElementById('coNoSearch').classList.remove("displayNone");
						return;
					}
					flag = 2;
				} else {
					if(data.data.length == 0) {
						document.getElementById('coNoSearch').classList.remove("displayNone");
						key1[6].endPullUpToRefresh(true);
						return;
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
					li.className = "mui-table-view-cell flexCenter OflexCenter";
					li.innerHTML = '<div class="madiaHead companyHead">' +
						'<div class="boxBlock"><img class="boxBlockimg companyImg" src="' + oimg + '"></div>' +
						'</div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + orgName + '<em class="authicon ' + oAuth + '" title="科袖认证企业"></em></p>' +
						'<p class="mui-ellipsis h2Font"><span id="">' + orgType + '</span> <span id="">' + orgOther + '</span></p>' +
						'</div>'

					document.getElementById("companyList").appendChild(li);
				}
				if($data.length>=20) {
					key1[6].endPullUpToRefresh(false);
					pageNo.co={
						modifyTime:$data[$data.length-1].modifyTime,
						sortNum:$data[$data.length-1].sortNum
					}
				} else {
					key1[6].endPullUpToRefresh(true);
				}
			}
		}
		if(webview.qiFlag == 1) {
//			document.getElementById("searchval").setAttribute("placeholder", "请输入专家姓名、机构、研究方向");
			document.getElementById("sele").classList.remove("displayNone");
			document.getElementById("searB").classList.add("searchboxNewT");
			search.oAjaxGet(baseUrl + "/ajax/professor/index/search", {
				"key": obj.ex,
				"subject": subject,
				"industry": industry,
				"address": address,
				"authType": authType,
				"rows": pageSize
			}, "get", search.oExeprt);
		} else if(webview.qiFlag == 2) {
//			document.getElementById("searchval").setAttribute("placeholder", "输入资源名称、用途、机构或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");
			search.oAjaxGet(baseUrl + "/ajax/resource/index/search", {
				"key": obj.rs,
				"rows": pageSize
			}, "get", search.resource);
		} else if(webview.qiFlag == 3) {
//			document.getElementById("searchval").setAttribute("placeholder", "输入文章标题、作者或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");
			search.oAjaxGet(baseUrl + "/ajax/article/index/search", {
				"key": obj.ar,
				"rows": pageSize
			}, "get", search.article);
		} else if(webview.qiFlag == 4) {
//			document.getElementById("searchval").setAttribute("placeholder", "输入专利名称、发明人、专利号或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");	
			
			search.oAjaxGet(baseUrl + "/ajax/ppatent/index/search", {
				"key": obj.pt,
				"rows": pageSize
			}, "get", search.patent);
		} else if(webview.qiFlag == 5) {
//			document.getElementById("searchval").setAttribute("placeholder", "输入论文题目、作者或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");	
			search.oAjaxGet(baseUrl + "/ajax/ppaper/index/search", {
				"key": obj.pp,
				"rows": pageSize
			}, "get", search.paper);
		} else if(webview.qiFlag == 6) {
//			document.getElementById("searchval").setAttribute("placeholder", "输入企业名称、产品名称或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");	
			search.oAjaxGet(baseUrl + "/ajax/org/index/search", {
				"key": obj.co,
				"rows": pageSize
			}, "get", search.company);
		}else if(webview.qiFlag == 7) {
//			document.getElementById("searchval").setAttribute("placeholder", "输入企业名称、产品名称或相关关键词");
			document.getElementById("sele").classList.add("displayNone");
			document.getElementById("searB").classList.remove("searchboxNewT");	
			search.oAjaxGet(baseUrl + "/ajax/ware/index/search", {
													"key": obj.rs,
													"rows": pageSize
												}, "get", search.service);
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
		mui('#serviceList').on('tap', 'li', function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/serviceShow.html", 'serviceShow.html', {}, {
			serviceId: resouId
		});
	});
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
				pageNo.ex = {},
				flag = 1;
			key1[0].refresh(true);
			search.oAjaxGet(baseUrl + "/ajax/professor/index/search", {
				"key": obj.ex,
				"subject": subject,
				"industry": industry,
				"address": address,
				"authType": authType,
				"rows": pageSize
			}, "get", search.oExeprt);
		})
		document.getElementById("searchval").addEventListener("keyup", function() {
			var e = event || window.event || arguments.caller.arguments[0];
			if(e.keyCode == 13) {
				var searchval = document.getElementById("searchval").value;
				if(searchval.replace(/^\s*|\s*$/,"")) {
				wlog("kw", searchval);
			}
				
				if(tabFlag == 1) {
					if(obj.ex != searchval) {
						flag = 1;
						obj.ex = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
							document.getElementById("searchval").value=inputVlue;
						}
						key1[0].refresh(true);
						pageNo.ex = {},
							search.oAjaxGet(baseUrl + "/ajax/professor/index/search", {
								"key": inputVlue,
								"subject": subject,
								"industry": industry,
								"address": address,
								"authType": authType,
								"rows": pageSize
							}, "get", search.oExeprt);
					}else{
						document.getElementById("searchval").value=inputVlue;
					}
				} else if(tabFlag == 2) {
					if(obj.rs != searchval) {
						key1[2].refresh(true);
						obj.rs = searchval
						if(searchval.trim()) {
							inputVlue=searchval;
							document.getElementById("searchval").value=inputVlue;
						}
						pageNo.rs = 1;
						flag = 1;
						obj.rs = searchval;
						search.oAjaxGet(baseUrl + "/ajax/resource/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.resource);
					}else{
						document.getElementById("searchval").value=inputVlue;
					}
				} else if(tabFlag == 3) {
					if(obj.ar != searchval) {
						key1[5].refresh(true);
						obj.ar = searchval
						if(searchval.trim()) {
							inputVlue=searchval;
							document.getElementById("searchval").value=inputVlue;
						}
						pageNo.ar = {};
						flag = 1;
						obj.ar = searchval;
						search.oAjaxGet(baseUrl + "/ajax/article/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.article);
					}else{
						document.getElementById("searchval").value=inputVlue;
					}
				} else if(tabFlag == 4) {
					
					if(obj.pt != searchval) {
						key1[3].refresh(true);
						pageNo.pt = {};
						flag = 1;
						obj.pt = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
							document.getElementById("searchval").value=inputVlue;
						}
						console.log(inputVlue)
						search.oAjaxGet(baseUrl + "/ajax/ppatent/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.patent);
					}else{
						document.getElementById("searchval").value=inputVlue;
					}

				} else if(tabFlag == 5) {
					if(obj.pp != searchval) {
						key1[4].refresh(true);
						pageNo.pp = {};
						flag = 1;
						obj.pp = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
							document.getElementById("searchval").value=inputVlue;
						}
						search.oAjaxGet(baseUrl + "/ajax/ppaper/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.paper);
					}else{
						document.getElementById("searchval").value=inputVlue;
					}

				}else if(tabFlag == 6) {
					if(obj.co != searchval) {
						key1[6].refresh(true);
						pageNo.co = {};
						flag = 1;
						obj.co = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
							document.getElementById("searchval").value=inputVlue;
						}
						search.oAjaxGet(baseUrl + "/ajax/org/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.company);
					}else{
						document.getElementById("searchval").value=inputVlue;
					}
				}else if(tabFlag == 7) {
					if(obj.se != searchval) {
						key1[1].refresh(true);
						pageNo.se = {};
						flag = 1;
						obj.se = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
							document.getElementById("searchval").value=inputVlue;
						}
						search.oAjaxGet(baseUrl + "/ajax/ware/index/search", {
							"key": inputVlue,
							"rows": pageSize
					}, "get", search.service);
					}
				}else{
					document.getElementById("searchval").value=inputVlue;
				}
			}

		});
		//左滑及右滑
		document.querySelector('#slider').addEventListener('slide', function(event) {
			var $this = document.querySelector(".mui-scroll .mui-active");
			var searchval = document.getElementById("searchval").value;
			if($this.innerHTML == "找专家") {
				tabFlag = 1;
				//document.getElementById("searchval").setAttribute("placeholder", "请输入专家姓名、机构、研究方向");
				document.getElementById("sele").classList.remove("displayNone");
				document.getElementById("searB").classList.add("searchboxNewT");
				if(key2[0] == 1) {
					
					if(obj.ex != searchval) {
						obj.ex = searchval;
					}
					if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
					flag = 1;
					pageNo.ex = {};
					search.oAjaxGet(baseUrl + "/ajax/professor/index/search", {
						"key": inputVlue,
						"subject": subject,
						"industry": industry,
						"address": address,
						"authType": authType,
						"rows": pageSize
					}, "get", search.oExeprt);
				} else {
					if(obj.ex != searchval) {
						pageNo.ex = {};
						key1[0].refresh(true);
						obj.ex = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
							}
						document.getElementById("searchval").value=inputVlue;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/professor/index/search", {
							"key": inputVlue,
							"subject": subject,
							"industry": industry,
							"address": address,
							"authType": authType,
							"rows": pageSize
						}, "get", search.oExeprt);

					} else {
						document.getElementById("searchval").value=inputVlue;
					}
				}
			} else if($this.innerHTML == "找资源") {
				tabFlag = 2;
				//document.getElementById("searchval").setAttribute("placeholder", "输入资源名称、用途、机构或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[2] == 1) {
					if(obj.rs != searchval) {
						obj.rs = searchval;
					}
					if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
					flag = 1;
					pageNo.rs = {};
					search.oAjaxGet(baseUrl + "/ajax/resource/index/search", {
						"key": inputVlue,
						"rows": pageSize
					}, "get", search.resource);
				} else {
					if(obj.rs != searchval) {
						pageNo.rs = {};
						key1[2].refresh(true);
						obj.rs = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
							}
						document.getElementById("searchval").value=inputVlue;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/resource/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.resource);
					} else {
						document.getElementById("searchval").value=inputVlue;
					}
				}
			} else if($this.innerHTML == "找文章") {
				tabFlag = 3;
				//document.getElementById("searchval").setAttribute("placeholder", "输入文章标题、作者或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[5] == 1) {
					if(obj.ar != searchval) {
						obj.ar = searchval;
					}
					if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
					flag = 1;
					pageNo.ar = {};
					search.oAjaxGet(baseUrl + "/ajax/article/index/search", {
						"key": inputVlue,
						"rows": pageSize
					}, "get", search.article);
				} else {
					if(obj.ar != searchval) {
						pageNo.ar = {};
						key1[5].refresh(true);
						obj.ar = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/article/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.article);
					} else {
						document.getElementById("searchval").value=inputVlue;
					}
				}
			} else if($this.innerHTML == "找专利") {
				tabFlag = 4;
				//document.getElementById("searchval").setAttribute("placeholder", "输入专利名称、发明人、专利号或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[3] == 1) {
					if(obj.pt != searchval) {
						obj.pt = searchval;
					}
					if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
					flag = 1;
					pageNo.pt = {};
					console.log(inputVlue)
					search.oAjaxGet(baseUrl + "/ajax/ppatent/index/search", {
						"key": inputVlue,
						"rows": pageSize
					}, "get", search.patent);
				} else {
					if(obj.pt != searchval) {
						pageNo.pt = {};
						key1[3].refresh(true);
						obj.pt = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/ppatent/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.patent);
					} else {
						document.getElementById("searchval").value=inputVlue;
					}
				}
			} else if($this.innerHTML == "找论文") {
				
				tabFlag = 5;
				//document.getElementById("searchval").setAttribute("placeholder", "输入论文题目、作者或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[4] == 1) {
					if(obj.pp != searchval) {
						obj.pp = searchval; 
					}
					if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
					flag = 1;
					pageNo.pp = {};
					search.oAjaxGet(baseUrl + "/ajax/ppaper/index/search", {
						"key": inputVlue,
						"rows": pageSize
					}, "get", search.paper);
				} else {
					if(obj.pp != searchval) {
						pageNo.pp = {};
						key1[4].refresh(true);
						obj.pp = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/ppaper/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.paper);
					} else {
						document.getElementById("searchval").value=inputVlue;
					}
				}
			}else if($this.innerHTML == "找企业") {
				tabFlag = 6;
				
				//document.getElementById("searchval").setAttribute("placeholder", "输入企业名称、产品名称或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[6] == 1) {
					if(obj.co != searchval) {
						obj.co = searchval;
					}
					if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
					flag = 1;
					pageNo.co = {};
					search.oAjaxGet(baseUrl + "/ajax/org/index/search", {
						"key": inputVlue,
						"rows": pageSize
					}, "get", search.company);
				} else {
					if(obj.co != searchval) {
						pageNo.co = {};
						key1[6].refresh(true);
						obj.co = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/org/index/search", {
							"key": inputVlue,
							"rows": pageSize
						}, "get", search.company);
					} else {
						document.getElementById("searchval").value=inputVlue;
					}
				}
			}else if($this.innerHTML == "找服务") {
				tabFlag = 7;
				
				//document.getElementById("searchval").setAttribute("placeholder", "输入企业名称、产品名称或相关关键词");
				document.getElementById("sele").classList.add("displayNone");
				document.getElementById("searB").classList.remove("searchboxNewT");
				if(key2[1] == 1) {
					if(obj.se != searchval) {
						obj.se = searchval;
					}
					if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
					flag = 1;
					pageNo.se = {};
					search.oAjaxGet(baseUrl + "/ajax/ware/index/search", {
							"key": inputVlue,
							"rows": pageSize
					}, "get", search.service);
				} else {
					if(obj.se != searchval) {
						pageNo.se = {};
						key1[1].refresh(true);
						obj.se = searchval;
						if(searchval.trim()) {
							inputVlue=searchval;
					}
					document.getElementById("searchval").value=inputVlue;
						flag = 1;
						search.oAjaxGet(baseUrl + "/ajax/ware/index/search", {
							"key": inputVlue,
							"rows": pageSize
					}, "get", search.service);
					} else {
						document.getElementById("searchval").value=inputVlue;
					}
				}
			}
		});

	})
});
