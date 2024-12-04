<template>
    <div>
        <el-dialog title="咨询详情" :visible.sync="dialogVisible" width="50%" :before-close="closeDialog">
            <el-form ref="form" :disabled="true" :model="form" label-width="80px">
                <el-form-item label="咨询内容">
                    <el-input type="textarea" v-model="form.context" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: '',

    props: {
        isShow: Boolean,
        context: String
    },

    data() {
        return {
            form: {
                context: ''
            }
        }
    },

    computed: {
        dialogVisible() {
            return this.isShow
        }
    },

    watch: {
        context: {
            handler(val) {
                if (val && val != 'undefined') {
                    this.form.context = val
                } else {
                    this.form.context = ''
                }
            }
        }
    },

    methods: {
        closeDialog() {
            this.$emit('hideDialog')
        }
    },

    components: {}
})
</script>

<style lang="scss" scoped></style>
