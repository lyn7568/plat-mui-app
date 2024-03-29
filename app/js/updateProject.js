mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		var fl;
		var oarr=[];
		//项目经历
		var projectShow = function(obj) {
			console.log(JSON.stringify(obj));
			if(obj.data.length > 0) {
				var arr = [];
				for(var i = 0; i < obj.data.length; i++) {
					if(obj.flag == 1) {
						var str = '<li class="mui-table-view-cell listitemExit" data-o="'+i+'">'
						var name = obj.data[i].name;
					} else {
						var str = '<li class="mui-table-view-cell listitem" style="margin-right:40px;"data-o="'+i+'">'
						var name = obj.data[i].company;
					}
					oarr[i]=obj.data[i];
					var odescp = ""
					if(obj.data[i].descp) {
						odescp = obj.data[i].descp
					}
					var os = '<div class="listtit2" style="margin-right:40px;">' + name + '<span class="updatebox mui-clearfix" style="top:5px;"><em></em>修改</span></div>' +
						' <p class="listtit3">' + timeT({
							startMonth: obj.data[i].startMonth,
							stopMonth: obj.data[i].stopMonth
						}) + '</p><p class="listtit3 mutlinebox">' + odescp + '</p></li>'
					arr.push(str + os);
				}
				document.getElementById(obj.selector).innerHTML = arr.join('');
			}else{
				document.getElementById(obj.selector).innerHTML = "";
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
						if(!fl) {
							plus.webview.currentWebview().show("slide-in-right", 150);
						}
						if($data.projects) {
							projectShow({
								data: $data.projects,
								selector: 'projectExperience',
								flag: 1
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
			var web = plus.webview.create("../html/updateProject-edit.html","updateProject-edit.html", {}, {data:oarr[this.getAttribute("data-o")]});
		});
		document.getElementById("login").addEventListener("tap",function(){
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateProject-edit.html","updateProject-edit.html", {}, {});
		})
		window.addEventListener("newId", function(event) {
			fl = event.detail.rd;
			personalMessage();
		})
	});
})