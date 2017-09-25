 (function($, doc) {
 $.ready(function() {
 	$.plusReady(function() {

 		var userid = plus.storage.getItem('userid');
 		var oRd="";
 		
 		/**
 		 * 获取对象属性的值
 		 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
 		 * @param {Object} obj 对象
 		 * @param {String} param 属性名
 		 */
 		var _getParam = function(obj, param) {
 			return obj[param] || '';
 		};
 		//普通示例

 		var userPicker = new $.PopPicker();
 		userPicker.setData([{
 			value: '1',
 			text: '1万元以内'
 		}, {
 			value: '2',
 			text: '1-5万元'
 		}, {
 			value: '3',
 			text: '5-10万元'
 		}, {
 			value: '4',
 			text: '10-20万元'
 		}, {
 			value: '5',
 			text: '20-50万元'
 		}, {
 			value: '6',
 			text: '50万元以上'
 		}]);
 		var showUserPickerButton = doc.getElementById('showDegreePicker');
 		var degreeResult = doc.getElementById('degreeResult');
 		showUserPickerButton.addEventListener('tap', function(event) {
 			userPicker.show(function(items) {
 				degreeResult.innerText = items[0].text;
 				showUserPickerButton.setAttribute('flag',items[0].value);
 				//返回 false 可以阻止选择框的关闭
 				//return false;
 			});
 		}, false);
 	

 	var userPicker1 = new $.PopPicker();
 	userPicker1.setData([{
 		value: '1',
 		text: '1个月内'
 	}, {
 		value: '2',
 		text: '1-3个月'
 	}, {
 		value: '3',
 		text: '3-6个月'
 	}, {
 		value: '4',
 		text: '6-12个月'
 	}, {
 		value: '5',
 		text: '1年以上'
 	}]);
 	var ExpecteDuration = doc.getElementById('ExpecteDuration');
 	var ExpecteResult = doc.getElementById('ExpecteResult');
 	ExpecteDuration.addEventListener('tap', function(event) {
 		userPicker1.show(function(items) {
 			ExpecteResult.innerText = items[0].text;
 			ExpecteDuration.setAttribute("flag",items[0].value) 
 			//返回 false 可以阻止选择框的关闭
 			//return false;
 		});
 	}, false);

 	//==========年份选择==========
 	var result = doc.getElementById('yearResult');
 	var btns = doc.getElementById('showYearPicker');
 	btns.addEventListener('tap', function() {
 		var optionsJson = this.getAttribute('data-options') || '{}';
 		var options = JSON.parse(optionsJson);
 		options.beginDate = new Date('2017-06-11'); //设置开始日期 
 		var id = this.getAttribute('id');
 		/*
 		 * 首次显示时实例化组件
 		 * 示例为了简洁，将 options 放在了按钮的 dom 上
 		 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
 		 */
 		var oD = new Date();
 		oDy = oD.getFullYear();
 		oDm = parseInt(oD.getMonth()) ;
 		oDd = parseInt(oD.getDate()) + 1;
 		var oc = oDy + "-" + oDm + "-" + oDd
 		options.beginDate = new Date(oDy,oDm,oDd); //设置开始日期 
 		options.endYear = new Date().getFullYear() + 100;
 		var picker = new $.DtPicker(options);
 		picker.show(function(rs) {
 			/*
 			 * rs.value 拼合后的 value
 			 * rs.text 拼合后的 text
 			 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
 			 * rs.m 月，用法同年
 			 * rs.d 日，用法同年
 			 * rs.h 时，用法同年
 			 * rs.i 分（minutes 的第二个字母），用法同年
 			 */
 			if(rs.y.text == "至今") {
 				result.innerText = "至今"
 			} else {
 				result.innerText = rs.y.text + "年" + rs.m.text + "月" + rs.d.text + "日";
 				btns.setAttribute("flag",rs.y.text+ rs.m.text + rs.d.text)
 			}

 			/* 
 			 * 返回 false 可以阻止选择框的关闭
 			 * return false;
 			 */
 			/*
 			 * 释放组件资源，释放后将将不能再操作组件
 			 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
 			 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
 			 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
 			 */
 			picker.dispose();
 		});
 	}, false);
 	var cityPicker = new $.PopPicker({
 		layer: 2
 	});
 	cityPicker.setData(cityData);
 	var showCityPickerButton = doc.getElementById('showCityPicker');
	var cityResult=document.querySelector("#cityResult")
 	showCityPickerButton.addEventListener('tap', function(event) {
 		cityPicker.show(function(items) {
 			cityResult.innerText = items[0].text + "-" + items[1].text;
 			cityResult.setAttribute('city',items[1].text);
 			cityResult.setAttribute('province',items[0].text)
 		});
 	}, false);
 	queryPerson()
 	/*个人信息*/
 	function queryPerson() {
 		$.ajax(baseUrl + '/ajax/professor/baseInfo/' + userid, {
 			dataType: 'json', //数据格式类型
 			type: 'GET', //http请求类型
 			timeout: 10000,
 			async: true,
 			success: function(data) {
 				if(data.success) {
 					if( data.data.province ) {
 						document.querySelector("#cityResult").innerHTML = data.data.province + "-" + data.data.address ;
 						cityResult.setAttribute('city', data.data.address );
 						cityResult.setAttribute('province', data.data.province )
 					}
 					if( data.data.phone ) {
 						document.querySelector("#phone").value = data.data.phone ;
 					}
 					oRd = data.data.orgId ;
 					queryCompany( data.data.orgId );
 				}
 			},
 			error: function() {
 				plus.nativeUI.toast("服务器链接超时", toastStyle);
 			}
 		});
 	}
 	/*企业信息*/
 	function queryCompany(orgId) {
 		$.ajax(baseUrl + '/ajax/org/' + orgId, {
 			dataType: 'json', //数据格式类型
 			type: 'GET', //http请求类型
 			timeout: 10000,
 			async: true,
 			success: function(data) {
 				if(data.success) {
 					var osur = plus.webview.getWebviewById("sureOrg.html");
 					if(osur!=null)
 					osur.close();
 					document.querySelector("#publisher").innerHTML = data.data.forShort ? data.data.forShort : data.data.name;
 				}
 			},
 			error: function() {
 				plus.nativeUI.toast("服务器链接超时", toastStyle);
 			}
 		});
 	}
 	/*检查格式是否合格*/
 	function  checkout() {
 		var arr=[];
 			arr[0] = { 
 				demand : document.querySelector("#demandTitle"),
 				fontNum : 50,
 				alertTitle : "需求主题",
 				length : 3
 			},
 			arr[1] = {
 				demand : document.querySelector("#demandContent"),
 				fontNum : 1000 ,
 				alertTitle : "需求内容" ,
 				length : 3
 			},
 			arr[2] = {
 				demand : document.querySelector("#cityResult"),
 				alertTitle : "所在城市" ,
 				txt : "请选择所在城市" ,
 				length : 2
 			},
 			arr[3] = {
 				demand : document.querySelector("#yearResult"),
 				alertTitle : "需求有效期" ,
 				txt : "请选择需求的截止日期" ,
 				length : 2
 			},
 			arr[4] = {
 				demand : document.querySelector("#phone"),
 				fontNum : 50,
 				alertTitle : "联系电话" ,
 				length : 3
 			};
 			for(var i in arr) {
 				if( arr[i].length ==3) {
 					if( arr[i].demand.value.replace(/(^\s*)|(\s*$)/g,"")=="") {
		 				plus.nativeUI.toast("请填写" + arr[i].alertTitle , "toastStyle");
		 				return;
		 			}else if( arr[i].demand.value.length >arr[i].fontNum ) {
		 				plus.nativeUI.toast( arr[i].alertTitle +"不可超过"+ arr[i].fontNum +"个字", "toastStyle");
		 				return;
		 			}
 				} else {
 					if( arr[i].demand.innerHTML== arr[i].txt) {
		 				plus.nativeUI.toast("请填写" + arr[i].alertTitle , "toastStyle");
		 				return;
		 			}
 				}
 			}
 			return 1;
 	}
 	/*发布需求*/
 	document.querySelector("#publishDemand").addEventListener( "tap", function() {
 		if(checkout()) {
 			pubDemand();
 		}
 	},false);
 	/*发布需求的函数*/
 	function pubDemand() {
 		$.ajax(baseUrl + '/ajax/demand' , {
 			dataType: 'json', //数据格式类型
 			type: 'post', //http请求类型
 			data: {
 				"title": document.querySelector("#demandTitle").value,
				"descp": document.querySelector("#demandContent").value,
				"province": cityResult.getAttribute('province'),
				"city": cityResult.getAttribute('city'),
				"cost": document.querySelector("#showDegreePicker").getAttribute('flag')==null?'':document.querySelector("#showDegreePicker").getAttribute('flag'),
				"duration": document.querySelector("#ExpecteDuration").getAttribute('flag')==null?'':document.querySelector("#ExpecteDuration").getAttribute('flag'),
				"invalidDay": btns.getAttribute('flag'),
				"contactNum": document.querySelector("#phone").value,
				"creator": userid,
				"orgId": oRd
 			},
 			timeout: 10000,
 			async: true,
 			success: function(data) {
 				if(data.success) {
 					plus.nativeUI.toast("需求发布成功", toastStyle);
 					$.back();
 				}
 			},
 			error: function() {
 				plus.nativeUI.toast("服务器链接超时", toastStyle);
 			}
 		});
 	}
 })
 })
 })(mui, document);