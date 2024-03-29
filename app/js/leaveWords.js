(function(window) {
	function ajaxRequist(url, obj, type, fn) {
		mui.ajax(baseUrl + url, {
			data: obj,
			dataType: 'json', //服务器返回json格式数据
			type: type, //支持'GET'和'POST'
			traditional: true,
			success: function(data) {
				if(data.success) {
					fn(data.data)
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	function trim(str) { //删除左右两端的空格
		　　
		return str.replace(/(^\s*)|(\s*$)/g, "");　　
	}
	var LeaveWord = function() {
		var self = this;
		self.sid = module.sid;
		self.stype = module.stype;
		self.init();
		var str=document.createElement("div");
		str.className="con-kong displayNone";
		var tNode=document.createTextNode("暂无留言")
		str.appendChild(tNode);
		document.getElementsByClassName('commentBlock')[0].parentNode.appendChild(str);
		self.bindEvent();
		self.LwordTotal();
	}

	function lgin() {
		if(plus.storage.getItem('userid')) {
			return true;
		}
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
		return false;
	}
	LeaveWord.prototype.init = function() {
		console.log(JSON.stringify(this))
		var self = this;
		ajaxRequist("/ajax/leavemsg/subject", {
			sid: self.sid,
			stype: self.stype,
			time: 0,
			id: 0,
			rows: 500
		}, "GET", function(data) {
			document.getElementsByClassName('commentBlock')[0].innerHTML = ""
			if(data.length == 0) {
				return;
			}
			var id = plus.storage.getItem('userid');
			for(var i = 0; i < data.length; i++) {
				var oText = "",
					reply = "",
					re ='<span class="spanitem"><em class="mui-icon iconfont plusbtn plusbtnCan icon-appreciate" style="font-size:16px;" data-id="' + data[i].id + '" data-num="' + data[i].agreeCount + '"></em><em style="margin-left:3px;display:' + (data[i].agreeCount ? "inline-block" : "none") + '">' + data[i].agreeCount + ' </em></span>'+
						'<span class="spanitem replyLew" data-id="' + data[i].id + '">回复</span>';
				if(id == data[i].sender) {
					oText = '<span class="spanitem"><em class="mui-icon iconfont plusbtn icon-appreciate" style="font-size:16px;" data-id="' + data[i].id + '" data-num="' + data[i].agreeCount + '"></em><em style="margin-left:3px;display:' + (data[i].agreeCount ? "inline-block" : "none") + '">' + data[i].agreeCount + ' </em></span>'+
							'<span class="spanitem dele" data-id="' + data[i].id + '">删除</span>';
					re = '';
				}
				if(data[i].reciver) {
					reply = '<em style="font-style:normal;padding:0 6px;">回复</em>' +  '<span class="h1Font reply2"></span>'
				}
				var baImg = "../images/default-photo.jpg";
				var li = document.createElement("li");
				li.className = "mui-table-view-cell leaveWord";
				li.innerHTML = '<div class="flexCenter mui-clearfix">' +
					'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')" data-id="' + data[i].sender + '"></div>' +
					'<div class="madiaInfo">' +
					'<p class="h2Font"><span class="h1Font replay1"></span>' + reply + '</p>' +
					'</div>' +
					'</div>' +
					'<div class="madiaInfo">' +
					'<p class="h1Font messageContent">' + data[i].cnt + '</p>' +
					'<p class="operateSpan">' +
					'<span class="spanitem commenttime">' + commenTime(data[i].createTime) + '</span>' + re + oText +
					'</p>' +
					'</div>'
				document.getElementsByClassName("commentBlock")[0].appendChild(li);
				if(data[i].reciver) {
					self.userInfo(data[i].sender, li, 1);
					self.userInfo(data[i].reciver, li, 2)
				} else {
					self.userInfo(data[i].sender, li, 1);
				}
				if(data[i].agreeCount)
					self.referThup(data[i].id, li, data[i].agreeCount);
			}
		})
	}
	LeaveWord.prototype.userInfo = function(uId, li, parNum) {
		ajaxRequist("/ajax/professor/editBaseInfo/" + uId, {}, "GET", function($data) {
			if(parNum == 1) {
				if($data.hasHeadImage == 1) {
					li.getElementsByClassName("useHead")[0].style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg" + ")";
				}
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			var styStr='<em class="authicon ' + userType.sty + '" title="科袖认证专家"></em>'
			if(userType.sty=="e"){
				styStr=""
			}
			var str = '<span class="h1Font" >' + $data.name + '</span>'+styStr
			if(parNum == 1) {
				li.getElementsByClassName("replay1")[0].innerHTML = str;
			} else {
				li.getElementsByClassName("reply2")[0].innerHTML = str;
			}
			if(li.getElementsByClassName("replyLew")[0])
				li.getElementsByClassName("replyLew")[0].setAttribute("name", "回复 " + $data.name + "：");
		})
	}
	LeaveWord.prototype.size = function() {
		if(document.getElementById("textInputThis").value.length > 200) {
			plus.nativeUI.toast("留言不得超过200个字", toastStyle);
			return false;
		}
		return true;
	}
	LeaveWord.prototype.topLw = function() {
		var self = this;
		if(!self.size) {
			return;
		}
		ajaxRequist("/ajax/leavemsg", {
			cnt: document.getElementById("textInputThis").value,
			refId: self.sid,
			refType: self.stype,
			sender: plus.storage.getItem('userid'),
			uname: plus.storage.getItem('name')
		}, "POST", function() {
			document.getElementById("textInputThis").value = "";
			document.getElementById('textInput').style.display = "none";
			document.getElementById('operCol').style.display = "block";
			self.init({
				sid: self.sid,
				stype: self.stype,
				time: 0,
				id: 0,
				rows: 500
			});
			self.LwordTotal();
		})
	}
	LeaveWord.prototype.bindEvent = function() {
		var self = this;
		document.getElementsByClassName("mui-btn")[0].addEventListener("tap", function() {
			if(!lgin()) {
				return;
			}
			if(document.getElementById("textInputThis").getAttribute("oid")) {
				self.replyLword(document.getElementById("textInputThis").getAttribute("oid"));
				return;
			}
			self.topLw();
		});
		mui(".commentBlock").on("tap", ".plusbtnCan", function() {
			if(!lgin()) {
				return;
			}
			if(this.classList.contains('icon-appreciatefill') == true) {
				return;
			}
			self.thub.call(this, this.getAttribute("data-id"));
		})
		mui(".commentBlock").on("tap", ".replyLew", function() {
			if(!lgin()) {
				return;
			}
			var oid = this.getAttribute("data-id")
			document.getElementById("operCol").style.display = "none";
			document.getElementById("textInput").style.display = "block";
			document.getElementById("textInputThis").focus();
			document.getElementById("textInputThis").placeholder = this.getAttribute("name");
			document.getElementById("textInputThis").setAttribute("oid", oid);
			return false;
		})
		mui("body").on("tap", ".mui-content", function() {
			document.getElementById("textInput").style.display = "none";
			document.getElementById("operCol").style.display = "block";
			document.getElementById("textInputThis").placeholder = "说点什么吧...";
			if(document.getElementById("textInputThis").getAttribute("oid")) {
				document.getElementById("textInputThis").removeAttribute("oid")
			}
		})
		mui(".commentBlock").on("tap", ".dele", function() {
			self.LwordDel(this, this.getAttribute("data-id"));
		});
		mui('.commentBlock').on('tap', '.useHead', function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
				proid: id
			});
		})
		mui(".artfoot").on("tap", ".inputShow", function() {
			if(!lgin()) {
				return;
			}
			if(document.getElementById("textInputThis").getAttribute("oid")) {
				document.getElementById("textInputThis").removeAttribute("oid")
			}
			document.getElementById("textInput").style.display = "block";
			document.getElementById("operCol").style.display = "none";
			document.getElementById("textInputThis").focus();
		})
		document.getElementById("textInputThis").addEventListener("input", function() {
			var length = trim(this.value);
			if(length) {
				document.getElementsByClassName("mui-btn")[0].removeAttribute("disabled");
			} else {
				document.getElementsByClassName("mui-btn")[0].setAttribute("disabled", "true")
			}
		})
	}
	LeaveWord.prototype.referThup = function(lid, li, num) {
		ajaxRequist("/ajax/leavemsg/agree", {
			id: lid,
			uid: plus.storage.getItem('userid')
		}, "GET", function(data) {
			if(data) {
				li.getElementsByClassName("plusbtnCan")[0].classList.add("icon-appreciatefill");
			}
		})
	}
	LeaveWord.prototype.thub = function(lid) {
		var self = this;
		ajaxRequist("/ajax/leavemsg/agree", {
			id: lid,
			uid: plus.storage.getItem('userid'),
			uname: plus.storage.getItem('name')
		}, "POST", function(data) {
			self.classList.add("icon-appreciatefill");
			self.nextElementSibling.innerHTML =Number(self.getAttribute("data-num")) + 1;
			self.nextElementSibling.style.display = "inline-block";
		})
	}
	LeaveWord.prototype.replyLword = function(lid) {
		var self = this;
		if(!self.size) {
			return;
		}
		ajaxRequist("/ajax/leavemsg/reply", {
			cnt: document.getElementById("textInputThis").value,
			id: lid,
			uid: plus.storage.getItem('userid'),
			uname: plus.storage.getItem('name')
		}, "POST", function(data) {
			self.LwordTotal();
			document.getElementById("textInputThis").value = "";
			document.getElementById('textInput').style.display = "none";
			document.getElementById('operCol').style.display = "block";
			document.getElementById("textInputThis").removeAttribute("oid");
			document.getElementById("textInputThis").placeholder = "说点什么吧...";
			self.init({
				sid: self.sid,
				stype: self.stype,
				time: 0,
				id: 0,
				rows: 500
			});
			
		})
	}
	LeaveWord.prototype.LwordDel = function($this, lid) {
		var self = this;
		ajaxRequist("/ajax/leavemsg/del", {
			id: lid
		}, "GET", function(data) {
			document.getElementsByClassName("commentBlock")[0].removeChild($this.parentNode.parentNode.parentNode);
			self.LwordTotal();
		})
	}
	LeaveWord.prototype.LwordTotal = function() {
		var self = this;
		ajaxRequist("/ajax/leavemsg/count", {
			sid: self.sid,
			stype: self.stype
		}, "get", function($data) {			
			if($data > 0) {
				document.getElementsByClassName('mui-badge')[0].innerHTML = $data;
				document.getElementsByClassName("con-kong")[0].classList.add("displayNone");
			}else{
				document.getElementsByClassName('mui-badge')[0].innerHTML = "";
				document.getElementsByClassName("con-kong")[0].classList.remove("displayNone");
			}
		})
	}

	var module = {
		lWord: function(sid, stype) {
			this.sid = sid;
			this.stype = stype;
			var lw = new LeaveWord();
			this.init = lw.init;
		}
	}
	window.module = module;
})(window)