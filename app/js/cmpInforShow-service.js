var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
    bounce: false,
    indicators: true, //是否显示滚动条
    deceleration: deceleration
});
mui.ready(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var orgId = self.cmpId;
		var rows = 10,
			pullRefreshEl,
			currentIndex,
			currentSelf,
			dataO = {
				serModifyTime: "",
				serId: "",
			}
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
			serviceListVal = function(tabIndex) {
				var aimId = "serviceShow",
					newStr = "企业尚未发布任何服务"
				oAjax("/ajax/ware/publish",{
					"category":"2",
					"owner":orgId,
					"modifyTime":dataO.serModifyTime,
					"rows": rows
				}, "get", function(res){
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					console.log(JSON.stringify(res))
					var obj = res.data;
					if(obj.length > 0) {
						dataO.serModifyTime = obj[obj.length - 1].modifyTime;
						
						for(var i = 0; i < obj.length; i++) {
							var cnt = "",
								hasImg = "../images/default-service.jpg"
							if(obj[i].images) {
								var subs = strToAry(obj[i].images)
								if(subs.length > 0) {
									hasImg = baseUrl + "/data/ware" + subs[0]
								}
							}
							if(obj[i].cnt) {
								cnt = "内容：" + obj[i].cnt
							}
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + obj[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + cnt + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById(aimId).appendChild(li);
						}
					}
					if (currentIndex != tabIndex) {
		                currentIndex = tabIndex;
		                mui.each(document.querySelectorAll('.mui-scroll'), function ($_index, pullRefreshEl) {
		                    if ($_index == tabIndex) {
		                        currentSelf = mui(pullRefreshEl).pullToRefresh({
		                            up: {
		                                callback: function () {
		                                	if(currentSelf.loading){
			                                    setTimeout(function () {
			                                         serviceListVal(tabIndex)
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
				mui('#serviceShow').on('tap', 'li', function() {
					var id = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/serviceShow.html", 'serviceShow.html', {}, {
						serviceId: id,
					});
				})
				document.getElementsByClassName("topback")[0].addEventListener("tap", function() {
					var web = plus.webview.getWebviewById("cmpInforShow.html");
					if(web)
						mui.fire(web, "newId", {
							rd: 1
						});
				})
			}
			
		serviceListVal(0)
		bindClikFun()
		
	})
})