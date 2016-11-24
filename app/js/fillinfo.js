//注册完成个人信息
mui.ready(function() {
	
    /*定义全局变量*/
	var userName = document.getElementById("userName");
	var userMechanism = document.getElementById("userMechanism");
	var userDepartment = document.getElementById("userDepartment");
	var userPosition = document.getElementById("userPosition");
	var userTitle = document.getElementById("userTitle");
	var goIndex = document.getElementById("goIndex");
	var dataProvince = document.getElementById("data-province");
	var dataAddress = document.getElementById("data-address");
	/*选择地址*/
	var cityPicker = new mui.PopPicker({layer: 2});
	cityPicker.setData(cityData);
	var showCityPickerButton = document.getElementById('showCityPicker');
	showCityPickerButton.addEventListener('tap', function(event) {
		cityPicker.show(function(items) {
			showCityPickerButton.value = items[0].text + " " + items[1].text;
			dataProvince.value = items[0].text;
			dataAddress.value = items[1].text;
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	}, false);
	mui.plusReady(function() {
		
		var self = plus.webview.currentWebview();
		
		/*校验提交按钮显示状态*/
		mui('.basicinfo').on('keyup', "#userName,#userMechanism", function() {
			hideButtn(userName,userMechanism,goIndex,"frmactiveok");
		});

		/*提交个人信息*/
		goIndex.addEventListener('tap', function() {
			var d = document.getElementById('showCityPicker').value;
			goVal();
		});

		function goVal() {
			var $data = {};
			$data.name = userName.value;
			$data.orgName = userMechanism.value;
			$data.title = userTitle.value;
			$data.department = userDepartment.value;
			$data.office = userPosition.value;
			$data.province = dataProvince.value;
			$data.address = dataAddress.value;
			$data.id = self.userid;
			console.log(JSON.stringify($data))
			mui.ajax(baseUrl + '/ajax/professor', {
				data: $data,
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.success);
					if(data.success) {
						goHome();
						var myaccountClose = plus.webview.getWebviewById("html/myaccount.html");
						plus.webview.close(myaccountClose);
					} else {
						plus.nativeUI.toast("提交失败，用户ID失效", toastStyle);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			})
		}

	});

});