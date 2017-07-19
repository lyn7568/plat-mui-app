mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		console.log(JSON.stringify(ws.projects));
		var oarr=[];
		//项目经历
		var projectShow = function(obj) {
			if(obj.data.length > 0) {
				var arr = [];
				for(var i = 0; i < obj.data.length; i++) {
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitem" data-o="'+i+'">'
						var name = obj.data[i].name;
					} else {
						var str = '<li class="mui-table-view-cell listitem" data-o="'+i+'">'
						var name = obj.data[i].company;
					}
					oarr[i]=obj.data[i];
					var odescp = ""
					if(obj.data[i].department) {
						odescp = obj.data[i].title+"，"+obj.data[i].department
					}else{
						odescp = obj.data[i].title
					}
					var os = '<div class="h4Tit listtit2">' + name + '<span class="updatebox mui-clearfix"><em></em>修改</span></div>' +
						 ' <p class="listtit3">'+odescp+'</p>'+
						' <p class="listtit3">' + timeT({
							startMonth: obj.data[i].startMonth,
							stopMonth: obj.data[i].stopMonth
						}) + '</p></li>'
					arr.push(str + os);
				}
				document.getElementById(obj.selector).innerHTML = arr.join('');
			}
		}

		function timeT(obj) {
			var a, b;
			if(obj.startMonth) {
				if(obj.startMonth.substring(4, 1) == 0) {
					a = obj.startMonth.substring(0, 4) + "年" + obj.startMonth.substring(5, 6) + "月";
				} else {
					a = obj.startMonth.substring(0, 4) + "年" + obj.startMonth.substring(4, 6) + "月";
				}
			} else {
				a = "";
			}
			if(obj.stopMonth) {
				if(obj.stopMonth.substring(4, 1) == 0) {
					b = obj.stopMonth.substring(0, 4) + "年" + obj.stopMonth.substring(5, 6) + "月";
				} else {
					b = obj.stopMonth.substring(0, 4) + "年" + obj.stopMonth.substring(4, 6) + "月";
				}
			} else {
				if(a) {
					b = "至今"
				} else {
					b = "";
					return "";
				}

			}
			return a + " - " + b;
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
						console.log(JSON.stringify($data.jobs))
						if($data.jobs) {
							projectShow({
								data: $data.jobs,
								selector: 'projectExperience',
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
		mui("#projectExperience").on("tap", "li", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateJob-edit.html","updateJob-edit.html", {}, {data:oarr[this.getAttribute("data-o")]});
		});
		document.getElementById("login").addEventListener("tap",function(){
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateJob-edit.html","updateJob-edit.html", {}, {});
		})
		window.addEventListener("newId", function(event) {
			alert(1)
			personalMessage();
		})
	});
})