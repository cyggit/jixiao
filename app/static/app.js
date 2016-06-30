//==================================== Grid Panel ==========================================

var store = Ext.create('Ext.data.Store',{
    id:'DateStore1',
    autoload:false,
    fields: [
        {name: 'id'},
        {name: 'EventNo'},
        //{name: 'CallNo'},
        {name: 'Name'},
        {name: 'LinkPhone'},
        {name: 'QuestionType'},
        {name: 'CreateTime'},
        {name: 'Status'},
        {name: 'IsRepeat'}
    ],
    pageSize:18,
    proxy:{
        type:'ajax',
        url:'request/list',
        reader:{
            type:'json',
            root:'root',
            totalProperty:'totalProperty'
        }
    }
});


var passwdWin=Ext.create('Ext.window.Window', {
    id:'pwdWin',
    title: '修改密码',
    height: 300,
    width: 500,
    layout: 'fit',
    closeAction:'hide',
    items:[{  // Let's put an empty grid in just to illustrate fit layout
        xtype: 'form',
        items:[
            {
                xtype:'container',
                layout:'hbox',
                margin:'20 0 0 50',
                items:[{xtype:'textfield',inputType:'password',name:'passwdNow',fieldLabel:'原始密码',alloBlank:false}]
            },{
                xtype:'container',
                layout:'hbox',
                margin:'10 0 0 50',
                items:[{xtype:'textfield',inputType:'password',name:'passwdNew',fieldLabel:'新密码',alloBlank:false}]
            },{
                xtype:'container',
                layout:'hbox',
                margin:'10 0 0 50',
                items:[{xtype:'textfield',inputType:'password',name:'passwdCfm',fieldLabel:'确认',alloBlank:false}]
            }
        ],buttons:[{
                xtype:'button',
                text:'确定'
            },{
                xtype:'button',
                text:'取消'
            }]
    }]
});


//-------------------------------toolbar-------------------------------------------
var toolbar1=Ext.create('Ext.toolbar.Toolbar', {
    renderTo: Ext.get('toolbar1'),
    id:'query_toolbar',
    width   : '100%',
    items: [{
           xtype: 'datefield',
            bodyPadding: 10,
            id:'BeginDate',
            name :'From',
            format:'Y-m-d',
            cls:'margin:0px;padding-right:20px;',
            fieldLabel: '开始日期'
        }, {
            xtype:'tbseparator'
        },{
            xtype: 'datefield',
            bodyPadding: 10,
            id:'EndDate',
            name :'To',
            format:'Y-m-d',
            fieldLabel: '结束日期'
        },{
            xtype:'tbseparator'
        },
        {
            xtpe:'button',
            text:'查询',
            iconCls:'find',
            handler:function(){
                var start=Ext.getCmp('BeginDate').getValue();
                var end=Ext.getCmp('EndDate').getValue();
                var start_date = Ext.util.Format.date(start,'Y-m-d');
                var end_date = Ext.util.Format.date(end,'Y-m-d');
                store.on('beforeload',function(){
                        Ext.apply(store.proxy.extraParams,{start_date:start_date,end_date:end_date,limit:18});
                    });
                store.load({
                    url:'request/list',
                    limit: 18,
                    params:
                    {
                        start_date:start_date,
                        end_date:end_date,
                        start:0
                        //limit:18
                    }
                });
		}
        }
    ]
});


//-------------------------------grid-------------------------------------------
//var sm = new Ext.selection.CheckboxModel();                 //复选框
var grid = Ext.create('Ext.grid.GridPanel', {
    //title: '市12345信访事项列表',
    renderTo:Ext.get('gridPanel'),
    //height: 500,
    //height: "100%",
    store: store,
    columns: [
        {xtype:'rownumberer',header:'id'},
        {header: '系统编号', dataIndex: 'EventNo'},
        //{header: 'CallNo', dataIndex: 'CallNo'},
        {header: '姓名', dataIndex: 'Name'},
        {header: '联系电话', dataIndex: 'LinkPhone'},
        {header: '内容分类', dataIndex: 'QuestionType'},
        {header: '受理日期', dataIndex: 'CreateTime'},
        {header: '办结状态',dataIndex: 'Status'},
        {
            header: '是否重复',
            dataIndex: 'IsRepeat',
            renderer:function(val){
                if(val=='是'){return '<span style="color:red">'+val+'</span>';}
                return  '<span style="color:black">'+val+'</span>';
            }
        }
    ],
    loadMask: true,
    //selModel: sm,
	autoHeight:true,
	forceFit:true,
	//autoScroll:true,
    listeners:{'itemclick':function(view, record, item, index, e){
        formObj = Ext.getCmp("contentForm");
        Ext.Ajax.request({
            url:'request/info/'+record.data.EventNo,
            success:function(response,options){
                //var res=response.responseText.trim();
                var res=response.responseText;
                // console.log(response.responseText);
                formObj.getForm().setValues(Ext.JSON.decode(res));

                var contentForm=Ext.getCmp('contentForm');
                var smsForm=Ext.getCmp('smsForm');
                var thisForm=contentForm.getForm()
                subs_code=thisForm.findField('SusbCode').getValue();
                subs_check=thisForm.findField('SubsCheck').getValue();
                who=thisForm.findField('Name').getValue();
                linkPhone=thisForm.findField('LinkPhone').getValue();
                //recvTime=thisFrom.findField('ResTime').getValue();
                comeType=thisForm.findField('ComeType').getValue();
                smsForm.getForm().findField("TargetNum").setValue(linkPhone);
                smsForm.getForm().findField("SMSContent").setValue('提示：您好!您向' +comeType+'反映的问题，承办部门已有办理反馈，可登录http://www.88812345.lg.gov.cn“结果查询”栏目查询，查询编码:'+ subs_code+'，验证码:'+subs_check);
            }
	});
    }},
    tbar:{
        xtype:'pagingtoolbar',
        pageSize: 18,
        store: store,
        displayInfo: true,
        displayMsg: '当前显示第 {0} - {1} 条，总共 {2}条',
        emptyMsg: "没有数据"
    }
});


//-------------------------------tabs-------------------------------------------
var tabs= new Ext.TabPanel({
    renderTo:document.body,
    deferredRender:false,
    autoDestroy: false
});

tabs.add({
    title:'12345信访事项列表',
    index:0,
    id:'tab1',
    closable:true,
    layout:{
        type:'vbox',
        align : 'stretch'
    },
    items:[{
        xtype:'panel',
        items:[toolbar1]
    },{
        xtype:'panel',
        flex:6,
        items:[grid]
    },{
        xtype:'panel',
        items:[missionForm]
    }]
    //listeners:{
    //    'activate':function(){
    //
    //    }
    //}
});


//====================================== Main Function =======================================
Ext.onReady(function () {
    Ext.application({
        require: 'Ext.container.Viewport',
        name: 'XinfangApp',
        renderTo:Ext.getBody(),
        launch: function () {
            Ext.create('Ext.container.Viewport', {
                layout: 'border',
                items: [{
                    region: 'north',                                            //<===================== Border North / TITLE
                    height: 50,
                    xtype:'toolbar',
                    bodyStyle:'background:#e0e0e0',
                    items:[
                        '<h2>龙岗区信访局业务短信发送平台</h2>',
                        '->',
                        {
                            text:'修改密码',
                            iconCls:'cog',
                            action:'password',
                            listeners:{
                                'click':function(){
                                    passwdWin.show();
                                }
                            }
                        },{
                            text:'退出系统',
                            iconCls:'quit',
                            action:'login',
                            listeners: {
                                 'click': function(){
                                    Ext.MessageBox.confirm('提示','确定退出？',function(btn){
                                        if(btn=='yes'){window.location.href='/logout';}
                                        else{
                                        }
                                    },this)
                            }
                 }
                        }
                    ]
                }, {
                    region: 'west',                                            //<===================== Border West / NAV
                    width: 200,
                    layout:'accordion',
                    collapsible: true,
                    layoutConfig:{
                        titleCollapse:true,
                        animate:true,
                        activeOnTop:false
                    },
                    items:[{
                        title:'短信类型',
                        iconCls:'find',
                        items:[{
                            title:'发送查询短信',
                            iconCls:'method'
                        },{
                            title:'发送受理提醒(建设中)',
                            iconCls:'information'
                        },{
                            title:'批量发送受理提醒(建设中)',
                            iconCls:'information'
                        },
                        ],
                        listeners : {'expand':function(p) {
                            if (tabs.getComponent('tab1')) {
                                tabs.setActiveTab('tab1');
                            }
                            else {
                                tabs.add({
                                    title: '12345信访事项列表',
                                    index: 0,
                                    id: 'tab1',
                                    closable: true,
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    items: [{
                                        xtype: 'panel',
                                        items: [toolbar1]
                                    }, {
                                        xtype: 'panel',
                                        flex: 6,
                                        items: [grid]
                                    }, {
                                        xtype: 'panel',
                                        items: [missionForm]
                                    }]
                                });
                                tabs.setActiveTab('tab1');
                                }
                            }
                        }
                    },{
                            title:'查询已发送短信',
                            iconCls:'drop-yes',
                            listeners : {
                                'expand':function(p){
                                   //Ext.MessageBox.alert("ExtJS", "ExtJS");
                                    if(tabs.getComponent('tab2')){
                                         tabs.setActiveTab('tab2');
                                    }
                                    else {
                                        tabs.add({
                                                title:'操作记录',
                                                id:'tab2',
                                                index:1,
                                                layout: {
                                                        type: 'vbox',
                                                        align: 'stretch'
                                                },
                                                closable:true,
                                                items:[{
                                                    xtype:'panel',
                                                    items:[toolbar2]
                                                },{
                                                    xtype:'panel',
                                                    flex:6,
                                                    items:[historyForm]
                                                }]
                                            });
                                         tabs.setActiveTab('tab2');
                                    }
                                }
                            }

                       //items:[date_picker3]
                    }
                    ]
                },
                {
                    region: 'center',                                            //<===================== Border Center / TABS
					layout: 'fit',
					items:[tabs]
                }
//				,{
//                    region:'south',
//                   height:20,
//					bodyStyle:'background:#e0e0e0',
//                    contentEl:'foot'
//                }
				]
            });
        }

        });
});
