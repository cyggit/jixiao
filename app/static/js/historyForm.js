
var histStore=Ext.create('Ext.data.Store',{
    id:'HistDateStore',
    autoload:false,
    fields: [
        {name: 'id'},
        {name: 'EventNo'},
        {name: 'CallNo'},
        {name: 'Name'},
        {name: 'CreateTime'},
        {name: 'isSend'},
        {name: 'isIgnore'},
        {name: 'SendContent'},
        {name: 'LogTime'},
    ],
    pageSize:25,
    proxy:{
        type:'ajax',
        url:'/request/history',
        reader:{
            type:'json',
            root:'root',
            totalProperty:'totalProperty'
        }
    }
});

var toolbar2=Ext.create('Ext.toolbar.Toolbar', {
    //renderTo: Ext.get('toolbar2'),
    id:'history_toolbar',
    width   : '100%',
    items: [{
           xtype: 'datefield',
            bodyPadding: 10,
            id:'HistBeginDate',
            name :'From',
            format:'Y-m-d',
            cls:'margin:0px;padding-right:20px;',
            fieldLabel: '开始日期'
        }, {
            xtype:'tbseparator'
        },{
            xtype: 'datefield',
            bodyPadding: 10,
            id:'HistEndDate',
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
                var start=Ext.getCmp('HistBeginDate').getValue();
                var end=Ext.getCmp('HistEndDate').getValue();
                var start_date = Ext.util.Format.date(start,'Y-m-d');
                var end_date = Ext.util.Format.date(end,'Y-m-d');
                histStore.on('beforeload',function(){
                        Ext.apply(histStore.proxy.extraParams,{start_date:start_date,end_date:end_date,limit:25});
                    });
                histStore.load({
                    url:'request/history',
                    limit: 25,
                    params:{start_date:start_date,end_date:end_date, start:0}
                });
		}
        }
    ]
});


var sm = new Ext.selection.CheckboxModel();                 //复选框
var historyForm= Ext.create('Ext.grid.Panel',{
    layout:'fit',
    store: histStore,
    renderTo:Ext.get('historyPanel'),
    autoHeight:true,
	forceFit:true,
    loadMask:true,
    columns: [
        {xtype:'rownumberer',header:'id'},
        {header: '系统编号', dataIndex: 'EventNo'},
        {header: '市电编号', dataIndex: 'CallNo'},
        {header: '姓名', dataIndex: 'Name'},
        {header: '受理日期', dataIndex: 'CreateTime'},
        {header: '是否已发送', dataIndex: 'isSend'},
        {header: '是否忽略', dataIndex: 'isIgnore'},
        {header: '发送内容', dataIndex: 'SendContent'},
        {header: '操作时间', dataIndex: 'LogTime'},
        {
            xtype:'actioncolumn',
            text:"操作",
            width:30,
            align:"center",
            items:[{
                icon:'static/resources/icons/undo.png',
                tooltip:'还原'
                //handler:function(grid,rowIndex,colIndex){
                //    var rec=historyForm.getStore().getAt(rowIndex);
                //    alert(rec.get('EventNo'));
            //    }
            }]
          //  renderer:function(value,cellmeta){
          //      var returnStr = "<INPUT type='button' class='restore' onclick='' value='还原'>";
          //      return returnStr;
          //},
        },
    ],
    bbar:{
        xtype:'pagingtoolbar',
        pageSize: 25,
        store: histStore,
        displayInfo: true,
        displayMsg: '当前显示第 {0} - {1} 条，总共 {2}条',
        emptyMsg: "没有数据"
    }
});