//配置文件
window.DataViz.Plugins = {
    //默认为false. 为true，即将put请求用post请求发送
    isPut2Post: false,
    //默认为false. 为true，即将delete请求用get请求发送
    isDelete2Get: false,
    // 默认点击左上角logo，打开ipt首页
    logoHref: "",
    // 默认点击左上角logo，打开新的浏览器标签
    logoHrefTargetSelf: false,
    //左侧需要显示的tab页
    menus: [{
        //图层tab项
        id: 'dv-layers',
        title: DataViz.Language.layerManagement,
        iconClass: 'supermapol-icons-layers'
    },{
        //打印tab页
        id: 'dv-print',
        title: DataViz.Language.print,
        iconClass: 'supermapol-icons-print'
    },{
        //设置tab项
        id: 'dv-settings',
        title: DataViz.Language.mapSetting,
        iconClass: 'supermapol-icons-setting'
    }
    // ,{
    //     //用户扩展项
    //     id: 'dv-extension',
    //     title: '扩展',
    //     iconClass: 'supermapol-icons-roadnetwork'
    // }
    ]
    // ,
    // //扩展js文件（注：相对路径）
    // jsFile: ['sample/Sample.js'],
    // //扩展css文件（注：相对路径）
    // cssFile: ['sample/Sample.css']
}