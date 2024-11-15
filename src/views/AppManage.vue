<template>
    <div>
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
        <el-table :data="tableData" style="width: 100%" border stripe :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="编号" width="150" align="center"></el-table-column>
            <el-table-column prop="webSiteName" label="官网名称" width="150" align="center"></el-table-column>
            <!-- <el-table-column prop="numberUse" label="使用次数" width="150" align="center"></el-table-column> -->
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
        <el-dialog title="新增官网信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="addForm">
                <el-form-item label="官网名称" prop="webSiteName" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
                    <el-input v-model="form.webSiteName" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="使用次数">
                    <el-input v-model="form.numberUse" autocomplete="off"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改官网信息" :visible.sync="dialogFormVisible1" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="editForm">
                <el-form-item label="官网ID" v-if="false">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="官网名称" prop="webSiteName" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
                    <el-input v-model="form.webSiteName" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="使用次数">
                    <el-input v-model="form.numberUse" autocomplete="off"></el-input>
                </el-form-item> -->
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
                        webSiteName: ''
                    },
                    dialogFormVisible: false,
                    dialogFormVisible1: false,
                    multipleSelection: [],
                    roles: [],
                    courses: [],
                    vis: false,
                    stuCourses: [],
                    stuVis: false,
                    rules: {
                        webSiteName: [
                            { required: true, message: '请输入官网名称', trigger: 'blur' }
                        ]
                    }
                }
            },
            created() {
                this.load()
            },
            methods:{
                load(){
                    /*Axios请求分页查询*/
                    this.request.get("/appManage/appManageList", {
                        params: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize
                        }
                    }).then(res => {
                        this.tableData = res.data.appList.records
                        this.total = res.data.appList.total
                    })
                },
                save(){
                    this.$refs.addForm.validate(valid => {
                        if (valid) {
                            this.request.post("/appManage/saveAppWebsite", this.form).then(res =>{
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
                            // this.$message.error("请填写必填参数")
                        }
                    })
                },
                edit(){
                    this.$refs.editForm.validate(valid => {
                        if (valid) {
                            this.request.post("/appManage/saveAppWebsite", this.form).then(res =>{
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
                            // this.$message.error("请填写必填参数")
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
                            this.load()
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
                    this.request.post("/appManage/deleteAppWebsite", {
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
                    (pageSize)
                    this.pageSize = pageSize
                    this.load()
                },
                handleCurrentChange(pageNum){
                    (pageNum)
                    this.pageNum = pageNum
                    this.load()
                },
    
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
    