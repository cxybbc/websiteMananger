<template>
    <div>
        <div style="padding: 10px 0;text-align: left" >
            <!-- <el-select clearable v-model="username" placeholder="请选择官网" style="width: 400px">
                <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName" :value="item.id"></el-option>
            </el-select> -->

            <!-- <el-input clearable v-model="username" placeholder="请输入需要筛选的条件" style="width: 400px"></el-input>
            <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
            <el-button  type="warning" @click="reset">重置</el-button> -->
            <div class="block">
                <el-date-picker
                    v-model="timeDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="filterDate">
                </el-date-picker>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" border stripe :header-cell-class-name="'headerBg'"
            @filter-change="handleFilterButton"
            @sort-change="sortChange"
            >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="id" label="序号" width="150" align="center"></el-table-column>
            <el-table-column prop="userIp" label="用户IP" width="150" align="center" sortable="custom"></el-table-column>
            <el-table-column prop="webSiteName" label="网站" width="150" align="center" 
                column-key="webSiteName"
                :filters="[{ text: 'Proknocukout_en', value: 'Proknocukout_en' }, { text: 'Formmasterapp_en', value: 'Formmasterapp_en' }, { text: 'Photoretouch_en', value: 'photoretouch_en' }, { text: 'Imyppt_en', value: 'Imyppt_en' },
                            { text: 'Proknocukout_zn', value: 'Proknocukout_zn' }, { text: 'Formmasterapp_zn', value: 'Formmasterapp_zn' }, { text: 'Photoretouch_zn', value: 'photoretouch_zn' }, { text: 'Imyppt_zn', value: 'Imyppt_zn' }]"
                :multiple="true">
                <template slot-scope="scope">
                    {{ webSiteNameTypeLabel(scope.row.webSiteName) }}
                </template>
            </el-table-column>
            <el-table-column prop="logTime" label="访问时间" width="150" align="center"></el-table-column>
            <el-table-column prop="webHost" label="访问域名" width="150" align="center"></el-table-column>
            <el-table-column prop="createTimeLog" label="日志时间" width="150" align="center"></el-table-column>
            <el-table-column prop="webRegion" label="地域" width="150" align="center" 
                column-key="webRegion"
                :filters="[{ text: '国内', value: '0' }, { text: '国外', value: '1' }]"
                :multiple="false">
                <template slot-scope="scope">
                    {{ webRegionTypeLabel(scope.row.webRegion) }}
                </template>
            </el-table-column>
            <el-table-column prop="webContent" label="user_agent" width="150" align="center"></el-table-column>
        </el-table>
        <!--分页 选页面-->
        <div style="padding: 10px 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[30, 35, 40, 45, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
    </template>
    
    <script>
        import {serverIp} from "../../public/config";
    
        export default {
            name: "User",
            data(){
                return{
                    serverIp: serverIp,
                    tableData: [],
                    total: 0,
                    pageNum: 1,
                    pageSize: 30,
                    username:"",
                    form: {},
                    dialogFormVisible: false,
                    dialogFormVisible1: false,
                    multipleSelection: [],
                    functionListCopy: [],
                    appList: [],
                    fileList: [],
                    base64Img: "",
                    webSite_types: [
                        {
                            value: 'Proknockout_en',
                            label: 'Proknockout_en'
                        },
                        {
                            value: 'Photoretouch_en',
                            label: 'Photoretouch_en'
                        },
                        {
                            value: 'Formmasterapp_en',
                            label: 'Formmasterapp_en'
                        },
                        {
                            value: 'Imyppt_en',
                            label: 'Imyppt_en'
                        },
                        {
                            value: 'Proknockout_zn',
                            label: 'Proknockout_zn'
                        },
                        {
                            value: 'Photoretouch_zn',
                            label: 'Photoretouch_zn'
                        },
                        {
                            value: 'Formmasterapp_zn',
                            label: 'Formmasterapp_zn'
                        },
                        {
                            value: 'Imyppt_zn',
                            label: 'Imyppt_zn'
                        }
                    ],
                    webRegion_types: [
                        {
                            value: '0',
                            label: '国内'
                        },
                        {
                            value: '1',
                            label: '国外'
                        }
                    ],
                    webRegion: '',
                    webSiteName: [],
                    logTime: '',
                    timeDate: '',
                    sort: '',
                    filterColumn: ''
                }
            },
            created() {
                //请求分页查询数据
                this.load()
            },
            computed: {
                webSiteNameTypeLabel() {
                    return function(value) {
                        const matchedObject = this.webSite_types.find(obj => obj.value == value);
                        return matchedObject ? matchedObject.label : '';
                    }
                },
                webRegionTypeLabel() {
                    return function(value) {
                        const matchedObject = this.webRegion_types.find(obj => obj.value == value);
                        return matchedObject ? matchedObject.label : '';
                    }
                },
                selectTag() {
                    return function(value) {
                        const matchedObject = this.appList.find(obj => obj.id == value);
                        return matchedObject ? matchedObject.webSiteName : '';
                    }
                },
                selectTag1() {
                    return function(value) {
                        const matchedObject = this.functionList.find(obj => obj.id == value);
                        return matchedObject ? matchedObject.functionName : '';
                    }
                }
            },
            methods:{
                load(){
                    this.request.post("/websiteLog/logAnalytics", {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }).then(res => {
                        this.tableData = res.data.webSiteLogs.records
                        this.total = res.data.webSiteLogs.total
                    })
                    // this.request.get("/appManage/appManages").then(res => {
                    //     this.appList = res.data.appList
                    // })
                    // this.request.get("/functionManage/functionLists").then(res => {
                    //     this.functionList = res.data.functionLists
                    // })
                },
                sortLoad(){
                    let webRegions = '';
                    let webSiteNames = [];
                    let logTimes = '';
                    let column = this.filterColumn
                    if (column.webRegion) {
                        webRegions = column.webRegion[0];
                        this.webRegion = webRegions;
                    }else if(column.webSiteName) {
                        for (let i = 0; i < column.webSiteName.length; i++) {
                            webSiteNames.push(column.webSiteName[i])
                        }
                        this.webSiteName = webSiteNames;
                    }else if(column.logTime) {
                        logTimes = column.logTimes[0];
                        this.logTime = logTimes;
                    }
                    this.request.post("/websiteLog/sortLogAnalytics", {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        order: this.sort,
                        logTimes: this.logTime,
                        webSiteNames: this.webSiteName,
                        webRegions: this.webRegion,
                        startTime: this.timeDate[0],
                        endTime: this.timeDate[1]
                    }).then(res => {
                        this.tableData = res.data.webSiteLogs.records
                        this.total = res.data.webSiteLogs.total
                    })
                },
                reset(){
                    this.username=""
                    this.load()
                },
                handleSizeChange(pageSize){
                    this.pageSize = pageSize
                    if (this.sort) {
                        this.sortLoad()
                    } else {
                        this.load()
                    }
                    
                },
                handleCurrentChange(pageNum){
                    this.pageNum = pageNum
                    // this.load()
                    if (this.sort) {
                        this.sortLoad()
                    } else {
                        this.load()
                    }
                },
                search() {
                    this.request.post("/websiteLog/logAnalytics", {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            logTime: this.username
                    }).then(res => {
                        this.tableData = res.data.webSiteLogs.records
                        this.total = res.data.webSiteLogs.total
    
                    })
                },
                handleFilterButton(column) {
                    this.filterColumn = column
                    let webRegions = '';
                    let webSiteNames = [];
                    let logTimes = '';
                    this.sort = "desc"
                    if (column.webRegion) {
                        webRegions = column.webRegion[0];
                        this.webRegion = webRegions;
                    }else if(column.webSiteName) {
                        for (let i = 0; i < column.webSiteName.length; i++) {
                            webSiteNames.push(column.webSiteName[i])
                        }
                        this.webSiteName = webSiteNames;
                    }else if(column.logTime) {
                        logTimes = column.logTimes[0];
                        this.logTime = logTimes;
                    }
                    this.request.post("/websiteLog/logAnalytics", {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            logTimes: this.logTime,
                            webSiteNames: this.webSiteName,
                            webRegions: this.webRegion,
                            order: this.sort,
                            startTime: this.timeDate[0],
                            endTime: this.timeDate[1]
                    }).then(res => {
                        this.tableData = res.data.webSiteLogs.records
                        this.total = res.data.webSiteLogs.total
                    }).catch((err) => {
                        // (err)
                    })
                },
                sortChange(row) {
                    if (!row.order) {
                        this.sort = ""
                        this.load()
                        return
                    }
                    if (row.order == "descending") {
                        this.sort = "desc"
                    } else {
                        this.sort = "asc"
                    }
                    this.sortLoad()
                },
                filterDate() {
                    if (!this.timeDate) {
                        this.this.pageNum = 1
                        this.load()
                    }
                    this.request.post("/websiteLog/dateList", {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        webSiteNames: this.webSiteName,
                        webRegions: this.webRegion,
                        startTime: this.timeDate[0],
                        endTime: this.timeDate[1]
                    }).then(res => {
                        this.tableData = res.data.dateList.records
                        this.total = res.data.dateList.total
                    })
                }
            }
        }
    </script>
    
    <style>
        .headerBg{
            background:#eee!important;
        }
        .el-table__header {
            width: 100% !important; 
        }
        .el-table__body {
            width: 100% !important; 
        }
        .el-form-item__label {
            width: 100px !important;
        }
        .el-form-item__content {
            margin-left: 100px !important;
        }
    </style>
    