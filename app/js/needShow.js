mui.ready(function() {
	mui.plusReady(function() {
		var consuId, demandTitle, demandContent,orgThis;
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var demandId = ws.demanid;
		var mySelf=document.getElementsByClassName("mySelf")[0];
		var mySelf2=document.getElementsByClassName("mySelf2")[0];
		var notSelf=document.getElementsByClassName("notSelf")[0];
		var BtnMore=document.getElementById("BtnMore");
		var goUpdate=document.getElementById("goUpdate");
		
		var shareOut=document.getElementById("shareOut");
		var shareOut2=document.getElementById("shareOut2");
	    var cancelShare=document.getElementById("cancelShare");
	    var maskBlack=document.getElementById("maskBlack");
	    var shareBlock=document.getElementById("shareBlock");
	    var attBtn=document.getElementById("attBtn");
		 
		getDemandinfo();
		pageViewsVal();
		moreMes();//更多
		
		document.getElementById("personAL").addEventListener("tap", function() {//企业详情
			var cmpId=this.getAttribute("data-id");
			mui.openWindow({
				url: '../html/cmpInforShow.html',
				id: 'cmpInforShow.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right",
				},
				extras: {
					cmpId: cmpId
				}
			});
		})
		//收藏
		var oifCollect=document.getElementById("ifCollect");
		var ocollectBtn=document.getElementById("ifCollect").parentNode;
		ifcollectionAbout(demandId,oifCollect, 7);
		ocollectBtn.addEventListener('tap', function() {
			if(userid && userid != null && userid != "null") {
				if(oifCollect.className == 'mui-icon iconfontnew icon-yishoucang') {
					cancelCollectionAbout(demandId,oifCollect, 7)
				} else {
					collectionAbout(demandId,oifCollect, 7);
				}
			} else {
				isLogin();
			}
		});
		
		if(userid){
			ifcollectionAbout(orgThis,attBtn, 6,1);
		}
		attBtn.addEventListener('tap', function() {
			if(userid && userid != null && userid != "null") {
				if(this.className=='mui-icon attenSpan attenedSpan') {
					cancelCollectionAbout(orgThis,this, 6,1)
				} else {
					collectionAbout(orgThis,this, 6,1);
				}
			} else {
				isLogin();
			}
		});
		
		goUpdate.addEventListener('tap', function() {//修改
			mui.openWindow({
				url: '../html/demandModify.html',
				id: '../html/demandModify.html',
				show: {
					autoShow: true,
					aniShow: "slide-in-right",
				},
				extras: {
					demandId: demandId
				}
			});
		});
		document.getElementById("closeBtn").addEventListener("tap", function() {//关闭
			var btn = ["确定", "取消"];
			mui.confirm("确认关闭该需求？", "提示", btn, function(e) {
				if(e.index == 0) {
					mui.ajax(baseUrl+"/ajax/demand/close",{
						"type": "POST",
						"async": false,
						"data":{
							"id":demandId,
							"uid":userid
						},
						"success": function(data) {
							if(data.success && data.data) {
								mySelf2.classList.remove("displayNone");
								mySelf.classList.add("displayNone");
								notSelf.classList.add("displayNone");
								mySelf2.querySelector(".statusTip").innerHTML="该需求 已关闭";
							}
						}
					});
				}
			})
		})
		 
	    shareOut.addEventListener("tap",function(){
	    	maskBlack.style.display="block";
	    	shareBlock.style.display="block";
	    })
	    shareOut2.addEventListener("tap",function(){
	    	maskBlack.style.display="block";
	    	shareBlock.style.display="block";
	    })
	    cancelShare.addEventListener("tap",function(){
	    	maskBlack.style.display="none";
	    	shareBlock.style.display="none";
	    })
	    maskBlack.addEventListener("tap",function(){
	    	this.style.display="none";
	    	shareBlock.style.display="none";
	    })
	    
		function getDemandinfo(){
			mui.ajax(baseUrl+"/ajax/demand/qo",{
				"type": "GET",
				"data": {
					"id": demandId
				 },
				"async": false,
				"dataType": "json",
				"success": function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						var ws=plus.webview.currentWebview();
						plus.nativeUI.closeWaiting();
						ws.show("slide-in-right", 150);
						
						var $da=data.data;
						document.getElementById("needTit").innerHTML=$da.title; //名字
						document.getElementById("demandTit").innerHTML=$da.title; //名字
						document.getElementById("oTime").innerHTML=commenTime($da.createTime);
						document.getElementById("demandDesp").innerHTML=$da.descp; //内容
						
						var strCon="";
						if($da.city){ strCon+='<div class="showTit">所在城市：<span class="showCon">'+$da.city+'</span></div>' }
						if($da.duration!=0){ strCon+='<div class="showTit">预期时长：<span class="showCon">'+demandDuration[$da.duration]+'</span></div>' }
						if($da.cost!=0){ strCon+='<div class="showTit">费用预算：<span class="showCon">'+demandCost[$da.cost]+'</span></div>' }
						if($da.invalidDay){ strCon+='<div class="showTit">有效期至：<span class="showCon">'+TimeTr($da.invalidDay)+'</span></div>' }
						document.getElementById("demandInfo").innerHTML=strCon;
						
						if(userid==$da.creator){
							if($da.state==0){
								mySelf2.classList.add("displayNone");
								mySelf.classList.remove("displayNone");
								notSelf.classList.add("displayNone");
								goUpdate.classList.remove("displayNone");
								BtnMore.classList.add("displayNone");
								mySelf.querySelector(".statusTip").innerHTML="该需求 已过期";
							}else if($da.state==1){
								mySelf2.classList.add("displayNone");
								mySelf.classList.remove("displayNone");
								notSelf.classList.add("displayNone");
								goUpdate.classList.remove("displayNone");
								BtnMore.classList.add("displayNone");
								mySelf.querySelector(".statusTip").classList.remove("notopen");
								mySelf.querySelector(".statusTip").parentNode.setAttribute("id","overBtn")
								mySelf.querySelector(".statusTip").innerHTML="需求已完成";
								//完成
								document.getElementById("overBtn").addEventListener("tap", function() {
									overGo();
								})
							}else if($da.state==2){
								mySelf2.classList.remove("displayNone");
								mySelf.classList.add("displayNone");
								notSelf.classList.add("displayNone");
								mySelf2.querySelector(".statusTip").innerHTML="该需求 已完成";
							}else if($da.state==3){
								mySelf2.classList.remove("displayNone");
								mySelf.classList.add("displayNone");
								notSelf.classList.add("displayNone");
								mySelf2.querySelector(".statusTip").innerHTML="该需求 已关闭";
							}
						}else{
							goUpdate.classList.add("displayNone");
							BtnMore.classList.remove("displayNone");
							mySelf2.classList.add("displayNone");
							mySelf.classList.add("displayNone");
							notSelf.classList.remove("displayNone");
							if($da.state==1){
								notSelf.querySelector(".statusTip").classList.remove("notopen");
								notSelf.querySelector(".statusTip").parentNode.setAttribute("id","replayBtn")
								notSelf.querySelector(".statusTip").innerHTML="立即回复";
								//立即回复
								document.getElementById("replayBtn").addEventListener("tap", function() {
									replayGo();
								})
								
							}else{
								notSelf.querySelector(".statusTip").classList.add("notopen");
								if($da.state==0){
									notSelf.querySelector(".statusTip").innerHTML="该需求 已过期";
								}else if($da.state==2){
									notSelf.querySelector(".statusTip").innerHTML="该需求 已完成";
								}else if($da.state==3){
									notSelf.querySelector(".statusTip").innerHTML="该需求 已关闭";
								}
							}
						}
						cmpFun($da.orgId);
						
						orgThis=$da.orgId;
						consuId = $da.creator;
						demandTitle = $da.title;
						demandContent = $da.descp;
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
			
		}
		//浏览量
		function pageViewsVal() {
			mui.ajax(baseUrl+"/ajax/demand/incPageViews",{
				"type": "POST",
				"dataType": "json",
				"data": {
					"id": demandId
				},
				"success": function(data) {
					if(data.success) {}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		/*企业用户信息*/
		function cmpFun(id) {
			mui.ajax(baseUrl+"/ajax/org/" + id,{
				"type": "get",
				"async": true,
				"success": function(data) {
					if(data.success && data.data) {
						if(data.data.forShort) {
							document.getElementById("cmpname").innerHTML=data.data.forShort;
						}else{
							document.getElementById("cmpname").innerHTML=data.data.name;
						}
						var img="../images/default-icon.jpg";
						if(data.data.hasOrgLogo==1){
							img=baseUrl+"/images/org/" + data.data.id + ".jpg";
						}
						document.getElementById("personAL").setAttribute("data-id",data.data.id);
						document.getElementById("companyImg").setAttribute("src",img);
						if(data.data.authStatus==3){
							document.getElementById("QauthFlag").classList.add("authicon-com-ok");
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
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
		//点击完成按钮调用函数
		function overGo(){
			var btn = ["确定", "取消"];
			mui.confirm("确认该需求已解决？", "提示", btn, function(e) {
				if(e.index == 0) {
					mui.ajax(baseUrl+"/ajax/demand/over",{
						"type": "POST",
						"async": false,
						"data":{
							"id":demandId,
							"uid":userid
						},
						"success": function(data) {
							if(data.success && data.data) {
								mySelf2.classList.remove("displayNone");
								mySelf.classList.add("displayNone");
								notSelf.classList.add("displayNone");
								mySelf2.querySelector(".statusTip").innerHTML="该需求 已完成";
							}
						}
					});
				}
			})
		}
		//点击回复按钮调用函数
		function replayGo(){
			if(userid && userid != null && userid != "null") {
				mui.ajax(baseUrl+"/ajax/consult/byDemand",{
					"type": "GET",
					"async": false,
					"data":{
						"demandId":demandId,
						"professorId":userid
					},
					"success": function(data) {
						if(data.success) {
							console.log(JSON.stringify(data))
							if(data.data == null) {
								var btn = ["确定", "取消"];
								mui.confirm("确认回复该需求？", "提示", btn, function(e) {
									if(e.index == 0) {
										createConsult()
									}
								})
							}else{
								webviewShow = plus.webview.create("../html/chats.html", 'chats.html', {}, {
									'consultId': data.data,
									'consultantId': userid
								});
							}
						}
					}
				});
			}else{
				isLogin();
			}
		}
		//立即回复新建跳转咨询
		function createConsult() {
			mui.ajax(baseUrl+"/ajax/consult",{
				type: "POST",
				timeout: 10000,
				data: {
					"consultType": "其他咨询",
					"consultTitle": demandTitle,
					"consultContant": demandContent,
					"professorId": userid,
					"consultantId": consuId,
					"demandId": demandId
				},
				success: function($ifno) {
					if($ifno.success){
						webviewShow = plus.webview.create("../html/chats.html", 'chats.html', {}, {
							'consultId': $ifno.data,
							'consultantId': consuId
						});
					}
				},
				error: function() {
	
				}
			})
		}

		function moreMes() {
			document.getElementById("BtnMore").addEventListener("tap", function() {
				var oUrl = baseUrl + "/images/logo180.png";
				plus.nativeUI.showWaiting(); //显示原生等待框
				var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
					proid: demandId,
					name: "demand",
					data: {
						content: document.getElementById("demandDesp").innerHTML.substring(0, 40),
						title: document.getElementById("demandTit").innerHTML,
						href: baseUrl + "/e/d.html?id=" + demandId,
						thumbs: [oUrl]
					},
					weiboData: {
						content: document.getElementById("demandTit").innerHTML + baseUrl + "/e/l.html?id=" + demandId,
					}
				})
			})
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
						content: document.getElementById("demandDesp").innerHTML.substring(0, 40),
						title: document.getElementById("demandTit").innerHTML,
						href: baseUrl + "/e/d.html?id=" + demandId,
						thumbs: [oUrl]
					});
				}
			} else if(oFen == "微信朋友圈") {
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: document.getElementById("demandDesp").innerHTML.substring(0, 40),
						title: document.getElementById("demandTit").innerHTML,
						href: baseUrl + "/e/d.html?id=" + demandId,
						thumbs: [oUrl]
					});
				}
			} else if(oFen == "新浪微博") {
				var share = buildShareService("sinaweibo");
				if(share) {
					shareMessage(share, "sinaweibo", {
						content: document.getElementById("demandTit").innerHTML + baseUrl + "/e/d.html?id=" + demandId,
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
				plus.nativeUI.toast("成功分享需求信息", toastStyle);
			}, function(e) {
				plus.nativeUI.closeWaiting();
				if(e.code == -2) {
					
				}
			});
		}
	
	});
})