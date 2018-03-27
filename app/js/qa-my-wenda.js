/**
 * Created by TT on 2018/1/9.
 */
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
    bounce: false,
    indicators: true, //是否显示滚动条
    deceleration: deceleration
});
mui.ready(function () {
    mui.plusReady(function () {
    	var self = plus.webview.currentWebview()
    	plus.nativeUI.closeWaiting();
		self.show("slide-in-right", 150);
        var currentIndex,
            currentSelf,
            rows = 20
        var listData = [
        		{
	                type: 0,
	                aimid: "myQ",
	                url: "/ajax/question/my",
	                notip: "您还没有提过问题"
            	},
                {
                    type: 1,
                    aimid: "myA",
                    url: "/ajax/question/answer/bySelf",
                    notip: "您还没有回答问题"
                },
                {
                    type: 2,
                    aimid: "watchPro",
                    url: "/ajax/watch/proList",
                    notip: "您还没有关注的人"
                },
                {
                    type: 3,
                    aimid: "watchQ",
                    url: "/ajax/question/watch",
                    notip: "您还没有关注的问题"
                },
                {
                    type: 4,
                    aimid: "watchA",
                    url: "/ajax/question/answer/byWatch",
                    notip: "您还没有收藏的回答"
                }
            ],
            dataO = {time: "", id: ""},
            watchO={
				watchTime:"",
				watchObjId:"",
			};
        var userid = plus.storage.getItem('userid');

        function allAgreeNum() {
            mui.ajax(baseUrl + "/ajax/question/answer/my/agree/count", {
                data: {"id": userid},
                dataType: 'json',
                type: "get",
                success: function (res) {
                    if (res.success) {
                        document.getElementById("allAgreeNum").innerHTML = res.data
                    }
                }
            })
        };
        var oAjaxGet = function (url, obj, oType, oFun) {
            var urlStr = baseUrl + url;
            mui.plusReady(function () {
                mui.ajax(urlStr, {
                    data: obj,
                    dataType: 'json',
                    type: oType,
                    traditional: true,
                    async: false,
                    success: function (res) {
                        if (res.success) {
                            oFun(res);
                        }
                    }
                });
            })
        };
        var comPull = function (dataStr, index) {
            var url = listData[index].url,
                aimId = listData[index].aimid,
                newStr = listData[index].notip;
            if (currentIndex != index) {
                currentIndex = index;
                mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
                    if ($_index == index) {
                        currentSelf = mui(pullRefreshEl).pullToRefresh({
                            up: {
                                callback: function () {
                                	if(currentSelf.loading){
	                                    setTimeout(function () {
	                                        if (index == 2) {
	                                            var rs = {
	                                            	"professorId": userid,
													"watchType":1,
													"createTime": watchO.watchTime,
													"watchObject":watchO.watchObjId,
													"rows":rows
	                                            };
	                                            oAjaxGet(url, rs, "get", oWatchPro);
	                                        } else {
	                                            var rs = {
	                                                "uid": userid,
	                                                "rows": rows,
	                                                "time": dataO.time,
	                                                "id": dataO.id
	                                            };
	                                            if (index == 0) {
	                                                oAjaxGet(url, rs, "get", oMyQ);
	                                            } else if (index == 1) {
	                                                oAjaxGet(url, rs, "get", oMyA);
	                                            } else if (index == 3) {
	                                                oAjaxGet(url, rs, "get", oWatchQ);
	                                            } else if (index == 4) {
	                                                oAjaxGet(url, rs, "get", oWatchA);
	                                            }
	                                        }
	                                        // currentSelf.endPullUpToRefresh()
	                                    }, 1000);
                                    }
                                }
                            }
                        });
                    }
                })
            }
            if (dataStr.length > 0) {
				var arr=[];
				if(index == 2){
					watchO.watchTime = dataStr[dataStr.length - 1].createTime;
					watchO.watchObjId = dataStr[dataStr.length - 1].watchObject;
					for(var i in dataStr) {
						arr[i]=dataStr[i].watchObject;
					}
					proModule(arr,aimId);
				}else{
					dataO.time = dataStr[dataStr.length - 1].createTime;
               		dataO.id = dataStr[dataStr.length - 1].id;	
               		for (var i = 0; i < dataStr.length; i++) {
	                    var liStr = document.createElement("li");
	                    document.getElementById(aimId).appendChild(liStr);
	                    if (index == 0 || index == 3) {
	                        questionModule(dataStr[i], liStr);
	                    } else if (index == 1 || index == 4) {
	                        answerModule(dataStr[i], liStr);
	                    }
	                }
				}
                if (dataStr.length < rows) {
                    currentSelf.endPullUpToRefresh(true);
                }else {
                    currentSelf.endPullUpToRefresh(false);
                }
               
            } else {
                currentSelf.endPullUpToRefresh(true);
                var liLen=document.getElementById(aimId).querySelectorAll("li").length;
                removeAfter(aimId);
                if(dataStr.length == 0 && liLen == 0 ){
                    insertAfter(newStr,aimId);
                }
                return;
            }
        };
        var oMyQ = function (res) {
                comPull(res.data, 0);
            },
            oMyA = function (res) {
                comPull(res.data, 1);
            },
            oWatchPro = function (res) {
                comPull(res.data, 2);
            },
            oWatchQ = function (res) {
                comPull(res.data, 3);
            },
            oWatchA = function (res) {
                comPull(res.data, 4);
            },
            proModule=function(arr,obj) {
				oAjaxGet("/ajax/professor/qm",{
					id:arr,
				},"get",function(data){
					var dataStr=data.data;
					for(var i = 0; i < dataStr.length; i++) {
						var userType = autho(dataStr[i].authType, dataStr[i].orgAuth, dataStr[i].authStatus);
						var os = "";
						if(dataStr[i].title) {
							if(dataStr[i].orgName) {
								os = dataStr[i].title + "，" + dataStr[i].orgName;
							} else {
								os = dataStr[i].title;
							}
						} else {
							if(dataStr[i].office) {
								if(dataStr[i].orgName) {
									os = dataStr[i].office + "，" + dataStr[i].orgName;
								} else {
									os = dataStr[i].office;
								}
							} else {
								if(dataStr[i].orgName) {
									os = dataStr[i].orgName;
								}
							}
						}
						var baImg = "../images/default-photo.jpg";
						if(dataStr[i].hasHeadImage == 1) {
							baImg = baseUrl+"/images/head/" + dataStr[i].id + "_l.jpg";
						}
						
						var li = document.createElement("li");
						li.setAttribute("data-id", dataStr[i].id);
						li.setAttribute("data-flag", 1);
						li.className = "mui-table-view-cell flexCenter";
						li.innerHTML =
							' <div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
							'<div class="madiaInfo">' +
							'<p><span class="h1Font">' + dataStr[i].name + '</span><em class="authicon ' + userType.sty + '"></em></p>' +
							'<p class="mui-ellipsis h2Font">' + os + '</p>' +
							'</div>'
						document.getElementById(obj).appendChild(li);
					}
				});
			},
            questionModule = function (dataStr, liStr) {
                var baImg = "../images/default-q&a.jpg";
				var subs = new Array();
				if(dataStr.img) {
					if(dataStr.img.indexOf(',')) {
						subs = dataStr.img.split(',');
					} else {
						subs[0] = dataStr.img;
					}
					baImg = baseUrl + "/data/question"+ subs[0];
				}
                var hd = "";
                if (dataStr.replyCount > 0) {
                    hd = '<span>回答 ' + dataStr.replyCount + '</span>'
                }
                liStr.setAttribute("data-id", dataStr.id);
                liStr.className = "mui-table-view-cell";
                liStr.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
                    '<div class="madiaHead qa-Head" style="background-image:url(' + baImg + ')"></div>' +
                    '<div class="madiaInfo OmadiaInfo">' +
                    '<p class="mui-ellipsis-2 h1Font">' + dataStr.title + '</p>' +
                    '<p class="show-item mui-ellipsis h2Font">' + hd + '<span class="attendCount"></span></p>' +
				'</div></div>'
				var $str = $(liStr);
				attendCount(dataStr.id, $str);
	        },
			attendCount=function(id, $str) {
				oAjaxGet("/ajax/watch/countProfessor", {
					id:id,
					type: 8
				}, "get", function(data) {
					if(data.success) {
						if(data.data > 0) {
							$str.find(".attendCount").html("关注 " + data.data);
						}
					}
				})
			},
            answerModule = function (dataStr, liStr) {
                var hd = "";
                if (dataStr.agree > 0) {
                    hd = '<span>赞 ' + dataStr.agree + '</span>'
                }
                liStr.setAttribute("data-id", dataStr.id);
                liStr.className = "mui-table-view-cell";
                liStr.innerHTML = '<div class="madiaInfo">' +
                    '<p class="h1Font mui-ellipsis-2 qa-question"></p>' +
                    '<div class="flexCenter qa-owner"></div>' +
                    '<div class="qa-con mui-ellipsis-5">' + listConCut(dataStr.cnt) + '</div>' +
                    '<div class="showliSpan mui-ellipsis">' +
                    '<span>' + commenTime(dataStr.createTime) + '</span>' + hd +'<span class="leaveMsgCount"></span>'+
                    '</div>' +
                    '</div>'
              	var $str = $(liStr);
                questioninfo(dataStr.qid, $str);
                proinfo(dataStr.uid, $str);
				leaveMsgCount(dataStr.id, $str);
            },
			leaveMsgCount=function(id, $str) {
				oAjaxGet("/ajax/leavemsg/count", {
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
            insertAfter = function (newStr, targetE) {
                var parent = document.getElementById(targetE).parentNode;
                var kong = document.createElement("div");
                kong.className = "con-kong";
                kong.innerHTML = newStr;
                if (parent.firstChild.className == "con-kong") {
                    return
                } else {
                    parent.insertBefore(kong,parent.firstChild);
                }

            },
            removeAfter = function (targetE) {
                var parent = document.getElementById(targetE).parentNode;
                if (parent.firstChild.className == "con-kong") {
                    parent.removeChild(parent.firstChild);
                } else {
                    return
                }
            },
            proinfo = function (pid, $str) {
                oAjaxGet("/ajax/professor/baseInfo/" + pid, {}, "get", function (res) {
                    var dataStr = res.data
                    var baImg = "../images/default-photo.jpg";
                    if (dataStr.hasHeadImage == 1) {
                        baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
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
						'<div class="owner-tit mui-ellipsis h2Font">' + os + '</div>' +
						'</div>'
                    $str.find(".qa-owner").html(str)
                });
            },
            questioninfo = function (qid, $str) {
                oAjaxGet("/ajax/question/qo", {
                    "id": qid,
                }, "get", function (res) {
                    $str.find(".qa-question").html(res.data.title);
                });

            }

        var slideFun = function (index) {
        	var url=listData[index].url,
        		obj=listData[index].aimid
            if (index == "0") {
                document.getElementById(obj).innerHTML = "";
                oAjaxGet(url, {
                    "uid": userid,
                    "rows": rows
                }, "get", oMyQ);
            } else if (index == "1") {
                document.getElementById(obj).innerHTML = "";
                oAjaxGet(url, {
                    "uid": userid,
                    "rows": rows
                }, "get", oMyA);
            } else if (index == "2") {
                document.getElementById(obj).innerHTML = "";
                oAjaxGet(url, {
                    "professorId": userid,
					"watchType":1,
					"createTime": watchO.watchTime,
					"watchObject":watchO.watchObjId,
					"rows":rows
                }, "get", oWatchPro);
            } else if (index == "3") {
                document.getElementById(obj).innerHTML = "";
                oAjaxGet(url, {
                    "uid": userid,
                    "rows": rows
                }, "get", oWatchQ);
            } else if (index == "4") {
                document.getElementById(obj).innerHTML = "";
                oAjaxGet(url, {
                    "uid": userid,
                    "rows": rows
                }, "get", oWatchA);
            }
        }

		allAgreeNum() 
        oAjaxGet(listData[0].url, {
            "uid": userid,
            "rows":rows
        }, "get", oMyQ);
        //左滑及右滑
        document.querySelector('#slider').addEventListener('slide', function (event) {
            mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
                var id = pullRefreshEl.getAttribute("data-pullToRefresh");
                if(id) {
                    pullRefreshEl.removeAttribute("data-pullToRefresh");
                }
            });
            dataO = {time: "", id: ""};
            watchO={
				watchTime:"",
				watchObjId:"",
			};
            var $this = document.querySelector(".mui-scroll .mui-active");
            var $type = $this.getAttribute("data-type");
            slideFun($type);
        });
        //点击
        document.querySelector('#slider').addEventListener('tap', function (event) {
            mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
                var id = pullRefreshEl.getAttribute("data-pullToRefresh");
                if(id) {
                    pullRefreshEl.removeAttribute("data-pullToRefresh");
                }
            });
            dataO = {time: "", id: ""};
            watchO={
				watchTime:"",
				watchObjId:"",
			};
            var $this = document.querySelector(".mui-scroll .mui-active");
            var $type = $this.getAttribute("data-type");
            slideFun($type);
        });
        
        mui("#myQ,#watchQ").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			console.log(JSON.stringify(id))
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-question-show.html", 'qa-question-show.html', {}, {
				"quid": id
			});
		})
		mui("#myA,#watchA").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-answer-show.html", 'qa-answer-show.html', {}, {
				"anid": id
			});
		})
		mui("#watchPro").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
				"proid": id
			});
		})
    })
});