mui.ready(function(){
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		plus.nativeUI.closeWaiting();
		plus.webview.currentWebview().show("slide-in-right", 150);
		var flag=self.flag
		if(flag){
			document.getElementsByClassName("xiugai-qa")[0].classList.remove("displayNone")
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
			if(oFen == "微信好友") {
				if(!weixinClient()) {
					return;
				}
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneSession", self.data);
				}
			} else if(oFen == "微信朋友圈") {
				if(!weixinClient()) {
					return;
				}
				var share = buildShareService("weixin");
				if(share) {
					shareMessage(share, "WXSceneTimeline",  self.data);
				}
			} else if(oFen == "新浪微博") {
				var share = buildShareService("sinaweibo");
				if(share) {
					shareMessage(share, "sinaweibo", self.weiboData);
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
					if(self.name=="professor") {
						shareAddIntegral(1);
					}else if(self.name=="resource"){
						shareAddIntegral(2);
					}else if(self.name=="article"){
						shareAddIntegral(3);
					}else if(self.name=="org"){
						shareAddIntegral(4);
					}else if(self.name=="paper"){
						shareAddIntegral(6);
					}else if(self.name=="patent"){
						shareAddIntegral(5);
					}
				}
				if(self.name=="demand"){
				 	plus.nativeUI.toast("成功分享需求信息", toastStyle);
				}
				if(self.name=="question"){
				 	plus.nativeUI.toast("成功分享问题信息", toastStyle);
				}
				if(self.name=="answer"){
				 	plus.nativeUI.toast("成功分享回答信息", toastStyle);
				}
				
			}, function(e) {
				console.log(JSON.stringify(e))
				plus.nativeUI.closeWaiting();
				if(e.code == -2) {
					
				}
			});
		}
		document.getElementById("corrEssor").addEventListener('tap',function(){
			plus.nativeUI.showWaiting(); //显示原生等待框
			var webviewShow = plus.webview.create("../html/correctBack.html", 'correctBack.html', {}, {
				proid: self.proid,
				name:self.name,
			})
		})
		document.getElementById("corrAnswer").addEventListener('tap',function(){
			plus.nativeUI.showWaiting(); //显示原生等待框
			var webviewShow = plus.webview.create("../html/qa-answer-q.html", 'qa-answer-q.html', {}, {
				anid: self.proid,
				quid: self.quid,
				qutit:self.data.title,
				qucnt:self.data.content
			})
		})
		document.getElementsByClassName("exitbtn")[0].addEventListener("tap",function(){
			var bts = ["是", "否"];
			plus.nativeUI.confirm("确认删除该回答？", function(e) {
				var i = e.index;
				if(i == 0) {
					mui.ajax(baseUrl + "/ajax/question/answer/delete", {
						data: {id:self.proid},
						dataType: 'json',
						type: 'get',
						success: function(data) {
							if(data.success) {
								plus.nativeUI.toast("该回答已删除", toastStyle);
								mui.back();
							}
						}
					});
				}
			}, "删除回答", bts);
		})
		
		document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
			if(self.name=="org") {
				var web = plus.webview.getWebviewById("cmpInforShow.html");
				mui.fire(web, "newId",{
					rd: 1
				});
			}
		})
	})
})
