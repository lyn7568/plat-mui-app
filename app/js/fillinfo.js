//注册完成个人信息
mui.ready(function() {
	
    /*定义全局变量*/
	var userName = document.getElementById("userName");
	var userMechanism = document.getElementById("userMechanism");
	var userDepartment = document.getElementById("userDepartment");
	var goIndex = document.getElementById("goIndex");
	var dataProvince = document.getElementById("data-province");
	var dataAddress = document.getElementById("data-address");
	var boxnav1=document.getElementById("boxnav1");
	var boxnav2=document.getElementById("boxnav2");
	var boxnav3=document.getElementById("boxnav3");
	var li1=document.getElementById("li1");
	var li2=document.getElementById("li2");
	var li3=document.getElementById("li3");
	var li4=document.getElementById("li4");
	var li5=document.getElementById("li5");
	var li6=document.getElementById("li6");
	var applyType;
	
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
	
	tab('box');
	
	boxnav1.addEventListener("tap",function(){
		document.querySelector(".maincon").style.display="block";
		var label1='<label>所在机构<small> ( 高校/科研机构/企业名称 )</small><em class="requiredcon"></em></label>';
		var label2='<label>所属部门<small> ( 院系/科研室/部门名称 )</small></label>';
		var label3='<label>职称</label>';
		var label4='<input type="text" class="mui-input-clear frmtype" id="userTitle">';
		var label5='<label>职位</label>';
		var label6='<input type="text" class="mui-input-clear frmtype" id="userPosition">';
		li1.innerHTML = label1;
		li2.innerHTML = label2;
		li3.innerHTML = label3;
		li4.innerHTML = label4;
		li5.innerHTML = label5;
		li6.innerHTML = label6;
		li3.style.display="block";
		li4.style.display="block";
		li5.style.display="block";
		li6.style.display="block";
		document.querySelector(".frmtype").value="";
		userMechanism.value="";
		userDepartment.value="";
	})
			
	boxnav2.addEventListener("tap",function(){
		document.querySelector(".maincon").style.display="block";
		var label1='<label>所在企业<small></small><em class="requiredcon"></em></label>';
		var label2='<label>所属部门</label>';
		var label3='<label>职位</label>';
		var label4='<input type="text" class="mui-input-clear frmtype" id="userPosition">';
		var label5='<label>职称</label>';
		var label6='<input type="text" class="mui-input-clear frmtype" id="userTitle">';
		li1.innerHTML = label1;
		li2.innerHTML = label2;
		li3.innerHTML = label3;
		li4.innerHTML = label4;
		li5.innerHTML = label5;
		li6.innerHTML = label6;
		li3.style.display="block";
		li4.style.display="block";
		li5.style.display="block";
		li6.style.display="block";
		document.querySelector(".frmtype").value="";
		userMechanism.value="";
		userDepartment.value="";
	})
			
	boxnav3.addEventListener("tap",function(){
		document.querySelector(".maincon").style.display="block";
		li3.style.display="none";
		li4.style.display="none";
		li5.style.display="none";
		li6.style.display="none";
		li4.getElementsByTagName('input').value="";
		var label1='<label>所在高校<em class="requiredcon"></em></label>';
		var label2='<label>所属学院</label>';
		li1.innerHTML = label1;
		li2.innerHTML = label2;
		document.querySelector(".frmtype").value="";
		userMechanism.value="";
		userDepartment.value="";
	})
	
	function tab(name) { 
		var oDome = document.getElementById(name);
		var oSpan = oDome.getElementsByTagName('ul')[0].childNodes;
		for(var i = 0; i < oSpan.length; i++) {
			oSpan[i].onclick = function() {
				for(var i = 0; i < oSpan.length; i++) {
					oSpan[i].className = '';
				}
				this.className = 'set';
			}
		}
	}

	window.addEventListener('showimg', function(event) {
		showuserimg();
	});
	
	function showuserimg(){
		var userId = plus.storage.getItem('userid');
		console.log(userId)
		var filPage = plus.webview.getWebviewById('../html/fillinfo.html');
		var dyPage = plus.webview.currentWebview();
		if(dyPage == filPage) {
			var mun = Math.round(Math.random()*99+1);
			var imgvar = '<img src="'+ baseUrl + '/images/head/' + userId + '_l.jpg?'+mun+'" style="width:100%"/>';
			console.log(imgvar) 
			document.getElementById('imgshow').innerHTML = imgvar;
		}
	}
	

	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
	
		/*校验提交按钮显示状态*/
		mui('.basicinfo').on('keyup', "#userName,#userMechanism", function() {
			hideButtn(userName,userMechanism,goIndex,"frmactiveok");
		});

		/*提交个人信息*/
		goIndex.addEventListener('tap', function() {
			var userTitle = document.getElementById("userTitle");
			var userPosition = document.getElementById("userPosition");
			applyType = document.querySelector(".boxnav .set span").getAttribute("data-num");
			console.log(applyType)
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
			console.log(self.userid)
			$data.authentication = applyType;
			console.log(JSON.stringify($data))
			mui.ajax(baseUrl + '/ajax/professor', {
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