mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var str = JSON.stringify(ws);
		var oDt = document.getElementsByClassName("frmtype");
		var dataProvince = document.getElementById("data-province");
		var dataAddress = document.getElementById("data-address");
		var oAddress = document.getElementById("addressa");
		var telePhone = document.getElementById("telePhone");
		var mail = document.getElementById("mail");
		var authu = document.getElementsByClassName("authu");
		var authStatus;
		var name;
		var org;

		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data))
					plus.nativeUI.closeWaiting();; //新webview的载入完毕后关闭等待框
					ws.show("slide-in-right", 150);
					var $data = data.data;
					if($data.authStatus == 0) {
						authu[0].innerText = "未认证"
					} else if($data.authStatus == 1) {
						authu[0].innerText = "已认证"
					} 
					authStatus = $data.authStatus;
					name = $data.name;
					org = $data.orgName;
					//学术领域
					oDt[0].value = $data.name
					oDt[1].value = $data.orgName;
					if($data.department) {
						oDt[2].value = $data.department;
					}
					if($data.title) {
						oDt[3].value = $data.title;
					}
					if($data.office) {
						oDt[4].value = $data.office;
					}
					if($data.address){
						oAddress.innerText = $data.province + " " + $data.address;
					}					
					dataProvince.value = $data.province;
					dataAddress.value = $data.address;
					if($data.email) {
						mail.value = $data.email
					}
					if($data.phone) {
						telePhone.value = $data.phone
					}
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
		oDt[0].addEventListener("focus", function() {
			if(authStatus == 1) {
				plus.nativeUI.toast("修改姓名后，身份认证失效，需重新认证");
			} else {
				var length = trim(oDt[0].value);
				if(!length)
					plus.nativeUI.toast("姓名不能为空");
			}
		});
		oDt[1].addEventListener("focus", function() {
			if(authStatus == 1) {
				plus.nativeUI.toast("修改所在机构后，身份认证失效，需重新认证");
			} else {
				var length = trim(oDt[1].value);
				if(!length)
					plus.nativeUI.toast("所在机构不能为空");
			}

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
		//更新认证状态函数
		var upStatus = function() {		
			mui.ajax(baseUrl + "/ajax/professor/authStatus", {
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				data: {
					authStatus: 0,
					id: userid
				},
				timeout: 10000, //超时设置				
				success: function(data) {
					if(data.success) {						
					}else{
						
					}
				}
			})
		}

		function savePro() {
			var mess = {};
			mess.name = oDt[0].value;
			mess.orgName = oDt[1].value;
			mess.department = oDt[2].value;
			mess.title = oDt[3].value;
			mess.office = oDt[4].value;
			mess.province = dataProvince.value;
			mess.address = dataAddress.value;
			mess.email = trim(mail.value);
			mess.phone = trim(telePhone.value);
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
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("html/proinforupdate.html");
						mui.fire(web, "newId");
						mui.back();
						var web3 = plus.webview.getWebviewById("html/myaccount.html");
						mui.fire(web3, "photoUser");						
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				}
			});
		}
		/*校验手机号*/
		function phoneVal() {
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			if(!hunPhone.test(trim(telePhone.value))) {
				plus.nativeUI.toast("请输入正确的手机号码", toastStyle);
				return 0;
			}
		}
		telePhone.addEventListener("blur", function() {
				phoneVal()
			})
			/*校验用户账号*/
		function userEmail() {
			var gunf = /^\w+@\w+\.((cn)|(com)|(com\.cn))$/;
			if(!gunf.test(trim(mail.value))) {
				plus.nativeUI.toast("请输入正确的邮箱", toastStyle);
				return 0;
			}
		}
		mail.addEventListener("blur", function() {
			userEmail();
		})
		var save = function() {
			if(trim(telePhone.value)) {
				var t = phoneVal();
				if(t == 0) {
					return;
				}
			}
			if(trim(mail.value)) {
				var mt = userEmail();
				if(mt == 0) {
					return;
				}
			}
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
		}
		document.getElementsByClassName("topsave")[0].addEventListener("click", function() {

			if(authStatus == 1 && (name != oDt[0].value || org != oDt[1].value)) {
				plus.nativeUI.confirm("确认修改?", function(e) {
					if(e.index == 0) {
						upStatus();
						save();
					}
				}, "修改姓名或所在机构后，身份认证失效，需重新认证", ["确认", "取消"]);
			} else {
				save();
			}

		});
		personalMessage();
	});
})