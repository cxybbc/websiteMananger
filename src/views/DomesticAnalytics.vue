<template>
    <div>
        <div style="padding: 10px 0; text-align: left; width: 100px">
            <div class="block">
                <el-date-picker v-model="timeDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="filterDate"> </el-date-picker>
            </div>
        </div>
        <div style="padding: 10px 0; text-align: right; width: 100px">
            <el-button type="primary" @click="exportData">数据导出<i class="el-icon-circle-plus-outline"></i></el-button>
        </div>
        <div id="suummary-box">
            <div class="up">
                <div class="bg-color-black item" v-for="item in titleItem" :key="item.title">
                    <div class="site">
                        <p class="fs-xl">{{ item.title }}</p>
                        <div class="site_summary">
                            <p class="fs-xl-1">独立用户数：{{ item.UV }}</p>
                            <p class="fs-xl-1">预览量：{{ item.PV }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%; margin-top: 10px" border stripe :header-cell-class-name="'headerBg'" @filter-change="handleFilterButton" @sort-change="sortChange">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <!-- <el-table-column prop="id" label="序号" width="150" align="center"></el-table-column> -->
            <el-table-column prop="user_ip" label="用户IP" width="150" align="center"></el-table-column>
            <el-table-column
                prop="website_name"
                label="网站"
                width="150"
                align="center"
                column-key="webSiteName"
                :filters="[
                    { text: 'knockout', value: 'Proknockout_zn' },
                    { text: 'formmster', value: 'Formmasterapp_zn' },
                    { text: 'retouch', value: 'photoretouch_zn' },
                    { text: 'ppt', value: 'Imyppt_zn' }
                ]"
                :multiple="true">
                <template slot-scope="scope">
                    {{ webSiteNameTypeLabel(scope.row.website_name) }}
                </template>
            </el-table-column>
            <el-table-column prop="log_time" label="访问时间" width="150" align="center"></el-table-column>
            <el-table-column prop="web_host" label="访问域名" width="150" align="center"></el-table-column>
            <el-table-column prop="create_time_log" label="日志时间" width="150" align="center"></el-table-column>
            <el-table-column prop="web_region" label="地域" width="150" align="center" column-key="web_region">
                <template slot-scope="scope">
                    {{ webRegionTypeLabel(scope.row.web_region) }}
                </template>
            </el-table-column>
            <el-table-column prop="web_content" label="user_agent" width="150" align="center"></el-table-column>
            <el-table-column prop="user_count" label="user_count" width="150" align="center"></el-table-column>
        </el-table>
        <!--分页 选页面-->
        <div style="padding: 10px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[30, 35, 40, 45, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>

<script>
import { serverIp } from '../../public/config'

export default {
    name: 'User',
    data() {
        return {
            serverIp: serverIp,
            tableData: [],
            total: 0,
            pageNum: 1,
            pageSize: 30,
            username: '',
            form: {},
            dialogFormVisible: false,
            dialogFormVisible1: false,
            multipleSelection: [],
            functionListCopy: [],
            appList: [],
            fileList: [],
            base64Img: '',
            webSite_types: [
                {
                    value: 'Proknockout_zn',
                    label: 'Proknockout_zn'
                },
                {
                    value: 'Photoretouch_zn',
                    label: 'Photoretouch_zn'
                },
                {
                    value: 'Formmasterapp_zn',
                    label: 'Formmasterapp_zn'
                },
                {
                    value: 'Imyppt_zn',
                    label: 'Imyppt_zn'
                }
            ],
            webRegion_types: [
                {
                    value: '0',
                    label: '国内'
                }
            ],
            webRegion: '',
            webSiteName: [],
            logTime: '',
            timeDate: '',
            sort: '',
            filterColumn: '',
            summaryBox: {},
            titleItem: []
        }
    },
    created() {
        //请求分页查询数据
        this.load()
    },
    computed: {
        webSiteNameTypeLabel() {
            return function (value) {
                const matchedObject = this.webSite_types.find(obj => obj.value == value)
                return matchedObject ? matchedObject.label : ''
            }
        },
        webRegionTypeLabel() {
            return function (value) {
                const matchedObject = this.webRegion_types.find(obj => obj.value == value)
                return matchedObject ? matchedObject.label : ''
            }
        },
        selectTag() {
            return function (value) {
                const matchedObject = this.appList.find(obj => obj.id == value)

                return matchedObject ? matchedObject.webSiteName : ''
            }
        },
        selectTag1() {
            return function (value) {
                const matchedObject = this.functionList.find(obj => obj.id == value)
                return matchedObject ? matchedObject.functionName : ''
            }
        }
    },
    methods: {
        load() {
            let loading = this.$loading({
                lock: true, //lock的修改符--默认是false
                text: '加载数据中，请稍候...', //显示在加载图标下方的加载文案
                background: 'rgba(0,0,0,0.8)', //遮罩层颜色
                spinner: 'el-icon-loading' //自定义加载图标类名
            })
            this.request
                .post('/websiteMasterLog/domesticAnalytics', {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                .then(res => {
                    this.tableData = res.data.domesticList.records
                    this.total = res.data.domesticList.total
                    let summary = res.data.summary
                    let data = []
                    summary.forEach(r => {
                        let map = {}
                        map['title'] = r.website_name
                        map['UV'] = r.UV
                        map['PV'] = r.PV
                        data.push(map)
                    })
                    this.titleItem = data
                    loading.close()
                })
                .catch(err => {
                    loading.close()
                })
        },
        sortLoad() {
            let loading = this.$loading({
                lock: true, //lock的修改符--默认是false
                text: '加载数据中，请稍候...', //显示在加载图标下方的加载文案
                background: 'rgba(0,0,0,0.8)', //遮罩层颜色
                spinner: 'el-icon-loading' //自定义加载图标类名
            })
            let webRegions = ''
            let webSiteNames = []
            let logTimes = ''
            let column = this.filterColumn
            if (column.webRegion) {
                webRegions = column.webRegion[0]
                this.webRegion = webRegions
            } else if (column.webSiteName) {
                for (let i = 0; i < column.webSiteName.length; i++) {
                    webSiteNames.push(column.webSiteName[i])
                }
                this.webSiteName = webSiteNames
            } else if (column.logTime) {
                logTimes = column.logTimes[0]
                this.logTime = logTimes
            }
            this.request
                .post('/websiteMasterLog/domesticAnalytics', {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    order: this.sort,
                    logTimes: this.logTime,
                    webSiteNames: this.webSiteName,
                    webRegions: this.webRegion,
                    startTime: this.timeDate[0],
                    endTime: this.timeDate[1]
                })
                .then(res => {
                    this.tableData = res.data.domesticList.records
                    this.total = res.data.domesticList.total
                    let summary = res.data.summary
                    let data = []
                    summary.forEach(r => {
                        let map = {}
                        map['title'] = r.website_name
                        map['UV'] = r.UV
                        map['PV'] = r.PV
                        data.push(map)
                    })
                    this.titleItem = data
                    loading.close()
                })
                .catch(err => {
                    loading.close()
                })
        },
        reset() {
            this.username = ''
            this.load()
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.handleFilterButton()
        },
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum
            this.handleFilterButton()
        },
        handleFilterButton(column) {
            console.log('column', column)
            if (column.webSiteName.length) {
                this.webSiteName = column.webSiteName
                // this.webSiteName = column
            }
            let loading = this.$loading({
                lock: true, //lock的修改符--默认是false
                text: '加载数据中，请稍候...', //显示在加载图标下方的加载文案
                background: 'rgba(0,0,0,0.8)', //遮罩层颜色
                spinner: 'el-icon-loading' //自定义加载图标类名
            })
            this.sort = 'desc'
            console.log('参数', this.webSiteName)
            this.request
                .post('/websiteMasterLog/domesticAnalytics', {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    logTimes: this.logTime,
                    webSiteNames: this.webSiteName,
                    webRegions: this.webRegion,
                    order: this.sort,
                    startTime: this.timeDate[0],
                    endTime: this.timeDate[1]
                })
                .then(res => {
                    this.tableData = res.data.domesticList.records
                    this.total = res.data.domesticList.total
                    let summary = res.data.summary
                    let data = []
                    summary.forEach(r => {
                        let map = {}
                        map['title'] = r.website_name
                        map['UV'] = r.UV
                        map['PV'] = r.PV
                        data.push(map)
                    })
                    this.titleItem = data
                    loading.close()
                })
                .catch(err => {
                    loading.close()
                    console.log(err)
                })
        },
        sortChange(row) {
            if (!row.order) {
                this.sort = ''
                this.load()
                return
            }
            if (row.order == 'descending') {
                this.sort = 'desc'
            } else {
                this.sort = 'asc'
            }
            this.sortLoad()
        },
        filterDate() {
            let loading = this.$loading({
                lock: true, //lock的修改符--默认是false
                text: '数据导出中，请稍候...', //显示在加载图标下方的加载文案
                background: 'rgba(0,0,0,0.8)', //遮罩层颜色
                spinner: 'el-icon-loading' //自定义加载图标类名
            })
            let start = ''
            let end = ''
            if (!this.timeDate) {
                this.pageNum = 1
                this.load()
            } else {
                start = this.timeDate[0]
                end = this.timeDate[1]
            }
            this.request
                .post('/websiteMasterLog/domesticAnalytics', {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    webSiteNames: this.webSiteName,
                    webRegions: this.webRegion,
                    startTime: start,
                    endTime: end
                })
                .then(res => {
                    this.tableData = res.data.domesticList.records
                    this.total = res.data.domesticList.total
                    let summary = res.data.summary
                    let data = []
                    summary.forEach(r => {
                        let map = {}
                        map['title'] = r.website_name
                        map['UV'] = r.UV
                        map['PV'] = r.PV
                        data.push(map)
                    })
                    this.titleItem = data
                    loading.close()
                })
                .catch(err => {
                    console.log(err)
                    loading.close()
                })
        },
        exportData() {
            let loading = this.$loading({
                lock: true, //lock的修改符--默认是false
                text: '数据导出中，请稍候...', //显示在加载图标下方的加载文案
                background: 'rgba(0,0,0,0.8)', //遮罩层颜色
                spinner: 'el-icon-loading' //自定义加载图标类名
            })
            let start = ''
            let end = ''
            if (this.timeDate) {
                start = this.timeDate[0]
                end = this.timeDate[1]
            }
            this.request
                .post(
                    '/websiteMasterLog/exportData',
                    {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        webSiteNames: this.webSiteName,
                        webRegions: this.webRegion,
                        startTime: start,
                        endTime: end
                    },
                    { responseType: 'blob' }
                )
                .then(res => {
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

<style>
.headerBg {
    background: #eee !important;
}
.el-table__header {
    width: 100% !important;
}
.el-table__body {
    width: 100% !important;
}
.el-form-item__label {
    width: 100px !important;
}
.el-form-item__content {
    margin-left: 100px !important;
}
#suummary-box {
    display: flex;
    flex-direction: column;
    .up {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .item {
            border: 2px solid #e0e0e0; /* 更改边框颜色为浅灰色 */
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1); /* 添加轻微的阴影效果 */
            background-color: #f5f5f5;
            border-radius: 10px;
            padding: 15px;
            margin: 15px;
            width: 36%;
            height: auto;
            .site {
                display: flex;
                flex-direction: column;
                align-items: center;
                .fs-xl {
                    height: 30px;
                    text-align: center;
                    color: #555; /* 更改标题颜色为深灰色 */
                    font-weight: normal; /* 取消标题加粗 */
                }
                .site_summary {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 5px;
                    .fs-xl-1 {
                        text-align: center;
                        font-size: 1.6rem;
                        padding: 5px;
                        color: #777; /* 更改摘要颜色为灰色 */
                        font-weight: normal; /* 取消摘要加粗 */
                    }
                }
            }
        }
    }
}
</style>
