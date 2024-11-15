<template>
    <div>
        <div style="padding: 10px 0;text-align: right" >
            <el-select clearable v-model="username" placeholder="请选择官网" style="width: 400px">
                <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName" :value="item.id"></el-option>
            </el-select>
            <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
            <el-button  type="warning" @click="reset">重置</el-button>
        </div>
        <div style="padding: 10px 0">
            <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
            <el-popconfirm
                    class="ml-5"
                    confirm-button-text='确定'
                    cancel-button-text='取消'
                    icon="el-icon-info"
                    icon-color="red"
                    title="您确定删除吗？"
                    @confirm="deleteBatch"
            >
                <!-- <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i></el-button> -->
            </el-popconfirm>
        </div>
        <el-table :data="tableData" :key="itemKey" style="width: 100%" border stripe :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="编号" width="150" align="center"></el-table-column>
            <el-table-column prop="functionName" label="功能名称" width="150" align="center"></el-table-column>
            <el-table-column prop="appWebSiteId" label="所属网站" width="150" align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="numberUse" label="使用次数" width="150" align="center"></el-table-column>
            <el-table-column prop="numberThreshold" label="计数阈值" width="150" align="center"></el-table-column>
            <el-table-column prop="probability" label="触发概率" width="150" align="center"></el-table-column>
            <el-table-column prop="operation" label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='取消'
                            icon="el-icon-info"
                            icon-color="red"
                            title="您确定删除吗？"
                            @confirm="handleDelete(scope.row.id)"
                    >
                        <el-button type="danger" slot="reference" >删除<i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
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
        <el-dialog title="新增功能信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="addForm">
                <el-form-item label="功能名称" prop="functionName" :rules="{
                            required: true, message: '功能名称不能为空', trigger: 'blur'
                        }">
                    <el-input v-model="form.functionName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                            required: true, message: '请选择所属官网', trigger: 'blur'
                        }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用次数" prop="numberUse" :rules="{
                            required: true, message: '请分配默认使用次数', trigger: 'blur'
                        }">
                    <el-input type="number" v-model="form.numberUse" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="计数阈值" prop="numberThreshold" :rules="{
                            required: true, message: '请填写默认技术阈值', trigger: 'blur'
                        }">
                    <el-input type="number" v-model="form.numberThreshold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="触发概率" prop="probability" :rules="{
                            required: true, message: '请填写默认触发概率', trigger: 'blur'
                        }">
                    <el-input v-model="form.probability" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改功能信息" :visible.sync="dialogFormVisible1" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="editForm">
                <el-form-item label="功能ID" v-if="false">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="功能名称" prop="functionName" :rules="{
                            required: true, message: '功能名称不能为空', trigger: 'blur'
                        }">
                    <el-input v-model="form.functionName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                            required: true, message: '请选择所属官网', trigger: 'blur'
                        }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="使用次数" prop="numberUse" :rules="{
                            required: true, message: '功能使用次数不能为空', trigger: 'blur'
                        }">
                    <el-input type="number" v-model="form.numberUse" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="计数阈值" prop="numberThreshold" :rules="{
                            required: true, message: '计数阈值不能为空', trigger: 'blur'
                        }">
                    <el-input type="number" v-model="form.numberThreshold" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="触发概率" prop="probability" :rules="{
                            required: true, message: '功能触发概率不能为空', trigger: 'blur'
                        }">
                    <el-input v-model="form.probability" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </div>
        </el-dialog>
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
                    // integration: "",
                    username:"",
                    form: {
                        id: '',
                        appWebSiteId: '',
                        functionName: '',
                        numberUse: '',
                        numberThreshold: '',
                        probability: ''
                    },
                    dialogFormVisible: false,
                    dialogFormVisible1: false,
                    multipleSelection: [],
                    roles: [],
                    appList: [],
                    courses: [],
                    itemKey: "",
                    vis: false,
                    stuCourses: [],
                    stuVis: false
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
                this.load()
            },            
            computed: {
                selectTag() {
                    return function(value) {
                        const matchedObject = this.appList.find(obj => obj.id == value);
                        return matchedObject ? matchedObject.webSiteName : '';
                    }
                }
            },
            methods:{
                load(){
                    /*Axios请求分页查询*/
                    this.request.get("/functionManage/functionList", {
                        params: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize
                        }
                    }).then(res => {
                        this.itemKey = Math.random()
                        this.tableData = res.data.functionList.records
                        this.total = res.data.functionList.total
                    })
                    this.request.get("/appManage/appManages").then(res => {
                        this.appList = res.data.appList
                    })
                },
                save(){
                    this.$refs.addForm.validate(valid => {
                        if (valid) {
                            this.request.post("/functionManage/saveFunction", this.form).then(res =>{
                                if (res.code === '200'){
                                    this.$message.success("保存成功")
                                    this.dialogFormVisible = false
                                    this.load()
                                    this.form = {}
                                }else {
                                    (res.msg)
                                    this.$message.error("保存失败")
                                }
                            })
                        } else {

                        }
                    })
                },
                edit(){
                    this.$refs.editForm.validate(valid => {
                        if (valid) {
                            this.request.post("/functionManage/saveFunction", this.form).then(res =>{
                                if (res.code === '200'){
                                    this.$message.success("保存成功")
                                    this.dialogFormVisible1 = false
                                    this.load()
                                    this.form = {}
                                }else {
                                    this.$message.error(res.msg)
                                }
                            })
                        } else {

                        }
                    })
                },
                reset(){
                    this.username=""
                    this.load()
                },
                handleSelectionChange(val){//删除确认提醒框
                    this.multipleSelection = val
                },
                deleteBatch(){
                    let ids =  this.multipleSelection.map(v => v.id)// 因为后端的是List数组 而这ids是对象数组 所以要用前端的map(v => v.id)把对象数组 [{},{},{}] 转变成纯id的数组 [1,2,3,...]
                    this.request.post("/user/del/batch/",ids).then(res => {
                        if(res.code === '200'){
                            this.$message.success("批量删除成功")
                            if (this.username) {
                                this.search()
                            } else {
                                this.load()
                            }
                        }else {
                            this.$message.error("批量删除失败")
                        }
                    })
                },
                handleEdit(row){
                    this.form = JSON.parse(JSON.stringify(row))
                    this.dialogFormVisible1 = true
                },
                handleDelete(id){
                    this.request.post("/functionManage/deleteFunction", {
                        id
                    }).then(res => {
                        if (res.code === '200'){
                            this.$message.success("删除成功")
                            this.load()
                        }else {
                            this.$message.error("删除失败")
                        }
                    })
                },
                handleAdd(){
                    this.dialogFormVisible=true
                    this.form={}
                },
                handleSizeChange(pageSize){
                    this.pageSize = pageSize
                    this.load()
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
                    this.request.post("/functionManage/searchFunction", {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            appWebSiteId: this.username
                    }).then(res => {
                        this.tableData = res.data.searchData.records
                        this.total = res.data.searchData.total
    
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
    </style>
    