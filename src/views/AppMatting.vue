<template>
    <div>
        <div style="padding: 10px 0;text-align: right" >
            <el-select clearable v-model="username" placeholder="请选择官网" style="width: 400px">
                <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName" :value="item.id"></el-option>
            </el-select>
            <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
            <el-button  type="warning" @click="reset">重置</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" border stripe :header-cell-class-name="'headerBg'">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="id" label="序号" width="150" align="center"></el-table-column>
            <el-table-column prop="userIp" label="用户IP" width="150" align="center"></el-table-column>
            <el-table-column prop="appWebSiteId" label="所属网站" width="150" align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="functionId" label="所属功能" width="150" align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{ selectTag1(scope.row.functionId) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="residueNumber" label="剩余次数" width="150" align="center"></el-table-column>
        </el-table>
        <!--分页 选页面-->
        <div style="padding: 10px 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10, 15, 20, 25]"
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
                    pageSize: 10,
                    username:"",
                    form: {},
                    dialogFormVisible: false,
                    dialogFormVisible1: false,
                    multipleSelection: [],
                    functionListCopy: [],
                    appList: [],
                    fileList: [],
                    base64Img: ""
                }
            },
            watch: {
                username(newVal) {
                    if (newVal != undefined && newVal != "") {
                        this.pageNum = 1
                    }
                }
            },
            created() {
                //请求分页查询数据
                this.load()
            },
            computed: {
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
                    this.request.get("/mattingManage/mattingList", {
                        params: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize
                        }
                    }).then(res => {
                        this.tableData = res.data.mattingList.records
                        this.total = res.data.mattingList.total
    
                    })
                    this.request.get("/appManage/appManages").then(res => {
                        this.appList = res.data.appList
                    })
                    this.request.get("/functionManage/functionLists").then(res => {
                        this.functionList = res.data.functionLists
                    })
                },
                reset(){
                    this.username=""
                    this.load()
                },
                handleSizeChange(pageSize){
                    this.pageSize = pageSize
                    if (this.username != undefined && this.username != "") {
                        this.search()
                    } else {
                        this.load()
                    }
                },
                handleCurrentChange(pageNum){
                    this.pageNum = pageNum
                    if (this.username != undefined && this.username != "") {
                        this.search()
                    } else {
                        this.load()
                    }
                },
                search() {
                    this.request.post("/mattingManage/searchMatting", {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            appWebSiteId: this.username
                    }).then(res => {
                        this.tableData = res.data.mattingList.records
                        this.total = res.data.mattingList.total
    
                    })
                    this.request.get("/appManage/appManages").then(res => {
                        this.appList = res.data.appList
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
    