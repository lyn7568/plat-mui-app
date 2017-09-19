 (function($, doc) {
 $.ready(function() {
 	$.plusReady(function() {

 		var userid = plus.storage.getItem('userid');
 		var currWindow = plus.webview.currentWebview();
 		var demandId= currWindow.demandId;
 		var oCost={
			'1' : '1万元以内',
			'2' : '1-5万元' ,
			'3' : '5-10万元' ,
			'4' : '10-20万元' ,
			'5' : '20-50万元' ,
			'6' : '50万元以上'
		};
		var oSpend= {
			'1' : '1个月内',
			'2' : '1-3个月' ,
			'3' : '3-6个月' ,
			'4' : '6-12个月' ,
			'5' : '1年以上' 
		};
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
 		oDm = parseInt(oD.getMonth()) + 1;
 		oDd = parseInt(oD.getDate()) + 1;
 		var oc = oDy + "-" + oDm + "-" + oDd
 		options.beginDate = new Date(oc); //设置开始日期 
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
 	queryDemand();
 	/*个人信息*/
 	function queryDemand() {
 		$.ajax(baseUrl + '/ajax/demand/qo' , {
 			dataType: 'json', //数据格式类型
 			type: 'GET', //http请求类型
 			data: {
 				"id" : demandId
 			},
 			timeout: 10000,
 			async: true,
 			success: function(data) {
 				if(data.success) {
 					var $data=data.data;
 					document.querySelector("#cityResult").innerHTML=$data.province + "-" + $data.city ;
					document.querySelector("#showCityPicker").setAttribute('city', data.data.city );
 					document.querySelector("#showCityPicker").setAttribute('province', data.data.province );
 					document.querySelector("#yearResult").innerHTML=$data.invalidDay.substr(0,4) +"年"+ $data.invalidDay.substr(4,2) +"月"+ $data.invalidDay.substr(6,2)+"日";
					document.querySelector("#showYearPicker").setAttribute('flag', $data.invalidDay );
					document.querySelector("#phone").value= $data.contactNum ;
					if($data.cost) {
						document.querySelector("#degreeResult").innerHTML=oCost[ $data.cost ] ;
						document.querySelector("#showDegreePicker").setAttribute('flag', $data.cost );
					}
					if($data.duration) {
						document.querySelector("#ExpecteResult").innerHTML=oCost[ $data.duration ] ;
						document.querySelector("#ExpecteDuration").setAttribute('flag', $data.duration );
					}
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
 				demand : document.querySelector("#cityResult"),
 				alertTitle : "所在城市" ,
 				txt : "请选择所在城市" ,
 				length : 2
 			},
 			arr[1] = {
 				demand : document.querySelector("#yearResult"),
 				alertTitle : "需求有效期" ,
 				txt : "请选择需求的截止日期" ,
 				length : 2
 			},
 			arr[2] = {
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
		 			}else if( arr[i].demand.value.length >50 ) {
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
 		$.ajax(baseUrl + '/ajax/demand/modify' , {
 			dataType: 'json', //数据格式类型
 			type: 'post', //http请求类型
 			data: { 
 				"id":demandId ,
				"province": cityResult.getAttribute('province'),
				"city": cityResult.getAttribute('city'),
				"cost": document.querySelector("#showDegreePicker").getAttribute('flag')==null?'':document.querySelector("#showDegreePicker").getAttribute('flag'),
				"duration": document.querySelector("#ExpecteDuration").getAttribute('flag')==null?'':document.querySelector("#ExpecteDuration").getAttribute('flag'),
				"invalidDay": result.getAttribute('flag'),
				"contactNum": document.querySelector("#phone").value,
				"modifier" : userid
 			},
 			timeout: 10000,
 			async: true,
 			success: function(data) {
 				if(data.success) {
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