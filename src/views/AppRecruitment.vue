<template>
    <div class="recruitmentPage">
        <dialogEditorRecruitmentType @refresh="hiddialog" :isShow="isShowEditor" :typeInfo="typeInfo" :pid="pid" :sortIndex="sortIndex" />
        <editorPosition :isEditor="isEditorPosition" @refresh="hidPositionDialog" :isShow="isShowPositionEditor" :positionInfo="positionInfo" :sortIndex="positionSortIndex" />
        <div class="typelist">
            <h3>职位分类列表</h3>
            <header>
                <div class="selectBox">
                    <span>分类名称:</span>
                    <el-input @input="searchType" v-model="searchInput" placeholder="请输入内容"></el-input>
                </div>
                <el-button type="primary" @click="addType">新增分类</el-button>
            </header>
            <main>
                <el-table v-loading="isTypeloading" :data="TypeTableData" style="width: 100%" height="300">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="id" label="id" />
                    <el-table-column label="名称" prop="name" />
                    <el-table-column prop="action" label="操作">
                        <template #default="scope">
                            <!-- <el-button size="small" @click="addChildType(scope.row)"> 新增子分类 </el-button> -->
                            <el-button size="small" @click="handleEdit(scope.row)"> 修改 </el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.row)"> 删除 </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination" @current-change="typePaginaitonChange" background layout="prev, pager, next" :page-size="pageSize1" :current-page="currentpage1" :total="total1" />
            </main>
        </div>
        <div class="positionlist">
            <h3>职位列表</h3>
            <header>
                <div class="selectBox">
                    <!-- <span>职位名称:</span>
                    <el-input @input="searchPosition" v-model="searchInputP" placeholder="请输入内容"></el-input> -->
                </div>
                <el-button type="primary" @click="addPosition">新增职位</el-button>
            </header>
            <main>
                <el-table v-loading="isPosistonloading" :data="positionData" style="width: 100%" height="300">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="id" label="id" />
                    <el-table-column label="职位" prop="title" />
                    <el-table-column label="职位分类">
                        <template #default="scope">
                            {{ initeType(scope.row.categoryId) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="人数" prop="num" />
                    <el-table-column label="薪资" prop="salary" />
                    <el-table-column label="邮箱" prop="email" />
                    <el-table-column label="地址" prop="address" />
                    <el-table-column prop="action" label="操作">
                        <template #default="scope">
                            <!-- <el-button size="small" @click="addChildType(scope.row)"> 新增子分类 </el-button> -->
                            <el-button size="small" @click="handleEditP(scope.row)"> 修改 </el-button>
                            <el-button size="small" type="danger" @click="handleDeleteP(scope.row)"> 删除 </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="pagination" @current-change="positionPaginaitonChange" background layout="prev, pager, next" :page-size="pageSize2" :current-page="currentpage2" :total="total2" />
            </main>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import request from '@/utils/request'
import dialogEditorRecruitmentType from '@/components/dialog/editorRecruitmentType.vue'
import editorPosition from '@/components/dialog/editorPosition.vue'
export default defineComponent({
    name: 'Recruitment',

    props: {},
    components: { dialogEditorRecruitmentType, editorPosition },
    data() {
        return {
            TypeTableData: [],
            positionData: [],
            total1: 0,
            currentpage1: 1,
            pageSize1: 6,
            pageSize2: 5,
            total2: 0,
            currentpage2: 1,
            isShowEditor: false,
            isShowPositionEditor: false,
            positionInfo: null,
            typeInfo: null,
            sortIndex: 0,
            sortIndexP: 0,
            positionSortIndex: 0,
            searchInput: '',
            pid: -1,
            isTypeloading: false,
            isPosistonloading: false,

            isEditorPosition: false, //修改职位
            searchInputP: ''
        }
    },

    computed: {},

    watch: {},

    methods: {
        //职位分类
        positionPaginaitonChange(page) {
            this.currentpage2 = page
            console.log('页码', page)

            this.getPositionList()
        },

        //职位分类分页
        async typePaginaitonChange(page) {
            try {
                this.currentpage1 = page
                if (this.searchInput) {
                    this.isTypeloading = true
                    const res = await request.post('/recruit/searchCategory', {
                        pageNum: this.currentpage1,
                        pageSize: this.pageSize1,
                        name: this.searchInput
                    })
                    console.log('搜索结果', res)
                    this.isTypeloading = false
                    this.total1 = res.data.searchData.total
                    this.TypeTableData = res.data.searchData.records
                } else {
                    this.getRecruitmentTypeList()
                }
            } catch (err) {
                console.log('分页失败')
            }
        },
        //获取分类列表
        async getRecruitmentTypeList() {
            try {
                this.isTypeloading = true
                const res = await request.get('/recruit/categoryPageList', {
                    params: {
                        pageNum: this.currentpage1,
                        pageSize: this.pageSize1
                    }
                })
                this.isTypeloading = false
                console.log('分类结果', res)
                this.total1 = res.data.categoryPageList.total
                this.TypeTableData = res.data.categoryPageList.records
                this.$store.commit('setRecruitmentTypeList', res.data.categoryPageList.records)
            } catch (err) {
                console.log(err)
            }
        },
        async getPositionList() {
            try {
                this.isPosistonloading = true
                const res = await request.get('/info/recruitInfoPageList', {
                    params: {
                        pageNum: this.currentpage2,
                        pageSize: this.pageSize2
                    }
                })
                console.log('参数', {
                    pageNum: this.currentpage2,
                    pageSize: this.pageSize2
                })
                this.isPosistonloading = false
                console.log('获取职位列表', res)
                this.positionData = res.data.infoPageList.records
                this.total2 = res.data.infoPageList.total
            } catch (err) {
                console.log('获取职位失败')
            }
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
        searchType() {
            clearTimeout(this.inputTimeout)
            this.inputTimeout = setTimeout(async () => {
                try {
                    if (this.searchInput == '') {
                        this.getRecruitmentTypeList()
                    } else {
                        this.isTypeloading = true
                        const res = await request.post('/recruit/searchCategory', {
                            pageNum: this.currentpage1,
                            pageSize: this.pageSize1,
                            name: this.searchInput
                        })
                        console.log('搜索结果', res)
                        this.isTypeloading = false
                        this.total1 = res.data.searchData.total
                        this.TypeTableData = res.data.searchData.records
                    }
                } catch (err) {
                    console.log('搜索失败', err)
                }
            }, 500)
        },
        searchPosition() {
            clearTimeout(this.inputTimeout)
            this.inputTimeout = setTimeout(async () => {
                try {
                    if (this.searchInputP == '') {
                        this.getPositionList()
                    } else {
                        this.isTypeloading = true
                        const res = await request.post('/recruit/searchCategory', {
                            pageNum: this.currentpage2,
                            pageSize: this.pageSize2,
                            name: this.searchInput
                        })
                        this.isTypeloading = false
                        this.total2 = res.data.searchData.total2
                        this.TypeTableData = res.data.searchData.records
                        console.log('搜索结果', res)
                    }
                } catch (err) {
                    console.log('搜索失败', err)
                }
            }, 500)
        },
        handleEdit(row) {
            this.isShowEditor = true
            this.typeInfo = row
            console.log('typeInfo', this.typeInfo)
            this.sortIndex = row.sortIndex
        },
        async handleDelete(row) {
            console.log('row', row)
            console.log(row.id)
            try {
                const formData = new FormData()
                formData.append('categoryId', row.id)
                const res = await request.post(`/recruit/deleteCategory`, formData, {
                    'Content-Type': 'mulltipart/form-data'
                })
                this.$message.success('删除成功')
                this.getRecruitmentTypeList()
            } catch (err) {
                console.log('删除失败', err)
                this.$message.error('删除失败')
            }
        },
        handleEditP(row) {
            this.isShowPositionEditor = true
            this.positionInfo = row
            this.sortIndex = row.sortIndex
        },
        async handleDeleteP(row) {
            console.log('row', row)
            console.log(row.id)
            const formData = new FormData()
            formData.append('infoId', row.id)
            try {
                const res = await request.post('/info/deleteRecruitInfo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (res.code == 200) {
                    this.$message.success(res.msg)
                    this.getPositionList()
                } else {
                    this.$message.error(res.msg)
                }
            } catch (err) {
                console.log('删除失败', err)
                this.$message.error(res.msg)
            }
        },
        addChildType(row) {
            this.pid = row.pid
            this.isShowEditor = true
        },
        async hiddialog() {
            this.isShowEditor = false
            this.pid = -1
            this.typeInfo = null
            this.sortIndex = 0
            if (this.searchInput) {
                this.isTypeloading = true
                try {
                    const res = await request.post('/recruit/searchCategory', {
                        pageNum: this.currentpage2,
                        pageSize: this.pageSize2,
                        name: this.searchInput
                    })
                    this.isTypeloading = false
                    this.total2 = res.data.searchData.total2
                    this.TypeTableData = res.data.searchData.records
                    console.log('搜索结果', res)
                } catch (err) {
                    console.log('失败', err)
                }
            } else {
                this.getRecruitmentTypeList()
            }
        },
        hidPositionDialog() {
            this.isShowPositionEditor = false
            this.positionInfo = null
            this.positionSortIndex = 0
            this.getPositionList()
        },
        addType() {
            this.isShowEditor = true
            this.typeId = 0
        },
        addPosition() {
            this.isShowPositionEditor = true
        },
        initeType(categoryId) {
            if (categoryId) {
                const list = this.$store.state.recruitmentTypeList
                return list.find(item => item.id === categoryId)?.name
            } else {
                return '--'
            }
        }
    },
    async mounted() {
        this.getWebSiteList()
        this.getRecruitmentTypeList()
        this.getPositionList()
    }
})
</script>

<style lang="less" scoped>
.recruitmentPage {
    .typelist {
        margin-bottom: 10px;
    }
    h3 {
        margin-bottom: 5px;
    }
    header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .pagination {
        margin-top: 5px;
    }
}
</style>
