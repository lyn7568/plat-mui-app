mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var str = JSON.stringify(ws);
		var oDt = document.getElementsByClassName("frmtype");
		var dataProvince = document.getElementById("data-province");
		var dataAddress = document.getElementById("data-address");
		var oAddress = document.getElementById("addressa")

		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					plus.nativeUI.closeWaiting();; //新webview的载入完毕后关闭等待框
					ws.show("slide-in-right", 150);
					var $data = data.data;
					//学术领域
					oDt[0].value = $data.name
					oDt[1].value = $data.orgName;
					oDt[2].value = $data.department;
					oDt[3].value = $data.office;
					oDt[4].value = $data.title;
					oAddress.innerText = $data.province + " " + $data.address;
					dataProvince.value = $data.province;
					dataAddress.value = $data.address;
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		oDt[0].addEventListener("blur", function() {
			var length = trim(oDt[0].value);
			if(!length)
				plus.nativeUI.toast("姓名不能为空");
		});
		oDt[1].addEventListener("blur", function() {
			var length = trim(oDt[1].value);
			if(!length)
				plus.nativeUI.toast("所在机构不能为空");
		});
		/*选择地址*/
		var cityPicker = new mui.PopPicker({
			layer: 2
		});
		cityPicker.setData(cityData);
		var showCityPickerButton = document.getElementById('showCityPicker');
		showCityPickerButton.addEventListener('tap', function(event) {
			cityPicker.show(function(items) {
				oAddress.innerText = items[0].text + " " + items[1].text;
				dataProvince.value = items[0].text;
				dataAddress.value = items[1].text;
				//返回 false 可以阻止选择框的关闭  
				//return false;
			});
		}, false);

		function savePro() {
			var mess = {};
			mess.name = oDt[0].value;
			mess.orgName = oDt[1].value;
			mess.department = oDt[2].value;
			mess.office = oDt[3].value;
			mess.title = oDt[4].value;
			mess.province = dataProvince.value;
			mess.address = dataAddress.value;
			mess.id = userid;
			var mess1 = JSON.stringify(mess);
			$.ajax({
				"url": baseUrl + '/ajax/professor',
				"type": "PUT",
				"async": true,
				"data": mess1,
				"contentType": "application/json",
				"success": function(data) {
					if(data.success) {
						var web = plus.webview.getWebviewById("html/proinforupdate.html");
						mui.fire(web, "newId");
						mui.back();
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				}
			});			
		}

		document.getElementsByClassName("topsave")[0].addEventListener("click", function() {
			var length1 = trim(oDt[0].value);
			var length2 = trim(oDt[1].value);
			if(length1 && length2) {
				savePro();
			} else if(!length1 && length2) {
				plus.nativeUI.toast("姓名不能为空");
			} else if(length1 && !length2) {
				plus.nativeUI.toast("所在机构不能为空");
			} else if(!length1 && !length2) {
				plus.nativeUI.toast("姓名不能为空&&所在机构不能为空");
			}

		});
		personalMessage();
	});
})              