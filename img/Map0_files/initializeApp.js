/**
 * @description 
 * @author chengl
 */
let initializeApp = {
    /**
     * @description 首页html文件中英文资源
     * @author chengl
     */
    /**
     * @description 初始化app
     * @author chengl
     */
    init: function () {
        const isEdit = location.href.indexOf('dataviz/edit.html') > -1;
        !isEdit && this.checkMobile();
        this.setLang(isEdit);
        this.loadThemes(isEdit);
    },

    /**
     * 设置页面样式
     */
    checkMobile: function () {
        if (this.getDeviceType() === "PC") {
            document.body.className = "share-pc";
            window.isMobile = false;
        } else {
            document.body.className = "share-mobile";
            window.isMobile = true;
        }
    },

    /**
     * 获取设备类型
     */
    getDeviceType: function () {
        if (/Android|webOS|iPhone|iPod|BlackBerry|Mobile/i.test(navigator.userAgent)) {
            return "MOBILE";
        } else {
            return "PC";
        }
    },

    /**
    * @description 设置网页语言 推荐react-intl
    * @author chengl
    * @param {Boolean} isEdit 是否编辑页面
    */
    setLang: function (isEdit) {
        const _this = this;
        let lang= window.lang = this.getLang().toLowerCase(),
            src = './static/nls/' + lang + '.js';
        document.querySelector('html').setAttribute('lang', lang);
        // 具备相互依赖性的js文件在这里添加
        _this.loadJS(src, _this.loadLangSuccess.bind(_this,isEdit), function() {
            lang = window.lang = 'zh';
            src = './static/nls/' + lang + '.js';
            _this.loadJS(src,_this.loadLangSuccess.bind(_this, isEdit));
        })
    },

    /**
     * 加载成功
     * @param {*} isEdit 
     */
    loadLangSuccess: function(isEdit) {
        const _this = this;
        // 设置网页标题
        const language = window.DataViz.Language.DataVizHtml;
        if(isEdit) {
            document.getElementsByTagName("title")[0].insertAdjacentText('afterBegin', language.DataViz);
            // 加载动画标识
            document.getElementById('loading-info').innerHTML = language.loading;
            
            _this.loadPlugins(function() {
                _this.loadJS('./app/app.js', function() {
                    _this.loadJS('./common/common.js', function() {
                        let config = window.DataViz.Plugins;
                        config.jsFile && config.jsFile.length > 0 && config.jsFile.forEach(function(file) {
                            _this.loadJS('./libs/plugins/' + file);
                        })
                        //扩展的css
                        config.cssFile && config.cssFile.length > 0 && config.cssFile.forEach(function(file) {
                            _this.loadCSS('./libs/plugins/' + file);
                        })
                    });
                })
            });
       } else {
           // 按钮提示
           let mapInfodom = document.querySelector('.map-info');
           let editBtndom = document.querySelector('.edit-btn');
           mapInfodom && (mapInfodom.title = language.mapInfo);
           editBtndom && (editBtndom.title = language.editBtn);
           // 其他  key为DOM元素，value为对应语言数据key值
           const changeArr = new Map([
               [document.getElementById('legend-title'), 'legendTitle'],
               [document.getElementsByClassName('back2Home'), 'back2Home'],
               [document.getElementById('app-title'), 'DataViz']
           ]);
           changeArr.forEach(function (value, key) {
               if (!key) {
                   return;
               }
               if (key.length && key.length > 1) {
                   Array.prototype.forEach.call(key, function (element) {
                       element.innerText = language[value];
                   });
                   return;
               } else {
                   key.innerText = language[value];
               }
           });
           _this.loadJS('./view/view.js')
       }
    },

    /**
     * @description 检测当前浏览器所用语言
     * @author chengl
     */
    getLang: function () {
        if(this.getCookie('language')) {
            return this.getCookie('language');
        } else {
            const browerLang = navigator.language || navigator.browserLanguage;
            return browerLang.split('-')[0];
        }
    },

    /**
     * 获取cookie
     * @param {string} key 键
     */
    getCookie: function (key) {
        key = key.toLowerCase();
        let value = null;
        let cookies = document.cookie.split(';');
        cookies.forEach(function (cookie) {
            const arr = cookie.split('=');
            if (arr[0].toLowerCase().trim() === key) {
                value = arr[1].trim();
                return;
            }
        });
        return value;
    },

    /**
     * @description 检测当前浏览器所用语言
     * @author chengl 获取浏览器语言
     * @param src js路径
     * @param callBack 加载完成的回调函数
     */
    loadJS: function (src, callBack, errorCallBack) {
        let script = document.createElement('script');
        script.setAttribute('src', src);
        callBack && (script.onload = function (e) {
            callBack && callBack();
            script.onload =null;
        });
        errorCallBack && (script.onerror = function() {
            errorCallBack();
        })
        document.body.appendChild(script);
    },

    /**
     * 加载css文件
     * @param {*} src  
     */
    loadCSS: function(src) {
        let link = document.createElement('link');
        link.setAttribute('href', src);
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        document.body.appendChild(link);
    },
    /**
     * @description 加载扩展开发资源文件
     * @author zhaoq
     */
    loadPlugins: function(callBack) {
        const _this = this;
        _this.loadJS('./libs/plugins/PluginsConfig.js', function() {
            callBack && callBack(); 
        });
    },
    /**
     * 加载主题文件
     * @param {boolean} isEdit 是否编辑
     */
    loadThemes: function (isEdit) {
        let theme = window.DataViz.theme;
        let dir = isEdit ? './app/' : './view/';
        if (theme === 'light') {
            let now = 'light', old = 'dark';
            let html = ''
                + '<link name="theme" rel="stylesheet" href="./common/' + now + '.css" type="text/css" title="' + now + '">'
                + '<link name="theme" rel="stylesheet" href="' + dir + now + '.css" type="text/css" title="' + now + '">'
                + '<link name="theme" rel="stylesheet" href="./common/' + old + '.css" type="text/css" title="' + old + '" disabled>'
                + '<link name="theme" rel="stylesheet" href="' + dir + old + '.css" type="text/css" title="' + old + '" disabled>'
            document.head.insertAdjacentHTML('beforeend', html);
        } else {
            let now = 'dark', old = 'light';
            let html = ''
                + '<link name="theme" rel="stylesheet" href="./common/' + now + '.css" type="text/css" title="' + now + '">'
                + '<link name="theme" rel="stylesheet" href="' + dir + now + '.css" type="text/css" title="' + now + '">'
                + '<link name="theme" rel="stylesheet" href="./common/' + old + '.css" type="text/css" title="' + old + '" disabled>'
                + '<link name="theme" rel="stylesheet" href="' + dir + old + '.css" type="text/css" title="' + old + '" disabled>'
            document.head.insertAdjacentHTML('beforeend', html);
        }
    }
}

initializeApp.init()