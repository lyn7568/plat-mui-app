mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		console.log()
		var oconsultcon = document.getElementsByClassName("borderarea")[0];
		var demandContent = document.getElementById("demandContent");
		var oNavsub = document.getElementById("navsub");
		var consun;
		var demandType;
		var orgId;
		if(ws.flag==0){
			demanTy(); 
		}else if(ws.flag==1){
			document.getElementById("oGe").className="checkNow";
			document.getElementById("oQi").className="checkNo";
			demandType=1;
		}else{
			document.getElementById("oQi").className="checkNow";
			document.getElementById("oGe").className="checkNo";
			demandType=2;
		}
		//处理iOS下弹出软键盘后头部会随页面的滚动条消失问题
		iosheader();
		tab("navsub"); //身份切换
		function tab(name) {
			var oDome = document.getElementById(name);
			var oSpan = oDome.getElementsByTagName('ul')[0].childNodes;
			for(var i = 0; i < oSpan.length; i++) {
				oSpan[i].onclick = function() {
					for(var i = 0; i < oSpan.length; i++) {
						oSpan[i].className = '';
					}
					this.className = 'set';
					if(this.getElementsByTagName("span")[0].innerText == "咨询技术难题") {
						consun = 1;
					} else if(this.getElementsByTagName("span")[0].innerText == "寻求研发资源") {
						consun = 2;
					} else {
						consun = 3;
					}
				}
			}
		}
		/*切换需求类型*/
function demanTy() {
	var deTy = document.getElementById("navsubTo");
	var deTyChild = deTy.getElementsByTagName("span");
	if(deTyChild[0].className != "checkNo" && deTyChild[1].className != "checkNo") {
		for(var n = 0; n < deTyChild.length; n++) {
			(function(m) {
				deTyChild[m].onclick = function() {
					this.className = "checkNow";
					if(m == 0) {
						demandType=1;
						deTyChild[1].className = "";
					} else if(m == 1) {
						demandType=2;
						deTyChild[0].className = "";
					}
				}
			})(n);
		}
	}
}
		/*需求内容*/
		function checkLen(obj) {

			var maxChars = 300; //最多字符数  

			if(obj.innerText.length > maxChars) {

				obj.innerText = obj.innerText.substring(0, maxChars);
			}

			var curr = maxChars - obj.innerText.length;
			document.getElementById("countNum").innerHTML = curr.toString();
		};

		oconsultcon.addEventListener('keyup', function() {
			checkLen(oconsultcon);
		});
		/*需求题目*/
		demandContent.addEventListener('keyup', function() {
			if(demandContent.value.length > 30) {
				demandContent.value = demandContent.value.substring(0, 30);
			}
		});
		/*行业及领域选择*/
		mui('.hotsearch').on('tap', 'li', function() {
				if(this.className == "checkedLi") {
					this.classList.remove("checkedLi")
				} else {
					this.classList.add("checkedLi")
				}
			})
			/*行业及领域选择添加及删除*/
		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		mui(".labelshow").on("tap", "em", function() {
			var val = this.parentNode;
			document.getElementsByClassName('labelshow')[0].removeChild(val);
		});
		document.getElementsByClassName("addlabelbtn")[0].addEventListener("tap", function() {
				var labelshow1 = document.getElementById("labelshow").getElementsByTagName("li");
				if(labelshow1.length > 4) {
					plus.nativeUI.toast("添加内容不能超过5个", toastStyle);
					return;
				}
				var addContent = document.getElementsByClassName('lineInput')[0].value;
				var content = trim(addContent);
				if(content.length>10){
					plus.nativeUI.toast("添加内容不能超过10个字", toastStyle);
					return;
				}
				if(content) {
					var node = document.createElement("li");
					node.innerHTML = content + '<em class="mui-icon mui-icon-closeempty"></em>';
					document.getElementsByClassName("labelshow")[0].appendChild(node);
					document.getElementsByClassName('lineInput')[0].value = ''
				} else {
					plus.nativeUI.toast("添加内容不能为空", toastStyle);
				}
			})
			/*查询应用行业及学术领域*/
		function industry(insu) {
			mui.ajax(baseUrl + "/ajax/dataDict/qaDictCode", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data: {
					"dictCode": insu
				},
				success: function(data) {
					if(data.success) {
						var $data = data.data;
						var n;
						($data.length > 5) ? n = 5:
							n = $data.length
						for(var i = 0; i < n; i++) {
							var node = document.createElement("li");
							node.innerHTML = '<span>' + $data[i].caption + '</span>';
							document.getElementsByClassName('hotsearch')[0].appendChild(node);
						}
						plus.nativeUI.closeWaiting();
						plus.webview.currentWebview().show("slide-in-right", 150);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		industry("INDUSTRY");
		industry("SUBJECT");
		getOrgId();
		function getOrgId(){
			mui.ajax(baseUrl + "/ajax/professor/baseInfo/"+userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
					var $rta = data.data;
					orgId = $rta.orgId
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		/*发布新需求*/
		document.getElementsByClassName("topsave")[0].addEventListener("tap", function() {
				var dd = oNavsub.getElementsByClassName("set");
				var cc=document.getElementById("navsubTo").getElementsByClassName("checkNow")
				if(dd.length == 0) {
					plus.nativeUI.toast("请选择您发布需求的目的", toastStyle);
					return;
				}
				if(cc.length == 0) {
					plus.nativeUI.toast("请选择您的需求类型", toastStyle);
					return;
				}
				if(!trim(demandContent.value)) {
					plus.nativeUI.toast("请填写需求主题", toastStyle);
					return;
				}
				if(!trim(oconsultcon.innerText)) {
					plus.nativeUI.toast("请填写需求内容", toastStyle);
					return;
				}
				publish()
			})
			/*发布需求函数*/
		function publish() {
			var arr = [];
			var oSuin = document.getElementsByClassName("checkedLi");
			var oin = document.getElementById("labelshow").getElementsByTagName("li");
			for(var i = 0; i < oSuin.length; i++) {
				arr[i] = oSuin[i].innerText;
			}
			for(var j = 0; j < oin.length; j++, i++) {
				arr[i] = oin[j].innerText;
			}

			mui.ajax(baseUrl + '/ajax/demand', {
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				timeout: 10000, //超时设置
				traditional: true,
				data: {
					"demander": userid,
					"demandAim": consun,
					"demandType": demandType,
					"demandTitle": demandContent.value,
					"demandContent": oconsultcon.innerText,
					"args": arr,
					"orgId": (demandType == 2) ? orgId : "",
				},
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {

						plus.nativeUI.toast("需求发布成功！很快会有专家与您联系，您可以在咨询列表中查看专家回复的信息", toastStyle);
						var curr = plus.webview.currentWebview();
						var wvs = plus.webview.all();
						for(var i = 0, len = wvs.length; i < len; i++) {
							//关闭除setting页面外的其他页面
							if(wvs[i].getURL() == curr.getURL())
								continue;
							plus.webview.close(wvs[i]);
						}
						//打开login页面后再关闭setting页面
						plus.webview.open('../index.html');
						curr.close();

					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
	})
})