mui.ready(function() {
	var qid, userid, username;
	var rows = 20,
		pageNum=1,
		dataC = {
			count: "",
			pid: ""
		};
	var pulldownRefresh = function() {
			setTimeout(function() {
				onePage();
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			}, 1000);
		},
		pullupRefresh = function() {
			setTimeout(function() {
				morePage();
				mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			}, 1000);
		}
	var oAjax = function(url, dataS, otype, oFun) {
			mui.ajax(baseUrl + url, {
				dataType: 'json',
				type: otype,
				data: dataS,
				success: function(res) {
					if(res.success) {
//						console.log(JSON.stringify(res))
						oFun(res)
					}
				}
			});
		},
		onePage = function() {
			document.getElementById("questList").innerHTML = ""
			oAjax("/ajax/question/commendatoryPro", {
				"id": qid,
				"uid": userid,
				"rows": rows
			}, "get", myConList)
		},
		morePage = function() {
			oAjax("/ajax/question/commendatoryPro", {
				"id": qid,
				"uid": userid,
				"count": dataC.count,
				"pid": dataC.pid,
				"rows": rows
			}, "get", myConList)
		},
		myConList = function(res) {
			var $info = res.data;
			if($info.length > 0) {
				dataC.count = res.data[res.data.length - 1].kws;
				dataC.pid = res.data[res.data.length - 1].id;

				for(var i = 0; i < $info.length; i++) {
					var liStr = document.createElement("li");
					liStr.className = "mui-table-view-cell";
					liStr.setAttribute("data-id", $info[i].id);
					document.getElementById("questList").appendChild(liStr);
					proModule($info[i].id, liStr);
				}
				if($info.length > rows) {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
				}
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		},
		proModule = function(pid, liStr) {
			oAjax("/ajax/professor/info/" + pid, {}, "get", function(res) {
				var dataStr = res.data
				var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
				var os = "";
				if(dataStr.title) {
					if(dataStr.orgName) {
						os = dataStr.title + "，" + dataStr.orgName;
					} else {
						os = dataStr.title;
					}
				} else {
					if(dataStr.office) {
						if(dataStr.orgName) {
							os = dataStr.office + "，" + dataStr.orgName;
						} else {
							os = dataStr.office;
						}
					} else {
						if(dataStr.orgName) {
							os = dataStr.orgName;
						}
					}
				}
				var baImg = "../images/default-photo.jpg";
				if(dataStr.hasHeadImage == 1) {
					baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
				}
				var oSub = "";
				if(dataStr.researchAreas.length) {
					var arr = [];
					for(var n = 0; n < dataStr.researchAreas.length; n++) {
						arr[n] = dataStr.researchAreas[n].caption;
					}
					oSub = "研究方向：" + arr.join("；");
				}
				liStr.setAttribute("data-id", dataStr.id);
				liStr.setAttribute("data-flag", 1);
				liStr.className = "mui-table-view-cell";
				liStr.innerHTML = '<div class="flexCenter flex-pright">' +
					'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
					'<div class="madiaInfo">' +
					'<p><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em></p>' +
					'<p class="mui-ellipsis h2Font">' + os + '</p>' +
					'<p class="mui-ellipsis h2Font">' + oSub + '</p>' +
					'</div></div>' +
					'<span class="yaoqing">999</span>'
				var $str = $(liStr);
				inviteStatus(dataStr.id, $str);
			});
		},
		inviteStatus = function(id, $str) {
			oAjax("/ajax/question/invite", {
				"qid": qid,
				"pid": id,
				"uid": userid,
			}, "get", function(res) {
				if(res.data.length>0){
					$str.find(".yaoqing").addClass("yiyaoqing");
					$str.find(".yaoqing").html("已邀请");
					$str.find(".yaoqing").attr("data-type","0");
				}else{
					$str.find(".yaoqing").text("邀请")
					$str.find(".yaoqing").attr("data-type","1");
				}
			});
		},
		searchPage = function(searchval) {
			document.getElementById("questList").innerHTML = ""
			oAjax("/ajax/professor/pqBaseInfo", {
				"key": searchval,
				"pageSize": rows,
				"pageNo": pageNum++
			}, "get", searchConList)
		},
		searchConList = function(res) {
			console.log(JSON.stringify(res))
			var $info = res.data.data;
			if($info.length > 0) {
				for(var i = 0; i < $info.length; i++) {
					if($info[i].id==userid){
						
					}else{
						var liStr = document.createElement("li");
						liStr.className = "mui-table-view-cell";
						liStr.setAttribute("data-id", $info[i].id);
						document.getElementById("questList").appendChild(liStr);
						proModule($info[i].id, liStr);
					}
				}
				mui('#pullrefresh').pullRefresh().refresh(true);
				if(pageNum < Math.ceil(res.data.total / res.data.pageSize)) {
					mui('#pullrefresh').pullRefresh().endPullUpToRefresh(false);
				}else{
					mui('#pullrefresh').pullRefresh().endPullUpToRefresh(true);
				}
			} else {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		}
		
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				height: 50,
				callback: pullupRefresh
			},
//			down: {
//				auto: true,
//				callback: pulldownRefresh
//			}
		}
	});
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
			plus.nativeUI.closeWaiting();
			self.show("slide-in-right", 150);
			qid=self.quid;
		userid = plus.storage.getItem('userid');
		username = plus.storage.getItem('name');
		onePage();

		mui("#questList").on("tap", "li .flexCenter", function() {
			var id = this.parentNode.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
				proid: id
			});
		})
		mui("#questList").on("tap", ".yaoqing", function() {
			var id = this.parentNode.getAttribute("data-id");
			var type = this.getAttribute("data-type");
			var that = this
			if(type) {
				oAjax("/ajax/question/invite", {
					"qid": qid,
					"pid": id,
					"uid": userid,
					"uname": username,
				}, "post", function(res) {
					that.setAttribute("data-type", "0");
					that.classList.add("yiyaoqing");
					that.innerText="已邀请";
					plus.nativeUI.toast("邀请成功");
				})
			}
		})
		document.getElementById("searchval").addEventListener("keyup", function() {
			var e = event || window.event || arguments.caller.arguments[0];
			if(e.keyCode == 13) {
				var searchval = document.getElementById("searchval").value;
				searchPage(searchval)
			}

		});
		
	})

})