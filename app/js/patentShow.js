var ocollectBtn = document.getElementById("collectBtn"); //收藏按钮

var patentId;
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	patentId = self.patentId;
	//patentId="FE95F18DDCFA4E64BF62C014D67E95FB";
	getRecourceMe();/*获取资源信息*/
	//关键词标签点击进去搜索
	mui(".tagList").on("tap","li",function(){
		var tagText = this.getElementsByTagName("span")[0].innerText;
		plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/searchListNew2.html?content=找论文", "../html/searchListNew2.html", {}, {
			key: tagText,
			qiFlag: 4
		}); 
	})
	//点击收藏按钮
	ifcollectionAbout(patentId,4);
	ocollectBtn.addEventListener('tap', function() {
		if(userid && userid != null && userid != "null") {
			if(document.getElementById("ifCollect").className=='mui-icon iconfontnew icon-yishoucang'){
				cancelCollectionAbout(patentId,4)
			} else {
				collectionAbout(patentId,4);
			}
		}else{
			isLogin();
		}
	});
	
	
	mui.ajax(baseUrl + '/ajax/ppatent/incPageViews',{
			"type": "POST",
			"dataType": "json",
			"data": {
				"id": patentId
			},
			"success": function(data) {
				if(data.success) {}
			},
			"error": function() {
				
			}
		});
	function getRecourceMe() {
		mui.plusReady(function() {
			mui.ajax(baseUrl + '/ajax/ppatent/qo', {
				data: {
					"id": patentId
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'get', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					if(data.success) {
						console.log(JSON.stringify(data))
						patentHtml(data.data);
						getpatentAuthors(data.data.id)
						
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
	function patentHtml($da) {
		document.getElementById("patentTit").innerHTML = $da.name;
		document.getElementById("patentName").innerHTML = $da.name; //名字
		document.getElementById("patentAbstract").innerHTML = $da.summary; //摘要内容
		document.getElementById("Znum1").innerHTML = $da.code;//专利号
		if($da.pubDay){
			document.getElementById("Znum2").innerHTML = TimeTr($da.pubDay);
		}else{
			document.getElementById("Znum2").parentNode.parentNode.style.display="none";
		}
		if($da.reqCode){
			document.getElementById("Znum4").innerHTML = $da.reqCode;
		}else{
			document.getElementById("Znum4").parentNode.parentNode.style.display="none";
		}
		if($da.reqDay){
			document.getElementById("Znum3").innerHTML =  TimeTr($da.reqDay);
		}else{
			document.getElementById("Znum3").parentNode.parentNode.style.display="none";
		}
		if($da.reqDay){
			document.getElementById("Znum5").innerHTML = $da.reqPerson;
		}else{
			document.getElementById("Znum5").parentNode.parentNode.style.display="none";
		}
		
		if($da.keywords != undefined && $da.keywords.length != 0 ){
			var subs = new Array();
			if($da.keywords.indexOf(',')){
				subs = $da.keywords.split(',');
			}else{
				subs[0] = $da.keywords;
			}
			var pstr=""
			if(subs.length>0){
				for (var i = 0; i < subs.length; i++) 
				{
					pstr+='<li><span class="h2Font">'+ subs[i] +'</span></li>'
				};
				document.getElementsByClassName("tagList")[0].innerHTML= pstr;
			}else{
				document.getElementsByClassName("tagList")[0].style.display="none";
			}
		}		
	}
	/*获取论文作者信息*/
	function getpatentAuthors(stritrm) {
		mui.ajax(baseUrl +"/ajax/ppatent/authors",{
			"type": "GET",
			"success": function(data) {
				if(data.success) {
					if(data.data.length>0){
						for(var i=0;i<data.data.length;i++){
							var authTy="",authTit="",baseInfo="",imgbg="../images/default-photo.jpg";
							if(data.data[i].professorId.substring(0, 1) != "#"){
								$.ajax(baseUrl +"/ajax/professor/editBaseInfo/" + data.data[i].professorId,{
									type:"get",
									async:true,
									success:function($proData){
										console.log(JSON.stringify($proData))
										if($proData.success){
											var showPro = $proData.data;
											if(showPro.hasHeadImage == 1) {
												imgbg = "/images/head/" + showPro.id + "_l.jpg";
											} else {
												imgbg = "../images/default-photo.jpg";
											}
											//认证
											var oSty = autho(showPro.authType,showPro.orgAuth,showPro.authStatus);
											authTy = oSty.sty;
											authTit = oSty.title;
											
											var title = showPro.title || "";
											var orgName = showPro.orgName || "";
											var office = showPro.office || "";
											if(orgName!=""){
												if(title != "") {
													baseInfo = title + "，" + orgName;
												}else{
													if(office!=""){
														baseInfo = office  + "，" + orgName;	
													}else{
														baseInfo = orgName;	
													}
												}
											}else{
												if(title != "") {
													baseInfo = title;
												}else{
													if(office!=""){
														baseInfo = office;	
													}else{
														baseInfo = "";	
													}
												}
											}
											var liItem = document.createElement("li");
											liItem.setAttribute("data-id",showPro.id);
											liItem.className = "mui-table-view-cell"
											var oString = '<div class="flexCenter mui-clearfix">'
											oString += '<div class="madiaHead useHead" style="background-image:url('+ imgbg +')"></div>'
											oString += '<div class="madiaInfo"><p><span class="h1Font">'+ showPro.name +'</span><em class="authicon '+ authTy +'" title="'+ authTit +'"></em></p>'
											oString += '<p class="mui-ellipsis h2Font">'+ baseInfo +'</p>'
											oString += '</div></div>'
											liItem.innerHTML = oString;
											document.getElementById("aboutAuthors").appendChild(liItem);
										}
									}
								})
							}else{
								var liItem = document.createElement("li");
								liItem.setAttribute("data-id",data.data[i].professorId);
								liItem.className = "mui-table-view-cell"
								var oString = '<div class="flexCenter mui-clearfix">'
								oString += '<div class="madiaHead useHead" style="background-image:url('+ imgbg +')"></div>'
								oString += '<div class="madiaInfo"><p><span class="h1Font">'+ data.data[i].name  +'</span></p>'
								oString += '</div></div>'
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
         if(userid==null || userid=='null'|userid == undefined |userid == 'undefined'){
			mui.openWindow({
				url: '../html/login.html',
				id: 'login.html'
			})
		}
	};
	
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

		var oUrl=baseUrl + "/images/logo180.png";
		
		if(oFen == "微信好友") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: document.getElementById("patentAbstract").innerHTML.substring(0,40),
					title: document.getElementById("patentName").innerHTML,
					href: baseUrl + "/e/z.html?id=" + patentId ,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "微信朋友圈") {
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneTimeline", {
					content: document.getElementById("patentAbstract").innerHTML.substring(0,40),
					title: document.getElementById("patentName").innerHTML,
					href: baseUrl + "/e/z.html?id=" + patentId ,
					thumbs: [oUrl]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content: document.getElementById("patentName").innerHTML+ baseUrl + "/e/z.html?id=" + patentId ,
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
					alert("认证授权失败：" + e.code + " - " + e.message);
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
				shareAddIntegral(2);
			}
		}, function(e) {
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
				plus.nativeUI.toast('已取消分享', {
					verticalAlign: 'center'
				});
			}
		});
	}

	/*图像预览*/
	mui.previewImage();
});