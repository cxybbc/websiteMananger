<template>
    <div>
        <editorCounseling :isShow="isShowDetail" @hideDialog="hideDialog" :context="counselingDetail" />
        <h1>咨询管理</h1>
        <main>
            <el-table v-loading="isLoading" :data="tableData" style="width: 100%" height="700">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="id" />
                <el-table-column prop="userName" label="姓名" />
                <el-table-column prop="mobile" label="手机" />
                <el-table-column prop="email" label="邮箱">
                    <template #default="scope"> {{ scope.row.email && scope.row.email != 'undefined' ? scope.row.email : '--' }} </template>
                </el-table-column>
                <el-table-column prop="company" label="公司" />
                <el-table-column prop="action" label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)"> 查看 </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" @current-change="PaginaitonChange" background layout="prev, pager, next" :page-size="pageSize" :current-page="currentpage1" :total="total1" />
        </main>
    </div>
</template>

<script>
import request from '@/utils/request'
import { defineComponent } from 'vue'
import editorCounseling from '@/components/dialog/editorCounseling.vue'
export default defineComponent({
    name: 'AppCounseling',

    props: {},

    data() {
        return {
            isLoading: false,
            pageSize: 20,
            tableData: [],
            currentpage1: 1,
            total1: 0,
            isShowDetail: false,
            counselingDetail: ''
        }
    },

    computed: {},

    watch: {},

    methods: {
        async getWebSiteList() {
            try {
                const res = await request.get('/appManage/appManages')
                console.log('res', res)
                this.$store.commit('setWebSiteList', res.data.appList)
            } catch (err) {
                console.log('获取应用站点', err)
            }
        },
        PaginaitonChange(page) {
            this.currentpage1 = page
            this.getCounselingList()
        },

        async getCounselingList() {
            try {
                this.isLoading = true
                const res = await request.get('/information/list', {
                    params: {
                        pageNum: this.currentpage1,
                        pageSize: this.pageSize
                    }
                })
                this.tableData = res.data.list.records
                this.total1 = res.data.list.total
                this.isLoading = false
                console.log('咨询列表', res)
            } catch (err) {
                console.log('err', err)
            }
        },
        handleEdit(row) {
            console.log(row)
            this.counselingDetail = row.context
            this.isShowDetail = true
        },
        hideDialog() {
            this.isShowDetail = false
        }
    },

    components: { editorCounseling },
    mounted() {
        this.getWebSiteList()
        this.getCounselingList()
    }
})
</script>

<style lang="less" scoped></style>
