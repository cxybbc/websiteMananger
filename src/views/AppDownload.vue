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
        </div>
        <el-table :data="tableData" :key="itemKey" style="width: 100%" border stripe :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="序号" width="150" align="center"></el-table-column>
            <el-table-column prop="downloadName" label="下载链接名称" width="150" align="center"></el-table-column>
            <el-table-column prop="appWebSiteId" label="所属网站" width="150" align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="downloadUrl" label="下载链接" width="150" align="center">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row.downloadUrl }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.downloadUrl }}</el-tag>
                        </div>
                    </el-popover>
                    <el-progress v-if="!uploadData && scope.row.id == currentId" :percentage="uploadProgress"></el-progress>
                    <el-progress v-if="!uploadData && scope.row.id == saveId" :percentage="uploadProgress"></el-progress>
                </template>
            </el-table-column>
            <el-table-column prop="download" label="跳转链接" width="150" align="center">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>{{ scope.row.download }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.download }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='好的'
                            cancel-button-text='我在想想'
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
        <el-dialog title="新增官网下载链接" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="addForm">
                <el-form-item label="下载链接名称" prop="downloadName" :rules="{
                            required: true, message: '请填写下载链接名称', trigger: 'blur'
                        }">
                    <el-input v-model="form.downloadName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="下载链接">
                    <!-- <el-input v-model="form.downloadUrl" autocomplete="off"></el-input> -->
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="action"
                        :on-change="handlePreview"
                        :on-remove="handleRemove"
                        :limit="1"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                    <el-progress v-if="!uploadData" :percentage="uploadProgress"></el-progress>
                </el-form-item>
                <el-form-item label="跳转链接">
                    <el-input v-model="form.download" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                            required: true, message: '请选择所属官网', trigger: 'blur'
                        }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改下载链接信息" :visible.sync="dialogFormVisible1" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="editForm">
                <el-form-item label="好评弹幕ID" v-if="false">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="下载链接名称" prop="downloadName" :rules="{
                            required: true, message: '下载链接名称不能为空', trigger: 'blur'
                        }">
                    <el-input v-model="form.downloadName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="下载链接">
                    <!-- <el-input v-model="form.downloadUrl" autocomplete="off"></el-input> -->
                    <el-input v-model="form.downloadUrl" autocomplete="off" v-if="form.downloadUrl"></el-input>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="action"
                        :on-change="handlePreview"
                        :on-remove="handleRemove"
                        :disabled="isUploading"
                        :limit="1"
                        :auto-upload="false"
                        v-if="!form.downloadUrl"
                        >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="action"
                        :on-change="handlePreview"
                        :on-remove="handleRemove"
                        :limit="1"
                        :auto-upload="false"
                        v-if="form.downloadUrl"
                        style="margin-top: 3px"
                        >
                        <el-button slot="trigger" size="small" type="primary">替换文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="跳转链接">
                    <el-input v-model="form.download" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                            required: true, message: '请选择所属官网', trigger: 'blur'
                        }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName" :value="item.id"></el-option>
                    </el-select>
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
                    username:"",
                    form: {
                        id: '',
                        downloadUrl: '',
                        appWebSiteId: '',
                        downloadName: '',
                        download: ''
                    },
                    dialogFormVisible: false,
                    dialogFormVisible1: false,
                    multipleSelection: [],
                    appList: [],
                    fileList: [],
                    base64Img: "",
                    fileName: "",
                    isUploading: false,
                    formData: new FormData(),
                    image: "",
                    itemKey: "",
                    uploadProgress: 0,
                    uploadData: true,
                    currentId: '',
                    saveId: '',
                    saveFile: '',
                    sliceSize: 5 * 1024 * 1024 //默认5M
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
                }
            },
            methods:{
                load(){
                    this.request.get("/downloadManage/downloadList", {
                        params: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize
                        }
                    }).then(res => {
                        this.itemKey = Math.random()
                        this.tableData = res.data.downloadList.records
                        this.total = res.data.downloadList.total
    
                    })
                    this.request.get("/appManage/appManages").then(res => {
                        this.appList = res.data.appList
                    })
                },
                save(){
                    this.$refs.addForm.validate(valid => {
                        if (valid) {
                            if (this.base64Img) {
                                // this.form["downloadUrl"] = this.base64Img
                                this.formData.append("downloadUrlName", this.fileName)
                            } else {
                                this.formData.append("downloadUrl", "")
                            }
                            // this.form['downloadFile'] = this.formData
                            this.formData.append("downloadName", this.form.downloadName)
                            this.formData.append("appWebSiteId", this.form.appWebSiteId)
                            this.formData.append("download", this.form.download)
                            this.formData.delete("downloadFile");
                            this.request.post("/downloadManage/saveDownload", this.formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                    // 'Content-Type': 'application/json;charset=UTF-8'
                                }
                            }).then( res =>{
                                if (res.code === '200'){
                                    this.dialogFormVisible = false
                                    this.$message.success("保存成功")
                                    // this.uploadData = true
                                    this.saveId = res.data.downloadId
                                    this.$refs.upload.clearFiles();
                                    this.formData = new FormData()
                                    // this.base64Img = ""
                                    this.load()
                                    setTimeout(() => {
                                        this.edit1(this.saveId);
                                    }, 1000);
                                }else {
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
                            if (this.base64Img) {
                                this.uploadData = false
                                // this.form["downloadUrl"] = this.base64Img
                                // this.form["downloadUrlName"] = this.fileName
                                this.formData.append("downloadUrlName", this.fileName)
                            } else {
                                // this.form["downloadUrl"] = this.image
                                this.formData.append("downloadUrl", this.form.downloadUrl)
                            }
                            // this.form['downloadFile'] = this.formData
                            this.formData.append("downloadUrlName", this.fileName)
                            this.formData.append("downloadName", this.form.downloadName)
                            this.formData.append("appWebSiteId", this.form.appWebSiteId)
                            this.formData.append("download", this.form.download)
                            this.formData.append("id", this.form.id)
                            this.dialogFormVisible1 = false
                            this.request.post("/downloadManage/saveDownload", this.formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                    // 'Content-Type': 'application/json;charset=UTF-8'
                                },
                                onUploadProgress: progressEvent => {
                                    this.uploadProgress = Number( ((progressEvent.loaded / progressEvent.total) * 90).toFixed(2) );
                                },
                            }).then( res =>{
                                if (res.code === '200') {
                                    this.uploadProgress = 100
                                    this.uploadData = true
                                    this.dialogFormVisible1 = false
                                    this.$refs.upload.clearFiles();
                                    this.formData = new FormData()
                                    this.base64Img = ""
                                    this.load()
                                    this.image = ""
                                } else {
                                    this.$message.error("保存失败")
                                }
                            })
                        } else {

                        }
                    })
                },
                edit1(id){
                    if (!this.saveId) {
                        return
                    }
                    if (this.base64Img) {
                        this.uploadData = false
                        this.formData.append("downloadUrlName", this.fileName)
                    } else {
                        this.formData.append("downloadUrl", this.image)
                    }

                    this.formData.append("downloadUrlName", this.fileName)
                    if (this.saveFile != "" && this.saveFile) {
                        this.formData.append("downloadFile", this.saveFile)
                    } else {
                        this.formData.append("downloadFile", null)
                    }

                    this.formData.append("downloadName", this.form.downloadName)
                    this.formData.append("appWebSiteId", this.form.appWebSiteId)
                    this.formData.append("download", this.form.download)
                    this.formData.append("id", id)
                    this.dialogFormVisible1 = false
                    this.request.post("/downloadManage/saveDownload", this.formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                            // 'Content-Type': 'application/json;charset=UTF-8'
                        },
                        onUploadProgress: progressEvent => {
                            this.uploadProgress = Number( ((progressEvent.loaded / progressEvent.total) * 90).toFixed(2) );
                        },
                    }).then( res =>{
                        if (res.code === '200') {
                            console.log("走这")
                            this.uploadProgress = 100
                            this.uploadData = true
                            this.dialogFormVisible1 = false
                            this.$refs.upload.clearFiles();
                            this.formData = new FormData()
                            this.image = ""
                            this.base64Img = ""
                            this.load()
                            this.form = {}
                            this.saveId = ""
                        } else {
                            this.$message.error("保存失败")
                        }
                    }).catch(err => {
                        this.uploadProgress = 100
                        this.uploadData = true
                        this.dialogFormVisible1 = false
                        this.$refs.upload.clearFiles();
                        this.formData = new FormData()
                        this.image = ""
                        this.base64Img = ""
                        this.load()
                        this.form = {}
                        this.saveId = ""
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
                    this.currentId = this.form.id
                    this.image = this.form.downloadUrl
                    this.dialogFormVisible1 = true
                },
                handleDelete(id){
                    this.request.post("/downloadManage/deleteDownload", {
                        id
                    }).then(res => {
                        if (res.code === '200'){
                            this.$message.success("删除成功")
                            if (this.username) {
                                this.search()
                            } else {
                                this.load()
                            }
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
                async handlePreview(file) {
                    this.fileName = file.name
                    // this.formData["downloadFile"] = file.raw;
                    this.formData.append("downloadFile", file.raw);
                    this.saveFile = file.raw
                    // this.base64Img = await this.fileToBase64(file.raw).then(res => {
                    //     return res
                    // })
                    this.base64Img = "fileupload"
                },
                handleRemove(file, fileList) {
                    this.base64Img = ""
                    this.fileName = ""
                },
                fileToBase64 (file) {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            const base64String = reader.result.split(",")[1];
                            resolve(base64String);
                        };
                        // 加载失败时
                        reader.onerror = function () {
                            reject(new Error("Failed to load file"));
                        };
                    })
                },
                search() {
                    this.pageNum = 1
                    this.request.post("/downloadManage/searchDownload", {
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
        .el-form-item__label {
            width: 100px !important;
        }
        .el-form-item__content {
            margin-left: 100px !important;
        }
    </style>
    