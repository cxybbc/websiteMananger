<template>
    <div>
        <el-dialog :title="'职位编辑'" :visible.sync="showdialog" width="50%" :before-close="canceldialog">
            <el-form ref="ruleForm" label-width="80px" :model="form">
                <el-form-item label="应用站点" prop="categoryId">
                    <el-select v-model="form.appWebsiteId" filterable placeholder="请选择">
                        <el-option v-for="item in websiteList" :key="item.id" :label="item.webSiteName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位分类" prop="categoryId">
                    <el-select v-model="form.categoryId" filterable placeholder="请选择">
                        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司官网" prop="url">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="职位" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="薪资" prop="salary">
                    <el-input v-model="form.salary"></el-input>
                </el-form-item>
                <el-form-item label="任职要求" prop="requirements">
                    <el-input v-model="form.requirements"></el-input>
                </el-form-item>
                <el-form-item label="岗位职责" prop="responsibility">
                    <el-input v-model="form.responsibility"></el-input>
                </el-form-item>
                <el-form-item label="招聘人数" prop="num">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="联系地址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="职位具体详情" prop="contact">
                    <el-input v-model="form.contact"></el-input>
                </el-form-item>
                <el-form-item label="详情补充" prop="content">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="canceldialog">取 消</el-button>
                <el-button type="primary" @click="uploadPositionInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import request from '@/utils/request'
export default defineComponent({
    name: 'EditorPosition',

    props: {
        isShow: Boolean,
        positionInfo: {},
        sortIndex: Number
    },

    data() {
        return {
            form: {
                id: '',
                title: '',
                salary: '',
                requirements: '',
                responsibility: '',
                num: '',
                mobile: '',
                email: '',
                address: '',
                categoryId: '',
                url: '',
                contact: '',
                content: '',
                appWebsiteId: '',
                click: ''
            }
        }
    },

    computed: {
        showdialog() {
            return this.isShow
        },
        typeList() {
            return this.$store.state.recruitmentTypeList
        },
        websiteList() {
            return this.$store.state.webSiteList
        }
    },

    methods: {
        canceldialog() {
            this.$emit('refresh')
        },
        async uploadPositionInfo() {
            try {
                const params = JSON.parse(JSON.stringify(this.form))

                if (!params.id) {
                    delete params.id
                    const res = await request.post('/info/saveRecruitInfo', params)
                    console.log('新增', res)
                    if (res.code == 200) {
                        this.$message.success(res.msg)
                        this.$emit('refresh')
                    } else {
                        this.$message.error(res.msg)
                    }
                } else {
                    console.log('参数', params)
                    const res = await request.post('/info/updateRecruitInfo', params)
                    console.log('修改', res)
                    if (res.code == 200) {
                        this.$message.success(res.msg)
                        this.$emit('refresh')
                    } else {
                        this.$message.error(res.msg)
                    }
                }
            } catch (err) {
                console.log('修改失败', err)
            }
        },
        async getPositionInfo(id) {
            try {
                const res = await request.post('/info/recruitInfo', {
                    infoId: id
                })
                console.log('获取详情', res)
            } catch (err) {}
        }
    },
    watch: {
        isShow: {
            handler(val) {
                if (val) {
                    for (let key in this.form) {
                        for (let key2 in this.positionInfo) {
                            if (key === key2) {
                                this.form[key] = this.positionInfo[key2]
                            }
                        }
                    }
                } else {
                    for (let key in this.form) {
                        this.form[key] = ''
                    }
                }
            },
            deep: true
        }
    },
    components: {}
})
</script>

<style lang="scss" scoped></style>
