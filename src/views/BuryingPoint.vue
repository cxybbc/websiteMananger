<template>
    <div class="b_p_view">
        <div style="padding: 10px 0;display: flex;align-items: center;column-gap: 20px;" height="60px">
            <el-button type="primary" @click="exportData">数据导出<i class="el-icon-circle-plus-outline"></i></el-button>
            <el-select v-model="searchForm.appId" placeholder="请模糊搜索以选择应用" style="max-width: 300px; max-height: 60px;"
                multiple collapse-tags clearable filterable @change="getWebSiteFun">
                <el-option v-for="item in appList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-model="searchForm.webName" placeholder="请选择事件功能点" style="width: 200px;" multiple collapse-tags
                clearable filterable>
                <el-option v-for="item in webNameList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-date-picker v-model="searchForm.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                value-format="yyyy-MM-dd" />
            <el-button type="primary" @click="searchData">查询</el-button>

            <el-button type="primary" @click="resetSearch">重置</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" border stripe :header-cell-class-name="'headerBg'"
            @filter-change="handleFilterButton" @sort-change="sortChange">
            <!-- <el-table-column prop="userIp" label="用户IP" width="150" align="center" sortable="custom"></el-table-column> -->
            <el-table-column prop="webName" label="国内站点" align="center" :filters="selectOptions" column-key="webName"
                :filter-method="filterWebName"></el-table-column>
            <el-table-column prop="functionName" label="功能名称" align="center"></el-table-column>
            <el-table-column prop="actionName" label="详情功能" align="center"></el-table-column>
            <el-table-column prop="dailyClicks" label="事件点击量" align="center">
                <template slot-scope="scope">
                    {{ scope.row.dailyClicks == null ? 1 : scope.row.dailyClicks }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="生成时间" align="center" sortable :filters="dateList"
                column-key="createTime" :filter-method="filterCreateTime"></el-table-column>
            <el-table-column prop="region" label="地域" align="center"></el-table-column>
        </el-table>
        <!--分页 选页面-->
        <div style="padding: 10px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                :page-sizes="[30, 35, 40, 45, 50]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchForm: {
                webName: [],
                date: []
            },
            appList: [],
            pageNum: 1,
            pageSize: 30,
            total: 0,
            tableData: [],
            dataList: [],
            selectOptions: [
                {
                    value: 'master',
                    text: 'formmaster'
                },
                {
                    value: 'retouch',
                    text: 'retouch'
                },
                {
                    value: 'knockout',
                    text: 'knockout'
                },
                {
                    value: 'ppt',
                    text: 'ppt'
                },
                {
                    value: 'ttoffice',
                    text: '天天办公网'
                },
                {
                    value: 'quoffice',
                    text: '趣帮office'
                }
            ],
            dateList: [],
            webNameList: [],
            createTimeList: []
        }
    },
    created() {


        this.getAppList()

        //请求分页查询数据
        this.load()
        // 日期筛选数据
        this.loadDates()
    },
    methods: {
        //重置查询
        resetSearch() {
            this.searchForm = {
                webName: [],
                date: []
            }
            this.getWebSiteFun()
            this.load()
        },

        search() {
            console.log('日期筛选', this.searchForm.date);
        },
        load() {
            this.request
                .post('/buryingPoint/getBuryingPoint', {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                .then(res => {
                    console.log('res', res);
                    if (res.code == 200 && res.data && res.data.result) {
                        this.tableData = res.data.result.records
                        this.total = res.data.result.total
                    } else {
                        this.tableData = []
                        this.total = 0
                    }
                    this.summaryList(undefined, undefined)
                })
        },

        //获取当前官网站点数据信息列表
        async getAppList() {
            try {
                const res = await this.request.post('/buryingPoint/getQueryData', {
                    webNames: []
                })
                console.log('官网列表', res)
                if (res.code == 200) {
                    this.appList = res.data.webNames

                } else {
                    this.$message.error('获取官网列表失败')
                }

            } catch (err) {
                console.log('获取失败', err)
            }
        },

        //获取网站和功能列表
        getWebSiteFun() {
            this.request
                .post('/buryingPoint/getQueryData', {
                    webNames: this.searchForm.appId
                })
                .then(res => {
                    console.log('当前网站和功能列表', res.data);
                    if (res.code == 200) {
                        this.webNameList = res.data.functionNames
                    }
                })
        },


        loadDates() {
            this.request.get('/buryingPoint/dateQuery').then(res => {
                let data = []
                data = res.data.result
                data.forEach(d => {
                    let map = {}
                    map['text'] = d
                    map['value'] = d
                    this.dateList.push(map)
                })
            })
        },
        summaryList(webName, createTime) {
            this.request
                .post('/buryingPoint/summaryData', {
                    webNames: webName,
                    createTimes: createTime
                })
                .then(res => {
                    // console.log(res.data.result)
                })
        },
        handleFilterButton(column) {
            if (column['webName']) {
                this.webNameList = column['webName']
            }
            if (column['createTime']) {
                this.createTimeList = column['createTime']
            }
            this.searchData()
        },
        filterWebName(value, row, column) {
            const property = column['property']
            return row[property] && row[property].toString().includes(value)
        },
        filterCreateTime(value, row, column) {
            const property = column['property']
            return row[property] && row[property].toString().includes(value)
        },
        searchData() {


            console.log('搜索参数', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                webNames: this.searchForm.appId,
                createTimes: this.createTimeList,
                websiteName: this.searchForm.webName,
                startTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[0] : '',
                endTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[1] : ''
            });
            this.request
                .post('/buryingPoint/getBuryingPoint', {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    webNames: this.searchForm.appId,
                    //createTimes: this.createTimeList,
                    functionNames: this.searchForm.webName,
                    startTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[0] : '',
                    endTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[1] : ''
                })
                .then(res => {
                    console.log('res', res);
                    if (res.code == 200 && res.data && res.data.result) {
                        this.tableData = res.data.result.records
                        this.total = res.data.result.total
                    } else {
                        this.tableData = []
                        this.total = 0
                    }
                    this.summaryList(this.webNameList, this.createTimeList)
                }).catch(err => {
                    console.log('搜索失败', err);
                })
        },
        sortChange() { },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            if (this.webNameList != undefined && this.createTimeList != undefined) {
                this.searchData()
            } else {
                this.load()
            }
        },
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum
            if (this.webNameList != undefined && this.createTimeList != undefined) {
                this.searchData()
            } else {
                this.load()
            }
        },
        filterHandler(value, row, column) {
            // console.log(value)
            // console.log(column.property)
        },
        exportData() {
            let loading = this.$loading({
                lock: true, //lock的修改符--默认是false
                text: '数据导出中，请稍候...', //显示在加载图标下方的加载文案
                background: 'rgba(0,0,0,0.8)', //遮罩层颜色
                spinner: 'el-icon-loading', //自定义加载图标类名

            })
            console.log('参数', {
                webNames: this.searchForm.webName,
                createTimes: this.createTimeList,
                startTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[0] : '',
                endTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[1] : '',
                websiteName: this.searchForm.webName,
            });
            this.request
                .post(
                    '/buryingPoint/exportData',
                    {
                        webNames: this.searchForm.webName,
                        createTimes: this.createTimeList,
                        startTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[0] : '',
                        endTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[1] : '',
                        websiteName: this.searchForm.webName,
                    },
                    { responseType: 'blob' }
                )


                .then(res => {
                    console.log(res)
                    const blob = new Blob([res], { type: 'application/octet-stream' })
                    const downloadLink = document.createElement('a')
                    downloadLink.href = URL.createObjectURL(blob)
                    downloadLink.download = 'burying_point.xlsx'
                    document.body.appendChild(downloadLink)
                    downloadLink.click()
                    document.body.removeChild(downloadLink)
                    loading.close()
                })
                .catch(error => {
                    console.log(error)
                    this.$message.error('请求失败，请稍后尝试')
                    loading.close()
                })
        }
    }
}
</script>

<style lang="less"></style>
