//mui.ready(function() {
	var obackBtn = document.getElementById("backBtn");//返回按钮
	
	var oconsultTitle = document.getElementById("consultTitle");//咨询标题
	var ochatName = document.getElementById("chatName");//与。。聊天
	var oconsultCon = document.getElementById("consultCon");//咨询内容
	var olookConBtn = document.getElementById("lookConBtn");//查看按钮
	var ostatus = document.querySelector('#status');//标记状态，用于返回咨询列表传值
	
	var oconfirm = document.getElementById("confirm");//我的需求，确认完成
	var oconfirmBtn = document.getElementById("confirmBtn");//确认完成按钮
	var oassessBtn = document.getElementById("assessBtn");//我的需求，去评价按钮
	var oassessed = document.getElementById("assessed");//我的需求，已评价(评价星级和评价内容)
	var omy_starContainer = document.getElementById("my_starContainer");//我的需求，星级容器
	var obxiejue = document.getElementById("bxiejue");//我的需求，被谢绝
	var odhuifu = document.getElementById("dhuifu");//我的需求，待回复
	
	var othat_weiassess = document.getElementById("that_weiassess");//收到咨询，未评价状态
	var owaying = document.getElementById("waying");//收到咨询，进行中状态
	var othat_assessed = document.getElementById("that_assessed");//收到咨询，对方已评价
	var ozixunstarContainer = document.getElementById("consult_starContainer");//收到咨询星级容器
	var yxiejue = document.getElementById("yxiejue");//收到咨询，已谢绝
	
	var omyNeeAss = document.getElementById("myNeeAss");//我的需求已评价，点击跳转评价详情
	var ogetConAss = document.getElementById("getConAss");//收到咨询对方已评价，点击跳转评价详情
	
	var oselfImg = document.getElementById("selfImg")//自己的头像
	var othatImg = document.getElementById("thatImg");//对方头像
	
	var omsg_list = document.getElementById("msg-list");
	var omsg_text = document.getElementById("msg-text");
	var omsg_type = document.getElementById("msg-type");
	var ochatFooter = document.getElementById("chatFooter");
	
	
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		if(self.num == 1){
			var consultSureid = plus.webview.getWebviewById('consultSure.html');
		    consultSureid.close();	
		}
		console.log('当前聊天页面id==='+self.id);
	})
	
	//查看咨询内容
	(function lookContultCon(){
		var flag = true;
		olookConBtn.addEventListener('tap',function(){
			if(flag){
				this.innerHTML = '收起';
				flag = false;
			}else {
				this.innerHTML = '查看咨询内容';
				flag = true;
			}
		});
	})();
	
	function getHeadInfo(manFlag,consultId){
		var myData;
		if(manFlag == 'myNeed'){//我的需求
			//我的需求
			mui.ajax(baseUrl+'/ajax/consult/qacon',{
				data:{"consultId":consultId,"readStatus":"1"},
				dataType:'json',//服务器返回json格式数据
				type:'get',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					myData = data.data;
					ochatName.innerHTML = myData["professor"]["name"];
					var consultTitle = myData["consultTitle"];
					oconsultTitle.innerHTML = consultTitle;
					oconsultCon.innerHTML = myData['consultContant'];
					//我的需求进行中
					if(myData["consultStatus"] == 0){
						ochatFooter.classList.remove('displayNone');
						oconfirm.classList.remove('displayNone');//我的需求，进行中
						console.log(myData["consultStatus"]);
						ostatus.setAttribute('status','consultStatus='+myData["consultStatus"]);					
						//clickConfirm(consultId);
					}else if(myData["consultStatus"] == 2){
						odhuifu.classList.remove('displayNone');//我的需求，待回复
					}else if(myData["consultStatus"] == 3){
						obxiejue.classList.remove('displayNone');//我的需求，被谢绝
					}else {
//						ochatFooter.style.display = 'none';;//对话底部隐藏
						if(myData["assessStatus"] == 0){
							oassessBtn.classList.remove('displayNone');//我的需求，未评价
							ostatus.setAttribute('status','');
							//clickweiassess(consultId);
							ostatus.setAttribute('status','myNeedAssessStatus='+myData["assessStatus"]);
						}else {
							oassessed.classList.remove('displayNone');//我的需求，已评价
							ostatus.setAttribute('status','myNeedAssessStatus='+myData["assessStatus"]);
							
							//评价星级
							var starCount = myData["assessStar"];
							var starlist = omy_starContainer.children;
							for(var i = 0; i < starCount; i++) {
								starlist[i].classList.remove('icon-favor');
				  				starlist[i].classList.add('icon-favorfill');
							};
							
							omyNeeAss.addEventListener('tap',function() {
								clickGodetail(oassessed,consultId,manFlag)
							});
						}
					} 
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right",150);
				},
				error:function(xhr,type,errorThrown){
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		
		}else if(manFlag == 'consult'){
			mui.ajax(baseUrl+'/ajax/consult/qapro',{
				data:{"consultId":consultId,"readStatus":"1"},
				dataType:'json',//服务器返回json格式数据
				type:'get',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					myData = data.data;
					ochatName.innerHTML = myData["professor"]["name"];
					var consultTitle = '回复：'+ myData["consultTitle"];
					oconsultTitle.innerHTML = consultTitle;
					oconsultCon.innerHTML = myData['consultContant'];
					//收到咨询进行中
					if(myData["consultStatus"] == 0){
						owaying.classList.remove('displayNone');
						ochatFooter.classList.remove('displayNone');
					}else if(myData["consultStatus"] == 3){
						yxiejue.classList.remove('displayNone');//收到咨询，已谢绝
					}else {//收到咨询已完成
						
//						ochatFooter.style.display = 'none';//对话底部隐藏
						
						if(myData["assessStatus"] == 0){//收到咨询未评价 
							othat_weiassess.classList.remove('displayNone');
						}else{//收到咨询已评价(评价星级和评价内容)
							othat_assessed.classList.remove('displayNone');
							//评价星级
							var starCount = myData["assessStar"];
							var starlist = ozixunstarContainer.children;
							for(var i = 0; i < starCount; i++) {
								starlist[i].classList.remove('icon-favor');
				  				starlist[i].classList.add('icon-favorfill');
							}
							
							ogetConAss.addEventListener('tap',function() {
								clickGodetail(othat_assessed,consultId,manFlag)
//								
							});

						}
					}
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right",150);
					
				},
				error:function(xhr,type,errorThrown){
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
			
		};
	};
	
	/*点击确认完成*/
	//function clickConfirm(consultId) {
		
	//};
	
	/*打开评价详情函数*/
	function goassessDetail(consultId,manFlag) {
		mui.openWindow({
			id:'chat-assess-detail.html',
		    url:'chat-assess-detail.html',
		    extras:{'consultId':consultId,'manFlag':manFlag}//向评价页面传值;咨询id
		});
	}
	/*点击已评价,进入评价详情*/
	function clickGodetail(btn,consultId,manFlag) {
		btn.addEventListener('tap',function(){
			goassessDetail(consultId,manFlag);
		});
	}
	
	
	/*打开评价页面*/
	function goassessFun(consultId) {
		mui.openWindow({
			id:'chat-assess.html',
		    url:'chat-assess.html',
		    extras:{'consultId':consultId}//向评价页面传值;咨询id
		});
	};
	
	/*更改咨询状态,进行中--完成*/
	function setState(consultId) {
		mui.ajax(baseUrl+'/ajax/consult/finishTime',{
			data:{
				"consultId":consultId, //咨询ID
		    	"consultStatus":"1", //咨询状态 0-进行中，1-已完成
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				/*console.log("更新咨询状态")
				console.log(data.data)*/
				if(data.success){
					ostatus.setAttribute('status','myNeedAssessStatus=0');
					goassessFun(consultId);//进入评价页面
				}
			},
			error:function(xhr,type,errorThrown){
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
		
	};
	
	
	/*评价完成返回 刷新==自定义事件*/
	window.addEventListener('refresh',function(event){
		//通过event.detail可获得传递过来的参数内容
		var self = plus.webview.currentWebview();
		
		var consultId = self.consultId;
		oconfirm.classList.add('displayNone');
		ochatFooter.classList.add('displayNone');
		oassessBtn.style.display="none";
		oassessBtn.classList.add('displayNone');
		getHeadInfo('myNeed',consultId);
	});

	var MIN_SOUND_TIME = 800;
	template.config('escape', false);
	//mui.plusReady=function(fn){fn();};
	mui.plusReady(function() {
		
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var consultId = self.consultId;
		var consultantId = self.consultantId;
		oconfirmBtn.addEventListener('tap', function() {
			
			var btnArray = ['确定','取消'];
			mui.confirm('确认此次咨询已完成？', '', btnArray, function(e) {
				
				if (e.index == 0) {//确定
					oconfirmBtn.style.display="none";
					oassessBtn.style.display="block";
					setState(consultId);//点击确认,更新咨询状态	
				} else {//取消
					oconfirm.classList.add('displayNone');
					ochatFooter.classList.add('displayNone');
					getHeadInfo('myNeed',consultId);
				}
			})
		});
		
		/*点击进入谢绝理由*/
		mui(".operatebox").on("tap",".yxiejue",function(){
			plus.nativeUI.showWaiting();//显示原生等待框
			plus.webview.create("../html/rejectReason-details.html", 'rejectReason-details.html',{},{'consultId': consultId});
		})
		
		/*点击未评价,进入评价页面*/
	//function clickweiassess(consultId){
		oassessBtn.addEventListener('tap',function(){
			goassessFun(consultId);
		});
	//};
		/*返回咨询列表页*/
		obackBtn.addEventListener('tap',function() {
			/*返回咨询列表*/
			var status = ostatus.getAttribute('status');
			console.log(status)
			var consultList = plus.webview.getWebviewById('consultlist.html');
//			console.log(consultId)
//			consultList.show();
			mui.fire(consultList,'backlist',{'consultId':consultId,'status':status}); 
	
		});
		
		if(userid == consultantId){//我的需求
			//头部信息
			var manFlag = 'myNeed';
			getHeadInfo(manFlag,consultId);
		}else {//收到咨询
			//头部信息
			var manFlag = 'consult';
			getHeadInfo(manFlag,consultId);
		};
		//渲染对话内容
		chatCon(consultId,userid);
		
		//根据咨询id查询消息
		function chatCon(consultId,userid) {
			mui.ajax(baseUrl+'/ajax/tidings/qacon',{
				data:{
					"consultId":consultId
				},
				dataType:'json',//服务器返回json格式数据
				type:'get',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					var myData = data.data;
					for(var i = 0; i < myData.length; i++ ){
						if(myData[i]['professor']['id'] == userid){//自己说话
							
							/*判断是否有头像*/
							if(myData[i]['professor']['hasHeadImage'] == 1){
								record.push({
									sender: 'self',
									type: 'text',
									content: myData[i]["tidingsContant"],
									imgurl:baseUrl + "/images/head/" + myData[i]["professor"].id + "_l.jpg"
								});
								
							}else {
								record.push({
									sender: 'self',
									type: 'text',
									content: myData[i]["tidingsContant"],
									imgurl:"../images/default-photo.jpg"
								});
							}
							
						}else{//对方说话
							console.log('对方id=='+myData[i]['professor'].id)
							/*判断是否有头像*/
							if(myData[i]['professor'] != '' && myData[i]['professor'] != undefined){
								if(myData[i]['professor']['hasHeadImage'] == 1){
									record.push({
										sender: 'zs',
										type: 'text',
										content: myData[i]["tidingsContant"],
										imgurl:baseUrl + "/images/head/" + myData[i]["professor"].id + "_m.jpg"
									});
								}else {
									record.push({
										sender: 'zs',
										type: 'text',
										content: myData[i]["tidingsContant"],
										imgurl:"../images/default-photo.jpg"
									});
								}
							}
						}
					}
					bindMsgList();
				},
				error:function(xhr,type,errorThrown){
					//根据消息id查询消息失败
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		
		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize"
		});
		var showKeyboard = function() {
			if (mui.os.ios) {
				var webView = plus.webview.currentWebview().nativeInstanceObject();
				webView.plusCallMethod({
					"setKeyboardDisplayRequiresUserAction": false
				});
			} else {
				var Context = plus.android.importClass("android.content.Context");
				var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				var main = plus.android.runtimeMainActivity();
				var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
				//var view = ((ViewGroup)main.findViewById(android.R.id.content)).getChildAt(0);
				imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
				//alert("ll");
			}
		};
		
		/*var record = [{
			sender: 'zs',
			type: 'text',
			content: 'Hi，我是 科袖 小管家！'
		}];*/
		var record = [];
		
		

			
		
		
		var ui = {
			body: document.querySelector('body'),
			footer: document.querySelector('footer'),
			footerRight: document.querySelector('.footer-right'),
			footerLeft: document.querySelector('.footer-left'),
			btnMsgType: document.querySelector('#msg-type'),
			boxMsgText: document.querySelector('#msg-text'),
			boxMsgSound: document.querySelector('#msg-sound'),
			btnMsgImage: document.querySelector('#msg-image'),
			areaMsgList: document.querySelector('#msg-list'),
			boxSoundAlert: document.querySelector('#sound-alert'),
			h: document.querySelector('#h'),
			content: document.querySelector('.mui-content')
		};
		//ui.h.style.width = ui.boxMsgText.offsetWidth+'px';
		//alert(ui.boxMsgText.offsetWidth );
		var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
		var msgItemTap = function(msgItem, event) {
			var msgType = msgItem.getAttribute('msg-type');
			var msgContent = msgItem.getAttribute('msg-content')
			if (msgType == 'sound') {
				player = plus.audio.createPlayer(msgContent);
				var playState = msgItem.querySelector('.play-state');
				playState.innerText = '正在播放...';
				player.play(function() {
					playState.innerText = '点击播放';
				}, function(e) {
					playState.innerText = '点击播放';
				});
			}
		};
		var imageViewer = new mui.ImageViewer('.msg-content-image', {
			dbl: false
		});
		var bindMsgList = function() {
			//绑定数据:
			/*tp.bind({
				template: 'msg-template',
				element: 'msg-list',
				model: record
			});*/
			ui.areaMsgList.innerHTML = template('msg-template', {
				"record": record
			});
			var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
			[].forEach.call(msgItems, function(item, index) {
				item.addEventListener('tap', function(event) {
					msgItemTap(item, event);
				}, false);
			});
			imageViewer.findAllImage();
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight +  ui.areaMsgList.offsetHeight;
		};
		bindMsgList();
		window.addEventListener('resize', function() {
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight +  ui.areaMsgList.offsetHeight;
		}, false);
		/*var send = function(msg) {
			record.push(msg);
			bindMsgList();
			toRobot(msg.content);
		};*/
		function getSelfImg (consultId,userid) {
			var selfImgUrl;
			mui.ajax(baseUrl+'/ajax/tidings/qacon',{
				data:{
					"consultId":consultId
				},
				dataType:'json',//服务器返回json格式数据
				async:false,
				type:'get',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					var myData = data.data;
					console.log()
					for(var i = 0; i < myData.length; i++ ){
						if(myData[i]['professor']['id'] == userid){
							if(myData[i]['professor']['hasHeadImage'] == 1){
								selfImgUrl = baseUrl + "/images/head/" + myData[i]["professor"].id + "_m.jpg";
							}else {
								selfImgUrl = "../images/default-photo.jpg";
							}
						}
					}
					
				},
				error:function(xhr,type,errorThrown){
					//根据消息id查询消息失败
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
			return selfImgUrl;
		};
		
		var send = function(msg) {
			record.push(msg);
			bindMsgList();
			toRobot(msg.content);
		};
		var toRobot = function(info) {
			var apiUrl = baseUrl+"/ajax/tidings";//保存消息接口
			mui.ajax(apiUrl,{
				data:{
					"tidingsContant":ui.boxMsgText.value, //消息内容
				    "senderId":userid, //发送者ID
				    "consultId":consultId //咨询ID
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					console.log('消息成功'+data.data);
					//alert(JSON.stringify(data));
				},
				error:function(xhr,type,errorThrown){
					//保存消息失败
					plus.nativeUI.toast("抱歉，咨询失败", toastStyle);
				}
			});
			
		};
		function msgTextFocus() {
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
			}
			//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchstart', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchmove', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		//					ui.footerRight.addEventListener('touchcancel', function(event) {
		//						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
		//							msgTextFocus();
		//							event.preventDefault();
		//						}
		//					});
		//					ui.footerRight.addEventListener('touchend', function(event) {
		//						if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
		//							msgTextFocus();
		//							event.preventDefault();
		//						}
		//					});
		ui.footerRight.addEventListener('release', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {//发送
				//showKeyboard();
				if(ui.boxMsgText.value == ''){
				return
			}
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();//获取焦点
				}, 150);
				//							event.detail.gesture.preventDefault();
				//执行是否有头像
//				console.log(getSelfImg(consultId,userid));
				send({
					sender: 'self',
					type: 'text',
					content: ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>'),
					imgurl:getSelfImg (consultId,userid)
				});
				ui.boxMsgText.value = '';
				mui.trigger(ui.boxMsgText, 'input', null); //发送消息向后台传数据
			} 
			 /* else if (ui.btnMsgType.classList.contains('mui-icon-mic')) {//说话功能
				ui.btnMsgType.classList.add('mui-icon-compose');
				ui.btnMsgType.classList.remove('mui-icon-mic');
				ui.boxMsgText.style.display = 'none';
				ui.boxMsgSound.style.display = 'block';
				ui.boxMsgText.blur();
				document.body.focus();
			} else if (ui.btnMsgType.classList.contains('mui-icon-compose')) {//编辑
				ui.btnMsgType.classList.add('mui-icon-mic');
				ui.btnMsgType.classList.remove('mui-icon-compose');
				ui.boxMsgSound.style.display = 'none';
				ui.boxMsgText.style.display = 'block';
				//--
				//showKeyboard();
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
			}*/
		}, false);
		/*ui.footerLeft.addEventListener('tap', function(event) {
			var btnArray = [{
				title: "拍照"
			}, {
				title: "从相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "选择照片",
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				switch (index) {
					case 0:
						break;
					case 1:
						var cmr = plus.camera.getCamera();
						cmr.captureImage(function(path) {
							send({
								sender: 'self',
								type: 'image',
								content: "file://" +  plus.io.convertLocalFileSystemURL(path)
							});
						}, function(err) {});
						break;
					case 2:
						plus.gallery.pick(function(path) {
							send({
								sender: 'self',
								type: 'image',
								content: path
							});
						}, function(err) {}, null);
						break;
				}
			});
		}, false); */
		var setSoundAlertVisable=function(show){
			if(show){
				ui.boxSoundAlert.style.display = 'block';
				ui.boxSoundAlert.style.opacity = 1;
			}else{
				ui.boxSoundAlert.style.opacity = 0;
				//fadeOut完成再真正隐藏
				setTimeout(function(){
					ui.boxSoundAlert.style.display = 'none';
				},200);
			}
		};
		var recordCancel = false;
		var recorder = null;
		var audio_tips = document.getElementById("audio_tips");
		var startTimestamp = null;
		var stopTimestamp = null;
		var stopTimer = null;
		ui.boxMsgSound.addEventListener('hold', function(event) {
			recordCancel = false;
			if(stopTimer)clearTimeout(stopTimer);
			audio_tips.innerHTML = "手指上划，取消发送";
			ui.boxSoundAlert.classList.remove('rprogress-sigh');
			setSoundAlertVisable(true);
			recorder = plus.audio.getRecorder();
			if (recorder == null) {
				plus.nativeUI.toast("不能获取录音对象");
				return;
			}
			startTimestamp = (new Date()).getTime();
			recorder.record({
				filename: "_doc/audio/"
			}, function(path) {
				if (recordCancel) return;
				send({
					sender: 'self',
					type: 'sound',
					content: path
				});
			}, function(e) {
				plus.nativeUI.toast("录音时出现异常: " +  e.message);
			});
		}, false);
		ui.body.addEventListener('drag', function(event) {
			//console.log('drag');
			if (Math.abs(event.detail.deltaY) > 50) {
				if (!recordCancel) {
					recordCancel = true;
					if (!audio_tips.classList.contains("cancel")) {
						audio_tips.classList.add("cancel");
					}
					audio_tips.innerHTML = "松开手指，取消发送";
				}
			} else {
				if (recordCancel) {
					recordCancel = false;
					if (audio_tips.classList.contains("cancel")) {
						audio_tips.classList.remove("cancel");
					}
					audio_tips.innerHTML = "手指上划，取消发送";
				}
			}
		}, false);
		ui.boxMsgSound.addEventListener('release', function(event) {
			//console.log('release');
			if (audio_tips.classList.contains("cancel")) {
				audio_tips.classList.remove("cancel");
				audio_tips.innerHTML = "手指上划，取消发送";
			}
			//
			stopTimestamp = (new Date()).getTime();
			if (stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
				audio_tips.innerHTML = "录音时间太短";
				ui.boxSoundAlert.classList.add('rprogress-sigh');
				recordCancel = true;
				stopTimer=setTimeout(function(){
					setSoundAlertVisable(false);
				},800);
			}else{
				setSoundAlertVisable(false);
			}
			recorder.stop();
		}, false);
		ui.boxMsgSound.addEventListener("touchstart", function(e) {
			//console.log("start....");
			e.preventDefault();
		});
		ui.boxMsgText.addEventListener('input', function(event) {
			//console.log("----"+ui.boxMsgText.value+"$$")
			//ui.boxMsgText.style.backgroundColor='red'
			ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('addColor');
						ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');						
						ui.h.style.width=ui.boxMsgText.offsetWidth+  'px';
						ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
						ui.footer.style.height = (ui.h.offsetHeight +  footerPadding) +  'px';
						ui.content.style.paddingBottom = ui.footer.style.height;
			
		});
		ui.boxMsgText.addEventListener('tap', function(event) {
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 0);
		}, false);
	});

	
