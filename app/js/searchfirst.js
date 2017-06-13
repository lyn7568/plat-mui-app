mui.plusReady(function() {
		document.getElementById("searchval").focus();
	var search = {
		oAjaxGet: function(url, obj, oType, oFun) {
			mui.ajax(url, {
				data: obj,
				dataType: 'json', //服务器返回json格式数据
				type: oType, //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				traditional: true,
				success: function(data) {
					if(data.success) {
						oFun(data.data);
					} 
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log(type);
				}
			});
		},
		keyWord:function(data){
			if(data.lennth==0) {
				return;
			}
			for(var i=0;i<data.length;i++) {
				var li=document.createElement('li');
				li.innerHTML=data[i].caption;
				document.getElementsByClassName("hotsearchNew")[0].appendChild(li);
			}
		},
		createWin:function(keyValue) {
			mui.openWindow({
					url: '../html/searchListNew.html',
					id: '../html/searchListNew.html',
					show:{
				      autoShow:false,
				      aniShow:"fade-in",
				    },
					extras:{
				      key:keyValue
				    }
				});
		}
	}
	
		search.oAjaxGet(baseUrl + "/ajax/dataDict/qlHotKey", {
		}, "get", search.keyWord); 
		
		mui(".hotsearchNew").on("tap","li",function(){
			search.createWin(this.innerHTML);
		})
		
		/*按键字搜索*/
		document.getElementById("searchval").addEventListener("keyup", function() {
			var e = event || window.event || arguments.caller.arguments[0];
			if(e.keyCode == 13) {
				search.createWin(this.value);
				
			}
		})
		
		
})