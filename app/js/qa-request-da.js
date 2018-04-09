var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
    bounce: false,
    indicators: true, //是否显示滚动条
    deceleration: deceleration
});
mui.ready(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
			plus.nativeUI.closeWaiting();
			self.show("slide-in-right", 150);
		var qid=self.quid,
			userid = plus.storage.getItem('userid'),
			username = plus.storage.getItem('name');
		var rows = 1,
			pullRefreshEl,
			currentIndex,
			currentSelf,
			dataC = {
				count: "",
				pid: "",
				proSortFirst:"",
				proStarLevel: "",
				proId: ""
			};
		var oAjax = function(url, dataS, otype, oFun) {
				mui.ajax(baseUrl + url, {
					dataType: 'json',
					type: otype,
					data: dataS,
					traditional: true,
					success: function(res) {
						if(res.success) {
							oFun(res)
						}
					}
				});
			},
			insertNodata = function(targetE, newStr) {
				var parent = document.getElementById(targetE).parentNode;
				var kong = document.createElement("div");
				kong.className = "con-kong";
				kong.innerHTML = '<div class="picbox picNull"></div>' +
					'<div class="txtbox">暂时没有符合该搜索条件的内容</div>'
				if(newStr) {
					kong.querySelector(".txtbox").innerHTML = newStr;
				}
				if(parent.firstChild.className == "con-kong") {
					return
				} else {
					parent.insertBefore(kong, parent.firstChild);
				}
			},
			removeNodata = function (targetE) {
	            var parent = document.getElementById(targetE).parentNode;
	            if (parent.firstChild.className == "con-kong") {
	                parent.removeChild(parent.firstChild);
	            } else {
	                return
	            }
	        },
			myConList = function() {
				var aimId = "questList",
					newStr = "抱歉，没有搜到可以邀请的人<br/>您可以通过分享该问题的方式获得更多答案"
				oAjax("/ajax/question/commendatoryPro", {
					"id": qid,
					"uid": userid,
					"count": dataC.count,
					"pid": dataC.pid,
					"rows": rows
				}, "get", function(res){
					console.log(JSON.stringify(res))
					var obj = res.data;
					if(obj.length > 0) {
						dataC.count = obj[obj.length - 1].kws;
						dataC.pid = obj[obj.length - 1].id;
		
						for(var i = 0; i < obj.length; i++) {
							var liStr = document.createElement("li");
							liStr.className = "mui-table-view-cell";
							liStr.setAttribute("data-id", obj[i].id);
							document.getElementById(aimId).appendChild(liStr);
							proModule(obj[i].id, liStr);
						}
					}
					if (currentIndex != 0) {
		                currentIndex = 0;
		                mui.each(document.querySelectorAll('.mui-scroll-wrapper .mui-scroll'), function ($_index, pullRefreshEl) {
		                    if ($_index == 0) {
		                        currentSelf = mui(pullRefreshEl).pullToRefresh({
		                            up: {
		                                callback: function () {
		                                	if(currentSelf.loading){
			                                    setTimeout(function () {
			                                        myConList();
			                                        currentSelf.endPullUpToRefresh();
			                                    }, 1000);
		                                    }
		                                }
		                            }
		                        });
		                    }
		                })
		            }
					var liLen = document.getElementById(aimId).querySelectorAll("li").length;
					removeNodata(aimId);
					if(obj.length == 0 && liLen == 0) {
						document.getElementById(aimId).style.display="none";
						insertNodata(aimId, newStr);
					}
					if(obj.length < rows) {
						currentSelf.endPullUpToRefresh(true);
					} else {
						currentSelf.endPullUpToRefresh(false);
					}
				})
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
				var aimId = "questListSearch",
					newStr = "抱歉，没有搜到可以邀请的人<br/>您可以通过分享该问题的方式获得更多答案"
				oAjax("/ajax/professor/index/search", {
					"key": searchval,
					"sortFirst": dataC.proSortFirst,
					"starLevel":dataC.proStarLevel,
					"id": dataC.proId,
					"rows":rows
				}, "get", function(res){
					console.log(JSON.stringify(res))
					var obj = res.data;
					if(obj.length > 0) {
						dataC.proSortFirst = obj[obj.length - 1].sortFirst;
						dataC.proStarLevel = obj[obj.length - 1].starLevel;
						dataC.proId = obj[obj.length - 1].id;
						
						for(var i = 0; i < obj.length; i++) {
							if(obj[i].id==userid){
								
							}else{
								var liStr = document.createElement("li");
								liStr.className = "mui-table-view-cell";
								liStr.setAttribute("data-id", obj[i].id);
								document.getElementById(aimId).appendChild(liStr);
								proModule(obj[i].id, liStr);
							}
						}
					}
					if (currentIndex != 1) {
		                currentIndex = 1;
		                mui.each(document.querySelectorAll('.mui-scroll-wrapper .mui-scroll'), function ($_index, pullRefreshEl) {
		                    if ($_index == 1) {
		                        currentSelf = mui(pullRefreshEl).pullToRefresh({
		                            up: {
		                                callback: function () {
		                                	if(currentSelf.loading){
			                                    setTimeout(function () {
			                                        searchPage(searchval)
			                                        currentSelf.endPullUpToRefresh();
			                                    }, 1000);
		                                    }
		                                }
		                            }
		                        });
		                    }
		                })
		            }
					var liLen = document.getElementById(aimId).querySelectorAll("li").length;
					removeNodata(aimId);
					if(obj.length == 0 && liLen == 0) {
						document.getElementById(aimId).style.display="none";
						insertNodata(aimId, newStr);
					}
					if(obj.length < rows) {
						currentSelf.endPullUpToRefresh(true);
					} else {
						currentSelf.endPullUpToRefresh(false);
					}
				})
			},
			bindClikFun=function(){
				mui("#questList,#questListSearch").on("tap", "li .flexCenter", function() {
					var id = this.parentNode.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
						proid: id
					});
				})
				mui("#questList,#questListSearch").on("tap", ".yaoqing", function() {
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
						document.getElementById("questListSearch").innerHTML = ""
						var searchval = document.getElementById("searchval").value;
						dataC = {
							proSortFirst:"",
							proStarLevel: "",
							proId: ""
						};
						document.getElementById("pullrefresh2").classList.remove("displayNone")
						document.getElementById("pullrefresh1").classList.add("displayNone")
						mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
			                var freshId = pullRefreshEl.getAttribute("data-pullToRefresh");
			                if(freshId) {
			                    pullRefreshEl.removeAttribute("data-pullToRefresh");
			                }
			            });
						searchPage(searchval)
					}
		
				});
			}
			
		myConList()
		bindClikFun()
		
	})
})
