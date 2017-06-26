mui.plusReady(function() {
	var oweb = plus.webview.currentWebview();
	function lag(se1, se2,num) {
		var oaddress = document.getElementById(se1).getElementsByTagName("li");
		for(var i = 0; i < oaddress.length; i++) {
			if(oaddress[i].innerHTML == se2) {
				oaddress[i].classList.add("filterCurrent");
				document.getElementsByClassName("orangeColor")[num].innerHTML=se2
			} else {
				oaddress[i].classList.remove("filterCurrent");
			}
		}
	}
	//筛选条件的选择
	mui(".filterUl").on("tap", "li", function() {
		this.parentNode.querySelector('li.filterCurrent').classList.remove("filterCurrent");
		this.classList.add("filterCurrent");
		this.parentNode.parentNode.querySelector(".filterClass span").innerText = this.innerText;
	})
	//筛选条件的展开关闭
	mui(".filterListNew").on("tap", ".filterClass", function() {
		if(this.className == "filterClass filterActive") {
			this.classList.remove("filterActive");
			this.parentNode.querySelector(".filterUl").classList.remove("filterUlactive");
		} else {
			this.classList.add("filterActive");
			//this.nextSibling.classList.add("filterUlactive");
			this.parentNode.querySelector(".filterUl").classList.add("filterUlactive");
		}
	})
	document.getElementById("oRes").addEventListener("tap", function() {
		expertProfessor.res("industry");
		expertProfessor.res("subject");
		expertProfessor.res("address");
	})
	var expertProfessor = {
		oAjaxGet: function(url, obj, oType, oFun) {
			mui.plusReady(function() {
				mui.ajax(url, {
					data: obj,
					dataType: 'json', //服务器返回json格式数据
					type: oType, //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					traditional: true,
					success: function(data) {
						if(data.success) {
							plus.nativeUI.closeWaiting();
							plus.webview.currentWebview().show("slide-in-right", 150);
							oFun(data.data);
						}
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				});
			})
		},
		ind: function($data) {
			if($data.length == 0) {
				return;
			}
			var li1 = document.createElement("li");
			li1.className = "filterCurrent"
			li1.innerHTML = "不限";
			document.getElementById('industry').appendChild(li1);
			for(var i = 0; i < $data.length; i++) {
				var li = document.createElement("li");
				li.innerHTML = $data[i].caption;
				document.getElementById('industry').appendChild(li);
			}
			if(oweb.industry) {
				lag("industry", oweb.industry,2);
			}
		},
		sub: function($data) {
			if($data.length == 0) {
				return;
			}
			var li1 = document.createElement("li");
			li1.className = "filterCurrent"
			li1.innerHTML = "不限";
			document.getElementById('subject').appendChild(li1);
			for(var i = 0; i < $data.length; i++) {
				var li = document.createElement("li");
				li.innerHTML = $data[i].caption;
				document.getElementById('subject').appendChild(li);
			}
			if(oweb.subject) {
				lag("subject", oweb.subject,1);
			}
		},
		add: function($data) {
			if($data.length == 0) {
				return;
			}
			var li1 = document.createElement("li");
			li1.className = "filterCurrent"
			li1.innerHTML = "不限";
			document.getElementById('address').appendChild(li1);
			for(var i = 0; i < $data.length; i++) {
				var li = document.createElement("li");
				li.innerHTML = $data[i].caption;
				document.getElementById('address').appendChild(li);
			}
			if(oweb.address) {
				lag("address", oweb.address,0);
			}
		},
		res: function(aa) {
			var t = document.getElementById(aa).getElementsByTagName("li");
			for(var i in t) {
				if(t[i].innerHTML == "不限") {
					t[i].className = "filterCurrent"
				} else {
					t[i].className = ""
				}
			}
			for(var n = 0; n < 3; n++) {
				document.getElementsByClassName('orangeColor')[n].innerHTML = "不限";
			}

		}
	}
	expertProfessor.oAjaxGet(baseUrl + '/ajax/dataDict/qaDictCode', {
		"dictCode": "INDUSTRY"
	}, "get", expertProfessor.ind);
	expertProfessor.oAjaxGet(baseUrl + '/ajax/dataDict/qaDictCode', {
		"dictCode": "SUBJECT"
	}, "get", expertProfessor.sub);
	expertProfessor.oAjaxGet(baseUrl + '/ajax/dataDict/qaCity', {
		"dictCode": "ADDRESS"
	}, "get", expertProfessor.add);
	document.getElementById("com").addEventListener('tap', function() {
		var arr = [];
		for(var n = 0; n < 3; n++) {
			if(document.getElementsByClassName('orangeColor')[n].innerHTML == "不限") {
				arr[n] = "";
			} else {
				arr[n] = document.getElementsByClassName('orangeColor')[n].innerHTML
			}
		}
		var web = plus.webview.getWebviewById("../html/searchListNew.html");
		mui.fire(web, "newId", {
			arry: arr
		});
		mui.back();
	})
})