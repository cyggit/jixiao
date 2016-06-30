var smsForm=Ext.create('Ext.form.Panel',{
    id:'smsForm',
    title:'编辑短信内容',
    renderTo:Ext.get('sms_region'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items:[{
        xtype:'textfield',
        name:'TargetNum',
        fieldLabel:'发送号码：',
        alloBlank:true
    },{
            xtype:'textarea',
            name:'SMSContent',
            width:500,
            flex:4
        }],buttons:[{
        xtype:'button',
        text:'发送短信',
        handler:function(){
            if (smsForm.getForm().findField("TargetNum").getValue()==""){
                Ext.Msg.alert('Error',"编辑内容框的发送号码不能为空");
            }else{
                smsForm.submit({
                    url:'/request/sendSms',
                    params:{
                        //sms_data:smsForm.getForm().findField('SMSContent').getValue(),
                        Name:contentForm.getForm().findField('Name').getValue(),
                        EventNo:contentForm.getForm().findField('EventNo').getValue(),
                        CallNo:contentForm.getForm().findField('CallNo').getValue(),
                        ResTime:contentForm.getForm().findField('ResTime').getValue()
                    },
                    success:function(form,action){
                        var obj=Ext.decode(action.response.responseText);
                        if (obj.success=="true"){
                            var sm = grid.getSelectionModel();
                            var record = sm.getSelection()[0];
                            store.remove(record);
                            Ext.Msg.alert('success','发送成功');
                            smsForm.getForm().reset();
                            //Ext.getCmp('contentForm').getForm().reset();
                            store.reload();
                        }
                        else{
                            Ext.Msg.alert('failure','重复发送/发送失败');
                            smsForm.getForm().reset();
                            Ext.getCmp('contentForm').getForm().reset();
                        }
                }
                });
            }
        }
    }]
});


var contentForm = Ext.create('Ext.form.Panel',{
        id:'contentForm',
        title:'信件内容',
        renderTo:Ext.get('form_region'),
        //collapsible:true,
        autoScroll:true,
        waitMsgTarget:true,
        //defaults:{anchor:'100%'},
        fieldDefaults:{
                labelWidth:60,
                labelAlign:'left',
                flex:1,
				margin:1
        },
        items:[
                {
                        xtype:'container',
                        layout:'hbox',
						margin:'3 0 3 0',
                        items:[
				                {xtype:'textfield',name:'Name',fieldLabel:'姓名',alloBlank:true},
                                {xtype:'textfield',name:'LinkPhone',fieldLabel:'联系电话',alloBlank:true},
                                {xtype:'textfield',name:'ResTime',fieldLabel:'受理日期',alloBlank:true},
							    {xtype:'textfield',name:'ComeType',fieldLabel:'受理渠道',alloBlank:true}
                              ]
                },{
                        xtype:'container',
                        layout:'hbox',
                        items:[
                                {xtype:'textfield',name:'EventNo',fieldLabel:'受理编号',alloBlank:false},
                                {xtype:'textfield',name:'CallNo',fieldLabel:'深电编号',alloBlank:false},
                                {xtype:'textfield',name:'SusbCode',fieldLabel:'查询码',alloBlank:true},
								{xtype:'textfield',name:'SubsCheck',fieldLabel:'验证码',alloBlank:true}
                              ]
                },
            {
                        xtype:'container',
                        layout:'hbox',
                        items:[{
                            xtype: 'textarea',
                            name: 'DemandsContent',
                            width: '100%',
                            fieldLabel: '诉求内容',
                            labelWidth: 60,
                            flex: 3
                        }]
                },{
                      xtype:'container',
                      layout:'hbox',
                      items:[{
                            xtype:'textarea',
                            name:'ProessResult',
                            width:'100%',
                            fieldLabel:'答复情况',
                            labelWidth:60,
                            flex:3
                      }]

		}],buttons:[{
                xtype: 'button',
                text: '忽略此件',
                handler:function(){
                    contentForm.submit({
                            url:'/request/ignore',
                            success:function(form,action){
                                    var sm = grid.getSelectionModel();
                                    var record = sm.getSelection()[0];
                                    store.remove(record);
                                    store.reload();
                                }
                    })

                }
            }
        //,{
        //        xtype: 'button',
        //        text: '生成短信',
        //        handler:function(){
        //            var contentForm=Ext.getCmp('contentForm');
        //            var smsForm=Ext.getCmp('smsForm');
        //            var thisFrom=contentForm.getForm()
        //            subs_code=thisFrom.findField('SusbCode').getValue();
        //            subs_check=thisFrom.findField('SubsCheck').getValue();
        //            who=thisFrom.findField('Name').getValue();
        //            recvTime=thisFrom.findField('ResTime').getValue();
        //            comeType=thisFrom.findField('ComeType').getValue();
        //            smsForm.getForm().findField("SMSContent").setValue('您好！您于'+ recvTime + '向' +comeType+'反映的问题，相关部门已作处理反馈，请登录www.88812345.lg.gov.cn“结果查询”栏目查询，查询编码:'+ subs_code+'，验证码:'+subs_check+'。');
        //        }
        //}
         ]
});


var missionForm=Ext.create('Ext.Panel',{
    id:'missionForm',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    renderTo: document.body,
    items: [{
        xtype: 'panel',
        flex: 2,
        items:[contentForm]
    },{
        xtype: 'panel',
        layout:'fit',
        flex: 1,
        items:[smsForm]
    }]
    //items:[{
    //    xtype:'panel',
    //    flex:6,
    //    items:[contentForm]
    //},{
    //    xtype:'panel',
    //    flex:4,
    //    itmes:[smsForm]
    //}]
});
