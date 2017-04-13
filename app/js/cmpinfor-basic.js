mui.ready(function() {
	mui.plusReady(function() {
		var dd=plus.webview.getWebviewById("cmpinfor-Unindex.html");
		var dd1=plus.webview.getWebviewById("cmpinfor-index.html");
		if(dd==null){
			var id = dd1.orgId;
			var oflag=dd1.flag;
		}
		if(dd1==null){
			var id = dd.orgId;
			var oflag=dd.flag;
		}
		if(oflag==0){
		document.getElementsByClassName("aa")[0].style.width="50%";
		document.getElementsByClassName("aa")[1].style.width="50%";
		document.getElementsByClassName("aa")[2].style.display="none";
		}
		
		/*按钮点击切换*/
		mui(".cmpClassNum").on("tap", "li", function() {
			var oStringText = this.innerText;
			var arr = new Array();
			arr[0] = plus.webview.getWebviewById("cmpinfor-basic.html");
			arr[1] = plus.webview.getWebviewById("cmpinfor-trend.html");
			arr[2] = plus.webview.getWebviewById("cmpinfor-staff.html");
			if(oStringText == "介绍") {
				return;
			} else if(oStringText == "动态") {
				arr[1].show();
			} else if(oStringText == "员工") {
				arr[2].show();
			}
		})

		function companyMessage() {
			mui.ajax(baseUrl + "/ajax/org/" + id, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						//console.log(JSON.stringify(data));
						plus.nativeUI.closeWaiting();
						if(oflag==0){
							plus.webview.getWebviewById("cmpinfor-Unindex.html").show("slide-in-right", 150);
						}else{
							plus.webview.getWebviewById("cmpinfor-index.html").show("slide-in-right", 150);
						}
						
							
						var $data = data.data;
						var orgType, orgSize;
						document.getElementById("companyName").innerText = $data.name;
						if($data.hasOrgLogo) {
							document.getElementById("oimg").src = baseUrl + "/images/org/" + $data.id + ".jpg";
						} else {
							document.getElementById("oimg").src = "../images/default-icon.jpg";
						}
						/*企业标识*/
						if($data.authStatus == 3) {
							document.getElementById("authFlag").classList.add("authicon-com-ok");
						}
						/*企业类型*/
						if($data.orgType) {
							switch($data.orgType) {
								case '2':
									orgType = "国有企业";
									break;
								case '3':
									orgType = "上市企业";
									break;
								case '4':
									orgType = "合资企业";
									break;
								case '5':
									orgType = "私人企业";
									break;
								case '6':
									orgType = "外资企业";
									break;
								default:
									orgType = "初创企业";
									break;
							}
							document.getElementById("orgType").innerText = orgType;
							document.getElementById("comType").innerText = orgType;
						} else {
							document.getElementById("comType").parentNode.removeChild(document.getElementById("comType"));
						}
						/*所在城市*/
						if($data.city) {
							document.getElementById("ocity").innerText = $data.city;
							document.getElementById("city").innerText = $data.city;
						} else {
							document.getElementById("ocity").parentNode.removeChild(document.getElementById("ocity"));
							document.getElementById("city").parentNode.style.display = "none";
						}
						/*时间*/
						if($data.foundTime) {
							var oTime = timeGeshi($data.foundTime);
							document.getElementById("createTime").innerText = oTime;
						} else {
							document.getElementById("createTime").parentNode.style.display = "none";
						}
						/*企业规模*/
						if($data.orgSize) {
							switch($data.orgSize) {
								case '1':
									orgSize = "50人以内";
									break;
								case '2':
									orgSize = "50-100人";
									break;
								case '3':
									orgSize = "100-200人";
									break;
								case '4':
									orgSize = "200-500人";
									break;
								case '5':
									orgSize = "500-1000人";
									break;
								default:
									orgSize = "1000人以上";
									break;
							}
							document.getElementById("orgSize").innerText = orgSize;
						} else {
							document.getElementById("orgSize").parentNode.style.display = "none";
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
							document.getElementById("breifinfolist").style.display = 'none';
						}
						/*应用行业*/
						if($data.industry) {
							indu($data.industry, 'industryShow')
						} else {
							document.getElementById("industry").style.display = "none";
						}
						/*专注领域*/
						if($data.subject) {
							indu($data.subject, 'subjectShow')
						} else {
							document.getElementById("subject").style.display = "none";
						}
						/*企业资质*/
						if($data.qualification) {
							indu($data.qualification, 'qiye')
						} else {
							document.getElementById("qiyelist").style.display = "none";
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		/*时间格式转换*/
		function timeGeshi(otm) {
			var otme = otm.substring(0, 4) + "年" + otm.substring(4, 6) + "月" + otm.substring(6, 8) + "日";
			return otme;
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
		companyMessage();
	});
})