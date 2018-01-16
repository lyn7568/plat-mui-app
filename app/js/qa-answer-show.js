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
					document.getElementById("snum").innerHTML = $da.agree;
					if($da.cnt) {
						document.getElementById("answerCnt").innerHTML = $da.cnt;
					}
					if(userid != $da.uid) {
						oattenSpan.style.display="block";
						ifcollectionAbout($da.uid,oattenSpan, 1,1);
					}else{
						isAgree($da.uid);
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
				});
				
			},
	 		isLogin=function() {//判断是否登录，登录才可咨询，关注，收藏
				var userid = plus.storage.getItem('userid');
		         if(userid==null || userid=='null'|userid == undefined |userid == 'undefined'){
					mui.openWindow({
						url: '../html/login.html',
						id: 'login.html'
					})
				}
			},
			moreMes=function(){
				document.getElementById("BtnMore").addEventListener("tap", function() {
					var oUrl = baseUrl + "/images/logo180.png";
					plus.nativeUI.showWaiting(); //显示原生等待框
					var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
						proid: answerId,
						quid:document.getElementById("questTit").getAttribute("data-id"),
						flag:flag,
						name: "answer",
						data: {
							content: document.getElementById("answerCnt").innerHTML.substring(0, 40),
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
						if(res.data){
							thumbs.classList.add("thumbedBtn")
							steps.classList.remove("stepedBtn")
							steps.innerHTML="踩"
						}else{
							thumbs.classList.remove("thumbedBtn")
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
			}else{
				isLogin();
			}
		})
		mui(".thumbBlock").on("tap",".stepBtn",function(){
			if(userid && userid != null && userid != "null") {
				oAjax('/ajax/question/answer/unAgree', {
					"id": answerId,
					"uid":userid,
					"uname":username
				}, "POST", function(res) {
					thumbs.classList.remove("thumbedBtn")
					steps.classList.add("stepedBtn")
					steps.innerHTML="取消踩"
					getConmain()
				})
			}else{
				isLogin();
			}
		})
		
	})

});