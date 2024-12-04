<template>
    <div v-loading="isloading">
        <el-dialog title="新闻编辑" :visible.sync="dialogVisible" width="50%" :before-close="closeDialog" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="应用站点">
                    <el-select v-model="form.appWebsiteId" filterable placeholder="请选择">
                        <el-option v-for="item in websiteList" :key="item.id" :label="item.webSiteName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="新闻标题">
                    <el-input v-model="form.title" placeholder="请输入新闻标题"></el-input>
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-radio-group v-model="form.isTop">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="新闻封面">
                    <el-upload class="upload-demo" :http-request="uploadCover" action="" :on-remove="removeFile" :on-change="beforeUpload" accept=".jpeg,.png,.jpg,.bmp,.gif" :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="新闻内容">
                    <div class="editor_container">
                        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
                        <Editor v-model="form.text" ref="EditorRef" :defaultConfig="editorConfig" style="height: 500px; overflow-y: hidden; border: 1px solid #eee" @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus" @onBlur="handleBlur" />
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
export default defineComponent({
    name: 'EditorNew',

    props: {
        isShow: Boolean,
        newDetailInfo: {},
        isloading: Boolean
    },
    data() {
        return {
            form: {
                id: '', //新闻id
                appWebsiteId: '', //应用站点
                title: '', //标题
                text: '', //新闻内容
                cover: '', //封面图
                isTop: '' //是否指定置顶
            },
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
        }
    },

    watch: {
        newDetailInfo: {
            handler(val) {
                if (val.id) {
                    this.form = this.newDetailInfo
                } else {
                    for (let key in this.form) {
                        this.form[key] = ''
                    }
                }
            },
            deep: true
        }
    },

    methods: {
        closeDialog() {
            this.$emit('refresh')
        },

        async uploadNewInfo() {
            try {
                const params = JSON.parse(JSON.stringify(this.form))
                if (params.id) {
                    console.log('修改参数', params)
                    const res = await request.post('/news/updateNewInfo', params)
                    console.log('修改新闻', res)
                    if (res.code == 200) {
                        this.$message.success('修改成功')
                        this.closeDialog()
                    } else {
                        this.$message.error('修改失败')
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
                        this.$message.error('新增失败')
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
        handleDestroyed(editor) {},
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
</style>
