mui.ready(function() {
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	var ocollectBtn = document.getElementById("collectBtn"),
		oanswer = document.getElementsByClassName("go-answer")[0],
		yaoanswer = document.getElementsByClassName("invite-answer")[0];
	var rows = 20,
		ifAl=1,//是否是首次加载
		dataO = {
			time: "",
			id: "",
			score:""
		};
	var oUrl = baseUrl + "/images/logo180.png";
	var userid, questionId ,pkey=[],byway;
	mui.plusReady(function() {
		userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		self.show("slide-in-right", 150);
		questionId = self.quid;

		var oAjax = function(url, dataS, otype, oFun) {
				mui.ajax(baseUrl + url, {
					dataType: 'json',
					type: otype,
					data: dataS,
					success: function(res) {
						if(res.success) {
							oFun(res)
						}
					}
				});
			},
			pullEvent = function() {
				pkey=mui('#pullrefresh').pullToRefresh({
					up: {
						callback: function() {
							var self = this;
							setTimeout(function() {
								answerList();
								self.endPullUpToRefresh();
							}, 1000);
						}
					},
					down: {
						callback: function() {
							var self = this;
							setTimeout(function() {
								getConmain();
								document.getElementById("curAnswers").innerHTML = "";
								dataO = {time: "",id: "",score:""}
								answerList();
								if(userid && userid != null && userid != "null") {
									anExist();
								}
								self.endPullDownToRefresh();
							}, 1000);
						}
					}
				})
			},
			getConmain = function() {
				oAjax('/ajax/question/qo', {
					"id": questionId
				}, "get", function(res) {
					var $da = res.data
					document.getElementById("questionId").setAttribute("data-id", $da.id);
					document.getElementById("questionTit").innerHTML = $da.title;
					document.getElementById("questionTime").innerHTML = commenTime($da.createTime);
					document.getElementById("replyCount").innerHTML = $da.replyCount;
					if($da.cnt) {
						document.getElementById("questionCnt").innerHTML =($da.cnt).replace(/\n/g,"<br />");
					}
					if($da.keys != undefined && $da.keys.length != 0) {
						var subs = new Array();
						if($da.keys.indexOf(',')) {
							subs = $da.keys.split(',');
						} else {
							subs[0] = $da.keys;
						}
						var pstr = ""
						if(subs.length > 0) {
							for(var i = 0; i < subs.length; i++) {
								pstr += '<li><span class="h2Font">' + subs[i] + '</span></li>'
							};
							document.getElementsByClassName("tagList")[0].innerHTML = pstr;
						} else {
							document.getElementsByClassName("tagList")[0].style.display = "none";
						}
					}
					if($da.img) {
						var subs = new Array();
						if($da.img.indexOf(',')) {
							subs = $da.img.split(',');
						} else {
							subs[0] = $da.img;
						}
						oUrl=baseUrl + "/data/question"+subs[0].replace(/.jpg/,"_s.jpg");
						var pstr = ""
						if(subs.length > 0) {
							for(var i = 0; i < subs.length; i++) {
								var imgu= baseUrl + "/data/question"+subs[i]
								pstr += '<li><span class="imgspan" style="background-image: url('+imgu+');"></span></li>'
							};
							document.getElementsByClassName("list_image")[0].innerHTML = pstr;
						} else {
							document.getElementsByClassName("list_image")[0].style.display = "none";
						}
					}
					
				})
			},
			anExist = function() {
				oAjax("/ajax/question/answer", {
					"qid": questionId,
					"uid": userid,
				}, "get", function(res) {
					console.log(JSON.stringify(res))
					if(res.data) {
						if(res.data.state=="1"){
							oanswer.setAttribute("data-can", "0"); //回答过
							oanswer.classList.add("answered");
							oanswer.querySelector("span").innerText = "您已回答"
						}else{
							oanswer.setAttribute("data-anid",res.data.id);
							oanswer.setAttribute("data-can", "2"); //回答过但已删除
							oanswer.querySelector("span").innerText = "撤销删除"
						}
					} else {
						oanswer.setAttribute("data-can", "1");
					}
				})
			},
			answerList = function() {
				var byway = document.querySelector('.list-hold-count>ul').querySelector("li.active").getAttribute("data-type");
				var typeurl,dataStr={};
				if(byway == 1) {
					typeurl = "/ajax/question/answer/qes/byScore"
					dataStr={
						"qid": questionId,
						"score": dataO.score,
						"id": dataO.id,
						"rows": rows
					}
				} else if(byway == 2) {
					typeurl = "/ajax/question/answer/qes/byTime"
					dataStr={
						"qid": questionId,
						"time": dataO.time,
						"id": dataO.id,
						"rows": rows
					}
				}
				oAjax(typeurl,dataStr, "get", function(res){
					console.log(JSON.stringify(res))
					var aimId="curAnswers",newStr="暂无回答"
					var $info = res.data;
					if(ifAl) {
						pullEvent()
						ifAl = 0;
					}
					if($info.length > 0) {
						if(byway == 1) {
							dataO.score = $info[$info.length - 1].score;
							dataO.id = $info[$info.length - 1].id;
						}else if(byway == 2) {
							dataO.time = $info[$info.length - 1].createTime;
							dataO.id = $info[$info.length - 1].id;
						}
				
						for(var i = 0; i < $info.length; i++) {
							var liStr = document.createElement("li");
							liStr.className = "mui-table-view-cell";
							liStr.setAttribute("data-id", $info[i].id);
							document.getElementById(aimId).appendChild(liStr);
							answerModule($info[i], liStr);
						}
						if($info.length > rows) {
							pkey.endPullupToRefresh(false);
						}
					} else {
						pkey.endPullUpToRefresh(true)
					}
					var liLen=document.getElementById(aimId).querySelectorAll("li").length;
	                removeAfter(aimId);
	                if($info.length == 0 && liLen == 0 ){
	                    insertAfter(newStr,aimId);
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
                console.log(parent.firstChild.className);
                if (parent.firstChild.className == "con-kong") {
                    parent.removeChild(parent.firstChild);
                } else {
                    return
                }
            },
			answerModule = function(dataStr, liStr) {
				var hd = "",
					hl = "";
				if(dataStr.agree > 0) {
					hd = '<span>' + dataStr.agree + '赞</span>'
				}
				liStr.setAttribute("data-id", dataStr.id);
				liStr.className = "mui-table-view-cell";
				liStr.innerHTML = '<div class="madiaInfo">' +
					'<div class="flexCenter qa-owner"></div>' +
					'<p class="qa-con mui-ellipsis-5">' + (dataStr.cnt).replace(/\n/g,"<br />") + '</p>' +
					'<div class="showli mui-ellipsis">' +
					'<span>' + commenTime(dataStr.createTime) + '</span>' + hd + '<span class="leaveMsgCount"></span>' +
					'</div>' +
					'</div>'
				var $str = $(liStr)
				proinfo(dataStr.uid, $str);
				leaveMsgCount(dataStr.id, $str);
			},
			leaveMsgCount=function(id, $str) {
				oAjax("/ajax/leavemsg/count", {
					sid:id,
					stype: "4"
				}, "get", function(data) {
					if(data.success) {
						if(data.data > 0) {
							$str.find(".leaveMsgCount").html(data.data + "留言");
						}
					}
				})
			},
			proinfo = function(pid, $str) {
				oAjax("/ajax/professor/baseInfo/" + pid, {}, "get", function(res) {
					var dataStr = res.data
					var baImg = "../images/default-photo.jpg";
					if(dataStr.hasHeadImage == 1) {
						baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
					}
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
					var str = '<div class="owner-head useHead" style="background-image:url(' + baImg + ')"></div>' +
						'<div class="owner-info">' +
						'<div class="owner-name"><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em></div>' +
						'<div class="owner-tit mui-ellipsis h2Font">' + os + '</div>' +
						'</div>'

					$str.find(".qa-owner").html(str);
				});
			},
			isLogin = function() { //判断是否登录，登录才可咨询，关注，收藏
				if(userid == null || userid == 'null' | userid == undefined | userid == 'undefined') {
					mui.openWindow({
						url: '../html/login.html',
						id: 'login.html'
					})
				}
			},
			moreMes=function(){
				document.getElementById("BtnMore").addEventListener("tap", function() {
					plus.nativeUI.showWaiting(); //显示原生等待框
					var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
						proid: questionId,
						name: "question",
						data: {
							content: document.getElementById("questionCnt").innerHTML.substring(0, 70),
							title: document.getElementById("questionTit").innerHTML,
							href: baseUrl + "/e/wen.html?id=" + questionId,
							thumbs: [oUrl]
						},
						weiboData: {
							content: document.getElementById("questionTit").innerHTML + baseUrl + "/e/wen.html?id=" + questionId,
						}
					})
				})
			}
		mui.ajax(baseUrl + '/ajax/question/pageViews',{
			"type" :  "POST" ,
			"dataType" : "json",
			"data" :{"qid":questionId},
			"success" : function(data) {
				console.log(data);
				if (data.success){
				}
			},
			"error":function(){
				
			}
		});
		
		pullEvent();
		getConmain();
		answerList();
		moreMes();
		if(userid && userid != null && userid != "null") {
			anExist(); //判断是否回答过该问题
			ifcollectionAbout(questionId, collectBtn.querySelector("span"), 8,2);
		}
		//关注按钮
		ocollectBtn.addEventListener('tap', function() {
			if(userid && userid != null && userid != "null") {
				if(this.querySelector("span").className == 'mui-icon iconfontnew icon-yishoucang') {
					cancelCollectionAbout(questionId, collectBtn.querySelector("span"), 8,2)
				} else {
					collectionAbout(questionId, collectBtn.querySelector("span"), 8,2);
				}
			} else {
				isLogin();
			}
		});
		mui(".list-hold-count>ul").on('tap', 'li', function(e) {
			var sortlist = document.querySelector('.list-hold-count>ul').querySelectorAll("li");
			for(var i = 0; i < sortlist.length; i++) {
				sortlist[i].classList.remove('active');
			}
			this.classList.add('active');
			byway = this.getAttribute("data-type");
			document.getElementById("curAnswers").innerHTML = "";
			dataO = {time: "",id: "",score:""}
			if(typeof(pkey)==undefined){
				pkey=[]
			}else{
				pkey.refresh(true)
			}
			answerList()
		});
		oanswer.addEventListener('tap', function() {
			var can = this.getAttribute("data-can");
			if(userid && userid != null && userid != "null") {
				if(can=="1") {
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/qa-answer-q.html", 'qa-answer-q.html', {}, {
						"aflag":0,
						"quid": questionId,
						"qutit":document.getElementById("questionTit").innerHTML
					});
				} else if(can=="2") {
					var anid= this.getAttribute("data-anid");
					oAjax("/ajax/question/answer/unDel", {
						"qid": questionId,
						"id": anid,
					}, "get", function(res) {
						console.log(JSON.stringify(res))
						if(res.data=="1") {
							oanswer.setAttribute("data-can", "0"); //回答过
							oanswer.classList.add("answered");
							oanswer.querySelector("span").innerText = "您已回答"
						}
					})
				}else{
					return
				}
			} else {
				isLogin();
			}
		})
		yaoanswer.addEventListener('tap', function() {
			if(userid && userid != null && userid != "null") {
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/qa-request-da.html", 'qa-request-da.html', {}, {
					"quid": questionId
				});
			} else {
				isLogin();
			}
		})
		mui("#curAnswers").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-answer-show.html", 'qa-answer-show.html', {}, {
				anid: id
			});
		})

	})
})