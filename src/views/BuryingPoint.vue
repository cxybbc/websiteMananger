<template>
    <div class="b_p_view">
        <div style="padding: 10px 0;display: flex;align-items: center;column-gap: 20px;">
            <el-button type="primary" @click="exportData">数据导出<i class="el-icon-circle-plus-outline"></i></el-button>
            <el-input v-model="searchForm.webName" placeholder="请输入国内站点" style="width: 200px;"></el-input>
            <el-date-picker v-model="searchForm.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                value-format="yyyy-MM-dd" />
            <el-button type="primary" @click="searchData">查询</el-button>
        </div>

        <el-table :data="tableData" style="width: 100%" border stripe :header-cell-class-name="'headerBg'"
            @filter-change="handleFilterButton" @sort-change="sortChange">
            <!-- <el-table-column prop="userIp" label="用户IP" width="150" align="center" sortable="custom"></el-table-column> -->
            <el-table-column prop="webName" label="国内站点" align="center" :filters="selectOptions" column-key="webName"
                :filter-method="filterWebName"></el-table-column>
            <el-table-column prop="functionName" label="功能名称" align="center"></el-table-column>
            <el-table-column prop="actionName" label="详情功能" align="center"></el-table-column>
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
                    webName: '',
                    date: []
                },
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
            //请求分页查询数据
            this.load()
            // 日期筛选数据
            this.loadDates()
        },
        methods: {


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
                        this.tableData = res.data.result.records
                        this.total = res.data.result.total
                        this.summaryList(undefined, undefined)
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
                    webNames: this.webNameList,
                    createTimes: this.createTimeList,
                    websiteName: this.searchForm.webName,
                    startTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[0] : '',
                    endTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[1] : ''
                });
                this.request
                    .post('/buryingPoint/getBuryingPoint', {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        webNames: this.webNameList,
                        createTimes: this.createTimeList,
                        websiteName: this.searchForm.webName,
                        startTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[0] : '',
                        endTime: Array.isArray(this.searchForm.date) ? this.searchForm.date[1] : ''
                    })
                    .then(res => {
                        console.log('res', res);
                        this.tableData = res.data.result.records
                        this.total = res.data.result.total
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
                this.request
                    .post(
                        '/buryingPoint/exportData',
                        {
                            webNames: this.webNameList,
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
