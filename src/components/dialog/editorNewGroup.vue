<template>
    <div v-loading="isloading">
        <el-dialog title="新闻分类" :visible.sync="dialogVisible" width="500px" :before-close="closeDialog"
            :close-on-click-modal="false">



            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="分类层级">
                    <el-radio-group v-model="type">
                        <el-radio :label="1">一级分类</el-radio>
                        <el-radio :label="2">二级分类</el-radio>

                    </el-radio-group>
                </el-form-item>
                <el-form-item label="应用官网">
                    <el-select v-model="form.appWebsiteId" filterable placeholder="请选择">
                        <el-option v-for="item in websiteList" :key="item.id" :label="item.webSiteName"
                            :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="一级分类" v-if="type == 2">
                    <el-select v-model="form.supClassificationId" filterable placeholder="请选择">
                        <el-option v-for="item in groupList" :key="item.id" :label="item.classificationName"
                            :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称" prop="classificationName">
                    <el-input v-model="form.classificationName" placeholder="请输入内容"></el-input>
                </el-form-item>
                <!-- <el-form-item label="分类国际化" prop="language">
                    <el-select v-model="form.language" filterable placeholder="请选择语言标识">
                        <el-option label="中文" value="zh"></el-option>
                        <el-option label="英文" value="en"></el-option>
                        <el-option label="西班牙语" value="es"></el-option>
                        <el-option label="中文繁体" value="zhTW"></el-option>
                        <el-option label="日本語" value="ja"></el-option>
                        <el-option label="泰语" value="th"></el-option>
                        <el-option label="俄语" value="ru"></el-option>
                        <el-option label="欧洲葡萄牙语" value="ptPT"></el-option>
                        <el-option label="巴西葡萄牙语" value="ptBR"></el-option>
                    </el-select>
                </el-form-item> -->


                <el-form-item label="未激活图标" prop="classificationAvaurl">
                    <el-upload class="upload-demo" action="#" :on-change="handlePreview" :auto-upload="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="激活图标" prop="activationClassificationAvaurl">
                    <el-upload class="upload-demo" action="#" :on-change="handleUnactive" :auto-upload="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="uploadNewGroup">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'

    import request from '@/utils/request'
    export default defineComponent({
        name: 'EditorNewGroup',

        props: {
            isShow: Boolean,
            newDetailInfo: {},
            isloading: Boolean,
            groupList: Array,
        },
        data() {
            return {
                type: 1,
                form: {
                    id: '', //新闻id

                    classificationName: '',
                    classificationAvaurl: '',
                    activationClassificationAvaurl: '',
                    supClassificationId: '',
                    supClassificationName: '',
                    // language: '',
                    appWebsiteId: ''
                },

            }
        },

        computed: {
            dialogVisible() {
                return this.isShow
            },
            websiteList() {
                return this.$store.state.webSiteList
            }
        },

        watch: {
            type(newVal, oldVal) {
                if (newVal == 1) {
                    this.form.supClassificationId = ''
                    this.form.supClassificationName = ''
                }
            }
        },

        methods: {
            resetForm() {
                this.form = {
                    id: '',
                    classificationName: '',
                    classificationAvaurl: '',
                    supClassificationId: '',
                    supClassificationName: ''
                }
                this.type = 1
            },
            closeDialog() {
                this.$emit('refresh')
            },
            async uploadNewGroup() {
                console.log('确定');
                try {
                    const params = JSON.parse(JSON.stringify(this.form))

                    console.log('params', params);
                    if (this.type == 2) {
                        params.supClassificationName = this.groupList.find(item => item.id == params.supClassificationId).classificationName
                    }
                    const res = await request.post('/newsClassification/save',
                        params
                    )
                    console.log('保存结果', res);
                    if (res.code == 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                        })
                        this.resetForm()
                        this.closeDialog()
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        })
                    }
                } catch (err) {
                    console.log('保存失败', err);
                }

            },
            async handlePreview(file) {
                this.form.classificationAvaurl = await this.fileToBase64(file.raw).then((res) => {
                    return res;
                });
            },
            async handleUnactive(file) {
                this.form.activationClassificationAvaurl = await this.fileToBase64(file.raw).then((res) => {
                    return res;
                });
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



        },


        mounted() {

        }
    })
</script>

<style lang="less" scoped></style>
