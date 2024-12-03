<template>
    <div>
        <h1>News Center</h1>
        <header>
            <div></div>
            <el-button type="primary" @click="addNew">新增新闻</el-button>
        </header>
        <main>
            <el-table v-loading="isNewsLoading" :data="tableData" style="width: 100%" height="700">
                <el-table-column type="selection" width="55" />
            </el-table>
            <el-pagination class="pagination" background layout="prev, pager, next" :page-size="20" :current-page="currentpage1" :total="total1" />
        </main>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import request from '@/utils/request'
export default defineComponent({
    name: 'NewsCenter',

    props: {},

    data() {
        return {
            tableData: [],
            total1: 1000,
            currentpage1: 1,
            isNewsLoading: false,
            isShowEditorBox: false
        }
    },

    computed: {},

    watch: {},

    methods: {
        async getNewsList() {
            try {
                const res = await request.get('/news/newsManageList', {
                    params: {
                        pageNum: this.currentpage1,
                        pageSize: 20
                    }
                })
                console.log('新闻中心列表', res)
                this.tableData = res.data.newsList.records
                this.total1 = res.data.newsList.total
            } catch (err) {}
        },
        addNew() {
            console.log('新增新闻')
            this.isShowEditorBox = true
        }
    },
    mounted() {
        this.getNewsList()
    },
    components: {}
})
</script>

<style lang="less" scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
}
</style>
