//注册完成个人信息
mui.ready(function() {
	mui.plusReady(function() {
		/*定义全局变量*/
		var userName = document.getElementById("userName");
		var userMechanism = document.getElementById("userMechanism");
		var userDepartment = document.getElementById("userDepartment");
		var goIndex = document.getElementById("goIndex");
		var dataProvince = document.getElementById("data-province");
		var dataAddress = document.getElementById("data-address");
		var applyType;
		var userId = plus.storage.getItem('userid');

		/*选择地址*/
		var cityPicker = new mui.PopPicker({
			layer: 2
		});
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

		/*头像上传自定义事件*/
		window.addEventListener('showimg', function(event) {
			showuserimg();
		});

		showusername();
		
		/*查询用户名*/
		function showusername() {
			
			alert(userId)
			mui.ajax(baseUrl + '/ajax/professor/baseInfo/' + userId, {
				dataType: 'json', //数据格式类型
				type: 'get', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						userName.innerText= data.data.name;
						plus.webview.currentWebview().show("slide-in-right", 150);
						plus.nativeUI.closeWaiting();
					}
				},
				error: function(data) {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			})
		}

		function showuserimg() {
			var userId = plus.storage.getItem('userid');
			console.log(userId)
			var filPage = plus.webview.getWebviewById('fillinfo-select.html');
			var dyPage = plus.webview.currentWebview();
			if(dyPage == filPage) {
				var mun = Math.round(Math.random() * 99 + 1);
				var imgvar = '<img src="' + baseUrl + '/images/head/' + userId + '_l.jpg?' + mun + '" style="width:100%"/>';
				console.log(imgvar)
				document.getElementById('imgshow').innerHTML = imgvar;
			}
		}

		var self = plus.webview.currentWebview();

		/*提交个人信息*/
		goIndex.addEventListener('tap', function() {
			var userTitle = document.getElementById("userTitle");
			var userPosition = document.getElementById("userPosition");
			goVal();
		});

		function goVal() {
			var $data = {};
			$data.name = userName.innerText;
			$data.orgName = userMechanism.value;
			$data.title = userTitle.value;
			$data.department = userDepartment.value;
			$data.office = userPosition.value;
			$data.province = dataProvince.value;
			$data.address = dataAddress.value;
			$data.id = plus.storage.getItem('userid');;
			$data.authentication = self.num;
			console.log(JSON.stringify($data))
			mui.ajax(baseUrl + '/ajax/professor/updatePro', {
				data: $data,
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.success);
					console.log(data.data);
					if(data.success) {
						var indexClose = plus.webview.getWebviewById("html/index_home.html");
						var myaccountClose = plus.webview.getWebviewById("html/myaccount.html");
						var consultClose = plus.webview.getWebviewById("html/consult_home.html");
						var centenClose = plus.webview.getWebviewById("index_centen.html");
						var consultlistClose = plus.webview.getWebviewById("consultlist.html");
						plus.webview.close(indexClose);
						plus.webview.close(centenClose);
						plus.webview.close(myaccountClose);
						plus.webview.close(consultlistClose);
						plus.webview.close(consultClose);
						goHome();
					} else {
						plus.nativeUI.toast("提交失败，用户ID失效", toastStyle);
					}
				},
				error: function(data) {
					console.log(data);
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			})
		}

	});

});