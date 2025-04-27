<template>
    <div>
        <el-dialog title="版权申明编辑" :visible.sync="dialogVisible" width="50%" :before-close="hideBox"
            :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="官网">
                    <el-select v-model="form.appWebsiteId" filterable placeholder="请选择" @change="getRightInfo">
                        <el-option v-for="item in websiteList" :key="item.id" :label="item.webSiteName"
                            :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版权申明">
                    <el-input type="textarea" v-model="form.versionNotice"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="hideBox">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import request from '@/utils/request'
    import dayjs from 'dayjs'
    export default defineComponent({
        name: 'EditorNewRight',

        props: {
            isShow: Boolean,
        },
        data() {
            return {
                form: {
                    appWebsiteId: '',
                    versionNotice: ''
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
        },

        watch: {
            dialogVisible(newVal, oldVal) {
                if (newVal) {

                }
            }
        },

        methods: {
            async getRightInfo() {


                try {
                    const res = await request.get('/news/getVersionNotice', {
                        params: {
                            appWebsiteId: this.form.appWebsiteId
                        }
                    })

                    if (res.code == 200) {
                        this.form.versionNotice = res.data.versionNotice
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        })
                    }
                } catch (err) {

                }

            },
            hideBox() {
                this.$emit('refresh')
            },
            async submit() {
                try {
                    const res = await request.post('/news/updateVersionNotice', this.form)
                    console.log('res', res);
                    if (res.code == 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success',
                        })
                        this.hideBox()
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        })
                    }
                } catch (err) {
                    console.log('保存失败', err);
                }
            }

        },

        components: {

        },
        mounted() {

        }
    })
</script>

<style lang="less" scoped></style>
