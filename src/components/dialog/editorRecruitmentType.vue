<template>
    <div>
        <el-dialog :title="title" :visible.sync="showdialog" width="30%" :before-close="canceldialog">
            <el-form ref="ruleForm" label-width="80px" :rules="rules" :model="form">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="canceldialog">取 消</el-button>
                <el-button type="primary" @click="comfirmdialog('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import request from '@/utils/request'
export default defineComponent({
    name: 'dialogEditorRecruitmentType',

    props: {
        typeInfo: {},
        isShow: {
            type: Boolean
        },
        sortIndex: {
            type: Number,
            default: 0
        },
        pid: {
            type: Number,
            default: -1
        }
    },

    data() {
        return {
            form: {
                name: '',
                id: '',
                pid: '',
                sortIndex: ''
            },
            rules: {
                name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            }
        }
    },

    computed: {
        showdialog() {
            return this.isShow
        },
        title() {
            if (!this.typeInfo?.id && this.pid == -1) {
                return '新增分类'
            } else if (this.pid !== -1) {
                return '新增子分类'
            } else {
                return '修改分类'
            }
        }
    },

    watch: {
        isShow: {
            handler(val) {
                if (val) {
                    this.form.name = this.typeInfo?.name
                    this.form.id = this.typeInfo?.id
                    this.form.pid = this.typeInfo?.pid
                    this.form.sortIndex = this.typeInfo?.sortIndex
                    this.typeId = this.typeInfo?.id
                    console.log(this.typeInfo)
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
        canceldialog() {
            this.$emit('refresh')
        },
        comfirmdialog(el) {
            this.$refs[el].validate(async valid => {
                if (valid) {
                    await this.eidtorRecuritmentType()
                    this.$emit('refresh')
                }
            })
        },
        async eidtorRecuritmentType() {
            try {
                if (!this.form.id) {
                    const res = await request.post('/recruit/saveCategory', {
                        name: this.form.name,
                        pid: this.pid === -1 ? 0 : this.pid + 1,
                        sortIndex: 1
                    })
                    console.log('新增', res)
                } else {
                    console.log('参数', this.form)
                    const res = await request.post('/recruit/updateCategory', {
                        name: this.form.name,
                        pid: this.form.pid,
                        sortIndex: this.form.sortIndex,
                        id: this.form.id
                    })
                    console.log('修改', res)
                }
            } catch (err) {
                console.log('失败', err)
            }
        }
    },

    components: {},
    mounted() {
        console.log('object')
    }
})
</script>

<style lang="scss" scoped></style>
