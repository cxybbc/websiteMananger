<template>
    <div>
        <el-dialog title="新闻编辑" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'EditorNew',

    props: {
        isShow: Boolean
    },
    data() {
        return {}
    },

    computed: {
        dialogVisible() {
            return this.isShow
        }
    },

    watch: {},

    methods: {},

    components: {}
})
</script>

<style lang="scss" scoped></style>
