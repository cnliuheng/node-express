lh.define("common", [], function() {
    return {
        /**
         * 传入id 返回id的dom元素
         */
        id: function(e){
           return document.getElementById(e); 
        },
        /**
         * 传入dom元素名字 返回id的dom元素
         */
        tagName : function(e){
            return document.getElementsByTagName(e);
        },
        /**
         * 传入#id或.class,匹配指定 CSS 选择器的一个元素。
         */
        element : function(e) {
            return document.querySelector(e);
        },
        /**
         * 传入.class,匹配指定 CSS 选择器的多个元素。
         */
        elements : function(e) {
            return document.querySelectorAll(e);
        },
        /* 封装ajax函数
         * @param {string}opt.type http连接的方式，包括POST和GET两种方式
         * @param {string}opt.url 发送请求的url
         * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
         * @param {object}opt.data 发送的参数，格式为对象类型
         * @param {object}opt.fromData 发送的参数是否为表单序列化的数组,如果设置的话则data:fromdata 默认为fasle
         * @param {function}opt.success ajax发送并接收成功调用的回调函数
         */
        ajax:function(opt) {
            opt = opt || {};
            opt.method = opt.method.toUpperCase() || 'GET';
            opt.url = opt.url || '';
            opt.async = opt.async || true;
            opt.dataType = opt.dataType || 'json';
            opt.fromSerialize = opt.fromSerialize || false;
            opt.data = opt.data || null;
            opt.success = opt.success || function () {};
            var xmlHttp = null;
            if (XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            //空的待发送数组
            var params = [];
            var postData;
            //根据数据判断
            // common.js:49 username=111&tid=1&title=222&gbtxt=333
            // 选择表单序列化,则进行元表单数据发送
            if(opt.fromSerialize) {
                postData = opt.data;
            }else{
                for (var key in opt.data){
                    params.push(key + '=' + opt.data[key]);
                }
                postData = params;
            }                                
            if (opt.method.toUpperCase() === 'POST') {
                xmlHttp.open(opt.method, opt.url, opt.async);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xmlHttp.send(postData);
            }
            else if (opt.method.toUpperCase() === 'GET') {
                xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
                xmlHttp.send(null);
            } 
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var resData = xmlHttp.responseText;
                    // var resData = eval("("+resData+")");
                    var resData = JSON.parse(resData);
                    opt.success(resData);
                }
            };
        },
        /* 封装表单序列化函数
         * @param {string}传入表单的id
         * @return {string} username=123123&tid=3&title=123123&gbtxt=123123123
         */
        serialize:function (form) {
            form = document.getElementById(form);
            var arrs = [],
            field = null,
            i,
            len,
            j,
            optLen,
            option,
            optValue;
            for(i = 0,len = form.elements.length; i < len; i++) {
                field = form.elements[i];
                switch(field.type) {
                    case "select-one":
                    case  "select-multiple":
                    if(field.name.length) {
                         for(j = 0,optLen = field.options.length; j < optLen; j++) {
                               option = field.options[j];
                               if(option.selected) {
                                   optValue = '';
                                   if(option.hasAttribute) {
                                       optValue = option.hasAttribute("value") ? option.value : option.text;
                                   }else {
                                       optValue = option.attributes["value"].specified ? option.value : option.text;
                                   }
                                   arrs.push(encodeURIComponent(field.name) + "=" +encodeURIComponent(optValue));
                               }
                           }
                     }
                    break;
                    case undefined:      //字段集
                    case "file":         // 文件输入
                    case "submit":       // 提交按钮
                    case "reset":        // 重置按钮
                    case "button":       // 自定义按钮
                    break;
                    case "radio":        // 单选框
                    case "checkbox":     // 复选框
                    if(!field.checked) {
                        break;
                    }
                    /* 执行默认动作 */
                   default:
                   // 不包含没有名字的表单字段
                   if(field.name.length) {
                       arrs.push(encodeURIComponent(field.name) + "=" +encodeURIComponent(field.value));
                   }
               }
            }
            return arrs.join("&");
        }
    }
});