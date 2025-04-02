<template>
    <div class="deeplinkView">
        <a href="weixin://">123</a>
        <div class="selectBox">
            <el-input
                v-model="serachText"
                style="width: 200px"
                clearable
                @input="getSerachList"
                @clear="getSerachList" />

            <div class="buttonBox">
                <el-button
                    type="primary"
                    @click="addDeeplink"
                    >添加深度链接</el-button
                >
            </div>
        </div>

        <el-table
            :data="tableData"
            style="width: 100%; height: 750px"
            border>
            <el-table-column
                prop="date"
                label="日期">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
            <el-table-column
                prop="action"
                label="操作"
                width="180px"
                fixed="right">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="addDeeplink"
                        type="primary"
                        >编辑</el-button
                    >
                    <el-button
                        size="mini"
                        @click="deleteDeeplink"
                        type="danger"
                        >删除</el-button
                    >
                </template></el-table-column
            >
        </el-table>
        <editorDeeplink
            :dialogVisible="dialogVisible"
            @close="closedDialog" />
    </div>
</template>

<script>
import editorDeeplink from '@/components/dialog/editorDeeplink.vue'

export default {
    components: {
        editorDeeplink
    },
    data() {
        return {
            dialogVisible: false, //编辑框显示
            serachText: '', //搜索框输入值
            inputSearch: null, //搜索框定时器
            //表格数据
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                },
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                },
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }
            ]
        }
    },

    methods: {
        //搜索deeplink
        getSerachList() {
            if (this.inputSearch) {
                clearTimeout(this.inputSearch)
            }
            this.inputSearch = setTimeout(() => {
                console.log('搜索', this.serachText)
            }, 300)
        },
        //获取列表
        async getList() {
            try {
                const res = await this.request.get()
            } catch (err) {
                console.log(err)
            }
        },
        //添加deeplink
        addDeeplink() {
            this.dialogVisible = true
        },
        //删除deeplink
        deleteDeeplink() {
            this.$confirm('此操作将永久删除该深度链接, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
                .catch(() => {})
        },
        //关闭编辑框
        closedDialog() {
            this.dialogVisible = false
        }
    },
    mounted() {}
}
</script>

<style lang="less" scoped>
.deeplinkView {
    .selectBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
}
</style>
