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
        var currentIndex,
            currentSelf,
            pageNo = 1,
            rows = 2,
            pageSize = 2;
        var listData = [{
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
                    url: "/ajax/watch/qaPro",
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
            dataO = {time: "", id: ""};
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
                            console.log(JSON.stringify(res));
                            console.log(JSON.stringify(obj));
                        }
                    }
                });
            })
        };
        var comPull = function (dataStr, index, reStr) {
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
                                    setTimeout(function () {
                                        if (index == 2) {
                                            var rs = {
                                                "professorId": userid,
                                                "watchType": 1,
                                                "pageSize": pageSize,
                                                "pageNo": ++pageNo
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
                                        currentSelf.endPullUpToRefresh()
                                    }, 1000);
                                }
                            },
                            auto:true
                        });
                    }
                })
            }
            if (dataStr.length > 0) {
                dataO.time = dataStr[dataStr.length - 1].createTime;
                dataO.id = dataStr[dataStr.length - 1].id;

                for (var i = 0; i < dataStr.length; i++) {
                    var liStr = document.createElement("li");
                    document.getElementById(aimId).appendChild(liStr);
                    if (index == 0 || index == 3) {
                        questionModule(dataStr[i], liStr);
                    } else if (index == 1 || index == 4) {
                        answerModule(dataStr[i], liStr);
                    } else if (index == 2) {
                        proModule(dataStr[i], liStr);
                    }
                }
                if (index == 2) {
                    if (pageNo < Math.ceil(reStr.total / reStr.pageSize)) {
                        currentSelf.endPullUpToRefresh(false);
                    } else {
                        currentSelf.endPullUpToRefresh(true);
                    }
                    if(reStr.total<=reStr.pageSize){
                        currentSelf.endPullUpToRefresh(true);
                    }
                } else {
                    if (dataStr.length > rows) {
                        currentSelf.endPullUpToRefresh(false);
                    }
                }
            } else {
                currentSelf.endPullUpToRefresh(true);
                return;
            }
        };
        var oMyQ = function (res) {
                console.log(0)
                comPull(res.data, 0);
            },
            oMyA = function (res) {
                console.log(1)
                comPull(res.data, 1);
            },
            oWatchPro = function (res) {
                console.log(2)
                comPull(res.data.data, 2, res.data);
            },
            oWatchQ = function (res) {
                console.log(3)
                comPull(res.data, 3);
            },
            oWatchA = function (res) {
                console.log(4)
                comPull(res.data, 4);
            },
            proModule = function (dataStr, liStr) {
                var dataStr = dataStr.professor;
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
                var baImg = "../images/default-photo.jpg";
                if (dataStr.hasHeadImage == 1) {
                    baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
                }
                var oSub = "";
                if (dataStr.researchAreas.length) {
                    var arr = [];
                    for (var n = 0; n < dataStr.researchAreas.length; n++) {
                        arr[n] = dataStr.researchAreas[n].caption;
                    }
                    oSub = "研究方向：" + arr.join("；");
                }
                liStr.setAttribute("data-id", dataStr.id);
                liStr.setAttribute("data-flag", 1);
                liStr.className = "mui-table-view-cell flexCenter";
                liStr.innerHTML = ' <div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
                    '<div class="madiaInfo">' +
                    '<p><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em></p>' +
                    '<p class="mui-ellipsis h2Font">' + os + '</p>' +
                    '<p class="mui-ellipsis h2Font">' + oSub + '</p>' +
                    '</div>'
            },
            questionModule = function (dataStr, liStr) {
                var baImg = "../images/default-q&a.jpg";
                if (dataStr.img) {
                    baImg = baseUrl + dataStr.img;
                }
                var hd = "";
                if (dataStr.replyCount > 0) {
                    hd = '<span>' + dataStr.replyCount + ' 回答</span>'
                }
                liStr.setAttribute("data-id", dataStr.id);
                liStr.className = "mui-table-view-cell";
                liStr.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
                    '<div class="madiaHead qa-Head" style="background-image:url(' + baImg + ')"></div>' +
                    '<div class="madiaInfo OmadiaInfo">' +
                    '<p class="mui-ellipsis-2 h1Font">' + dataStr.title + '</p>' +
                    '<p class="show-item mui-ellipsis h2Font">' + hd + '<span>N 关注</span></p>' +
                    '</div></div>'
            },
            answerModule = function (dataStr, liStr) {
                var hd = "", hl = "";
                if (dataStr.agree > 0) {
                    hd = '<span>' + dataStr.agree + ' 赞</span>'
                }
                if (dataStr.ballot > 0) {
                    hl = '<span>' + dataStr.ballot + ' 留言</span>'
                }
                liStr.setAttribute("data-id", dataStr.id);
                liStr.className = "mui-table-view-cell";
                var str = '<div class="madiaInfo">' +
                    '<p class="h1Font mui-ellipsis-2 qa-question"></p>' +
                    '<div class="flexCenter qa-owner"></div>' +
                    '<p class="qa-con mui-ellipsis-5">' + dataStr.cnt + '</p>' +
                    '<div class="showli mui-ellipsis">' +
                    '<span>' + commenTime(dataStr.createTime) + '</span>' + hd + hl +
                    '</div>' +
                    '</div>'
                var $str = $(str)
                $str.appendTo(liStr);
                questioninfo(dataStr.qid, $str);
                proinfo(dataStr.uid, $str);

            },
            insertAfter = function (newStr, targetE) {
                var parent = document.getElementById(targetE).parentNode;
                var kong = document.createElement("div");
                kong.className = "con-kong";
                kong.innerHTML = newStr;
                if (parent.lastChild.className == "con-kong") {
                    return
                } else {
                    parent.insertBefore(kong, document.getElementById(targetE).nextSibling);
                }

            },
            removeAfter = function (targetE) {
                var parent = document.getElementById(targetE).parentNode;
                if (parent.lastChild.className == "con-kong") {
                    parent.removeChild(parent.querySelector(".con-kong"));
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
                    var str = '<div class="owner-head useHead" style="background:url(' + baImg + ')"></div>' +
                        '<div class="owner-info">' +
                        '<div class="owner-name"><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em></div>' +
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
            if (index == "0") {
                document.getElementById("myQ").innerHTML = "";
                oAjaxGet("/ajax/question/my", {
                    "uid": userid,
                    "rows": rows
                }, "get", oMyQ);
            } else if (index == "1") {
                document.getElementById("myA").innerHTML = "";
                oAjaxGet("/ajax/question/answer/bySelf", {
                    "uid": userid,
                    "rows": rows
                }, "get", oMyA);
            } else if (index == "2") {
                document.getElementById("watchPro").innerHTML = "";
                oAjaxGet("/ajax/watch/qaPro", {
                    "professorId": userid,
                    "watchType": 1,
                    "pageSize": pageSize,
                    "pageNo": pageNo
                }, "get", oWatchPro);
            } else if (index == "3") {
                document.getElementById("watchQ").innerHTML = "";
                oAjaxGet("/ajax/question/watch", {
                    "uid": userid,
                    "rows": rows
                }, "get", oWatchQ);
            } else if (index == "4") {
                document.getElementById("watchA").innerHTML = "";
                oAjaxGet("/ajax/question/answer/byWatch", {
                    "uid": userid,
                    "rows": rows
                }, "get", oWatchA);
            }
        }

        oAjaxGet("/ajax/question/my", {
            "uid": userid,
            "rows":rows
        }, "get", oMyQ);
        //左滑及右滑
        document.querySelector('#slider').addEventListener('slide', function (event) {
            currentSelf.endPullUpToRefresh(false);
            mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
                var id = pullRefreshEl.getAttribute("data-pullToRefresh");
                if(id) {
                    pullRefreshEl.removeAttribute("data-pullToRefresh");
                }
            });
            dataO = {time: "", id: ""};pageNo = 1;
            var $this = document.querySelector(".mui-scroll .mui-active");
            var $type = $this.getAttribute("data-type");
            slideFun($type);
        });
        //点击
        document.querySelector('#slider').addEventListener('tap', function (event) {
            currentSelf.endPullUpToRefresh(false);
            mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
                var id = pullRefreshEl.getAttribute("data-pullToRefresh");
                if(id) {
                    pullRefreshEl.removeAttribute("data-pullToRefresh");
                }
            });
            dataO = {time: "", id: ""};pageNo = 1;
            var $this = document.querySelector(".mui-scroll .mui-active");
            var $type = $this.getAttribute("data-type");
            slideFun($type);
        });
    })
});