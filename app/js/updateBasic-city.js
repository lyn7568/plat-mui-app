mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview();
		console.log(JSON.stringify(web));
		var city, province,suc=1;
		
		var oadd={
			
		}
		plus.geolocation.getCurrentPosition(function(p) {
			console.log(JSON.stringify(p));
			plus.nativeUI.closeWaiting();
			web.show("slide-in-right", 150);
			oadd.address=p.address.city;
			if(!p.address.province) {
				oadd.province=p.address.city;
			}else{
				oadd.province=p.address.province;
			}
			
		}, function(e) {
			plus.nativeUI.closeWaiting();
			web.show("slide-in-right", 150);
			suc=0;
		});
		
		var userid = plus.storage.getItem('userid');
		var cityResult = document.getElementById('cityResult');
		
		if(web.address) {
			cityResult.innerText = web.province + "-" + web.address;
			city = web.address;
			province = web.province;
		}
		/*选择地址*/
		var cityPicker = new mui.PopPicker({
			layer: 2
		});
		cityPicker.setData(cityData);
		var showCityPickerButton = document.getElementById('showCityPicker');

		showCityPickerButton.addEventListener('tap', function(event) {
			cityPicker.show(function(items) {
				cityResult.innerText = items[0].text + "-" + items[1].text;
				city = items[1].text;
				province = items[0].text;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		}, false);
		document.getElementById("login").addEventListener("tap", function() {
			savePro();
		})

		function savePro() {
			var mess = {};
			mess.sex=web.sex;
			mess.birthday=web.birthday;
			mess.name = web.name;
			mess.orgName = web.orgName;
			mess.department = web.department;
			mess.title = web.title;
			mess.office = web.office;
			mess.address = city;
			mess.email = web.email;
			mess.province = province;
			mess.phone = web.phone;
			mess.id = userid;
			var mess1 = JSON.stringify(mess);
			console.log(JSON.stringify(mess))
			$.ajax({
				"url": baseUrl + '/ajax/professor',
				"type": "PUT",
				"async": true,
				"data": mess1,
				"contentType": "application/json",
				"success": function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						plus.nativeUI.showWaiting();
						var web = plus.webview.getWebviewById("updateBasic.html");
						mui.fire(web, "newId", {
							rd: 1
						});
						mui.back();
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		}
		document.getElementById('currentLocation').addEventListener("tap",function(){
			if(suc==0) {
				plus.nativeUI.toast("请在系统设置中，打开定位服务，并允许科袖访问您的位置信息。", toastStyle);
				return;
			}
			cityResult.innerText = oadd.address + "-" + oadd.province;
			city=oadd.address;
			province=oadd.province;
		})
	})
})