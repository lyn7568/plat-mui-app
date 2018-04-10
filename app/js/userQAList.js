var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
    bounce: false,
    indicators: true, //是否显示滚动条
    deceleration: deceleration
});
mui.ready(function() {
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		var proId = self.proid;
		var rows = 10,
			pullRefreshEl,
			currentIndex,
			currentSelf,
			dataO = {
				AnsTime:"",
				AnsId:"",
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
			answerListVal = function(tabIndex) {
				var aimId = "QAShow",
					newStr = "企业尚未发布任何问答"
				oAjax("/ajax/question/answer/bySelf",{
					"time":dataO.AnsTime,
	                "id":dataO.AnsId,
	                "uid":proId,
	                "rows":rows
				}, "get", function(res){
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
					console.log(JSON.stringify(res))
					var obj = res.data;
					if(obj.length > 0) {
						dataO.AnsTime = obj[obj.length - 1].createTime;
						dataO.AnsId = obj[obj.length - 1].id;
						
						for(var i = 0; i < obj.length; i++) {
							var hd = "";
			                if (obj[i].agree > 0) {
			                    hd = '<span>赞 ' + obj[i].agree + '</span>'
			                }
							var li = document.createElement("li");
								li.setAttribute("data-id", obj[i].id);
								li.className = "mui-table-view-cell";
								li.innerHTML = '<div class="madiaInfo">' +
				                    '<p class="h1Font mui-ellipsis-2 qa-question"></p>' +
				                    '<div class="flexCenter qa-owner"></div>' +
				                    '<div class="qa-con mui-ellipsis-5">' + listConCut(obj[i].cnt) + '</div>' +
				                    '<div class="showliSpan mui-ellipsis">' +
				                    '<span>' + commenTime(obj[i].createTime) + '</span>' + hd +'<span class="leaveMsgCount"></span>'+
				                    '</div>' +
				                    '</div>'
							document.getElementById(aimId).appendChild(li);
							var $str = $(li);
			                questioninfo(obj[i].qid, $str);
			                proinfo(obj[i].uid, $str);
							leaveMsgCount(obj[i].id, $str);
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
			                                         answerListVal(tabIndex)
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
			proinfo=function(pid, $str) {
				oAjax("/ajax/professor/baseInfo/" + pid,{}, "get", function(data){
	                var dataStr = data.data
	                var baImg = "../images/default-photo.jpg";
	                if (dataStr.hasHeadImage == 1) {
	                    baImg = baseUrl+"/images/head/" + dataStr.id + "_l.jpg";
	                }
	                var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
	                var os = "";
	                if (dataStr.title) {
	                    if (dataStr.orgName) {
	                        os = dataStr.title + "，" + dataStr.orgName;
	                    } else {
	                        os = dataStr.title;
	                    }
	                } else {
	                    if (dataStr.office) {
	                        if (dataStr.orgName) {
	                            os = dataStr.office + "，" + dataStr.orgName;
	                        } else {
	                            os = dataStr.office;
	                        }
	                    } else {
	                        if (dataStr.orgName) {
	                            os = dataStr.orgName;
	                        }
	                    }
	                }
	                var styStr='<em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em>'
					if(userType.sty=="e"){
						styStr=""
					}
					var str = '<div class="owner-head useHead" style="background-image:url(' + baImg + ')"></div>' +
						'<div class="owner-info">' +
						'<div class="owner-name"><span class="h1Font">' + dataStr.name + '</span>'+styStr+'</div>' +
						'<div class="owner-tit mui-ellipsis h2Font" style="margin-top:0;">' + os + '</div>' +
						'</div>'
	
	                $str.find(".qa-owner").html(str)
		        });
		    },
		    questioninfo=function(qid, $str) {
		        oAjax("/ajax/question/qo",{
		        	id:qid
		        }, "get", function(data){
	                $str.find(".qa-question").html(data.data.title);
	                if(data.data.pageViews>0){
	                    $str.find(".qaPageview").html("阅读量 "+data.data.pageViews);
	                }else{
	                    $str.find(".qaPageview").hide()
	                }
		        });
		    },
		    leaveMsgCount=function(id, $str) {
				oAjax("/ajax/leavemsg/count", {
					sid:id,
					stype: "4"
				}, "get", function(data) {
					if(data.success) {
						if(data.data > 0) {
							$str.find(".leaveMsgCount").html("留言 " + data.data);
						}
					}
				})
			},
			bindClikFun=function(){
				mui("#QAShow").on("tap","li",function(){
					var AId=this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/qa-answer-show.html", 'qa-answer-show.html', {}, {
						"anid":AId
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
			
		answerListVal(0)
		bindClikFun()
		
	})
})