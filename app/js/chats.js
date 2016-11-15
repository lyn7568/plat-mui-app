mui.ready(function() {
	 
	var oconsultTitle = document.getElementById("consultTitle");//咨询标题
	var ochatName = document.getElementById("chatName");//与。。聊天
	var oconsultCon = document.getElementById("consultCon");//咨询内容
	var olookConBtn = document.getElementById("lookConBtn");//查看按钮
	
	var oconfirmBtn = document.getElementById("confirmBtn");//我的需求，确认完成按钮
	var oassessBtn = document.getElementById("assessBtn");//我的需求，去评价按钮
	var oassessed = document.getElementById("assessed");//我的需求，已评价(评价星级和评价内容)
	var omy_starContainer = document.getElementById("my_starContainer");//我的需求，星级容器
	
	var othat_weiassess = document.getElementById("that_weiassess");//收到咨询，未评价状态
	var owaying = document.getElementById("waying");//收到咨询，进行中状态
	var othat_assessed = document.getElementById("that_assessed");//收到咨询，对方已评价
	var oconstarContainer = document.getElementById("consult_starContainer");//收到咨询星级容器
	
	
	var omsg_list = document.getElementById("msg-list");
	var omsg_text = document.getElementById("msg-text");
	var omsg_type = document.getElementById("msg-type");
	var ochatFooter = document.getElementById("chatFooter");
	
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
				success:function(data){
					myData = data.data;
					ochatName.innerHTML = myData["professor"]["name"];
					var consultTitle = '关于'+myData["consultTitle"]+"的咨询";
					oconsultTitle.innerHTML = consultTitle;
					oconsultCon.innerHTML = myData['consultContant'];
					//我的需求进行中
					if(myData["consultStatus"] == 0){
						oconfirmBtn.classList.remove('displayNone');//我的需求，进行中
						ochatFooter.classList.remove('displayNone');
					}else {
						if(myData["assessStatus"] == 0){
							oassessBtn.classList.remove('displayNone');//我的需求，未评价
						}else {
							
							oassessed.classList.remove('displayNone');//我的需求，已评价
							
							//评价星级
							console.log("我的需求已评价")
							var starCount = myData["assessStar"];
							console.log(starCount);
							for(var i=0;i < starCount;i++){
								if(i < starCount){
									omy_starContainer.querySelectorAll('.iconfont')[i].classList.remove('icon-favor');
									omy_starContainer.querySelectorAll('.iconfont')[i].classList.add('icon-favorfill');
									console.log(omy_starContainer.querySelectorAll('.iconfont')[i].classList)
								}
							}
							
						}
					} 
					
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
		
		}else if(manFlag == 'consult'){
			mui.ajax(baseUrl+'/ajax/consult/qapro',{
				data:{"consultId":consultId,"readStatus":"1"},
				dataType:'json',//服务器返回json格式数据
				type:'get',//HTTP请求类型
				success:function(data){
					myData = data.data;
					ochatName.innerHTML = myData["professor"]["name"];
					var consultTitle = '回复：关于'+myData["consultTitle"]+"的咨询";
					oconsultTitle.innerHTML = consultTitle;
					oconsultCon.innerHTML = myData['consultContant'];
					//收到咨询进行中
					if(myData["consultStatus"] == 0){
						owaying.classList.remove('displayNone');
						ochatFooter.classList.remove('displayNone');
					}else {//收到咨询已完成
						if(myData["assessStatus"] == 0){//收到咨询未评价
							othat_weiassess.classList.remove('displayNone');
						}else{//收到咨询已评价(评价星级和评价内容)
							
							othat_assessed.classList.remove('displayNone');
							
							//评价星级
							var starCount = myData["assessStar"];
							console.log(starCount);
							for(var i = 0;i < starCount;i++){
								othat_assessed.querySelectorAll('.iconfont')[i].classList.remove('icon-favor');
								othat_assessed.querySelectorAll('.iconfont')[i].classList.add('icon-favorfill');
								console.log(othat_assessed.querySelectorAll('.iconfont')[i].classList); 	
								
							}
						}
					}
					
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
			
		};
	};
	
	//对话内容保存
	function saveChatFun(consultId,userid){
		var tidingsContant = omsg_text.innerHTML
		console.log(tidingsContant);
		mui.ajax(baseUrl +'/ajax/tidings',{
			data:{
				"consultId":consultId,
				"sendId":userid,
				"tidingsContant":tidingsContant
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			success:function(data){
				console.log(data);
			},
			error:function(xhr,type,errorThrown){
				
			}
		});
	}
	
		
		
	var MIN_SOUND_TIME = 800;
	mui.init({
		gestureConfig: {
			tap: true, //默认为true
			doubletap: true, //默认为false
			longtap: true, //默认为false
			swipe: true, //默认为true
			drag: true, //默认为true
			hold: true, //默认为false，不监听
			release: true //默认为false，不监听
		}
	});
	template.config('escape', false);
	//mui.plusReady=function(fn){fn();};
	mui.plusReady(function() {
		
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var consultId = self.consultId;
//		var manFlag = self.manFlag;
		var consultantId = self.consultantId;
		console.log(consultId);
//		console.log(manFlag);
		console.log('userid'+userid);
		console.log('consultantId'+consultantId);
		if(userid == consultantId){//我的需求
			//头部信息
			var manFlag = 'myNeed';
			getHeadInfo(manFlag,consultId);
		}else {//收到咨询
			//头部信息
			var manFlag = 'consult';
			getHeadInfo(manFlag,consultId);
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
		
		var record = [{
			sender: 'zs',
			type: 'text',
			content: 'Hi，我是 科袖 小管家！'
		}];
		//根据咨询id查询消息
		mui.ajax(baseUrl+'/ajax/tidings/qacon',{
			data:{
				"consultId":consultId
			},
			dataType:'json',//服务器返回json格式数据
			type:'get',//HTTP请求类型
			success:function(data){
				var myData = data.data;
				for(var i = 0; i < myData.length; i++ ){
					if(data.data[i]['professor']['id'] == userid){
						record.push({
							sender: 'self',
							type: 'text',
							content: data.data[i]["tidingsContant"]
						});
					}else{
						record.push({
							sender: 'zs',
							type: 'text',
							content: data.data[i]["tidingsContant"]
						});
					}
				}
				bindMsgList();
			},
			error:function(xhr,type,errorThrown){
				//根据消息id查询消息失败
			}
		});
		
		
		
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
		ui.h.style.width = ui.boxMsgText.offsetWidth+'px';
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
		var send = function(msg) {
			record.push(msg);
			bindMsgList();
			toRobot(msg.content);
		};
		var toRobot = function(info) {
// 						var apiUrl = 'http://www.tuling123.com/openapi/api';
//			var apiUrl = baseUrl+'/ajax/tidings/qacon';//根据咨询id查询对话消息
			var apiUrl = baseUrl+"/ajax/tidings";//保存消息接口
			
			mui.ajax(apiUrl,{
				data:{
					"tidingsContant":ui.boxMsgText.value, //消息内容
				    "senderId":userid, //发送者ID
				    "consultId":consultId //咨询ID
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				success:function(data){
					console.log('消息成功'+data.data);
					//alert(JSON.stringify(data));
				},
				error:function(xhr,type,errorThrown){
					//保存消息失败
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
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();//获取焦点
				}, 150);
				//							event.detail.gesture.preventDefault();
				send({
					sender: 'self',
					type: 'text',
					content: ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>')
				});
				ui.boxMsgText.value = '';
				mui.trigger(ui.boxMsgText, 'input', null); //发送消息向后台传数据
			} else if (ui.btnMsgType.classList.contains('mui-icon-mic')) {//说话
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
			}
		}, false);
		ui.footerLeft.addEventListener('tap', function(event) {
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
		}, false); 
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
			ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
						ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
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
//			}(mui, document));
		
		
		
		
		
		
		
		
		
		
		
		

	
	
})