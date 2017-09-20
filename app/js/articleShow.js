//var createTime = "",
//	orderKey = "";
//mui.init({
//	pullRefresh: {
//		container: '#pullrefresh',
//		up: {
//			contentrefresh: '正在加载...',
//			callback: pullupRefresh
//		}
//	}
//});
//
//function pullupRefresh() {
//	setTimeout(function() {
//		leword(1, 0);
//	}, 1000);
//}
leword(500, 1);
var stt;
function leword(row, aa) {
	mui.plusReady(function() {
		var af = aa,
			stt;
		var obj = {};
		obj.articleId = plus.webview.currentWebview().articleId;
		/*obj.createTime = createTime;
		obj.orderKey = orderKey;*/
		obj.rows = row;
		mui.ajax(baseUrl + "/ajax/leaveWord/ql", {
			data: obj,
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			traditional: true,
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.success) {
					/*if(af == 1) {*/
					document.getElementsByClassName('commentBlock')[0].innerHTML = ""
					if(data.data.length == 0) {
						//mui('#pullrefresh').pullRefresh().disablePullupToRefresh(true);
						return;
					}
					/*} else {
						if(data.data.length == 0) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							return;
						}
					}*/
					var id = plus.storage.getItem('userid');
					/*createTime = data.data[data.data.length - 1].createTime;
					orderKey = data.data[data.data.length - 1].orderKey;*/
					/*if(data.data.length == row) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}*/
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
					/*mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);*/
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	})
}

mui.plusReady(function() {
	var ffl=false;
	var oCurren = {
		self: plus.webview.currentWebview(),
		userid: plus.storage.getItem('userid'),
		login: function() {
			mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-bottom"
				},
				extras: {
					ourl: plus.webview.currentWebview().id
				}
			});
		}
	}
	var leaveWord = {
		getLeaveWord: function($data) {
			console.log(JSON.stringify($data));
		},
		sendLeaveWord: function($data) {
			console.log(JSON.stringify($data));
		},
		leaveWordTotal: function($data) {
			document.getElementsByClassName('mui-badge')[0].innerHTML = $data
		}
	}
	
	var oArticleModule = {
		articleId: oCurren.self.articleId,
//		oFlag: oCurren.self.oFlag,
//		oWner: oCurren.self.ownerid,
		oAjaxGet: function(url, obj, oType, oFun) {
			mui.ajax(url, {
				data: obj,
				dataType: 'json', //服务器返回json格式数据
				type: oType, //HTTP请求类型//超时时间设置为10秒；
				traditional: true,
				success: function(data) {
					if(data.success) {
						oFun(data.data);
					} else {
						//alert(JSON.stringify(data));
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		},
		articleMess: function($data) {
			plus.nativeUI.closeWaiting();
			plus.webview.currentWebview().show("slide-in-right", 150);
			console.log(JSON.stringify($data));
			document.getElementById("articleName").innerHTML = $data.articleTitle;
			if($data.articleType=='2'){
				oArticleModule.oFlag = 1;
				oArticleModule.oWner=$data.orgId;
			}else{
				oArticleModule.oWner=$data.professorId;
			}
			if($data.articleImg){
				stt = $data.articleImg.substring(0, 9);
			}
			console.log(stt)
			if($data.articleContent) {
				document.getElementById("articleContent").innerHTML = $data.articleContent;
				var oImg = document.getElementById("articleContent").getElementsByTagName("img");
				for(var i = 0; i < oImg.length; i++) {
					(function(n) {
						var att = oImg[n].src.substr(7);
						oImg[n].setAttribute("src", baseUrl + att);
					})(i);
				}
			}
			if($data.subject) {
				document.getElementsByClassName("tagList")[0].style.display = "block";
				var arr = $data.subject.split(",");
				for(var i in arr) {
					var oLi = document.createElement("li");
					oLi.innerHTML = '<span class="h2Font">' + arr[i] + '</span>'
					document.getElementsByClassName("tagList")[0].appendChild(oLi);
				}
			}
			document.getElementById("snum").innerHTML = $data.articleAgree;
			if($data.articleType == 1) {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralateArticles", {
					"keys": arr,
					"professorId": oArticleModule.oWner,
					"articleId": oArticleModule.articleId,
					"rows": 5
				}, "get", oArticleModule.correlationArticle);
			} else {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralateArticles", {
					"keys": arr,
					"orgId": oArticleModule.oWner,
					"articleId": oArticleModule.articleId,
					"rows": 5
				}, "get", oArticleModule.correlationArticle);
			}

			document.getElementById("oTime").innerHTML = commenTime($data.publishTime);
			
			if(oArticleModule.oFlag == 1) {
				/*企业发布文章信息*/
				oArticleModule.oAjaxGet(baseUrl + "/ajax/org/" + oArticleModule.oWner, "", "get", oArticleModule.business);
				//document.getElementById('attBtn').style.display = "none";
				companylist();
				if(oCurren.userid)
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}, "get", oArticleModule.attentionGetExpert);
			} else {
				if(plus.storage.getItem('userid') == oArticleModule.oWner) {
					document.getElementById('attBtn').style.display = "none";
				}
				mui('#personAL').on('tap', '#messImg,#name', function() {
					var id = oArticleModule.oWner;
					plus.nativeUI.showWaiting(); //显示原生等待框
					plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
						proid: id
					}); //后台创建webview并打开show.html
				})
				/*查询是否关注专家*/
				if(oCurren.userid)
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}, "get", oArticleModule.attentionGetExpert);
				/*个人发布文章信息*/
				oArticleModule.oAjaxGet(baseUrl + "/ajax/professor/editBaseInfo/" + oArticleModule.oWner, "", "get", oArticleModule.professorMess);
			}
			
		},
		professorMess: function($data) {
			//console.log(JSON.stringify($data));
			document.getElementById('name').innerHTML = $data.name;
			if($data.hasHeadImage == 1) {
				document.getElementById("messImg").style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg" + ")";
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			document.getElementById("auth").classList.add(userType.sty);
		},
		business: function($data) {
			//console.log(JSON.stringify($data));
			if($data.forShort){
				document.getElementById('name').innerHTML = $data.forShort;
			}else{
				document.getElementById('name').innerHTML = $data.name;
			}
			document.getElementById("messImg").classList.add("cmpHead2");
			document.getElementById("messImg").innerHTML='<div class="boxBlock"><img class="boxBlockimg" id="companyImg" src="../images/default-icon.jpg"></div>'
			if($data.hasOrgLogo) {
				document.getElementById("companyImg").src= baseUrl + "/images/org/" + $data.id + ".jpg";
			}
			if($data.authStatus==3){
				document.getElementById("auth").classList.add("authicon-com-ok");
			}
			mui('#personAL').on('tap', '#messImg,#name', function() {
				mui.openWindow({
					url: '../html/cmpInforShow.html',
					id: 'cmpInforShow.html',
					show: {
						autoShow: false,
						aniShow: "slide-in-right",
					},
					extras: {
						cmpId: oArticleModule.oWner,
					}
				});
			})
		},
		correlationExpert: function($data) {
			if($data.length == 0) {
				return;
			}
			document.getElementById("correlationExpert").style.display = "block";
			for(var i = 0; i < $data.length; i++) {
				(function(n) {
					oArticleModule.oAjaxGet(baseUrl + "/ajax/professor/editBaseInfo/" + $data[n].professorId, "", "get", oArticleModule.expertList);
				})(i)

			}

		},
		expertList: function($data) {
			var os = "";
			if($data.title) {
				if($data.orgName) {
					os = $data.title + "，" + $data.orgName;
				} else {
					os = $data.title;
				}
			} else {
				if($data.office) {
					if($data.orgName) {
						os = $data.office + "，" + $data.orgName;
					} else {
						os = $data.office;
					}
				} else {
					if($data.orgName) {
						os = $data.orgName;
					}
				}
			}
			var baImg = "../images/default-photo.jpg";
			if($data.hasHeadImage == 1) {
				baImg = baseUrl + "/images/head/" + $data.id + "_l.jpg";
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			var li = document.createElement("li");
			li.className = "mui-table-view-cell";
			li.setAttribute("data-id", $data.id);
			li.innerHTML = '<div class="flexCenter mui-clearfix">' +
				'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
				'<div class="madiaInfo">' +
				'<p><span class="h1Font">' + $data.name + '</span><em class="authicon ' + userType.sty + '"></em></p>' +
				'<p class="mui-ellipsis h2Font">' + os + '</p>' +
				'</div>' +
				'</div>'
			document.getElementById("expertList").appendChild(li);
		},
		correlationResource: function($data) {
			//console.log(JSON.stringify($data));
			if($data.length == 0) {
				return;
			}
			document.getElementById("resource").style.display = "block";
			for(var i = 0; i < $data.length; i++) {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/resource/queryOne", {
					"resourceId": $data[i].resourceId
				}, "get", oArticleModule.rsourceList);
			}

		},
		rsourceList: function($data) {
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
			if($data.images.length>0){
				rImg = baseUrl + "/data/resource/" + $data.images[0].imageSrc;
			}
			var li = document.createElement("li");
			li.setAttribute("data-id", $data.resourceId);
			li.className = "mui-table-view-cell";
			li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
				' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
				'<div class="madiaInfo OmadiaInfo">' +
				'<p class="mui-ellipsis-2 h1Font">' + $data.resourceName + '</p>' +
				'<p><span class="h2Font">' + namepo + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
				'</div>' +
				'</div>'
			document.getElementById("resourceList").appendChild(li);
		},
		correlationArticle: function($data) {
				if($data.total) {
					if($data.data.length == 0) {
						return;
					}
				}else{
					if($data.length == 0) {
						return;
					}
				}
				var oo=1;
			if($data.total) {
				var $data=$data.data;
				
				document.getElementById('newarticle').style.display = "block";
				oo=0;
			}else{
				document.getElementById('article').style.display = "block";
				
			}
			
			for(var i = 0; i < $data.length; i++) {
				var ourl, of ;
				if($data[i].articleType == 1) {
					ourl = baseUrl + "/ajax/professor/editBaseInfo/" + $data[i].professorId; of = 1;
				} else {
					ourl = baseUrl + "/ajax/org/" + $data[i].orgId; of = 2;
				}
				var arImg = "../images/default-artical.jpg";
				if($data[i].articleImg) {
					arImg = baseUrl + "/data/article/" + $data[i].articleImg
				}
				var title = $data[i].articleTitle;
				mui.ajax(ourl, {
					dataType: 'json', //服务器返回json格式数据
					type: "get", //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					async: false,
					traditional: true,
					success: function(data) {
						if(data.success) {
							var namepo=""
							var li = document.createElement("li");
							if( of == 1) {
								namepo = data.data.name;
								var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
								li.setAttribute("owner-id", data.data.id);
								li.setAttribute("data-type", 1);
							} else {
								if(data.data.forShort){
									namepo = data.data.forShort;
								}else{
									namepo = data.data.name;
								}
								var userType = {};
								if(data.data.authStatus == 3) {
									userType.sty = 'authicon-com-ok'
								} else {
									userType.sty = "e"
								}
								li.setAttribute("owner-id", data.data.id);
								li.setAttribute("data-type", 2);
							}
							li.setAttribute("data-id", $data[i].articleId);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + title + '</p>' +
								'<p><span class="h2Font" style="margin-right:10px">'+namepo+'</span><span class="time">'+commenTime($data[i].publishTime)+'</span></p>'+
								'</div>' +
								'</div>'
							
							if(oo==0){
								document.getElementById("newarticleList").appendChild(li)
							}else{document.getElementById("articleList").appendChild(li);}
						}
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				});
			}
		},
		thumbsUp: function($data) {
			document.getElementById("snum").innerHTML = Number(document.getElementById("snum").innerHTML) + 1;
			document.getElementsByClassName("thumbBtn")[0].classList.add("thumbedBtn");
		},
		thumbs: function($data) {

			if($data) {
				document.getElementsByClassName("thumbBtn")[0].classList.add("thumbedBtn");
			}
		},
		attentionGetExpert: function($data) {
			if($data) {
				document.getElementsByClassName("attenSpan")[0].classList.add("attenedSpan");
				document.getElementsByClassName("attenSpan")[0].innerText = "已关注";
			}
		},
		attentionPostExpert: function($data) {
			document.getElementsByClassName("attenSpan")[0].classList.add("attenedSpan");
			document.getElementsByClassName("attenSpan")[0].innerText = "已关注";
		},
		attentionNoPostExpert: function($data) {
			document.getElementsByClassName("attenSpan")[0].classList.remove("attenedSpan");
			document.getElementsByClassName("attenSpan")[0].innerText = "关注";
		},
		storeGetUp: function($data) {
			if($data) {
				document.getElementsByClassName("icon-shoucang")[0].classList.add("icon-yishoucang");
			}
		},
		storePostUp: function($data) {
			plus.nativeUI.toast("收藏成功", toastStyle);
			document.getElementsByClassName("icon-shoucang")[0].classList.add("icon-yishoucang");
			console.log(document.getElementsByClassName("icon-shoucang")[0].className);
		},
		storeDeleteUp: function($data) {
			plus.nativeUI.toast("已取消收藏", toastStyle);
			document.getElementsByClassName("icon-shoucang")[0].classList.remove("icon-yishoucang");
		},
	}
	/*文章详细内容*/
	oArticleModule.oAjaxGet(baseUrl + "/ajax/article/query", {
		articleId: oArticleModule.articleId
	}, "get", oArticleModule.articleMess);
	mui.ajax(baseUrl + '/ajax/article/pageViews',{
		"type" :  "POST" ,
		"dataType" : "json",
		"data" :{"articleId":oArticleModule.articleId},
		"success" : function(data) {
			console.log(data);
			if (data.success){
			}
		},
		"error":function(){
			
		}
	});
	oArticleModule.oAjaxGet(baseUrl + "/ajax/article/find", {pageSize:5}, "get", oArticleModule.correlationArticle);
	oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralatePro", {
		"articleId": oArticleModule.articleId
	}, "get", oArticleModule.correlationExpert);
	oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralateRes", {
		"articleId": oArticleModule.articleId
	}, "get", oArticleModule.correlationResource);
	//相关企业
	function companylist() {
		mui.ajax(baseUrl+"/ajax/article/ralateOrg",{
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		data: {
			"articleId": oArticleModule.articleId,
		},
		timeout: 10000, //超时设置
		success: function(data) {
			if(data.success) {
				
				var $data=data.data;
				if($data.length) {
					document.getElementById("bus").style.display="block";
				}
				for(var i=0;i<$data.length;i++) {
					angleBus.call($data[i])
				}
			}
		},
		error: function() {
			$.MsgBox.Alert('提示', '服务器请求失败')
		}
	});
	}
	function angleBus() {
		mui.ajax(baseUrl+"/ajax/org/" +this.orgId,{
			type: "GET",
			timeout: 10000,
			dataType: "json",
			context: document.getElementById("busList"),
			success: function(data) {
				if(data.success) {
					busfil.call(this,data.data);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	function busfil($data) {				
				var li = document.createElement("li");
					li.setAttribute("data-id", $data.id);
					var oimg = ($data.hasOrgLogo) ? baseUrl + "/images/org/" + $data.id + ".jpg" : "../images/default-icon.jpg";
					var oAuth = ($data.authStatus == 3) ? 'authicon-com-ok' : '';
					var orgName = ($data.forShort) ? $data.forShort : $data.name;
					var orgType = ($data.orgType == '2') ? "上市企业" : "";
					var orgOther = ($data.industry) ? $data.industry.replace(/,/gi, " | ") : "";
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						'<div class="madiaHead companyHead">' +
						'<div class="boxBlock" style="width:88px;height:58px;"><img class="boxBlockimg companyImg" src="' + oimg + '"></div>' +
						'</div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + orgName + '<em class="authicon ' + oAuth + '" title="科袖认证企业"></em></p>' +
						'<p class="mui-ellipsis h2Font"><span id="">' + orgType + '</span> <span id="">' + orgOther + '</span></p>' +
						'</div>' +
						'</div>'
					this.appendChild(li);

}
	mui('#expertList').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
			proid: id
		});
	})
	mui('#busList').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/cmpInforShow.html", 'cmpInforShow.html', {}, {
			cmpId: id
		});
	})
	/*留言*/
	mui('.commentBlock').on('tap', '.useHead,.h1Font', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
			proid: id
		});
	})
	/*资源浏览*/
	mui('#resourceList').on('tap', 'li', function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
		});
	})
	mui('#articleList,#newarticleList').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		var webviewShow=plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
			articleId: id
		});
		webviewShow.addEventListener("loaded", function() {
			setTimeout(function(){plus.webview.currentWebview().close()},1000)
			
		}, false);

	});
	document.getElementsByClassName("thumbBtn")[0].addEventListener("tap", function() {
		var oClsNm = document.getElementById("snum").parentNode.className;
		if(oClsNm == 'thumbBtn thumbedBtn')
			return;
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid) {
			oArticleModule.oAjaxGet(baseUrl + "/ajax/article/agree", {
				"articleId": oArticleModule.articleId,
				'operateId': oCurren.userid
			}, "post", oArticleModule.thumbsUp);
		} else {
			oCurren.login();
		}
	})
	/*查询是否点赞,登录状态下查询否则不查*/
	if(oCurren.userid) {
		oArticleModule.oAjaxGet(baseUrl + "/ajax/article/isAgree", {
			"articleId": oArticleModule.articleId,
			'operateId': oCurren.userid
		}, "get", oArticleModule.thumbs);
		/*查询是否收藏文章*/
		oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
			"watchObject": oArticleModule.articleId,
			'professorId': oCurren.userid
		}, "get", oArticleModule.storeGetUp);

	}
	/*自定义事件*/
	window.addEventListener("newId", function(event) {
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid == oArticleModule.oWner) {
			document.getElementById('attBtn').style.display = "none";
		}
		
			/*查询是否关注专家*/
		oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
			"watchObject": oArticleModule.oWner,
			'professorId': oCurren.userid
		}, "get", oArticleModule.attentionGetExpert);
		
		oArticleModule.oAjaxGet(baseUrl + "/ajax/article/isAgree", {
			"articleId": oArticleModule.articleId,
			'operateId': oCurren.userid
		}, "get", oArticleModule.thumbs);

		

		/*查询是否收藏文章*/
		oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
			"watchObject": oArticleModule.articleId,
			'professorId': oCurren.userid
		}, "get", oArticleModule.storeGetUp);
	})

	document.getElementsByClassName("attenSpan")[0].addEventListener("tap", function() {
		var oClsNm = document.getElementsByClassName("attenSpan")[0].className;
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid) {
			var $info={};
			if(oArticleModule.oFlag == 1) {
				$info={
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}
			}else{
				$info={
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}
			}
			if(oClsNm == 'mui-icon attenSpan attenedSpan') {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/delete",$info , "post", oArticleModule.attentionNoPostExpert);
			} else {
				if(oArticleModule.oFlag == 1) {
					$info.watchType=6;
				}else{
					$info.watchType=1;
				}
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch", $info, "post", oArticleModule.attentionPostExpert);
			}
		} else {
			oCurren.login();
		}
	})
	/*收藏文章*/
	//  
	document.getElementById('atto').addEventListener("tap", function() {
		var oClsNm = document.getElementsByClassName("icon-shoucang")[0].className;
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid) {
			if(oClsNm == 'mui-icon iconfontnew icon-shoucang icon-yishoucang') {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/delete", {
					"watchObject": oArticleModule.articleId,
					'professorId': oCurren.userid
				}, "post", oArticleModule.storeDeleteUp);
			} else {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch", {
					"watchObject": oArticleModule.articleId,
					'professorId': oCurren.userid,
					"watchType": 3
				}, "post", oArticleModule.storePostUp);
			}
		} else {
			oCurren.login();
		}
	})
	/*留言总数*/
	function trim(str) { //删除左右两端的空格
		　　
		return str.replace(/(^\s*)|(\s*$)/g, "");　　
	}
	oArticleModule.oAjaxGet(baseUrl + "/ajax/leaveWord/lwCount", {
		"articleId": oArticleModule.articleId
	}, "get", leaveWord.leaveWordTotal);
	document.getElementById("textInputThis").addEventListener("input", function() {
		var length = trim(this.value);
		if(length) {
			document.getElementsByClassName("mui-btn")[0].removeAttribute("disabled");
			
		} else {
			document.getElementsByClassName("mui-btn")[0].setAttribute("disabled", "true")
		}
		
	})
	document.getElementsByClassName("mui-btn")[0].addEventListener("tap", function() {
		if(document.getElementById("textInputThis").value.length>200) {
				plus.nativeUI.toast("留言不得超过200个字", toastStyle);
				return;
			}
		mui.ajax(baseUrl + "/ajax/leaveWord", {
			data: {
				"articleId": plus.webview.currentWebview().articleId,
				"sender": plus.storage.getItem('userid'),
				"content": document.getElementById("textInputThis").value
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.success) {
					document.getElementById("textInputThis").value = "";
					//					createTime = "";
					//					orderKey = "";
					//					mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
					document.getElementById('textInput').style.display = "none";
					document.getElementById('operCol').style.display = "block";
					leword(500, 1);
					oArticleModule.oAjaxGet(baseUrl + "/ajax/leaveWord/lwCount", {
						"articleId": oArticleModule.articleId
					}, "get", leaveWord.leaveWordTotal)
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			},
			beforeSend: function(data) {
				console.log(JSON.stringify(data));
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
					//					createTime = "";
					//					orderKey = "";
					//					mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
					leword(500, 1);
					oArticleModule.oAjaxGet(baseUrl + "/ajax/leaveWord/lwCount", {
						"articleId": oArticleModule.articleId
					}, "get", leaveWord.leaveWordTotal)
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	})
	mui(".artfoot").on("tap", ".inputShow", function() {
		if(!plus.storage.getItem('userid')) {
			oCurren.login();
			return;
		}
		document.getElementById("textInput").style.display = "block";
		document.getElementById("operCol").style.display = "none";
		document.getElementById("textInputThis").focus();
	})

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
		if(oFen == "微信好友") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: document.getElementById("articleContent").innerText.substring(0, 70),
					title: document.getElementById("articleName").innerHTML,
					href: baseUrl + "/e/a.html?id=" + oArticleModule.articleId,
					thumbs: [baseUrl + "/data/article/" + stt + oArticleModule.articleId + "_s.jpg"]
				});
			}
		} else if(oFen == "微信朋友圈") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneTimeline", {
					content: document.getElementById("articleContent").innerText.substring(0, 70),
					title: document.getElementById("articleName").innerHTML,
					href: baseUrl + "/e/a.html?id=" + oArticleModule.articleId,
					thumbs: [baseUrl + "/data/article/" + stt + oArticleModule.articleId + "_s.jpg"]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content: document.getElementById("articleName").innerHTML+baseUrl + "/e/a.html?id=" + oArticleModule.articleId
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
				shareAddIntegral(3);
			}

		}, function(e) {
			console.log(JSON.stringify(e))
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
			
			}
		});
	}

	mui(".tagList").on("tap", "li", function() {
		 plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/searchListNew2.html?content=6", "../html/searchListNew2.html", {}, {
			key: this.getElementsByTagName("span")[0].innerHTML,
			qiFlag: 3
		}); 
	})
	
	moreMes();
	function moreMes(){
		document.getElementById("BtnMore").addEventListener("tap",function(){
			var oUrl=baseUrl + "/images/logo180.png";
			plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
			proid: oArticleModule.articleId,
			name:"article",
			data:{
					content: document.getElementById("articleContent").innerText.substring(0, 70),
					title: document.getElementById("articleName").innerHTML,
					href: baseUrl + "/e/a.html?id=" + oArticleModule.articleId,
					thumbs: [baseUrl + "/data/article/" + stt + oArticleModule.articleId + "_s.jpg"]
				},
			weiboData:{
					content: document.getElementById("articleName").innerHTML+baseUrl + "/e/a.html?id=" + oArticleModule.articleId
				}
		})
		})
	}
	document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
			var web = plus.webview.getWebviewById("cmpInforShow.html");
			var web1 = plus.webview.getWebviewById("cmpInforShow-article.html");
			if(!web1){
				if(web) 
				mui.fire(web, "newId",{
									rd: 1
							});
			}
			
	})
});