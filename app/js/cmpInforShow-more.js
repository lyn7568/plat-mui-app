
mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var orgId = self.cmpId;
		var oName = "";
		
		function companyMessage(id) {
			mui.ajax(baseUrl + "/ajax/org/" + id, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						console.log(JSON.stringify(data));
						var web = plus.webview.currentWebview()
						plus.nativeUI.closeWaiting();
						web.show("slide-in-right", 150);
						
						var $data = data.data;
						document.getElementById("companyName").innerHTML = $data.name;
						oName=$data.name;
						comNum()
						/*企业地址*/
						if($data.addr) {
							document.getElementById("address").innerText = $data.addr;
						} else {
							document.getElementById("address").parentNode.style.display = 'none';
						}
						/*时间*/
						if($data.foundTime) {
							var oTime = TimeTr($data.foundTime);
							document.getElementById("createTime").innerText = oTime;
						} else {
							document.getElementById("createTime").parentNode.style.display = "none";
						}
						/*企业规模*/
						if($data.orgSize) {
							document.getElementById("orgSize").innerText = orgSizeShow[$data.orgSize];
						} else {
							document.getElementById("orgSize").parentNode.style.display = "none";
						}
						/*企业类型*/
						if($data.orgType) {
							document.getElementById("orgType").innerText = orgTypeShow[$data.orgType];
						} else {
							document.getElementById("orgType").parentNode.style.display = "none";
						}
						/*企业官网*/
						if($data.orgUrl) {
							document.getElementById("shotAddress").innerText = $data.orgUrl;
						} else {
							document.getElementById("shotAddress").parentNode.style.display = "none";
						}
						/*企业简介*/
						if($data.descp) {
							document.getElementById("breifinfo").innerText = $data.descp;
						} else {
							document.getElementById("breifinfo").parentNode.parentNode.style.display = 'none';
						}
						
						/*企业资质*/
						if($data.qualification) {
							indu($data.qualification, 'qiyelist')
						} else {
							document.getElementById("qiyelist").parentNode.parentNode.style.display = "none";
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		
		/*应用行业及领域及企业纸质*/
		function indu(oString, oSelector) {
			var arr = oString.split(",");
			var oArr = new Array();
			var i;
			for(i in arr) {
				oArr.push('<li>' + arr[i] + '</li>');
			}
			document.getElementById(oSelector).innerHTML = oArr.join("");
		}
		companyMessage(orgId);
		function comNum() {
			mui.ajax(baseUrl + "/ajax/org/regInfo",{ 
				type: "get",
				dataType: "json",
				data: {
					"name": oName
				},
				success: function(data) {
					if(data.success) {
						if(data.data) {
							var $data = data.data;
							var str = "";
							if($data.num) {
								str += "<li>工商注册号：<span>" + $data.num + "</span></li>"
							}
							if($data.code) {
								str += "<li>组织机构代码：<span>" + $data.code + "</span></li>"
							}
							if($data.creditCode) {
								str += "<li>统一信用代码：<span>" + $data.creditCode + "</span></li>"
							}
							if($data.type) {
								str += "<li>企业类型：<span>" + $data.type + "</span></li>"
							}
							if($data.industry) {
								str += "<li>行业：<span>" + $data.industry + "</span></li>"
							}
							if($data.operatingPeriod) {
								str += "<li>营业期限：<span>" + $data.operatingPeriod + "</span></li>"
							}
							if($data.dayOfApproval) {
								str += "<li>核准日期：<span>" + $data.dayOfApproval + "</span></li>"
							}
							if($data.manager) {
								str += "<li>登记机关：<span>" + $data.manager + "</span></li>"
							}
							if($data.addr) {
								str += "<li>注册地址：<span>" + $data.addr + "</span></li>"
							}
							if($data.scopeOfBusiness) {
								str += "<li>经营范围：<span>" + $data.scopeOfBusiness + "</span></li>"
							}
							document.getElementById("comMes").innerHTML = str;
						}else {
							document.getElementById("comMes").parentNode.parentNode.style.display="none";
						}
					}else{
						document.getElementById("comMes").parentNode.parentNode.style.display="none";
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
			var web = plus.webview.getWebviewById("cmpInforShow.html");
				mui.fire(web, "newId",{
									rd: 1
							});
	})
	});
})