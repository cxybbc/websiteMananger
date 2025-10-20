<template>
    <div v-loading="isloading">
        <el-dialog title="新闻编辑" :visible.sync="dialogVisible" width="30%" :before-close="closeDialog"
            :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="已绑定其他应用站点">
                    <el-select v-model="form.appWebsiteIds" multiple filterable placeholder="请选择">
                        <el-option v-for="item in websiteList" :key="item.id" :label="item.webSiteName" :value="item.id"
                            :disabled="disabledOption(item)"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="已应用站点">
                    <el-select v-model="form.oldAppWebsiteIds" multiple disabled filterable>
                        <el-option v-for="item in websiteList" :key="item.id" :label="item.webSiteName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="新闻标题">
                    <el-input v-model="form.title" placeholder="请输入新闻标题"></el-input>
                </el-form-item>
                <el-form-item label="新闻路由地址">
                    <el-input v-model="form.textMeaning" placeholder="请输入新闻路由地址"></el-input>
                </el-form-item>
                <el-form-item label="新闻描述">
                    <el-input v-model="form.description" placeholder="请输入新闻描述"></el-input>
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-radio-group v-model="form.isTop">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="新闻封面">
                    <el-upload class="upload-demo" :http-request="uploadCover" action="" :on-remove="removeFile"
                        :on-change="beforeUpload" accept=".jpeg,.png,.jpg,.bmp,.gif" :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                    <div v-if="this.form.cover">
                        <p style="color: aqua; font-size: 12px">已上传图片</p>
                        <img style="width: 100px; height: auto" :src="this.form.cover" alt="" />
                    </div>
                </el-form-item>
                <el-form-item label="新闻一级分类">
                    <el-select v-model="parentGroupId" filterable placeholder="请选择" @change="initChildGroup">
                        <el-option v-for="item in groupList" :key="item.id" :label="item.classificationName"
                            :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="新闻二级分类">
                    <el-select v-model="childGroupId" filterable placeholder="请选择">
                        <el-option v-for="item in childGroupList" :key="item.id" :label="item.classificationName"
                            :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="浏览量">
                    <el-input-number v-model="form.views"></el-input-number>
                </el-form-item>
                <el-form-item label="版权声明">
                    <el-input v-model="form.versionNotice"></el-input>
                </el-form-item>
                <el-form-item label="文章目录">
                    <p v-for="(item, index) in form.directory" :key="index">
                        <el-input v-model="item.title" placeholder="请输入目录"></el-input>
                    </p>
                    <p>
                        <el-button type="primary" @click="addDirectory">添加目录</el-button>
                    </p>
                </el-form-item>
                <el-form-item label="发布时间">

                    <el-date-picker v-model="form.newsTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="新闻内容">
                    <div class="editor_container">
                        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
                        <Editor v-model="form.text" ref="EditorRef" :defaultConfig="editorConfig"
                            style="height: 500px; overflow-y: hidden; border: 1px solid #eee" @onCreated="handleCreated"
                            @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus"
                            @onBlur="handleBlur" />
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="uploadNewInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
    import request from '@/utils/request'
    import dayjs from 'dayjs'
    export default defineComponent({
        name: 'EditorNew',

        props: {
            isShow: Boolean,
            newDetailInfo: {},
            isloading: Boolean,
            groupList: Array,
        },
        data() {
            return {
                parentGroupId: '', //一级分类id
                childGroupId: '', //二级分类id

                form: {
                    id: '', //新闻id
                    appWebsiteIds: [], //应用站点
                    oldAppWebsiteIds: [], //应用站点
                    title: '', //标题
                    textMeaning: '', //新闻路由地址
                    text: '', //新闻内容
                    cover: '', //封面图
                    isTop: '', //是否指定置顶
                    classificationId: '', //分类id
                    views: '', //浏览量
                    newsTime: '', //发布时间，
                    versionNotice: '', //版权声明
                    description: '',//新闻描述
                    directory: [
                        {
                            title: '',
                        }
                    ], //目录
                },
                currentId: '',
                fileList: [],
                editorRef: null,
                toolbarConfig: {
                    mode: 'simple'
                },
                editorConfig: {
                    placeholder: '请输入内容',
                    MENU_CONF: {}
                }
            }
        },

        computed: {
            dialogVisible() {
                return this.isShow
            },
            websiteList() {
                return this.$store.state.webSiteList
            },
            childGroupList() {
                return this.groupList.find(item => item.id == this.parentGroupId)?.children
            }
        },

        watch: {
            newDetailInfo: {
                handler(val) {
                    this.fileList = []
                    if (val.id) {
                        const copyData = JSON.parse(JSON.stringify(val))
                        console.log('copyData', copyData)
                        for (let key in this.form) {
                            if (key === 'appWebsiteIds') {
                                this.currentId = copyData.appWebsiteId
                                if (copyData.appWebsiteIdList.length) {
                                    copyData.appWebsiteIdList.forEach(element => {
                                        this.form['appWebsiteIds'].push(element.appWebsiteId)
                                    })
                                }
                            } else if (key === 'oldAppWebsiteIds') {
                                if (copyData.appWebsiteIdList.length) {
                                    copyData.appWebsiteIdList.forEach(element => {
                                        this.form['oldAppWebsiteIds'].push(element.appWebsiteId)
                                    })
                                }
                            } else if (key === 'directory') {
                                if (copyData.directory) {
                                    const directory = JSON.parse(copyData.directory)
                                    if (directory.length) {
                                        this.form['directory'] = directory.map(item => ({ title: item }))
                                    }
                                }
                            } else if (key === 'classificationId') {
                                if (copyData.newClassificationInfo) {
                                    if (copyData.newClassificationInfo.supClassificationId === 0) {
                                        this.parentGroupId = copyData.newClassificationInfo.id
                                    } else {
                                        this.parentGroupId = copyData.newClassificationInfo.supClassificationId
                                        this.childGroupId = copyData.newClassificationInfo.id
                                    }
                                }
                            }
                            else {
                                this.form[key] = copyData[key]
                            }
                        }
                    } else {
                        for (let key in this.form) {
                            this.form[key] = ''
                            this.form.appWebsiteIds = []
                            this.form.oldAppWebsiteIds = []
                            this.parentGroupId = ''
                            this.childGroupId = ''
                            this.form.directory = [
                                {
                                    title: '',
                                }
                            ]
                        }
                    }
                },
                deep: true
            }
        },

        methods: {

            initChildGroup() {


                this.childGroupId = ''
            }
            , addDirectory() {
                console.log('res', this.form.directory);
                this.form.directory.push({ title: '' })
            },
            disabledOption(item) {
                if (item.id == this.currentId) {
                    return true
                } else {
                    return false
                }
            },
            closeDialog() {
                this.currentId = ''
                this.$emit('refresh')
            },

            async uploadNewInfo() {
                try {
                    const params = JSON.parse(JSON.stringify(this.form))
                    if (!params.textMeaning) {
                        this.$message.error('请输入新闻路由地址')
                        return
                    }
                    if (params.newsTime) {
                        params.newsTime = dayjs(params.newsTime).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (params.directory.length) {
                        params.directory = JSON.stringify(params.directory.map(item => item.title))
                    }
                    if (this.parentGroupId && !this.childGroupId && this.childGroupList.length) {
                        this.$message.error('请选择二级分类')
                        return
                    }
                    if (this.parentGroupId) {
                        params.classificationId = this.parentGroupId
                    }
                    if (this.childGroupId) {
                        params.classificationId = this.childGroupId
                    }
                    if (params.id) {
                        console.log('修改参数', params)
                        const res = await request.post('/news/updateNewInfo', params)
                        console.log('修改新闻', res)
                        if (res.code == 200) {
                            this.$message.success('修改成功')
                            this.closeDialog()
                        } else {
                            this.$message.error(res.msg)
                        }
                    } else {
                        delete params.id


                        console.log('参数', params)
                        const res = await request.post('/news/saveNewInfo', params)

                        console.log('新增res', res)
                        if (res.code == 200) {
                            this.$message.success('新增成功')
                            this.closeDialog()
                        } else {
                            this.$message.error(res.msg)
                        }
                    }

                } catch (err) {
                    console.log('失败', err)
                }
            },
            handleCreated(editor) {
                this.editorRef = Object.seal(editor)
            },
            handleChange(editor) {
                const htmlContent = editor.getHtml()
                console.log('输入', htmlContent)
            },
            handleDestroyed(editor) { },
            handleFocus(editor) {
                console.log('获取焦点')
            },
            handleBlur(editor) {
                console.log('失去焦点')
            },
            beforeUpload(file, fileList) {
                if (fileList.length > 1) {
                    this.fileList = [fileList[fileList.length - 1]] // 保留最后一个选中的文件
                }
            },
            removeFile() {
                this.form.cover = ''
            },
            async uploadCover(file) {
                console.log(file.file)
                try {
                    const formData = new FormData()
                    formData.append('file', file.file)
                    const res = await request.post('/news/uploadFile', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    console.log('res', res)
                    if (res.code == 200) {
                        this.form.cover = '//' + res.data.url
                        this.$message.success('上传成功')
                    } else {
                        this.$message.error('上传失败')
                        this.form.cover = ''
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        },

        components: { Editor, Toolbar },
        mounted() {
            this.editorConfig.MENU_CONF['uploadImage'] = {
                async customUpload(file, insertFn) {
                    const formData = new FormData()
                    formData.append('file', file)
                    try {
                        const res = await request.post('/news/uploadFile', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                token: localStorage.getItem('user').token
                            }
                        })
                        console.log('上传图片', res)
                        if (res.code == 200) {
                            const url = '//' + res.data.url
                            insertFn(url)
                            this.$message.success('上传成功')
                        } else {
                            this.$message.error('上传失败')
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        }
    })
</script>

<style lang="less" scoped>
    @import '@wangeditor/editor/dist/css/style.css';

    .disabledOption {
        // :deep() ;
    }
</style>
