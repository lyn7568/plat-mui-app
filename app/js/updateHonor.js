mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var fl;
		var oarr=[];
		//荣誉奖项
		var honorShow = function(obj) {
			console.log(JSON.stringify(obj))
			if(obj.data.length > 0) {
				var arr = [];	                  
				for(var i = 0; i < obj.data.length; i++) {
					oarr[i]=obj.data[i];
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitemExit" data-o="'+i+'">'
						var name = obj.data[i].name;
						if(obj.data[i].year) {
							var year='获得于'+obj.data[i].year+'年'
						}else{
							var year="";
						}
						
					} else {
						var str = '<li class="mui-table-view-cell mui-media listitem" data-o="'+i+'">'
						var name = obj.data[i].school;
						
						if(obj.data[i].year) {
							if(obj.data[i].year!="至今  ") {
								var year='毕业于'+obj.data[i].year+'年'
							}else{
								var year="至今";
							}
							
						}else{
							var year="至今";
						}
					} 
					var odescp=""
						if(obj.data[i].descp) {
							odescp=obj.data[i].descp;
						}
					var os = '<div class="listtit2" style="margin-right:40px;">' + name + '<span class="updatebox mui-clearfix" style="top:5px;"><em></em>修改</span></div>' +
						' <p class="listtit3">' + year + '</p><p class="listtit3 mutlinebox">'+odescp+'</p></li>'
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
						if(!fl) {
							plus.webview.currentWebview().show("slide-in-right", 150);
						}
						//荣誉奖项
						if($data.honors.length) {
							honorShow({
								data: $data.honors,
								selector: 'honor',
								flag: 1
							});
						}else{
							document.getElementById("honor").innerHTML="";
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
		mui("#honor").on("tap", "li", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateHonor-edit.html","updateHonor-edit.html", {}, {data:oarr[this.getAttribute("data-o")]});
		});
		document.getElementById("login").addEventListener("tap",function(){
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateHonor-edit.html","updateHonor-edit.html", {}, {});
		})
		window.addEventListener("newId", function(event) {
			fl = event.detail.rd;
			personalMessage();
		})
	});
})