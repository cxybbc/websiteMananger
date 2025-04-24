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
            :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="序号" width="150" align="center"></el-table-column>
            <el-table-column prop="barrageTitle" label="好评弹幕标题" width="150" align="center"></el-table-column>
            <el-table-column prop="appWebSiteId" label="所属网站" width="150" align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="barrage" label="好评弹幕文本" width="150" align="center"></el-table-column>
            <el-table-column prop="barrageUrl" label="好评弹幕图片" width="150" align="center">
                <template slot-scope="scope">
                    <img v-if="scope.row.barrageUrl" :src="'//' + scope.row.barrageUrl" alt=""
                        style="width: 50px; height: 50px" />
                    <el-progress v-if="!uploadData && scope.row.id == currentId"
                        :percentage="uploadProgress"></el-progress>
                </template>
            </el-table-column>
            <el-table-column prop="sortIndex" label="好评弹幕存放点" width="150" align="center"></el-table-column>
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
        <el-dialog title="新增好评弹幕" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="addForm">
                <el-form-item label="好评弹幕标题" prop="barrageTitle" :rules="{
                    required: true, message: '弹幕标题不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.barrageTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="好评弹幕文本" prop="barrage" :rules="{
                    required: true, message: '弹幕文本不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.barrage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="好评弹幕图片">
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
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
                <el-form-item label="好评点" prop="sortIndex" :rules="{
                    required: true, message: '请分配存放点', trigger: 'blur'
                }">
                    <el-input type="number" v-model="form.sortIndex" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改好评弹幕" :visible.sync="dialogFormVisible1" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="editForm">
                <el-form-item label="好评弹幕ID" v-if="false">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="好评弹幕标题" prop="barrageTitle" :rules="{
                    required: true, message: '弹幕标题不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.barrageTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="好评弹幕文本" prop="barrage" :rules="{
                    required: true, message: '弹幕文本不能为空', trigger: 'blur'
                }">
                    <el-input v-model="form.barrage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="好评弹幕图片">
                    <el-input v-model="form.barrageUrl" autocomplete="off" v-if="form.barrageUrl"></el-input>
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false" v-if="!form.barrageUrl">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false" v-if="form.barrageUrl"
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
                <el-form-item label="好评点" prop="sortIndex" :rules="{
                    required: true, message: '请分配存放点', trigger: 'blur'
                }">
                    <el-input type="number" v-model="form.sortIndex" autocomplete="off"></el-input>
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
                itemKey: "",
                image: "",
                form: {
                    id: '',
                    barrage: '',
                    barrageTitle: '',
                    appWebSiteId: '',
                    barrageUrl: '',
                    sortIndex: ''
                },
                dialogFormVisible: false,
                dialogFormVisible1: false,
                multipleSelection: [],
                appList: [],
                fileList: [],
                base64Img: "",
                uploadProgress: 0,
                uploadData: true,
                currentId: ''
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
                return function (value) {
                    const matchedObject = this.appList.find(obj => obj.id == value);
                    return matchedObject ? matchedObject.webSiteName : '';
                }
            }
        },
        methods: {
            load() {
                this.request.get("/barrageManage/barrageList", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                }).then(res => {
                    this.itemKey = Math.random()
                    this.tableData = res.data.barrageList.records
                    this.total = res.data.barrageList.total

                })
                this.request.get("/appManage/appManages").then(res => {
                    this.appList = res.data.appList
                })
            },
            save() {
                this.$refs.addForm.validate(valid => {
                    if (valid) {
                        if (this.base64Img) {
                            this.form["barrageUrl"] = this.base64Img
                        } else {
                            this.form["barrageUrl"] = this.form.barrageUrl
                        }
                        this.request.post("/barrageManage/saveBarrage", this.form).then(res => {
                            if (res.code === '200') {
                                this.$message.success("保存成功")
                                this.dialogFormVisible = false
                                this.$refs.upload.clearFiles();
                                this.form = {}
                                if (this.username) {
                                    this.search()
                                } else {
                                    this.load()
                                }
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
                            this.form["barrageUrl"] = this.base64Img
                        } else {
                            this.form["barrageUrl"] = this.form.barrageUrl
                        }
                        this.dialogFormVisible1 = false
                        this.request.post("/barrageManage/saveBarrage", this.form).then(res => {
                            if (res.code === '200') {
                                this.uploadProgress = 100
                                this.uploadData = true
                                this.$message.success("保存成功")
                                this.dialogFormVisible1 = false
                                this.$refs.upload.clearFiles();
                                this.form = {}
                                if (this.username) {
                                    this.search()
                                } else {
                                    this.load()
                                }
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
            reset() {
                this.username = ""
                this.pageNum = 1
                this.load()
            },
            handleSelectionChange(val) {//删除确认提醒框
                this.multipleSelection = val
            },
            deleteBatch() {
                let ids = this.multipleSelection.map(v => v.id)// 因为后端的是List数组 而这ids是对象数组 所以要用前端的map(v => v.id)把对象数组 [{},{},{}] 转变成纯id的数组 [1,2,3,...]
                this.request.post("/user/del/batch/", ids).then(res => {
                    if (res.code === '200') {
                        this.$message.success("批量删除成功")
                        if (this.username) {
                            this.search()
                        } else {
                            this.load()
                        }
                    } else {
                        this.$message.error("批量删除失败")
                    }
                })
            },
            handleEdit(row) {
                this.form = JSON.parse(JSON.stringify(row))
                this.currentId = this.form.id
                this.image = this.form.barrageUrl
                this.dialogFormVisible1 = true
            },
            handleDelete(id) {
                this.request.post("/barrageManage/deleteBarrage", {
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
                this.request.post("/barrageManage/searchBarrage", {
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