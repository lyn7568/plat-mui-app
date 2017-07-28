mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		console.log(JSON.stringify(ws.projects));
		var oDe={
			1:"博士",
			2:"硕士",
			3:"学士",
			4:"大专",
			5:"其他"
		}
		var oarr=[];
		//荣誉奖项
		var honorShow = function(obj) {
			if(obj.data.length > 0) {
				var arr = [];	                  
				for(var i = 0; i < obj.data.length; i++) {
					oarr[i]=obj.data[i];
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitemExit" data-o="'+i+'">'
						var name = obj.data[i].name;
						if(obj.data[i].year) {
							var year='发表于'+obj.data[i].year+'年'
						}else{
							var year="";
						}
						
					} else {
						var str = '<li class="mui-table-view-cell listitemExit" data-o="'+i+'">'
						var name = obj.data[i].school;
						
						if(obj.data[i].year) {
							if(obj.data[i].year!="至今  ") {
								var year='毕业于'+obj.data[i].year+'年'
							}else{
								var year="至今";
							}
							
						}else{
							var year="";
						}
					} 
					var odescp=""
						
						var arrq=[];
						if(obj.data[i].degree) {
							arrq.push(oDe[obj.data[i].degree]);
						}
						if(obj.data[i].major) {
							arrq.push(obj.data[i].major);
						}
	                    if(obj.data[i].college) {
							arrq.push(obj.data[i].college);
						}  
						if(arrq.length) {
							odescp=arrq.join(",")
						}
					var os = '<div class="listtit2">' + name + '<span class="updatebox mui-clearfix"><em></em>修改</span></div>' +
						' <p class="listtit3 mutlinebox">'+odescp+'</p><p class="listtit3">' + year + '</p></li>'
					arr.push(str + os);
				}
				document.getElementById(obj.selector).innerHTML = arr.join('');
			}else{
				document.getElementById(obj.selector).innerHTML = "";
			}
		}
		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						var $data = data.data;
						plus.nativeUI.closeWaiting();
						plus.webview.currentWebview().show("slide-in-right", 150);
						//荣誉奖项
						//教育背景
						if($data.edus.length) {
							honorShow({
								data: $data.edus,
								selector: 'education',
								flag: 2
							});
						}

					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		personalMessage();
		mui("#education").on("tap", "li", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateEdu-edit.html","updateEdu-edit.html", {}, {data:oarr[this.getAttribute("data-o")]});
		});
		document.getElementById("login").addEventListener("tap",function(){
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateEdu-edit.html","updateEdu-edit.html", {}, {});
		})
		window.addEventListener("newId", function(event) {
			personalMessage();
		})
	});
})