mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var person={};
		var f1;
		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/baseInfo/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						plus.nativeUI.closeWaiting();
						console.log(f1)
						if(!f1) {
							ws.show("slide-in-right", 150);
						}
						var $data = data.data;
						//头像					
						if($data.hasHeadImage) {
							var mun = Math.round(Math.random() * 99 + 1);
							document.getElementById("userimg").style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg?" + mun + ")";
						}
						document.getElementById("exName").innerHTML=$data.name;
						person.name=$data.name;
						if($data.orgName) {
							document.getElementById('orgName').innerHTML=$data.orgName;
							person.orgName=$data.orgName;
						}else{
							person.orgName="";
						}
						if($data.department) {
							document.getElementById("department").innerHTML = $data.department;
							person.department=$data.department;
						}else{
							person.department='';
						}
						if($data.title) {
							document.getElementById("title").innerHTML= $data.title;
							person.title=$data.title;
						}else{
							person.title=""
						}
						if($data.office) {
							document.getElementById("office").innerHTML = $data.office;
							person.office=$data.office;
						}else{
							person.office=""
						}
						
						if($data.address) {
							document.getElementById("city").innerHTML = $data.address;
							person.address=$data.address;
						}else{
							person.address="";
						}
						if($data.province) {
							person.province=$data.province;
						}else{
							person.province="";
						}
						if($data.email) {
							document.getElementById("mail").innerHTML = $data.email;
							person.email=$data.email;
						}else{
							person.email="";
						}
						if($data.phone) {
							document.getElementById("phone").innerHTML = $data.phone;
							person.phone=$data.phone;
						}else{
							person.phone = "";
						}
						person.orgAuth=$data.orgAuth
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		personalMessage();
		window.addEventListener("newId", function(event) {
			f1 = event.detail.rd;
			personalMessage();
		});
		//创建窗口
		function openNewWebview(obj) {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/"+obj.html+"",obj.id, {}, obj.data);
		}
		function bindEvent(obj) {
			document.getElementById(obj.selector).parentNode.addEventListener('tap',function(){
			obj.web.data=person;
			openNewWebview(obj.web);
		})
		}
		//职称
		bindEvent({selector:"title",txt:"请填写最高职位",web:{html:'updateBasic-title.html',id:"updateBasic-title.html"}});
		bindEvent({selector:"department",txt:"请填写当前就职的部门",web:{html:'updateBasic-depart.html',id:"updateBasic-depart.html"}});
		bindEvent({selector:"office",txt:"请填写当前担任的职位",web:{html:'updateBasic-post.html',id:"updateBasic-post.html"}});
		bindEvent({selector:"phone",txt:"请填写手机/办公电话",web:{html:'updateBasic-tel.html',id:"updateBasic-tel.html"}});
		bindEvent({selector:"orgName",txt:"请填写当前就职的机构",web:{html:'updateBasic-org.html',id:"updateBasic-org.html"}});
		bindEvent({selector:"city",txt:"请选择所在城市",web:{html:'updateBasic-city.html',id:"updateBasic-city.html"}});
		bindEvent({selector:"mail",txt:"请填写电子邮箱",web:{html:'updateBasic-email.html',id:"updateBasic-email.html"}});
	});
})