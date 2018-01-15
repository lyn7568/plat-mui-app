(function(window) {
	function ajaxRequist(url, obj, type, fn) {
		mui.ajax(url, {
			data: obj,
			dataType: 'json', //服务器返回json格式数据
			type: type, //支持'GET'和'POST'
			traditional: true,
			success: function(data) {
				console.log(JSON.stringify(data))
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
		self.init();
		self.bindEvent();
	}
	LeaveWord.prototype.init = function() {
		var self = this;
		ajaxRequist(baseUrl + "/ajax/leavemsg/dialog", {
			id: self.sid
		}, "GET", function(data) {
			plus.webview.currentWebview().show();
			console.log(JSON.stringify(data))
			document.getElementsByClassName('commentBlock')[0].innerHTML = ""
			if(data.length == 0) {
				return;
			}
			var id = plus.storage.getItem('userid');
			for(var i = 0; i < data.length; i++) {
				var oText = "",
					reply = "",re="";
					if(data[i].state=="1") 
					re = '<span class="replyLew" style="margin-right:10px;" data-id="' + data[i].id + '">回复</span>' + '<span class="mui-icon iconfont plusbtn icon-appreciate"style="padding-left:10px;margin-right:10px;font-size:14px;" data-id="' + data[i].id + '" data-num="' + data[i].agreeCount + '"></span><span  class="zan"style="display:' + (data[i].agreeCount ? "inline-block" : "none") + '">' + data[i].agreeCount + ' 赞 </span>';
					
				if(id == data[i].sender) {
					oText = "删除";
					re = "";
				}
				if(data[i].state=="0") {
					oText = ""
				}
				if(data[i].reciver) {
					reply = " 回复 " + "<span class='reply2'></span>"
				}
				var baImg = "../images/default-photo.jpg";
				var li = document.createElement("li");
				li.className = "mui-table-view-cell";
				li.innerHTML = '<div class="flexCenter mui-clearfix">' +
					'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')" data-id="' + data[i].sender + '"></div>' +
					'<div class="madiaInfo">' +
					'<p><span class="replay1"></span>' + reply + '</p>' +
					'</div>' +
					'</div>' +
					'<div class="madiaInfo">' +
					'<p class="h2Font">' + ((data[i].state=="1")?data[i].cnt:"该留言已被其本人删除。") + '</p>' +
					'<p class="operateSpan">' +
					'<span class="commenttime">' + commenTime(data[i].createTime) + '</span>' + re +
					'<span data-id="' + data[i].id + '" class="dele">' + oText + '</span>' +
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
		ajaxRequist(baseUrl + "/ajax/professor/editBaseInfo/" + uId, {}, "GET", function($data) {
			if(parNum == 1) {
				if($data.hasHeadImage == 1) {
					li.getElementsByClassName("useHead")[0].style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg" + ")";
				}
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			var str = '<span class="h1Font" >' + $data.name + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em>'
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
	LeaveWord.prototype.bindEvent = function() {
		var self = this;
		document.getElementsByClassName("mui-btn")[0].addEventListener("tap", function() {
				self.replyLword(document.getElementById("textInputThis").getAttribute("oid"));
		});
		mui(".commentBlock").on("tap", ".plusbtn", function() {
			if(this.classList.contains('icon-appreciatefill') == true) {
				return;
			}
			self.thub.call(this, this.getAttribute("data-id"));
		})
		mui(".commentBlock").on("tap", ".replyLew", function() {
			var oid = this.getAttribute("data-id")
			document.getElementById("textInput").style.display = "block";
			document.getElementById("textInputThis").focus();
			document.getElementById("textInputThis").placeholder = this.getAttribute("name");
			document.getElementById("textInputThis").setAttribute("oid", oid);
			return false;
		})
		mui("body").on("tap", ".mui-content", function() {
			document.getElementById("textInput").style.display = "none";
		})
		mui(".commentBlock").on("tap", ".dele", function() {
			self.LwordDel(this, this.getAttribute("data-id"));
		});
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
		ajaxRequist(baseUrl + "/ajax/leavemsg/agree", {
			id: lid,
			uid: plus.storage.getItem('userid')
		}, "GET", function(data) {
			if(data) {
				li.getElementsByClassName("plusbtn")[0].classList.add("icon-appreciatefill");
				li.getElementsByClassName("zan")[0].innerHTML = "已赞" + num;
			}
		})
	}
	LeaveWord.prototype.thub = function(lid) {
		var self = this;
		ajaxRequist(baseUrl + "/ajax/leavemsg/agree", {
			id: lid,
			uid: plus.storage.getItem('userid'),
			uname: plus.storage.getItem('name')
		}, "POST", function(data) {
			self.classList.add("icon-appreciatefill");
			self.nextElementSibling.innerHTML = "已赞" + (Number(self.getAttribute("data-num")) + 1);
			self.nextElementSibling.style.display = "inline-block";
		})
	}
	LeaveWord.prototype.replyLword = function(lid) {
		var self = this;
		if(!self.size) {
			return;
		}
		ajaxRequist(baseUrl + "/ajax/leavemsg/reply", {
			cnt: document.getElementById("textInputThis").value,
			id: lid,
			uid: plus.storage.getItem('userid'),
			uname: plus.storage.getItem('name')
		}, "POST", function(data) {
			document.getElementById("textInputThis").value = "";
			document.getElementById('textInput').style.display = "none";
			self.init({
				id: self.sid
			});
		})
	}
	LeaveWord.prototype.LwordDel = function($this, lid) {
		var self = this;
		ajaxRequist(baseUrl + "/ajax/leavemsg/del", {
			id: lid
		}, "GET", function(data) {
			document.getElementsByClassName("commentBlock")[0].removeChild($this.parentNode.parentNode.parentNode);
		})
	}

	var module = {
		lWord: function(sid) {
			this.sid = sid;
			var lw = new LeaveWord();
		}
	}
	window.module = module;
})(window)