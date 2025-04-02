<template>
    <div>
        <div style="padding: 10px 0; text-align: right">
            <!-- <el-input style="width: 500px" placeholder="请输入官网名称" suffix-icon="el-icon-search" v-model="username"></el-input> -->
            <el-select clearable v-model="username" placeholder="请选择官网" style="width: 400px">
                <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName"
                    :value="item.id"></el-option>
            </el-select>
            <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
        </div>
        <div style="padding: 10px 0">
            <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
            <el-button type="primary" @click="templateAddEn" style="text-align: right">表格国外模板图片<i
                    class="el-icon-circle-plus-outline"></i></el-button>
            <el-button type="primary" @click="templateAddZh" style="text-align: right">表格国内模板图片<i
                    class="el-icon-circle-plus-outline"></i></el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" :key="itemKey" border stripe
            :header-cell-class-name="'headerBg'" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="序号" width="150" align="center"></el-table-column>
            <el-table-column prop="bannerTitle" label="轮播图标题" width="150" align="center"></el-table-column>
            <el-table-column prop="appWebSiteId" label="所属网站" width="150" align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{
                        selectTag(scope.row.appWebSiteId)
                        }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="bannerText" label="轮播图文本" width="150" align="center"></el-table-column>
            <el-table-column label="轮播图" width="150" align="center">
                <template slot-scope="scope">
                    <img :src="'//' + scope.row.bannerAvaurl" alt="" style="width: 100px; height: 100px" />
                    <el-progress v-if="!uploadData && scope.row.id == currentId"
                        :percentage="uploadProgress"></el-progress>
                </template>
            </el-table-column>
            <el-table-column prop="bannerTime" label="轮播时长(秒)" width="150" align="center"></el-table-column>
            <el-table-column prop="sortIndex" label="轮播点" width="150" align="center"></el-table-column>
            <el-table-column prop="bannerUrl" label="跳转链接" width="150" align="center"></el-table-column>
            <el-table-column prop="operation" label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleView(scope.row)">查看 <i class="el-icon-edit"></i></el-button>

                    <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
                    <el-popconfirm class="ml-5" confirm-button-text="好的" cancel-button-text="我在想想" icon="el-icon-info"
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
        <el-dialog title="新增轮播图信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="addForm">
                <el-form-item label="轮播图标题" prop="bannerTitle" :rules="{
                    required: true,
                    message: '请填写轮播图标题',
                    trigger: 'blur',
                }">
                    <el-input v-model="form.bannerTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播图文本" prop="bannerText" :rules="{
                    required: true,
                    message: '请填写轮播图文本',
                    trigger: 'blur',
                }">
                    <el-input v-model="form.bannerText" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                    <!-- <el-input v-model="form.bannerAvaurl" autocomplete="off"></el-input> -->
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                    required: true,
                    message: '请选择所属官网',
                    trigger: 'blur',
                }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="轮播时长" prop="bannerTime" :rules="{
                    required: true,
                    message: '请输入轮播时长',
                    trigger: 'blur',
                }">
                    <el-input v-model="form.bannerTime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播点" prop="sortIndex" :rules="{
                    required: true,
                    message: '请分配默认的轮播点',
                    trigger: 'blur',
                }">
                    <el-input type="number" v-model="form.sortIndex" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" prop="bannerUrl">
                    <el-input v-model="form.bannerUrl" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改轮播图信息" :visible.sync="dialogFormVisible1" width="30%">
            <el-form label-width="80px" size="small" :model="form" ref="editForm">
                <el-form-item label="轮播图ID" v-if="false">
                    <el-input v-model="form.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播图标题" prop="bannerTitle" :rules="{
                    required: true,
                    message: '轮播图标题不能为空',
                    trigger: 'blur',
                }">
                    <el-input v-model="form.bannerTitle" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播图文本" prop="bannerText" :rules="{
                    required: true,
                    message: '轮播图文本不能为空',
                    trigger: 'blur',
                }">
                    <el-input v-model="form.bannerText" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播图">
                    <el-input v-model="form.bannerAvaurl" autocomplete="off" v-if="form.bannerAvaurl"></el-input>
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false" v-if="!form.bannerAvaurl">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                    <el-upload class="upload-demo" ref="upload" action="action" :on-change="handlePreview"
                        :on-remove="handleRemove" :limit="1" :auto-upload="false" v-if="form.bannerAvaurl"
                        style="margin-top: 3px">
                        <el-button slot="trigger" size="small" type="primary">替换文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                    required: true,
                    message: '请选择所属官网',
                    trigger: 'blur',
                }">
                    <el-select clearable v-model="form.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                        <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="轮播时长" prop="bannerTime" :rules="{
                    required: true,
                    message: '请默认分配轮播时长',
                    trigger: 'blur',
                }">
                    <el-input v-model="form.bannerTime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="轮播存放点" prop="sortIndex" :rules="{
                    required: true,
                    message: '请分配默认存放点',
                    trigger: 'blur',
                }">
                    <el-input type="number" v-model="form.sortIndex" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" prop="bannerUrl">
                    <el-input v-model="form.bannerUrl" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="表格模板图片" :visible.sync="templateDialog">
            <el-dialog width="30%" title="官网绑定" :visible.sync="innerVisible" append-to-body>
                <el-form label-width="80px" size="small" :model="mustForm" ref="mustForm">
                    <el-form-item label="所属官网" prop="appWebSiteId" :rules="{
                        required: true,
                        message: '请选择所属官网',
                        trigger: 'blur',
                    }">
                        <el-select clearable v-model="mustForm.appWebSiteId" placeholder="请选择官网" style="width: 100%">
                            <el-option v-for="item in appList" :key="item.id" :label="item.webSiteName"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="轮播时长" prop="bannerTime" :rules="{
                        required: true,
                        message: '请默认分配轮播时长',
                        trigger: 'blur',
                    }">
                        <el-input v-model="mustForm.bannerTime" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="轮播存放点" prop="sortIndex" :rules="{
                        required: true,
                        message: '请分配默认存放点',
                        trigger: 'blur',
                    }">
                        <el-input type="number" v-model="mustForm.sortIndex" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地域选择" prop="webMark" :rules="{
                        required: true,
                        message: '请默认分配轮播时长',
                        trigger: 'blur',
                    }">
                        <el-select v-model="mustForm.webMark" placeholder="请选择">
                            <el-option label="国内" value="zh"></el-option>
                            <el-option label="国外" value="en"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisibleClose">取 消</el-button>
                    <el-button type="primary" @click="innerVisibleAdd">确 定</el-button>
                </div>
            </el-dialog>
            <div class="inputDeep">
                <el-input v-model="formUrlText" placeholder="请输入需要检索的图片前缀名称"></el-input>
            </div>
            <div class="imgList">
                <div class="img-item" v-for="(item, index) in formUrlList" :class="{ active: item.bOn }" :key="index"
                    @click="checkImg(index)">
                    <p style="
              margin-bottom: 5px;
              text-align: center;
              font-weight: bold;
              font-size: 14px;
            ">
                        {{ item.name }}
                    </p>
                    <img :src="item.url" alt="" />
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formUrlClose">取 消</el-button>
                <el-button type="primary" @click="formUrlAdd">确 定</el-button>
            </div>
        </el-dialog>


        <!-- 轮播图详情数据 -->
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="轮播图详情数据"
            :visible.sync="isBannerPreview" width="80%">
            <div class="preview_content" style="height: 500px; overflow-y: auto">
                <p>可拖动进行轮播图排序</p>
                <draggable v-model="bannerDataList" @end="onDragEnd" :animation="200" ghost-class="dragging">
                    <div v-for="(item, index) in bannerDataList" :key="index" class="item-card"
                        style="position: relative; width: 100px; text-align: center; margin: 10px; display: inline-block">
                        <!-- 图片 -->
                        <img :src="'//' + item.bannerAvaurl" :alt="item.name"
                            style="width: 100px; height: 100px; border-radius: 5px" />
                        <!-- 名称 -->
                        <div style="margin-top: 5px">{{ item.bannerTitle }}</div>
                    </div>
                </draggable>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { serverIp } from "../../public/config";
import draggable from 'vuedraggable'
export default {
    name: "User",
    data() {
        return {
            serverIp: serverIp,
            tableData: [],
            total: 0,
            pageNum: 1,
            pageSize: 10,
            // integration: "",
            username: "",
            form: {
                id: "",
                bannerTitle: "",
                bannerText: "",
                bannerAvaurl: "",
                appWebsiteId: "",
                bannerTime: "",
                sortIndex: "",
                banneUrl: "",
            },
            dialogFormVisible: false,
            dialogFormVisible1: false,
            isBannerPreview: false,
            bannerDataList: [],
            multipleSelection: [],
            appList: [],
            fileList: [],
            base64Img: "",
            itemKey: "",
            image: "",
            uploadProgress: 0,
            uploadData: true,
            currentId: "",
            templateDialog: false,
            formUrlList: [],
            formUrlText: "",
            mustForm: {
                appWebSiteId: "",
                bannerTime: "",
                sortIndex: "",
                webMark: "",
            },
            innerVisible: false,
            webMark: "",
        };
    },
    watch: {
        formUrlText(newVal) {
            if (newVal != undefined && newVal != "") {
                this.request
                    .post("/ossImage/searchImageUrlList", {
                        webMark: this.webMark,
                        likeName: newVal,
                    })
                    .then((res) => {
                        if (res.code == 200) {
                            this.formUrlList = [];
                            res.data.urlList.forEach((element) => {
                                let map = {};
                                map["name"] = element.split("/")[5];
                                map["url"] = element;
                                this.formUrlList.push(map);
                            });
                        } else {
                            this.$message.error("获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                this.request
                    .post("/ossImage/ImageUrlList", {
                        webMark: this.webMark,
                    })
                    .then((res) => {
                        if (res.code == 200) {
                            this.formUrlList = [];
                            res.data.urlList.forEach((element) => {
                                let map = {};
                                map["name"] = element.split("/")[5];
                                map["url"] = element;
                                this.formUrlList.push(map);
                            });
                        } else {
                            this.$message.error("获取失败");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        username(newVal) {
            if (newVal != undefined && newVal != "") {
                this.pageNum = 1;
            }
        },
    },
    created() {
        //请求分页查询数据
        this.load();
    },
    computed: {
        selectTag() {
            return function (value) {
                const matchedObject = this.appList.find((obj) => obj.id == value);
                return matchedObject ? matchedObject.webSiteName : "";
            };
        },
    },
    mounted() {
        this.formUrlList.map(function (value) {
            value.bOn = false;
        });
    },
    methods: {
        load() {
            this.request
                .get("/bannerManage/bannerList", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                })
                .then((res) => {
                    this.itemKey = Math.random();
                    this.tableData = res.data.bannerList.records;
                    this.total = res.data.bannerList.total;
                });
            this.request.get("/appManage/appManages").then((res) => {
                this.appList = res.data.appList;
            });
        },
        save() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    if (this.base64Img) {
                        this.form["bannerAvaurl"] = this.base64Img;
                    } else {
                        this.form["bannerAvaurl"] = this.form.bannerAvaurl;
                    }
                    this.request
                        .post("/bannerManage/saveBanner", this.form)
                        .then((res) => {
                            if (res.code === "200") {
                                this.$message.success("保存成功");
                                this.dialogFormVisible = false;
                                this.$refs.upload.clearFiles();
                                this.form = {};
                                this.load();
                                this.image = "";
                                this.base64Img = "";
                            } else {
                                this.$message.error("保存失败");
                            }
                        });
                } else {
                }
            });
        },
        edit() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    if (this.base64Img) {
                        this.uploadData = false;
                        this.form["bannerAvaurl"] = this.base64Img;
                    } else {
                        this.form["bannerAvaurl"] = this.form.bannerAvaurl;
                    }
                    this.dialogFormVisible1 = false;

                    this.request
                        .post("/bannerManage/saveBanner", this.form, {
                            onUploadProgress: (progressEvent) => {
                                this.uploadProgress = Number(
                                    ((progressEvent.loaded / progressEvent.total) * 90).toFixed(2)
                                );
                            },
                        })
                        .then((res) => {
                            if (res.code === "200") {
                                this.uploadProgress = 100;
                                this.uploadData = true;
                                this.$message.success("保存成功");
                                this.dialogFormVisible1 = false;
                                this.form = {};
                                this.load();
                                this.$refs.upload.clearFiles();
                                this.image = "";
                                this.base64Img = "";
                            } else {
                                this.$message.error("保存失败");
                            }
                        });
                } else {
                }
            });
        },
        reset() {
            this.username = "";
            this.load();
        },

        //查看当前轮播数据
        handleView(row) {
            const params = {
                appWebSiteId: row.appWebSiteId,
                sortIndex: row.sortIndex,
            }
            console.log('参数', params);
            this.request.get("/bannerManage/selectClassification", { params }).then((res) => {
                console.log(res);
                if (res.code == 200) {
                    this.isBannerPreview = true;
                    this.bannerDataList = res.data.classificationList;
                }

            })
        },

        //轮播图拖动排序
        onDragEnd() {
            this.bannerDataList.forEach((item, index) => {
                item.sortIndex = index + 1;
            });
            console.log('排序后', this.bannerDataList);
            const relations = this.bannerDataList.map(item => ({
                id: item.id,                // 获取 id
                moveSortIndex: item.sortIndex // 获取排序索引
            }));
            console.log('relations', relations);
            const requestData = {
                relations: relations
            };



            this.request.post('/bannerManage/moveBanner', requestData).then((res) => {
                console.log(res);
                if (res.code == 200) {
                    this.$message.success('排序成功');
                    this.isBannerPreview = false;
                    this.load();
                } else {
                    this.$message.error('排序失败');
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleSelectionChange(val) {
            //删除确认提醒框
            val;
            this.multipleSelection = val;
        },
        deleteBatch() {
            let ids = this.multipleSelection.map((v) => v.id); // 因为后端的是List数组 而这ids是对象数组 所以要用前端的map(v => v.id)把对象数组 [{},{},{}] 转变成纯id的数组 [1,2,3,...]
            this.request.post("/user/del/batch/", ids).then((res) => {
                if (res.code === "200") {
                    this.$message.success("批量删除成功");
                    console.log(this.username);
                    if (this.username) {
                        this.search();
                    } else {
                        this.load();
                    }
                } else {
                    this.$message.error("批量删除失败");
                }
            });
        },
        handleEdit(row) {
            this.form = JSON.parse(JSON.stringify(row));
            this.currentId = this.form.id;
            this.image = this.form.bannerAvaurl;
            this.dialogFormVisible1 = true;
        },
        handleDelete(id) {
            this.request
                .post("/bannerManage/deleteBanner", {
                    id,
                })
                .then((res) => {
                    if (res.code === "200") {
                        this.$message.success("删除成功");
                        this.load();
                    } else {
                        this.$message.error("删除失败");
                    }
                });
        },
        handleAdd() {
            this.dialogFormVisible = true;
            this.form = {};
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            if (this.username != undefined && this.username != "") {
                this.search();
            } else {
                this.load();
            }
        },
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum;
            if (this.username != undefined && this.username != "") {
                this.search();
            } else {
                this.load();
            }
        },
        async handlePreview(file) {
            this.base64Img = await this.fileToBase64(file.raw).then((res) => {
                return res;
            });
        },
        handleRemove(file, fileList) {
            this.base64Img = "";
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
            });
        },
        search() {
            this.request
                .post("/bannerManage/searchBanner", {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    appWebSiteId: this.username,
                })
                .then((res) => {
                    this.tableData = res.data.searchData.records;
                    this.total = res.data.searchData.total;
                });
            this.request.get("/appManage/appManages").then((res) => {
                this.appList = res.data.appList;
            });
        },
        formUrlAdd() {
            // this.templateDialog = false
            this.innerVisible = true;
        },
        formUrlClose() {
            this.templateDialog = false;
            this.formUrlList = [];
            this.formUrlText = "";
            this.webMark = "";
        },
        templateAddEn() {
            this.webMark = "en";
            this.templateDialog = true;
            this.request
                .post("/ossImage/ImageUrlList", {
                    webMark: this.webMark,
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.formUrlList = [];
                        res.data.urlList.forEach((element) => {
                            let map = {};
                            map["name"] = element.split("/")[5];
                            map["url"] = element;
                            map["bOn"] = false;
                            this.formUrlList.push(map);
                        });
                    } else {
                        this.$message.error("获取失败");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        templateAddZh() {
            this.webMark = "zh";
            this.templateDialog = true;
            this.request
                .post("/ossImage/ImageUrlList", {
                    webMark: "zh",
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.formUrlList = [];
                        res.data.urlList.forEach((element) => {
                            let map = {};
                            map["name"] = element.split("/")[5];
                            map["url"] = element;
                            map["bOn"] = false;
                            this.formUrlList.push(map);
                        });
                    } else {
                        this.$message.error("获取失败");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        checkImg(index) {
            const temp = this.formUrlList[index];
            temp.bOn = !this.formUrlList[index].bOn;
            this.$set(this.formUrlList, index, temp);
        },
        innerVisibleAdd() {
            this.$refs.mustForm.validate((valid) => {
                if (valid) {
                    let urlList = [];
                    this.formUrlList.forEach((obj) => {
                        if (obj.bOn) {
                            urlList.push(obj.name);
                        }
                    });
                    this.$set(this.mustForm, "bannerUrls", urlList);
                    this.request
                        .post("/bannerManage/saveBanners", this.mustForm)
                        .then((res) => {
                            if (res.code == 200) {
                                this.$message.success("保存成功");
                                this.innerVisible = false;
                                this.templateDialog = false;
                                this.$refs.upload.clearFiles();
                                this.mustForm = {};
                                this.webMark = "";
                                this.load();
                            } else {
                                this.$message.error("保存失败");
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                }
            });
        },
        innerVisibleClose() {
            this.innerVisible = false;
            this.webMark = "";
            this.mustForm = {};
        },
    },
    components: {
        draggable
    }
};
</script>

<style lang="less">
.headerBg {
    background: #eee !important;
}

.el-form-item__label {
    width: 100px !important;
}

.el-form-item__content {
    margin-left: 100px !important;
}

.imgList {
    width: 100%;
    margin: 20px 0;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;

    .active {
        display: block;
        width: 196px;
        height: 196px;
        line-height: 0;
        font-size: 0;
        vertical-align: middle;
        border: 3px solid #2b89fd;
        -webkit-transform: rotate(0deg);
    }

    .active::before {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        border: 12px solid #2b89fd;
        border-top-color: transparent;
        border-left-color: transparent;
    }

    .active::after {
        content: "";
        display: block;
        width: 5px;
        height: 10px;
        position: absolute;
        right: 4px;
        bottom: 5px;
        border: 1px solid #fff;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: rotate(45deg);
        cursor: pointer;
    }

    .img-item {
        width: 196px;
        height: 230px;
        overflow: hidden;
        background-color: #ffffff;
        margin: 20px;
        cursor: pointer;
        display: flex;
        /* 使用flex布局 */
        flex-direction: column;
        justify-content: center;
        /* 水平居中 */
        align-items: center;

        /* 垂直居中 */
        img {
            height: 196px;
        }
    }
}

.inputDeep .el-input__inner {
    border: none;
}
</style>