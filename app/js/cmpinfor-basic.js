mui.ready(function() {
	mui.plusReady(function() {
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
	});
	var id = "1B17DF270F0B4AAB8E1633267E4E2F5E";

	function companyMessage() {
		mui.ajax(baseUrl + "/ajax/org/" + id, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						console.log(JSON.stringify(data));
						var $data = data.data;
						var orgType,orgSize;
						document.getElementById("companyName").innerText = $data.name;
						if($data.hasOrgLogo) {
							document.getElementById("oimg").src = baseUrl + "/images/org/" + $data.id + ".jpg";
						} else {
							document.getElementById("oimg").src = "../images/default-icon.jpg"
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
						}else{
							document.getElementById("comType").parentNode.removeChild(document.getElementById("comType"));
						}
						/*所在城市*/
						if($data.city) {
							document.getElementById("ocity").innerText = $data.city;
					} else {
						document.getElementById("ocity").parentNode.removeChild(document.getElementById("ocity"));
					}
					/*时间*/
					if($data.foundTime) {
						var oTime = timeGeshi($data.foundTime);
						document.getElementById("createTime").innerText=oTime;
					} else {
						document.getElementById("createTime").parentNode.style="none";
					}
					/*企业规模*/
					if($data.orgSize) {
						switch($data.orgSize) {
							case '1':
								orgSize.innerText="50人以内";
								break;
							case '2':
								$("#qualificationList").text("50-100人")
								break;
							case '3':
								$("#qualificationList").text("100-200人")
								break;
							case '4':
								$("#qualificationList").text("200-500人")
								break;
							case '5':
								$("#qualificationList").text("500-1000人")
								break;
							default:
								$("#qualificationList").text("1000人以上")
								break;
						}
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
		var otme = otm.substring(0, 4) + "年" + otm.substring(4, 6) + "月" + otm.substring(6, 8)+"日";
		return otme;
	}
companyMessage();
})