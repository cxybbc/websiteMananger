<template>
    <div>
        <editorNew :isloading="detailLoading" :isShow="isShowEditorBox" :newDetailInfo="newDetailInfo" @refresh="hideDialog" />
        <h1>新闻中心</h1>
        <header>
            <div></div>
            <el-button type="primary" @click="addNew">新增新闻</el-button>
        </header>
        <main>
            <el-table v-loading="isNewsLoading" :data="tableData" style="width: 100%" height="700">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="id" />

                <el-table-column prop="title" label="标题" />
                <el-table-column label="是否置顶">
                    <template #default="scope">
                        {{ scope.row.isTop ? '是' : '否' }}
                        <!-- <el-switch @change="changeStatus(scope.row.id)" v-model="scope.row.isTop" active-color="#13ce66" inactive-color="#ff4949"> </el-switch> -->
                    </template>
                </el-table-column>
                <el-table-column label="网站">
                    <template #default="scope"> {{ initWebsiteName(scope.row.appWebsiteId) }} </template>
                </el-table-column>

                <el-table-column label="封面图">
                    <template #default="scope">
                        <img :src="scope.row.cover" style="object-fit: contain; height: 100px" alt="" />
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column prop="action" label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.row)"> 修改 </el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.row)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination" @current-change="PaginaitonChange" background layout="prev, pager, next" :page-size="pageSize" :current-page="currentpage1" :total="total1" />
        </main>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import request from '@/utils/request'
import editorNew from '@/components/dialog/editorNew.vue'
export default defineComponent({
    name: 'NewsCenter',

    props: {},

    data() {
        return {
            tableData: [],
            total1: 1000,
            currentpage1: 1,
            isNewsLoading: false,
            isShowEditorBox: false,
            newDetailInfo: null,
            pageSize: 20,
            detailLoading: false
        }
    },

    computed: {},

    watch: {},

    methods: {
        PaginaitonChange(page) {
            this.currentpage1 = page
            this.getNewsList()
        },
        async getNewsList() {
            this.isNewsLoading = true
            try {
                const res = await request.get('/news/newsManageList', {
                    params: {
                        pageNum: this.currentpage1,
                        pageSize: this.pageSize
                    }
                })
                console.log('新闻中心列表', res)
                this.tableData = res.data.newsList.records
                this.total1 = res.data.newsList.total
                this.isNewsLoading = false
            } catch (err) {}
        },
        async getWebSiteList() {
            try {
                const res = await request.get('/appManage/appManages')
                console.log('res', res)
                this.$store.commit('setWebSiteList', res.data.appList)
            } catch (err) {
                console.log('获取应用站点', err)
            }
        },
        addNew() {
            console.log('新增新闻')
            this.isShowEditorBox = true
        },
        hideDialog() {
            this.isShowEditorBox = false
            this.newDetailInfo = {}
            this.getNewsList()
        },
        initWebsiteName(websiteId) {
            return this.$store.state.webSiteList.find(item => item.id === websiteId)?.webSiteName
        },
        async handleEdit(row) {
            console.log('编辑新闻', row)
            const newsInfo = await this.getNewsDetail(row.id, row.appWebsiteId)
            console.log(newsInfo.id)
            this.newDetailInfo = newsInfo
            this.isShowEditorBox = true
        },
        handleDelete(row) {
            console.log('删除新闻', row)
            this.$confirm('此操作将永久删除该新闻, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async () => {
                    try {
                        const formData = new FormData()
                        formData.append('newId', row.id)

                        const res = await request.post('/news/deleteNewInfo', formData, {
                            headers: {
                                'Content-Type': 'multepart/form-data'
                            }
                        })
                        console.log('delete', res)
                        if (res.code == 200) {
                            this.$message.success(res.msg)
                            this.getNewsList()
                        } else {
                            this.$message.error(res.msg)
                        }
                    } catch (err) {}
                })
                .catch(() => {})
        },
        // async changeStatus(id) {
        //     const changItem = JSON.parse(JSON.stringify(this.tableData.find(item => item.id === id)))
        //     try {
        //         console.log('参数', changItem)
        //         const res = await request.post('/news/updateNewInfo', {
        //             id: changItem.id,
        //             isTop: changItem.isTop
        //         })
        //         console.log('更新状态', res)
        //         if (res.code == 200) {
        //             this.$message.success('修改成功')
        //             this.getNewsList()
        //         } else {
        //             this.$message.error('修改失败')
        //         }
        //     } catch (err) {
        //         console.log('失败', err)
        //     }
        // },
        async getNewsDetail(id, webId) {
            try {
                this.detailLoading = true
                const res = await request.get('/news/newManageInfo', {
                    params: {
                        newId: id,
                        appWebsiteId: webId
                    }
                })
                console.log('新闻详情', res)

                if (res.code == 200) {
                    this.detailLoading = false
                    return res.data.info
                } else {
                    this.detailLoading = false
                    return {}
                }
            } catch (err) {
                console.log('object', err)
            }
        }
    },
    mounted() {
        this.getWebSiteList()
        this.getNewsList()
    },
    components: { editorNew }
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
