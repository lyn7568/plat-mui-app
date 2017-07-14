
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
						document.getElementById("companyName").innerText = $data.name;
						
						/*所在城市*/
						if($data.city) {
							document.getElementById("address").innerText = $data.city;
						} else {
							document.getElementById("address").parentNode.style.display = "none";
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
						/*应用行业*/
						if($data.industry) {
							document.getElementById("industryShow").innerText = $data.industry;
						} else {
							document.getElementById("industryShow").parentNode.style.display = 'none';
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
								str += "<li>工商注册号：" + $data.num + "</li>"
							}
							if($data.code) {
								str += "<li>组织机构代码：" + $data.code + "</li>"
							}
							if($data.creditCode) {
								str += "<li>统一信用代码：" + $data.creditCode + "</li>"
							}
							if($data.type) {
								str += "<li>企业类型：" + $data.type + "</li>"
							}
							if($data.industry) {
								str += "<li>行业：" + $data.industry + "</li>"
							}
							if($data.operatingPeriod) {
								str += "<li>营业期限：" + $data.operatingPeriod + "</li>"
							}
							if($data.dayOfApproval) {
								str += "<li>核准日期：" + $data.dayOfApproval + "</li>"
							}
							if($data.manager) {
								str += "<li>登记机关：" + $data.manager + "</li>"
							}
							if($data.addr) {
								str += "<li>注册地址：" + $data.addr + "</li>"
							}
							if($data.scopeOfBusiness) {
								str += "<li>经营范围：" + $data.scopeOfBusiness + "</li>"
							}
							var $str=$(str)
							document.getElementById("comMes").innerHTML = $str;
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
		comNum();
	});
})