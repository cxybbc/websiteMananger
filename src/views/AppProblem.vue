<template>
    <div>
        <div style="padding: 10px 0;text-align: right">
            <el-select clearable v-model="username" placeholder="请选择官网" style="width: 400px">
                <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName"
                    :value="item.id"></el-option>
            </el-select>
            <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
        </div>
        <div style="padding: 10px 0">

            <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
        </div>
        <el-table :data="tableData" :key="itemKey" style="width: 100%" border stripe
            :header-cell-class-name="'headerBg'">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="序号" width="150" align="center"></el-table-column>
            <el-table-column prop="problemTitle" label="常见问题" width="150" align="center"></el-table-column>
            <el-table-column prop="problemName" label="问题解答" width="150" align="center"></el-table-column>
            <el-table-column prop="problemUrl" label="详情图" width="150" align="center">
                <template slot-scope="scope">
                    <img v-if="scope.row.problemUrl" :src="'//' + scope.row.problemUrl" alt=""
                        style="width: 50px; height: 50px" />
                    <el-progress v-if="!uploadData && scope.row.id == currentId"
                        :percentage="uploadProgress"></el-progress>
                </template>
            </el-table-column>
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
            <el-table-column prop="applicationCategory" label="应用分类" width="150" align="center">
                <template slot-scope="scope">
                    <!-- <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag> -->
                    <el-tag type="primary" v-if="scope.row.applicationCategory == 0">web端</el-tag>
                    <el-tag type="warning" v-if="scope.row.applicationCategory == 1">移动端</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="regionCategory" label="地域分类" width="150" align="center">
                <template slot-scope="scope">
                    <!-- <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag> -->
                    <el-tag type="primary" v-if="scope.row.regionCategory == 0">国内</el-tag>
                    <el-tag type="warning" v-if="scope.row.regionCategory == 1">国外</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-popconfirm class="ml-5" confirm-button-text='好的' cancel-button-text='我在想想' icon="el-icon-info"
                        icon-color="red" title="您确定删除吗？" @confirm="handleDelete(scope.row.id)">
                        <el-button type="danger" slot="reference">删除<i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页 选页面-->
        <div style="padding: 10px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                :page-sizes="[5, 10, 15, 20, 25]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="新增常见问题" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="addForm">
                <el-form-item label="常见问题" prop="problemTitle" :rules="{
                    required: true, message: '常见问题不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.problemTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="问题解答" prop="problemName" :rules="{
                    required: true, message: '问题解答不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.problemName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="详情图">
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                    required: true, message: '常见请选择所属官网', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能分类" prop="functionId" :rules="{
                    required: true, message: '请选择所属功能', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.functionId" placeholder="请选择所属功能" value-key="id"
                        style="width: 100%">
                        <el-option v-for="item in functionListCopy" :key="item.id" :label="item.functionName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用分类" prop="applicationCategory" :rules="{
                    required: true, message: '请选择应用分类', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.applicationCategory" placeholder="请选择应用" style="width: 100%">
                        <el-option v-for="item in acList" :key="item.id" :label="item.label"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地域分类" prop="regionCategory" :rules="{
                    required: true, message: '请选择地域分类', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.regionCategory" placeholder="请选择地域" style="width: 100%">
                        <el-option v-for="item in rcList" :key="item.id" :label="item.label"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="常见问题修改" :visible.sync="dialogFormVisible1" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="editForm">
                <el-form-item label="常见问题ID" v-if="false">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="常见问题" prop="problemTitle" :rules="{
                    required: true, message: '常见问题不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.problemTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="问题解答" prop="problemName" :rules="{
                    required: true, message: '问题解答不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.problemName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="详情图">
                    <el-input v-model="form.problemUrl" autocomplete="off" v-if="form.problemUrl"></el-input>
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false" v-if="!form.problemUrl">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false" v-if="form.problemUrl"
                        style="margin-top: 3px">
                        <el-button slot="trigger" size="small" type="primary">替换文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                    required: true, message: '请选择所属官网', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能分类" prop="functionId" :rules="{
                    required: true, message: '请选择所属功能', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.functionId" placeholder="请选择所属功能" value-key="id"
                        style="width: 100%">
                        <el-option v-for="item in functionListCopy" :key="item.id" :label="item.functionName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="应用分类" prop="applicationCategory" :rules="{
                    required: true, message: '请选择应用分类', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.applicationCategory" placeholder="请选择应用" style="width: 100%">
                        <el-option v-for="item in acList" :key="item.id" :label="item.label"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地域分类" prop="regionCategory" :rules="{
                    required: true, message: '请选择地域分类', trigger: 'blur'
                }">
                    <el-select clearable v-model="form.regionCategory" placeholder="请选择地域" style="width: 100%">
                        <el-option v-for="item in rcList" :key="item.id" :label="item.label"
                            :value="item.id"></el-option>
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
    import { serverIp } from "../../public/config";

    export default {
        name: "User",
        data() {
            return {
                serverIp: serverIp,
                tableData: [],
                total: 0,
                pageNum: 1,
                pageSize: 10,
                username: "",
                form: {
                    id: '',
                    problemName: '',
                    problemTitle: '',
                    appWebSiteId: '',
                    problemUrl: '',
                    applicationCategory: '',
                    regionCategory: '',
                    functionId: ''
                },
                dialogFormVisible: false,
                dialogFormVisible1: false,
                multipleSelection: [],
                appList: [],
                fileList: [],
                functionList: [],
                functionListCopy: [],
                base64Img: "",
                image: "",
                itemKey: "",
                functionId: "",
                uploadProgress: 0,
                uploadData: true,
                currentId: '',
                acList: [
                    {
                        id: 0,
                        label: "web端"
                    },
                    {
                        id: 1,
                        label: "移动端"
                    }
                ],
                rcList: [
                    {
                        id: 0,
                        label: "国内"
                    },
                    {
                        id: 1,
                        label: "国外"
                    }
                ]
            }
        },
        created() {
            //请求分页查询数据
            this.load()
        },
        watch: {
            form: {
                handler: function (val) {
                    this.functionListCopy = this.functionList.filter(obj => obj.appWebSiteId == val.appWebSiteId)
                    // if (this.functionListCopy.length > 0) {
                    //     this.form.functionId = this.functionListCopy[0].id
                    // } else {
                    //     this.form.functionId = ""
                    // }

                },
                deep: true //对象的深度验证
            },
            watch: {
                username(newVal) {
                    if (newVal != undefined && newVal != "") {
                        this.pageNum = 1
                    }
                }
            }
        },
        computed: {
            selectTag() {
                return function (value) {
                    const matchedObject = this.appList.find(obj => obj.id == value);
                    return matchedObject ? matchedObject.webSiteName : '';
                }
            },
            selectTag1() {
                return function (value) {
                    const matchedObject = this.functionList.find(obj => obj.id == value);
                    return matchedObject ? matchedObject.functionName : '';
                }
            }
        },
        methods: {
            load() {
                this.request.get("/problemManage/problemList", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                }).then(res => {
                    this.itemKey = Math.random()
                    this.tableData = res.data.problemList.records
                    this.total = res.data.problemList.total

                })
                this.request.get("/appManage/appManages").then(res => {
                    this.appList = res.data.appList
                })
                this.request.get("/functionManage/functionLists").then(res => {
                    this.functionList = res.data.functionLists
                })
            },
            save() {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        if (this.base64Img) {
                            this.form["problemUrl"] = this.base64Img
                        } else {
                            this.form["problemUrl"] = this.form.problemUrl
                        }
                        this.request.post("/problemManage/saveProblem", this.form).then(res => {
                            if (res.code === '200') {
                                this.$message.success("保存成功")
                                this.dialogFormVisible = false
                                this.$refs.upload.clearFiles();
                                this.functionListCopy = []
                                if (this.username) {
                                    this.search()
                                } else {
                                    this.load()
                                }
                                this.form = {}
                                this.image = ""
                                this.base64Img = ""
                            } else {
                                this.$message.error("保存失败")
                            }
                        })
                    } else {

                    }
                })
            },
            edit() {
                this.$refs.editForm.validate(valid => {
                    if (valid) {
                        if (this.base64Img) {
                            this.uploadData = false
                            this.form["problemUrl"] = this.base64Img
                        } else {
                            this.form["problemUrl"] = this.form.problemUrl
                        }
                        this.dialogFormVisible1 = false
                        this.request.post("/problemManage/saveProblem", this.form).then(res => {
                            if (res.code === '200') {
                                this.uploadProgress = 100
                                this.uploadData = true
                                this.$message.success("保存成功")
                                this.dialogFormVisible1 = false
                                this.$refs.upload.clearFiles();
                                this.functionListCopy = []
                                if (this.username) {
                                    this.search()
                                } else {
                                    this.load()
                                }
                                this.form = {}
                                this.base64Img = ""
                                this.image = ""
                            } else {
                                this.$message.error("保存失败")
                            }
                        })
                    } else {

                    }
                })
            },
            reset() {
                this.username = ""
                this.load()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            deleteBatch() {
                let ids = this.multipleSelection.map(v => v.id)// 因为后端的是List数组 而这ids是对象数组 所以要用前端的map(v => v.id)把对象数组 [{},{},{}] 转变成纯id的数组 [1,2,3,...]
                this.request.post("/user/del/batch/", ids).then(res => {
                    if (res.code === '200') {
                        this.$message.success("批量删除成功")
                        this.load()
                    } else {
                        this.$message.error("批量删除失败")
                    }
                })
            },
            handleEdit(row) {
                this.form = JSON.parse(JSON.stringify(row))
                this.image = this.form.navigationIcon
                this.currentId = this.form.id
                this.dialogFormVisible1 = true
            },
            handleDelete(id) {
                this.request.post("/problemManage/deleteProblem", {
                    id
                }).then(res => {
                    if (res.code === '200') {
                        this.$message.success("删除成功")
                        if (this.username) {
                            this.search()
                        } else {
                            this.load()
                        }
                    } else {
                        this.$message.error("删除失败")
                    }
                })
            },
            handleAdd() {
                this.dialogFormVisible = true
                this.form = {}
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize
                if (this.username != undefined && this.username != "") {
                    this.search()
                } else {
                    this.load()
                }
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum
                if (this.username != undefined && this.username != "") {
                    this.search()
                } else {
                    this.load()
                }
            },
            async handlePreview(file) {
                this.base64Img = await this.fileToBase64(file.raw).then(res => {
                    return res
                })
            },
            handleRemove(file, fileList) {
                this.base64Img = ""
            },
            fileToBase64(file) {
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
                this.request.post("/problemManage/searchProblem", {
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
    .headerBg {
        background: #eee !important;
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