var ocollectBtn = document.getElementById("collectBtn"); //收藏按钮
var paperId;
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	console.log(userid)
	var self = plus.webview.currentWebview();
	var userName = plus.storage.getItem('name');
	paperId = self.paperId;
	//paperId="FF6EFFA4D7474CC7B808D9BC08E88E79";
	getRecourceMe(); /*获取资源信息*/
	//关键词标签点击进去搜索
	mui(".tagList").on("tap", "li", function() {
		var tagText = this.getElementsByTagName("span")[0].innerText;
		plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/searchListNew2.html?content=5", "../html/searchListNew2.html", {}, {
			key: tagText,
			qiFlag: 5
		});
	})
	//点击收藏按钮
	ifcollectionAbout(paperId, 5);
	ocollectBtn.addEventListener('tap', function() {
		if(userid && userid != null && userid != "null") {
			if(document.getElementById("ifCollect").className == 'mui-icon iconfontnew icon-yishoucang') {
				cancelCollectionAbout(paperId, 5)
			} else {
				collectionAbout(paperId, 5);
			}
		} else {
			isLogin();
		}
	});

	mui.ajax(baseUrl + '/ajax/ppaper/incPageViews', {
		"type": "POST",
		"dataType": "json",
		"data": {
			"id": paperId
		},
		"success": function(data) {
			if(data.success) {}
		},
		"error": function() {

		}
	});

	//点击进入个人详情页面
	mui("#aboutAuthors").on("tap","li",function(){
		var oDataId =this.getAttribute("data-id");
		if(oDataId.substring(0,1)!="#"){
			mui.openWindow({
				url: '../html/userInforShow.html',
				id: 'html/userInforShow.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right",
				},
				extras: {
					proid: oDataId
				}
			});
		}else{
			
		}
	})

	function getRecourceMe() {
		mui.plusReady(function() {
			mui.ajax(baseUrl + '/ajax/ppaper/qo', {
				data: {
					"id": paperId
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'get', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					if(data.success) {
						console.log(JSON.stringify(data))
						paperHtml(data.data);
						getPaperAuthors(data.data.id)

						plus.nativeUI.closeWaiting();
						plus.webview.currentWebview().show("slide-in-right", 150);
					}
				},
				error: function(xhr, type, errorThrown) {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		})
	}

	function paperHtml($da) {
		document.getElementById("paperTit").innerHTML = $da.name;
		document.getElementById("paperName").innerHTML = $da.name; //名字
		document.getElementById("paperAbstract").innerHTML = $da.summary; //摘要内容
		if(!$da.cn4periodical) {
			$da.cn4periodical = ""
		}
		if(!$da.en4periodical) {
			$da.en4periodical = ""
		}
		if(!$da.cn4periodical && !$da.en4periodical) {
			document.getElementById("paperJournal").parentNode.parentNode.style.display = "none";
		} else {
			document.getElementById("paperJournal").innerHTML = $da.cn4periodical + " " + $da.en4periodical;
		}

		if(!$da.pubDay) {
			document.getElementById("paperVolume").parentNode.parentNode.style.display = "none";
		} else {
			document.getElementById("paperVolume").innerHTML = $da.pubDay;
		}
		if($da.keywords != undefined && $da.keywords.length != 0) {
			var subs = new Array();
			if($da.keywords.indexOf(',')) {
				subs = $da.keywords.split(',');
			} else {
				subs[0] = $da.keywords;
			}
			var pstr = ""
			if(subs.length > 0) {
				patentRelatedList(subs)
				for(var i = 0; i < subs.length; i++) {
					pstr += '<li><span class="h2Font">' + subs[i] + '</span></li>'
				};
				document.getElementsByClassName("tagList")[0].innerHTML = pstr;
			} else {
				document.getElementsByClassName("tagList")[0].style.display = "none";
			}
		}
	}
	/*获取论文作者信息*/
	function getPaperAuthors(stritrm) {

		mui.ajax(baseUrl + "/ajax/ppaper/authors", {
			"type": "GET",
			"success": function(data) {
				console.log(JSON.stringify(data))
				if(data.success) {
					if(data.data.length > 0) {
						document.getElementById("aboutAuthors").innerHTML = ""
						for(var i = 0; i < data.data.length; i++) {
							var authTy = "",
								authTit = "",
								baseInfo = "",
								imgbg = "../images/default-photo.jpg";
							if(data.data[i].professorId.substring(0, 1) != "#") {
								mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + data.data[i].professorId, {
									type: "get",
									async: true,
									success: function($proData) {
										console.log(JSON.stringify($proData))
										if($proData.success) {
											var showPro = $proData.data;
											if(showPro.hasHeadImage == 1) {
												imgbg = baseUrl + "/images/head/" + showPro.id + "_l.jpg";
											} else {
												imgbg = "../images/default-photo.jpg";
											}
											//认证
											var oSty = autho(showPro.authType, showPro.orgAuth, showPro.authStatus);
											authTy = oSty.sty;
											authTit = oSty.title;

											var title = showPro.title || "";
											var orgName = showPro.orgName || "";
											var office = showPro.office || "";
											if(orgName != "") {
												if(title != "") {
													baseInfo = title + "，" + orgName;
												} else {
													if(office != "") {
														baseInfo = office + "，" + orgName;
													} else {
														baseInfo = orgName;
													}
												}
											} else {
												if(title != "") {
													baseInfo = title;
												} else {
													if(office != "") {
														baseInfo = office;
													} else {
														baseInfo = "";
													}
												}
											}
											var liItem = document.createElement("li");
											liItem.setAttribute("data-id", showPro.id);
											var odis = (userid == showPro.id) ? "none" : "block";
											liItem.className = "mui-table-view-cell"
											var oString = '<div class="flexCenter mui-clearfix" style="width:80%;">'
											oString += '<div class="madiaHead useHead" style="background-image:url(' + imgbg + ')"></div>'
											oString += '<div class="madiaInfo"><p><span class="h1Font">' + showPro.name + '</span><em class="authicon ' + authTy + '" title="' + authTit + '"></em></p>'
											oString += '<p class="mui-ellipsis h2Font">' + baseInfo + '</p>'
											oString += '</div></div><span class="mui-icon attenSpan"  style="display:' + odis + ';" data-id="'+showPro.id+'">关注</span>'
											liItem.innerHTML = oString;
											document.getElementById("aboutAuthors").appendChild(liItem);
											if(userid){
											ifcollectionAbout1.call(liItem.getElementsByClassName("attenSpan")[0],showPro.id,1);}
										}
									}
								})
							} else {
								var liItem = document.createElement("li");
								var otext = (userName == data.data[i].name) ? "<span class='invite'>是我本人</span>" : "<span class='invite invite2'>邀请</span>";
								liItem.setAttribute("data-id", data.data[i].professorId);
								liItem.className = "mui-table-view-cell"
								var oString = '<div class="flexCenter mui-clearfix" style="width:80%;">'
								oString += '<div class="madiaHead useHead" style="background-image:url(' + imgbg + ')"></div>'
								oString += '<div class="madiaInfo"><p><span class="h1Font">' + data.data[i].name + '</span></p>'
								oString += '</div></div>' + otext 
								liItem.innerHTML = oString;
								document.getElementById("aboutAuthors").appendChild(liItem);
							}

						}
					}
				}
			},
			"data": {
				"id": stritrm
			},
			dataType: "json",
			'error': function(xhr, type, errorThrown) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	//判断是否登录，登录才可咨询，关注，收藏
	function isLogin() {
		var userid = plus.storage.getItem('userid');
		if(userid == null || userid == 'null' | userid == undefined | userid == 'undefined') {
			mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras: {
					ourl: self.id
				}
			});
			return 1;
		}
	};

	window.addEventListener("newId", function(event) {
		userName = plus.storage.getItem('name');
		userid = plus.storage.getItem('userid');
		getRecourceMe();
		ifcollectionAbout(paperId, 5);
	});

	function leadIn(sel) {
		mui.ajax(baseUrl + "/ajax/ppaper/ass", {
			"type": "POST",
			"data": {
				id: paperId,
				uid: userid,
				author: userName
			},
			"success": function(data) {
				if(data.success) {
					if(data.data > 0) {
						plus.nativeUI.toast("导入成功", toastStyle);
						sel.style.display = "none";
					}
				}
			}
		});
	}
	mui("#aboutAuthors").on("tap", "li>span", function(e) {
		var evt=e?e:window.event;
		evt.stopPropagation();
		var that = this;
		if(this.innerHTML === "是我本人") {
			if(isLogin()) {
				return;
			}
			var btn = ["确定", "取消"];
			mui.confirm("确认这是您发表的论文？", "提示", btn, function(e) {
				if(e.index == 0) {
					leadIn(that);
				}
			})
		} else if(this.innerHTML === "邀请") {
			var share = buildShareService("weixin");
			if(userid) {
				var our=baseUrl + "/e/I.html?i=" + s16to64(paperId)+"&d="+s16to64(userid)+"&f=1";
			} else{
				var our=baseUrl + "/e/I.html?i=" + s16to64(paperId)+"&f=1";
			}
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: "赶快认领，上千家企业正在期待与您合作",
					title: "您的论文被科袖网收录了",
					href: our,
					thumbs: [baseUrl + "/images/logo180.png"]
				});
			}
		} else if(this.innerHTML === "关注") {
			if(isLogin()) {
				return;
			}
					collectionAbout1(this.getAttribute("data-id"), '1',this);
					
		} else if(this.innerHTML === "已关注") {
			if(isLogin()) {
				return;
			}
			cancelCollectionAbout1(this.getAttribute("data-id"), '1',this);
		}
		
	})
	
	/*判断是否收藏资源文章或者是否关注专家*/
	function ifcollectionAbout1(watchObject,num) {
		var that=this;
		mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
			data: {
				"professorId": userid,
				"watchObject": watchObject
			},
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					if(num=="1"){//已关注专家
						that.classList.add("attenedSpan");
						that.innerText="已关注";
					}else{//已收藏资源或文章
						document.getElementById("ifCollect").classList.remove("icon-shoucang");
						document.getElementById("ifCollect").classList.add("icon-yishoucang");
					}
				} else {
					if(num=="1"){//关注专家
						that.classList.remove("attenedSpan");
						that.innerText="关注";
					}else{//收藏资源或文章
						document.getElementById("ifCollect").classList.add("icon-shoucang");
						document.getElementById("ifCollect").classList.remove("icon-yishoucang");
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*收藏资源、文章或者关注专家*/
	function collectionAbout1(watchObject, num,sel) {
		mui.ajax(baseUrl + '/ajax/watch', {
			data: {
				"professorId": userid,
				"watchObject": watchObject,
				"watchType": num
			},
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success) {
					if(num=="1"){//关注专家
						sel.classList.add("attenedSpan");
						sel.innerText="已关注";
						plus.nativeUI.toast("关注成功", toastStyle);
					}else{//收藏资源或文章
						document.getElementById("ifCollect").classList.remove("icon-shoucang");
						document.getElementById("ifCollect").classList.add("icon-yishoucang");
						plus.nativeUI.toast("收藏成功", toastStyle);
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*取消收藏资源、文章或者取消关注专家*/
	function cancelCollectionAbout1(watchObject, num,sel) {
		mui.ajax({
			url: baseUrl + '/ajax/watch/delete',
			data: {
				professorId: userid,
				watchObject: watchObject
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					if(num=="1"){//关注专家
						sel.classList.remove("attenedSpan");
						sel.innerText="关注";
						plus.nativeUI.toast("已取消关注", toastStyle);
					}else{//收藏资源或文章
						document.getElementById("ifCollect").classList.add("icon-shoucang");
						document.getElementById("ifCollect").classList.remove("icon-yishoucang");
						plus.nativeUI.toast("已取消收藏", toastStyle);
					}
					
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}
	var r64 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "-", "_"];
		var d64 = {
			"0": 0,
			"1": 1,
			"2": 2,
			"3": 3,
			"4": 4,
			"5": 5,
			"6": 6,
			"7": 7,
			"8": 8,
			"9": 9,
			"A": 10,
			"B": 11,
			"C": 12,
			"D": 13,
			"E": 14,
			"F": 15,
			"G": 16,
			"H": 17,
			"I": 18,
			"J": 19,
			"K": 20,
			"L": 21,
			"M": 22,
			"N": 23,
			"O": 24,
			"P": 25,
			"Q": 26,
			"R": 27,
			"S": 28,
			"T": 29,
			"U": 30,
			"V": 31,
			"W": 32,
			"X": 33,
			"Y": 34,
			"Z": 35,
			"a": 36,
			"b": 37,
			"c": 38,
			"d": 39,
			"e": 40,
			"f": 41,
			"g": 42,
			"h": 43,
			"i": 44,
			"j": 45,
			"k": 46,
			"l": 47,
			"m": 48,
			"n": 49,
			"o": 50,
			"p": 51,
			"q": 52,
			"r": 53,
			"s": 54,
			"t": 55,
			"u": 56,
			"v": 57,
			"w": 58,
			"x": 59,
			"y": 60,
			"z": 61,
			"-": 62,
			"_": 63
		};
		function s16to64(s) {
			var out, idx, n1, n2, n3;
			idx = s.length - 1;
			out = "";
			while(idx >= 0) {
				n1 = d64[s.charAt(idx--)];
				if(idx < 0) {
					out = r64[n1] + out;
					break;
				}
				n2 = d64[s.charAt(idx--)];
				if(idx < 0) {
					out = r64[(n2 >>> 2)] + r64[((n2 & 0x3) << 4) + n1] + out;
					break;
				}
				n3 = d64[s.charAt(idx--)];
				out = r64[(n2 >>> 2) + (n3 << 2)] + r64[((n2 & 0x3) << 4) + n1] + out;
			}
			return out;
		}

		function s64to16(s) {
			var out, idx, n1, n2;
			idx = s.length - 1;
			out = "";
			while(idx >= 0) {
				n1 = d64[s.charAt(idx--)];
				if(idx < 0) {
					out = r64[n1 >>> 4] + r64[n1 & 0xF] + out;
					break;
				}
				n2 = d64[s.charAt(idx--)];
				out = r64[(n2 >>> 2)] + r64[(n1 >>> 4) + ((n2 & 0x3) << 2)] + r64[n1 & 0xF] + out;
			}
			return out;
		}
	/*微信及微信朋友圈分享专家*/
	var auths, shares;
	plus.oauth.getServices(function(services) {
		auths = {};
		for(var i in services) {
			var t = services[i];
			auths[t.id] = t;

		}
	}, function(e) {
		alert("获取登录服务列表失败：" + e.message + " - " + e.code);
	});
	plus.share.getServices(function(services) {

		shares = {};
		for(var i in services) {

			var t = services[i];

			shares[t.id] = t;

		}
	}, function(e) {
		alert("获取分享服务列表失败：" + e.message + " - " + e.code);
	});
	mui("#shareBlock").on("tap", "li", function() {
		document.getElementById("shareBlock").style.display = "none";
		document.getElementById("maskBlack").style.display = "none";
		var oFen = this.getElementsByTagName("span")[0].innerHTML;

		var oUrl = baseUrl + "/images/logo180.png";

		if(oFen == "微信好友") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: document.getElementById("paperAbstract").innerHTML.substring(0, 40),
					title: document.getElementById("paperName").innerHTML,
					href: baseUrl + "/e/l.html?id=" + paperId,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "微信朋友圈") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneTimeline", {
					content: document.getElementById("paperAbstract").innerHTML.substring(0, 40),
					title: document.getElementById("paperName").innerHTML,
					href: baseUrl + "/e/l.html?id=" + paperId,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content: document.getElementById("paperName").innerHTML + baseUrl + "/e/l.html?id=" + paperId,
				});
			}
		}

	})

	function buildShareService(ttt) {
		var share = shares[ttt];
		if(share) {
			if(share.authenticated) {
				console.log("---已授权---");
			} else {
				console.log("---未授权---");
				share.authorize(function() {
					console.log('授权成功...')
				}, function(e) {
					//alert("认证授权失败：" + e.code + " - " + e.message);
					return null;
				});
			}
			return share;
		} else {
			alert("没有获取微信分享服务");
			return null;
		}

	}

	function shareMessage(share, ex, msg) {
		msg.extra = {
			scene: ex
		};
		share.send(msg, function() {
			plus.nativeUI.closeWaiting();
			if(plus.storage.getItem('userid')) {
				//shareAddIntegral(2);
				if(msg.content=="赶快认领，上千家企业正在期待与您合作") {
					shareAddIntegral(1);
				}else{
					shareAddIntegral(6);
				}
			}
		}, function(e) {
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
				
			}
		});
	}

	/*图像预览*/
	mui.previewImage();
	moreMes();

	function moreMes() {
		document.getElementById("BtnMore").addEventListener("tap", function() {
			var oUrl = baseUrl + "/images/logo180.png";
			plus.nativeUI.showWaiting(); //显示原生等待框
			var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
				proid: paperId,
				name: "paper",
				data: {
					content: document.getElementById("paperAbstract").innerHTML.substring(0, 40),
					title: document.getElementById("paperName").innerHTML,
					href: baseUrl + "/e/l.html?id=" + paperId,
					thumbs: [oUrl]
				},
				weiboData: {
					content: document.getElementById("paperName").innerHTML + baseUrl + "/e/l.html?id=" + paperId,
				}
			})
		})
	}
	mui(".artfoot").on("tap", ".inputShow", function() {
		if(!plus.storage.getItem('userid')) {
			mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras: {
					ourl: self.id
				}
			});
			return;
		}
		document.getElementById("textInput").style.display = "block";
		document.getElementById("operCol").style.display = "none";
		document.getElementById("textInputThis").focus();
	})
	isAgreeNum()
	function isAgreeNum() {
	var data = {"id": paperId}
	mui.ajax(baseUrl+"/ajax/ppaper/agreeCount",{		
		data:data,
		dataType: 'json', //数据格式类型
		type: 'get', //http请求类型
		timeout: 10000,
		async: true,
		success: function(data) {
			if(data.success){
					document.getElementById("snum").innerHTML=data.data;
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}
	if(userid && userid != "null" && userid != null) {
					isAgree() //文章点赞
				} 
	/*判断论文是否被赞*/
function isAgree() {
	var data = {"id": paperId,"uid":userid }
	mui.ajax(baseUrl+"/ajax/ppaper/agree",{	
		data:data,
		dataType: 'json', //数据格式类型
		type: 'get', //http请求类型
		timeout: 10000,
		async: true,
		success: function(data) {
			if(data.success){
				if(data.data){
					document.getElementsByClassName("thumbBtn")[0].classList.add("thumbedBtn");
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}
mui('.thumbBlock').on("tap",".thumbBtn",function(){
	if (!isLogin()) {
		if(this.className=="thumbBtn thumbedBtn"){
			return;
		}
		addAgree();
	}
})
/*点赞*/
function addAgree() {
	var data = {"uid": userid,"id": paperId}
	mui.ajax(baseUrl+"/ajax/ppaper/agree",{		
		data:data,
		dataType: 'json', //数据格式类型
		type: 'POST', //http请求类型
		timeout: 10000,
		async: true,
		success: function(data) {
			if(data.success){
			document.getElementById("snum").innerHTML = Number(document.getElementById("snum").innerHTML) + 1;
			document.getElementsByClassName("thumbBtn")[0].classList.add("thumbedBtn");
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}
mui(".artfoot").on("tap", ".inputShow", function() {
	
		if(!isLogin()) {
			document.getElementById("textInput").style.display = "block";
			document.getElementById("operCol").style.display = "none";
			document.getElementById("textInputThis").focus();
		}
		
	})
leword();

function leword() {
		var data = {"paperId": paperId,"rows": 500}	
		mui.ajax(baseUrl + "/ajax/leaveWord/ql/paper", {
			data: data,
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			traditional: true,
			success: function(data) {
				if(data.success) {
					document.getElementsByClassName('commentBlock')[0].innerHTML = ""
					if(data.data.length == 0) {
						return;
					}
					var id = plus.storage.getItem('userid');
					for(var i = 0; i < data.data.length; i++) {
						var oText = ""
						if(id == data.data[i].professor.id) {
							oText = "删除"
						}
						var userType = autho(data.data[i].professor.authType, data.data[i].professor.orgAuth, data.data[i].professor.authStatus);
						var baImg = "../images/default-photo.jpg";
						if(data.data[i].professor.hasHeadImage == 1) {
							baImg = baseUrl + "/images/head/" + data.data[i].professor.id + "_l.jpg";
						}
						var li = document.createElement("li");
						li.className = "mui-table-view-cell";
						li.innerHTML = '<div class="flexCenter mui-clearfix">' +
							'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')" data-id="' + data.data[i].professor.id + '"></div>' +
							'<div class="madiaInfo">' +
							'<p><span class="h1Font" data-id="' + data.data[i].professor.id + '">' + data.data[i].professor.name + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
							'</div>' +
							'</div>' +
							'<div class="madiaInfo">' +
							'<p class="h2Font">' + data.data[i].content + '</p>' +
							'<p class="operateSpan">' +
							'<span class="commenttime">' + commenTime(data.data[i].createTime) + '</span>' +
							'<span data-id="' + data.data[i].id + '" class="dele">' + oText + '</span>' +
							'</p>' +
							'</div>'
						document.getElementsByClassName("commentBlock")[0].appendChild(li);
					}

				} else {
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
}
lewordNum();
function lewordNum() {
		var data = {"paperId": paperId}	
		mui.ajax(baseUrl + "/ajax/leaveWord/lwCount/paper", {
			data: data,
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			traditional: true,
			success: function(data) {
				if(data.success) {
					document.getElementsByClassName("mui-badge")[0].innerHTML=data.data;
					}

				
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
}
function trim(str) { //删除左右两端的空格
		　　
		return str.replace(/(^\s*)|(\s*$)/g, "");　　
	}
document.getElementById("textInputThis").addEventListener("input", function() {
		var length = trim(this.value);
		if(length) {
			document.getElementsByClassName("mui-btn")[0].removeAttribute("disabled")
		} else {
			document.getElementsByClassName("mui-btn")[0].setAttribute("disabled", "true")
		}
	})
document.getElementsByClassName("mui-btn")[0].addEventListener("tap", function() {
		mui.ajax(baseUrl + "/ajax/leaveWord/paper", {
			data: {
				"paperId": paperId,
				"sender": plus.storage.getItem('userid'),
				"content": document.getElementById("textInputThis").value
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.success) {
					document.getElementById("textInputThis").value = "";
					document.getElementById('textInput').style.display = "none";
					document.getElementById('operCol').style.display = "block";
					leword();
					lewordNum();
				}
			},
			error: function() {
				//异常处理；
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	})
mui(".commentBlock").on("tap", ".dele", function() {
		var $this = this;
		mui.ajax(baseUrl + "/ajax/leaveWord/delete", {
			data: {
				"id": this.getAttribute("data-id"),
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.success) {
					document.getElementsByClassName("commentBlock")[0].removeChild($this.parentNode.parentNode.parentNode);
					leword();
					lewordNum();
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	})
mui('.commentBlock').on('tap', '.useHead,.h1Font', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
			proid: id
		});
	})
//您可能感兴趣的论文
	paperInterestingList()
	function paperInterestingList(){
		mui.ajax(baseUrl+"/ajax/ppaper/ralatePapers",{
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{
				"paperId":paperId
			},
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				if(data.success) {
					console.log(data);
					var $data = data.data;
					if($data.length > 0){
						document.getElementById("paperModule").style.display="block";
						for(var i = 0; i < $data.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", $data[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead paperHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis h1Font">' + $data[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("paperList").appendChild(li);
						}
					}
				}
			},
			"error":function(){
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}
	//根据关键词查询查找相关专利
	function patentRelatedList(array){
		mui.ajax(baseUrl+"/ajax/ppatent/assPatents",{
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{
				"kws":array
			},
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				if(data.success) {
					console.log(data);
					var $data = data.data;
					if($data.length > 0){
						document.getElementById("paperModule").style.display="block";
						for(var i = 0; i < $data.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", $data[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead patentHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis h1Font">' + $data[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">作者:' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("patentList").appendChild(li);
						}
					}
				}
			},
			"error":function(){
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}
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
});