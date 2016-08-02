/**
 * User: _Jay
 * Desciption: ajax use javascript
 * Dependent on: any mondules
 * Datetime: 31 July 2016 (Sunday) 20:15
 */

'use strict';

var Ajax = (function(stringifyFn, parseFn) {
	/**
	 * Ajax对象 * @type {Object}
	 */
	var Ajax = {
		/**
		 * 获取xhr对象
		 * @return {[type]} [description]
		 */
		_getXHR: function() {
			var xhr;
			try {
				xhr = new XMLHttpRequest();
			} catch (e) {
				var IEXHRVers = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
				for (var i = 0, len = IEXHRVers.length; i < len; i++) {
					try {
						xhr = new ActiveXObject(IEXHRVers[i]);
					} catch (e) {
						continue;
					}
				}
			}
			return xhr;
		},
		/**
		 * 打印info日志
		 * @return {[type]} [description]
		 */
		_info: function() {
			console.log(arguments);
		},
		/**
		 * 打印error日志
		 * @return {[type]} [description]
		 */
		_error: function() {
			console.error(arguments);
		},
		_formatParams2Url: function(data) {
			var arrData = [];
			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					arrData.push(key + '=' + data[key]);
				}
			}
			return arrData.join('&');
		},
		/**
		 * 发起get请求
		 * @param  {[type]} url     [description]
		 * @param  {[type]} data    [description]
		 * @param  {[type]} success [description]
		 * @param  {[type]} error   [description]
		 * @return {[type]}         [description]
		 */
		get: function(url, data, success, error) {
			var _p = this;
			var xhr = _p._getXHR();
			//监听
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					xhr.status == 200 && success && success(parseFn(xhr.responseText));
					xhr.status != 200 && error && error(xhr.status, xhr.responseText);
					xhr = undefined;
				}
			}

			xhr.open('GET', url, true); //第三个参数标示使用异步
			//TODO 是否需要设置头
			if (data instanceof Function) {
				success && (error = success);
				success = data;
				xhr.send(null);
			} else {
				xhr.send(_p._formatParams2Url(data));
			}
		},
		/**
		 * post method
		 * post json data by default
		 * @param  {[type]}  url           [description]
		 * @param  {[type]}  data          [description]
		 * @param  {[type]}  success       [description]
		 * @param  {[type]}  error         [description]
		 * @param  {Boolean} isLikeOneForm [description]
		 * @return {[type]}                [description]
		 */
		post: function(url, data, success, error, isLikeOneForm) {
			var _p = this;
			var xhr = _p._getXHR();
			var lastArg = arguments[arguments.length - 1];

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					xhr.status == 200 && success && success(parseFn(xhr.responseText));
					xhr.status != 200 && error && error(xhr.status, xhr.responseText);
					xhr = undefined;
				}
			}

			xhr.open('POST', url, true); //第三个参数标示使用异步
			//TODO 是否需要设置头
			if (data instanceof Function) {
				success && (error = success);
				success = data;
			}
			//判断是否是json格式
			if (typeof lastArg == 'boolean') {
				if (!lastArg) {
					xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
					xhr.send(stringifyFn(data));
				} else {
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
					xhr.send(_p._formatParams2Url(data))
				}
			}
		},

		delete: function(){},
		put: function(){}
	};

	return Ajax;
})(JSON.stringify, JSON.parse);