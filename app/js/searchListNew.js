var subject = "",
	industry = "",
	address = "",
	pageSize = 20,
	pageNo = 1,
	authType = 1,
	flag = 1,
	qiFlag = 1,
	inputValue;
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	setTimeout(function() {
		pageNo++;
		console.log(pageNo)
		if(qiFlag == 1) {
			search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
				"key": inputValue,
				"subject": subject,
				"industry": industry,
				"address": address,
				"authType": authType,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.oExeprt);
		} else if(qiFlag == 2) {
			search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
				"key": inputValue,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.resource);
		} else if(qiFlag == 3) {
			search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
				"key": inputValue,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.article);
		}
	}, 1000);

}
var search = {
	oAjaxGet: function(url, obj, oType, oFun) {
		mui.plusReady(function() {
			mui.ajax(url, {
				data: obj,
				dataType: 'json', //服务器返回json格式数据
				type: oType, //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				traditional: true,
				success: function(data) {
					//console.log(JSON.stringify(data))
					if(data.success) {
						oFun(data.data);
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log(type);
				}
			});
		})

	},
	oExeprt: function(data) {
		console.log(JSON.stringify(data))
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		document.getElementById('noSearch').style.display = "none"
		if(flag == 1) {
			document.getElementById("list").innerHTML = ""
			if(data.data.length == 0) {
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
				document.getElementById('noSearch').style.display = "block";
				return;
			}
			if(pageNo < Math.ceil(data.total / data.pageSize)) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)

			} else {
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
			}
			flag = 2;
		} else {
			if(data.data.length == 0) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			if(pageNo < Math.ceil(data.total / data.pageSize)) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)

			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

			}
		}
		console.log(pageNo);
		console.log(Math.ceil(data.total / data.pageSize));

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
			}
		});
	},
	resource: function(data) {
		console.log(JSON.stringify(data));
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		document.getElementById('noSearch').style.display = "none"
		var $da = data.data;
		if(flag == 1) {
			document.getElementById("list").innerHTML = ""
			if(data.data.length == 0) {
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
				document.getElementById('noSearch').style.display = "block";
				return;
			}
			if(pageNo < Math.ceil(data.total / data.pageSize)) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)

			} else {
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);

			}
			flag = 2;
		} else {
			if(data.data.length == 0) {
				document.getElementById('noSearch').style.display = "block";
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			if(pageNo < Math.ceil(data.total / data.pageSize)) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)

			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

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
				namepo = $data.organization.name;
				if($data.organization.authStatus == 3) {
					userType.sty = "authicon-com-ok"
				} else {
					userType.sty = "e"
				}
			}
			var rImg = baseUrl + "/data/resource/" + $data.images[0].imageSrc;
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
			document.getElementById("list").appendChild(li);
		}

	},
	article: function(data) {
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		console.log(JSON.stringify(data))
		document.getElementById('noSearch').style.display = "none"
		var $data = data.data;
		if(flag == 1) {
			document.getElementById("list").innerHTML = ""
			if(data.data.length == 0) {
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
				document.getElementById('noSearch').style.display = "block";
				return;
			}
			if(pageNo < Math.ceil(data.total / data.pageSize)) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)

			} else {
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);

			}
			flag = 2;
		} else {
			if(data.data.length == 0) {
				document.getElementById('noSearch').style.display = "block";
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
			if(pageNo < Math.ceil(data.total / data.pageSize)) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false)

			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);

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
				name = $data[i].editOrganization.name;
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
			document.getElementById("list").appendChild(li);

		}
	},
}

mui.plusReady(function() {
	/*webvie窗口值*/
	var windowModule = {
		self: plus.webview.currentWebview().key,
		flag:plus.webview.currentWebview().qiFlag,
	}
	document.getElementById("searchval").value = windowModule.self;
	inputValue = windowModule.self;
	if(windowModule.flag==1) {
		qiFlag=1;
		search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
		"key": document.getElementById("searchval").value,
		"subject": subject,
		"industry": industry,
		"address": address,
		"authType": authType,
		"pageSize": pageSize,
		"pageNo": pageNo
	}, "get", search.oExeprt);
	}else if(windowModule.flag==2) {
		qiFlag=2;
		document.getElementById("sele").style.display = "none";
		document.getElementsByClassName("fixbtnNew")[0].getElementsByTagName("li")[1].classList.add("liactive");
		for(var i = 0; i < siblings(document.getElementsByClassName("fixbtnNew")[0].getElementsByTagName("li")[1]).length; i++) {
			siblings(document.getElementsByClassName("fixbtnNew")[0].getElementsByTagName("li")[1])[i].classList.remove("liactive")
		}
		search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
				"key": document.getElementById("searchval").value,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.resource);
	}else {
		qiFlag=3;
		document.getElementById("sele").style.display = "none";
		document.getElementsByClassName("fixbtnNew")[0].getElementsByTagName("li")[2].classList.add("liactive");
		for(var i = 0; i < siblings(document.getElementsByClassName("fixbtnNew")[0].getElementsByTagName("li")[2]).length; i++) {
			siblings(document.getElementsByClassName("fixbtnNew")[0].getElementsByTagName("li")[2])[i].classList.remove("liactive")
		}
		search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
				"key": document.getElementById("searchval").value,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.article);
	}
	
	document.getElementById("sele").addEventListener("tap", function() {
		search.createWin();
	})
	/*自定义事件*/
	window.addEventListener("newId", function(event) {
		var arry = event.detail.arry;
		subject = arry[1],
			industry = arry[2],
			address = arry[0],
			pageNo = 1,
			flag = 1;
		mui('#pullrefresh').pullRefresh().refresh(true);
		search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
			"key": document.getElementById("searchval").value,
			"subject": subject,
			"industry": industry,
			"address": address,
			"authType": authType,
			"pageSize": pageSize,
			"pageNo": pageNo
		}, "get", search.oExeprt);
	})
	mui(".fixbtnNew").on("tap", "li", function() {
		inputValue = document.getElementById("searchval").value;
		this.classList.add("liactive");
		for(var i = 0; i < siblings(this).length; i++) {
			siblings(this)[i].classList.remove("liactive")
		}
		flag = 1;
		pageNo = 1;
		mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
		if(this.innerHTML == "找资源") {
			document.getElementById("sele").style.display = "none";
			document.getElementById("searB").classList.remove("searchboxNewT");
			qiFlag = 2;
			search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
				"key": document.getElementById("searchval").value,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.resource);
		} else if(this.innerHTML == "找专家") {
			document.getElementById("sele").style.display = "block";
			qiFlag = 1;
			search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
				"key": document.getElementById("searchval").value,
				"subject": subject,
				"industry": industry,
				"address": address,
				"authType": authType,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.oExeprt);
		} else if(this.innerHTML == "找文章") {
			document.getElementById("sele").style.display = "none";
			document.getElementById("searB").classList.remove("searchboxNewT");
			qiFlag = 3;
			search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
				"key": document.getElementById("searchval").value,
				"pageSize": pageSize,
				"pageNo": pageNo
			}, "get", search.article);
		}
	})

	function siblings(elm) {
		var a = [];
		var p = elm.parentNode.children;
		for(var i = 0, pl = p.length; i < pl; i++) {
			if(p[i] !== elm) a.push(p[i]);
		}
		return a;
	}
	/*按键字搜索*/
	document.getElementById("searchval").addEventListener("keyup", function() {
		var e = event || window.event || arguments.caller.arguments[0];
		if(e.keyCode == 13) {
			flag = 1;
			pageNo = 1;
			inputValue = document.getElementById("searchval").value;
			mui('#pullrefresh').pullRefresh().refresh(true);
			var c = document.getElementsByClassName("liactive")[0].innerHTML;
			if(c == "找资源") {
				document.getElementById("sele").style.display = "none";
				qiFlag = 2;
				search.oAjaxGet(baseUrl + "/ajax/resource/firstpq", {
					"key": document.getElementById("searchval").value,
					"pageSize": pageSize,
					"pageNo": pageNo
				}, "get", search.resource);
			} else if(c == "找专家") {
				document.getElementById("sele").style.display = "block";
				qiFlag = 1;
				search.oAjaxGet(baseUrl + "/ajax/professor/pqAPP", {
					"key": document.getElementById("searchval").value,
					"subject": subject,
					"industry": industry,
					"address": address,
					"authType": authType,
					"pageSize": pageSize,
					"pageNo": pageNo
				}, "get", search.oExeprt);
			} else if(c == "找文章") {
				document.getElementById("sele").style.display = "none";
				qiFlag = 3;
				search.oAjaxGet(baseUrl + "/ajax/article/firstpq", {
					"key": document.getElementById("searchval").value,
					"pageSize": pageSize,
					"pageNo": pageNo
				}, "get", search.article);
			}
		}
	})
	/*跳转*/
	mui("#list").on("tap", "li", function() {
		var tFl = this.getAttribute("data-flag");
		if(tFl == 1) {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			plus.webview.create("../html/proinforbrow.html", 'proinforbrow.html', {}, {
				proid: id
			});
		} else if(tFl == 2) {
			var resouId = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
			});
		} else if(tFl == 3) {
			var id = this.getAttribute("data-id");
			var datatype = this.getAttribute("data-type");
			var ownerid = this.getAttribute("owner-id");
			if(datatype == 1) {
				mui.openWindow({
					url: '../html/professorArticle.html',
					id: 'html/professorArticle.html',
					show: {
						autoShow: false,
						aniShow: "slide-in-right",
					},
					extras: {
						articleId: id,
						ownerid: ownerid,
					}
				});
			} else if(datatype == 2) {
				mui.openWindow({
					url: '../html/professorArticle.html',
					id: 'html/professorArticle.html',
					show: {
						autoShow: false,
						aniShow: "slide-in-right",
					},
					extras: {
						articleId: id,
						ownerid: ownerid,
						oFlag: 1
					}
				});
			}
		}
	})
})