mui.ready(function() {
	mui.plusReady(function() {
		var ocollectBtn = document.getElementById("collectBtn")
		var oattenSpan = document.getElementById("attenSpan"); 
		var oifCollect = document.getElementById("ifCollect")//星星
		var thumbs=document.getElementsByClassName("thumbBtn")[0],
			steps=document.getElementsByClassName("stepBtn")[0]

		var userid = plus.storage.getItem('userid'),
		    username = plus.storage.getItem('name');
		var self = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		self.show("slide-in-right", 150);
		var answerId = self.anid;
		var flag=0;
		var answerTit=""
		var oUrl = baseUrl + "/images/logo180.png";
		
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
			getConmain = function() {
				oAjax('/ajax/question/answer', {
					"id": answerId
				}, "get", function(res) {
					var $da = res.data
					document.getElementById("answerTime").innerHTML = commenTime($da.createTime);
					if($da.agree>0){
						document.getElementById("snum").innerHTML = $da.agree;
						document.getElementById("zanNum").innerHTML = $da.agree;
					}
					
					if($da.cnt) {
						answerTit=$da.cnt
						document.getElementById("answerCnt").innerHTML = ($da.cnt).replace(/\n/g,"<br />");
					}
					if(userid != $da.uid) {
						oattenSpan.style.display="block";
						ifcollectionAbout($da.uid,oattenSpan, 1,1);
					}else{
						document.getElementsByClassName("canTap")[0].classList.add("displayNone")
						document.getElementsByClassName("noTap")[0].classList.remove("displayNone")
						flag=1
					}
					proinfo($da.uid)
					questioninfo($da.qid)
				})
			},
			proinfo = function(uid) {
				oAjax("/ajax/professor/baseInfo/" + uid, {}, "get", function(res) {
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
					var str = '<div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>'+
								'<div class="madiaInfo">'+
									'<p><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + ' title="' + userType.title + '"></em></p>'+
									'<p class="mui-ellipsis h2Font">' + os + '</p>'+
								'</div>'
					document.getElementById("ownerCon").innerHTML=str
					document.getElementById("ownerCon").setAttribute("data-id", uid);
				});
			},
			questioninfo=function(qid){
				oAjax("/ajax/question/qo", {
					"id": qid,
				}, "get", function(res){
					document.getElementById("questTit").innerHTML=res.data.title;
					document.getElementById("questTit").setAttribute("data-id",qid);
					if(res.data.img) {
						var subs = new Array();
						if(res.data.img.indexOf(',')) {
							subs =res.data.img.split(',');
						} else {
							subs[0] = res.data.img;
						}
						oUrl=baseUrl + "/data/question"+subs[0].replace(/.jpg/,"_s.jpg");
					}
				});
				
			},
	 		isLogin=function() {//判断是否登录，登录才可咨询，关注，收藏
		         if(userid==null || userid=='null'|userid == undefined |userid == 'undefined'){
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
						proid: answerId,
						quid:document.getElementById("questTit").getAttribute("data-id"),
						flag:flag,
						name: "answer",
						data: {
							content: answerTit.substring(0, 70),
							title: document.getElementById("questTit").innerHTML,
							href: baseUrl + "/e/da.html?id=" + answerId,
							thumbs: [oUrl]
						},
						weiboData: {
							content: document.getElementById("questTit").innerHTML + baseUrl + "/e/da.html?id=" + answerId,
						}
					})
				})
			},
			isAgree=function(id){
				oAjax('/ajax/question/answer/agree', {
					"aid": answerId,
					"uid":id
				}, "get", function(res) {
					if(res.success){
						console.log(JSON.stringify(res))
						if(res.data==null){
							
						}else if(res.data.flag){
							thumbs.classList.add("thumbedBtn")
						}else{
							steps.classList.add("stepedBtn")
							steps.innerHTML="取消踩"
						}
					}
				})
			}
			
			
		getConmain()
		moreMes()
		if(userid && userid != null && userid != "null") {
			module.lWord(answerId, 4);
			ifcollectionAbout(answerId,oifCollect,9);
			isAgree(userid);
		}
		document.getElementById("ownerCon").addEventListener('tap', function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
				proid: id
			});
		})
		document.getElementById("questTit").addEventListener('tap', function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-question-show.html", 'qa-question-show.html', {}, {
				quid: id
			});
		})
		//点击关注专家按钮
		oattenSpan.addEventListener('tap', function() {
			var thisId=document.getElementById("ownerCon").getAttribute("data-id");
			if(userid && userid != null && userid != "null") {
				if(this.className=='mui-icon attenSpan attenedSpan') {
					cancelCollectionAbout(thisId,this, 1,1)
				} else {
					collectionAbout(thisId,this, 1,1);
				}
			}else{
				isLogin();
			}
		});
		//点击收藏按钮
		ocollectBtn.addEventListener('tap', function() {
			if(userid && userid != null && userid != "null") {
				if(oifCollect.className=='mui-icon iconfontnew icon-yishoucang'){
					cancelCollectionAbout(answerId,oifCollect,9);
				} else {
					collectionAbout(answerId,oifCollect,9);
				}
			}else{
				isLogin();
			}
		});
		
		mui(".thumbBlock").on("tap",".thumbBtn",function(){
			if(userid && userid != null && userid != "null") {
				if(this.className=="thumbBtn thumbedBtn"){
					oAjax('/ajax/question/answer/agree/cancle', {
						"id": answerId,
						"uid":userid,
						"uname":username
					}, "POST", function(res) {
						thumbs.classList.remove("thumbedBtn")
						getConmain()
					})
				}else{
					oAjax('/ajax/question/answer/agree', {
						"id": answerId,
						"uid":userid,
						"uname":username
					}, "POST", function(res) {
						thumbs.classList.add("thumbedBtn")
						steps.classList.remove("stepedBtn")
						steps.innerHTML="踩"
						getConmain()
					})
				}
			}else{
				isLogin();
			}
		})
		mui(".thumbBlock").on("tap",".stepBtn",function(){
			if(userid && userid != null && userid != "null") {
				if(this.className=="stepBtn stepedBtn"){
					oAjax('/ajax/question/answer/oppose/cancle', {
						"id": answerId,
						"uid":userid,
						"uname":username
					}, "POST", function(res) {
						steps.classList.remove("stepedBtn")
						steps.innerHTML="踩"
						getConmain()
					})
				}else{
					oAjax('/ajax/question/answer/oppose', {
						"id": answerId,
						"uid":userid,
						"uname":username
					}, "POST", function(res) {
						steps.classList.add("stepedBtn")
						steps.innerHTML="取消踩"
						thumbs.classList.remove("thumbedBtn")
						getConmain()
					})
				}
			}else{
				isLogin();
			}
		})
		
		window.addEventListener('customEvent', function(event) {
		    var detail = event.detail;
		    getConmain()
		});
		
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
				if(!weixinClient()) {
					return;
				}
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: document.getElementById("answerCnt").innerHTML.substring(0, 70),
						title:  document.getElementById("questTit").innerHTML,
						href: baseUrl + "/e/da.html?id=" + answerId,
						thumbs: [oUrl]
					});
				}
			} else if(oFen == "微信朋友圈") {
				if(!weixinClient()) {
					return;
				}
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: document.getElementById("answerCnt").innerHTML.substring(0, 70),
						title:  document.getElementById("questTit").innerHTML,
						href: baseUrl + "/e/da.html?id=" + answerId,
						thumbs: [oUrl]
					});
				}
			} else if(oFen == "新浪微博") {
				var share = buildShareService("sinaweibo");
				if(share) {
					shareMessage(share, "sinaweibo", {
						content:  document.getElementById("questTit").innerHTML + baseUrl + "/e/da.html?id=" + answerId,
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
	})

});