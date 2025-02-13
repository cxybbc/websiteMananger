<template>
    <div>
        <div style="padding: 10px 0; text-align: right">
            <el-select
                clearable
                v-model="username"
                placeholder="请选择官网"
                style="width: 400px">
                <el-option
                    v-for="item in appList"
                    :key="item.id"
                    :label="item.webSiteName"
                    :value="item.id"></el-option>
            </el-select>
            <el-button
                class="ml-5"
                type="primary"
                @click="search"
                >搜索</el-button
            >
            <el-button
                type="warning"
                @click="reset"
                >重置</el-button
            >
        </div>
        <div style="padding: 10px 0">
            <el-button
                type="primary"
                @click="handleAdd"
                >新增<i class="el-icon-circle-plus-outline"></i
            ></el-button>
            <el-popconfirm
                class="ml-5"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="您确定删除吗？"
                @confirm="deleteBatch">
                <!-- <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i></el-button> -->
            </el-popconfirm>
        </div>
        <el-table
            :data="tableData"
            :key="itemKey"
            style="width: 100%"
            border
            stripe
            :header-cell-class-name="'headerBg'"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55"></el-table-column>
            <el-table-column
                prop="id"
                label="编号"
                align="center"></el-table-column>
            <el-table-column
                prop="functionName"
                label="功能名称"
                align="center"></el-table-column>
            <el-table-column
                prop="appWebSiteId"
                label="所属网站"
                align="center">
                <template slot-scope="scope">
                    <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="numberUse"
                label="使用次数"
                align="center"></el-table-column>
            <el-table-column
                prop="numberThreshold"
                label="计数阈值"
                align="center"></el-table-column>
            <el-table-column
                prop="probability"
                label="触发概率"
                w
                align="center"></el-table-column>
            <el-table-column
                prop="operation"
                label="操作"
                width="300"
                align="center">
                <template slot-scope="scope">
                    <el-button
                        type="success"
                        @click="handleEdit(scope.row)"
                        >编辑 <i class="el-icon-edit"></i
                    ></el-button>
                    <el-popconfirm
                        class="ml-5"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        icon="el-icon-info"
                        icon-color="red"
                        title="您确定删除吗？"
                        @confirm="handleDelete(scope.row.id)">
                        <el-button
                            type="danger"
                            slot="reference"
                            >删除<i class="el-icon-remove-outline"></i
                        ></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--分页 选页面-->
        <div style="padding: 10px 0">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[5, 10, 15, 20, 25]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog
            title="新增功能信息"
            :visible.sync="dialogFormVisible"
            width="30%">
            <el-form
                label-width="80px"
                size="small"
                :model="form"
                ref="addForm">
                <el-form-item
                    label="功能名称"
                    prop="functionName"
                    :rules="{
                        required: true,
                        message: '功能名称不能为空',
                        trigger: 'blur'
                    }">
                    <el-input
                        v-model="form.functionName"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="所属官网"
                    prop="appWebSiteId"
                    :rules="{
                        required: true,
                        message: '请选择所属官网',
                        trigger: 'blur'
                    }">
                    <el-select
                        clearable
                        v-model="form.appWebSiteId"
                        placeholder="请选择官网"
                        style="width: 100%">
                        <el-option
                            v-for="item in appList"
                            :key="item.id"
                            :label="item.webSiteName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="使用次数"
                    prop="numberUse"
                    :rules="{
                        required: true,
                        message: '请分配默认使用次数',
                        trigger: 'blur'
                    }">
                    <el-input
                        type="number"
                        v-model="form.numberUse"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="计数阈值"
                    prop="numberThreshold"
                    :rules="{
                        required: true,
                        message: '请填写默认技术阈值',
                        trigger: 'blur'
                    }">
                    <el-input
                        type="number"
                        v-model="form.numberThreshold"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="触发概率"
                    prop="probability"
                    :rules="{
                        required: true,
                        message: '请填写默认触发概率',
                        trigger: 'blur'
                    }">
                    <el-input
                        v-model="form.probability"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="深度链接">
                    <div class="deep-link-container">
                        <template v-if="deepLinkView.length">
                            <div
                                v-for="(deep, index) in deepLinkView"
                                :key="index"
                                class="deep-link-item">
                                <span class="system-label">
                                    {{ deep.system }}
                                </span>
                                <div class="url-wrapper">
                                    <p class="url-text">{{ deep.depthLinkUrl }}</p>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        class="copy-btn"
                                        @click="copyUrl(deep.depthLinkUrl)">
                                        复制
                                    </el-button>
                                </div>
                            </div>
                        </template>

                        <!-- 空状态 -->
                        <div
                            v-else
                            class="empty-state">
                            <el-empty
                                :image-size="120"
                                description="暂无数据">
                                <template #description>
                                    <p class="empty-text">暂无深度链接数据</p>
                                </template>
                            </el-empty>
                        </div>
                    </div>
                    <el-button
                        type="primary"
                        @click="eidtorDeepLink"
                        >编辑</el-button
                    >
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="save"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            title="修改功能信息"
            :visible.sync="dialogFormVisible1"
            width="30%">
            <el-form
                label-width="80px"
                size="small"
                :model="form"
                ref="editForm">
                <el-form-item
                    label="功能ID"
                    v-if="false">
                    <el-input
                        v-model="form.id"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="功能名称"
                    prop="functionName"
                    :rules="{
                        required: true,
                        message: '功能名称不能为空',
                        trigger: 'blur'
                    }">
                    <el-input
                        v-model="form.functionName"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="所属官网"
                    prop="appWebSiteId"
                    :rules="{
                        required: true,
                        message: '请选择所属官网',
                        trigger: 'blur'
                    }">
                    <el-select
                        clearable
                        v-model="form.appWebSiteId"
                        placeholder="请选择官网"
                        style="width: 100%">
                        <el-option
                            v-for="item in appList"
                            :key="item.id"
                            :label="item.webSiteName"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="使用次数"
                    prop="numberUse"
                    :rules="{
                        required: true,
                        message: '功能使用次数不能为空',
                        trigger: 'blur'
                    }">
                    <el-input
                        type="number"
                        v-model="form.numberUse"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="计数阈值"
                    prop="numberThreshold"
                    :rules="{
                        required: true,
                        message: '计数阈值不能为空',
                        trigger: 'blur'
                    }">
                    <el-input
                        type="number"
                        v-model="form.numberThreshold"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                    label="触发概率"
                    prop="probability"
                    :rules="{
                        required: true,
                        message: '功能触发概率不能为空',
                        trigger: 'blur'
                    }">
                    <el-input
                        v-model="form.probability"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="深度链接">
                    <div class="deep-link-container">
                        <template v-if="deepLinkView.length">
                            <div
                                v-for="(deep, index) in deepLinkView"
                                :key="index"
                                class="deep-link-item">
                                <span class="system-label">
                                    {{ deep.system }}
                                </span>
                                <div class="url-wrapper">
                                    <p class="url-text">{{ deep.depthLinkUrl }}</p>
                                    <el-button
                                        type="primary"
                                        size="small"
                                        class="copy-btn"
                                        @click="copyUrl(deep.depthLinkUrl)">
                                        复制
                                    </el-button>
                                </div>
                            </div>
                        </template>

                        <!-- 空状态 -->
                        <div
                            v-else
                            class="empty-state">
                            <el-empty
                                :image-size="120"
                                description="暂无数据">
                                <template #description>
                                    <p class="empty-text">暂无深度链接数据</p>
                                </template>
                            </el-empty>
                        </div>
                    </div>
                    <el-button
                        type="primary"
                        @click="eidtorDeepLink"
                        >编辑</el-button
                    >
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="edit"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <!-- 编辑深度链接 -->
        <el-dialog
            title="深度链接"
            :visible.sync="isEditorDeeplink"
            :before-close="
                () => {
                    isEditorDeeplink = false
                }
            "
            width="40%">
            <ul class="deeplinkContent">
                <li class="scheme_row">
                    <el-input
                        v-model="deepLinkForm.depthLink"
                        placeholder="请输入深度链接"></el-input>
                </li>
                <li
                    class="input_item"
                    v-for="(item, index) in deepLinkForm.params"
                    :key="item.deepName">
                    <div class="systemRow">
                        <el-select
                            v-model="item.system"
                            placeholder="请选择系统">
                            <el-option
                                v-for="el in system"
                                :key="el.value"
                                :label="el.label"
                                :value="el.value"></el-option>
                        </el-select>
                        <i
                            class="el-icon-circle-close"
                            style="cursor: pointer"
                            @click="deleteSystem(index)"></i>
                    </div>
                    <div
                        class="paramsRow"
                        v-for="(param, paramsIndex) in item.params">
                        <el-input
                            v-model="param.param"
                            style="flex: 1; margin-right: 5px"
                            placeholder="请输入深度链接参数Key"></el-input>
                        <el-input
                            v-model="param.value"
                            style="flex: 1; margin-right: 5px"
                            placeholder="请输入深度链接参数Value" />
                        <el-button
                            type="danger"
                            @click="removeRow(index, paramsIndex)"
                            >删除参数</el-button
                        >
                    </div>
                    <div>
                        <el-button
                            style="margin-top: 5px"
                            type="primary"
                            @click="
                                item.params.push({
                                    param: '',
                                    value: ''
                                })
                            ">
                            添加参数</el-button
                        >
                    </div>
                </li>
                <li class="button_item">
                    <el-button
                        style="width: 100%"
                        type="primary"
                        @click="addSystem"
                        >添加系统</el-button
                    >
                </li>
            </ul>

            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="cancelDeepParams">取 消</el-button>
                <el-button
                    type="primary"
                    @click="comfirmDeepLink"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {serverIp} from '../../public/config'

export default {
    name: 'User',

    data() {
        return {
            serverIp: serverIp,
            tableData: [],
            total: 0,
            pageNum: 1,
            pageSize: 15,
            // integration: "",
            username: '',
            form: {
                id: '',
                appWebSiteId: '',
                functionName: '',
                numberUse: '',
                numberThreshold: '',
                probability: ''
            },
            dialogFormVisible: false,
            dialogFormVisible1: false,
            multipleSelection: [],
            roles: [],
            appList: [],
            courses: [],
            itemKey: '',
            vis: false,
            stuCourses: [],
            stuVis: false,
            isEditorDeeplink: false,
            deepLinkView: [],
            system: [
                {
                    label: 'ios',
                    value: 'ios'
                },
                {
                    label: 'android',
                    value: 'android'
                }
            ],
            deepLinkForm: {
                depthLink: '',
                params: [
                    {
                        system: '',
                        params: [
                            {
                                param: '',
                                value: ''
                            }
                        ]
                    }
                ]
            }
        }
    },
    watch: {
        username(newVal) {
            if (newVal != undefined && newVal != '') {
                this.pageNum = 1
            }
        }
    },
    created() {
        this.load()
    },
    computed: {
        selectTag() {
            return function (value) {
                const matchedObject = this.appList.find(obj => obj.id == value)
                return matchedObject ? matchedObject.webSiteName : ''
            }
        }
    },
    methods: {
        load() {
            /*Axios请求分页查询*/
            this.request
                .get('/functionManage/functionList', {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                })
                .then(res => {
                    this.itemKey = Math.random()
                    this.tableData = res.data.functionList.records
                    this.total = res.data.functionList.total
                })
            this.request.get('/appManage/appManages').then(res => {
                this.appList = res.data.appList
            })
        },
        save() {
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    const param = JSON.parse(JSON.stringify(this.form))
                    param.depthLinkParam = JSON.stringify(param.depthLinkParam)
                    this.request.post('/functionManage/saveFunction', param).then(res => {
                        if (res.code === '200') {
                            this.$message.success('保存成功')
                            this.dialogFormVisible = false

                            if (this.username) {
                                this.search()
                            } else {
                                this.load()
                            }
                            this.form = {}
                        } else {
                            res.msg
                            this.$message.error('保存失败')
                        }
                    })
                } else {
                }
            })
        },
        edit() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    const param = JSON.parse(JSON.stringify(this.form))
                    param.depthLinkParam = JSON.stringify(param.depthLinkParam)
                    this.request.post('/functionManage/saveFunction', param).then(res => {
                        if (res.code === '200') {
                            this.$message.success('保存成功')
                            this.dialogFormVisible1 = false
                            if (this.username) {
                                this.search()
                            } else {
                                this.load()
                            }

                            this.form = {}
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                } else {
                }
            })
        },
        reset() {
            this.username = ''
            this.load()
        },
        handleSelectionChange(val) {
            //删除确认提醒框
            this.multipleSelection = val
        },
        deleteBatch() {
            let ids = this.multipleSelection.map(v => v.id) // 因为后端的是List数组 而这ids是对象数组 所以要用前端的map(v => v.id)把对象数组 [{},{},{}] 转变成纯id的数组 [1,2,3,...]
            this.request.post('/user/del/batch/', ids).then(res => {
                if (res.code === '200') {
                    this.$message.success('批量删除成功')
                    if (this.username) {
                        this.search()
                    } else {
                        this.load()
                    }
                } else {
                    this.$message.error('批量删除失败')
                }
            })
        },
        parseUrlParams(url) {
            try {
                // 1. 获取问号后面的部分
                const paramsString = url.split('?')[1]
                if (!paramsString) return {}

                // 2. 分割参数对
                const paramsArray = paramsString.split('&')

                // 3. 解析每个参数对
                const paramsObject = {}
                paramsArray.forEach(param => {
                    const [key, value] = param.split('=')
                    if (key && value) {
                        // 解码 URL 编码的值
                        paramsObject[decodeURIComponent(key)] = decodeURIComponent(value)
                    }
                })

                return paramsObject
            } catch (err) {
                console.error('URL解析错误:', err)
                return {}
            }
        },
        async getDeepLinkList(functionId, webId) {
            try {
                // const res = await this.request.get('/functionManage/depthList', {
                //     params: {
                //         appWebSiteId: webId,
                //         functionId: functionId
                //     }
                // })
                const res = await this.request.post('/functionManage/functionInfo', {
                    id: functionId
                })
                console.log('res', res)
                console.log('获取深度链接成功', JSON.parse(res.data.functionInfo.depthLinkParam))
                const depthLink = res.data.functionInfo.depthLink
                // if (res.code == 200) {
                //     this.deepLinkView = res.data.depths
                // }
                const deeplinklist = []
                const depthLinkParam = JSON.parse(res.data.functionInfo.depthLinkParam)
                depthLinkParam.forEach(item => {
                    let params
                    if (item.params.length) {
                        params = {
                            system: item.system,
                            depthLinkUrl: depthLink + '?' + item.params.map(item => `${item.param}=${item.value}`).join('&')
                        }
                    } else {
                        params = {
                            system: item.system,
                            depthLinkUrl: depthLink
                        }
                    }

                    deeplinklist.push(params)
                })
                console.log('deepLinkView', deeplinklist)
                this.deepLinkView = deeplinklist
            } catch (err) {
                console.log('获取深度链接失败', err)
            }
        },
        handleEdit(row) {
            this.form = JSON.parse(JSON.stringify(row))
            console.log('row', row)
            this.deepLinkView = []
            this.deepLinkForm = {
                depthLink: '',
                params: [
                    {
                        system: '',
                        params: [
                            {
                                param: '',
                                value: ''
                            }
                        ]
                    }
                ]
            }
            this.getDeepLinkList(row.id, row.appWebSiteId)
            this.dialogFormVisible1 = true
        },
        handleDelete(id) {
            this.request
                .post('/functionManage/deleteFunction', {
                    id
                })
                .then(res => {
                    if (res.code === '200') {
                        this.$message.success('删除成功')
                        if (this.username) {
                            this.search()
                        } else {
                            this.load()
                        }
                    } else {
                        this.$message.error('删除失败')
                    }
                })
        },
        handleAdd() {
            this.dialogFormVisible = true
            this.form = {}
            this.deepLinkView = []
            this.deepLinkForm = {
                depth_link: '',
                params: [
                    {
                        system: '',
                        params: [
                            {
                                param: '',
                                value: ''
                            }
                        ]
                    }
                ]
            }
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.load()
            if (this.username != undefined && this.username != '') {
                this.search()
            } else {
                this.load()
            }
        },
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum
            if (this.username != undefined && this.username != '') {
                this.search()
            } else {
                this.load()
            }
        },
        search() {
            this.request
                .post('/functionManage/searchFunction', {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    appWebSiteId: this.username
                })
                .then(res => {
                    this.tableData = res.data.searchData.records
                    this.total = res.data.searchData.total
                })
            this.request.get('/appManage/appManages').then(res => {
                this.appList = res.data.appList
            })
        },
        //编辑深度链接
        eidtorDeepLink() {
            if (this.deepLinkView.length) {
                this.deepLinkForm.depthLink = this.deepLinkView[0].depthLinkUrl.split('?')[0]
                this.deepLinkForm.params = []
                this.deepLinkView.forEach(item => {
                    const paramsObj = this.parseUrlParams(item.depthLinkUrl)
                    console.log('paramsObj', paramsObj)
                    const params = []
                    for (let key in paramsObj) {
                        params.push({
                            param: key,
                            value: paramsObj[key]
                        })
                    }
                    this.deepLinkForm.params.push({
                        system: item.system,
                        params
                    })
                })
                console.log('deepLinkForm', this.deepLinkForm)
            }
            this.isEditorDeeplink = true
        },

        addSystem() {
            if (this.deepLinkForm.params.length >= this.system.length) {
                this.$message.error('系统已上限')
                return
            }
            this.deepLinkForm.params.push({system: '', params: [{param: '', value: ''}]})
        },
        //删除该系统
        deleteSystem(index) {
            this.deepLinkForm.params.splice(index, 1)
        },
        //删除该参数
        removeRow(index, paramsIndex) {
            this.deepLinkForm.params[index].params.splice(paramsIndex, 1)
        },
        cancelDeepParams() {
            this.deepLinkForm = {
                depth_link: '',
                params: [
                    {
                        system: '',
                        params: [
                            {
                                param: '',
                                value: ''
                            }
                        ]
                    }
                ]
            }
            this.isEditorDeeplink = false
        },

        comfirmDeepLink() {
            let isValid = true
            if (!this.deepLinkForm.depthLink) {
                return this.$message.error('请输入深度链接')
            }
            this.deepLinkForm.params.forEach(item => {
                if (!item.system) {
                    isValid = false
                    return this.$message.error('请选择系统')
                }
                item.params = item.params.filter(param => param.param && param.value) // 过滤掉空值
            })
            if (!isValid) {
                return
            }
            this.form.depthLink = this.deepLinkForm.depthLink
            this.form.depthLinkParam = this.deepLinkForm.params
            const params = JSON.parse(JSON.stringify(this.deepLinkForm.params))
            console.log('pra', JSON.parse(JSON.stringify(params)))
            params.forEach((item, index) => {
                if (item.params.length) {
                    item.depthLinkUrl = `${this.deepLinkForm.depthLink}?${item.params
                        .filter(param => param.param && param.value) // 过滤掉空值
                        .map(param => `${param.param}=${param.value}`)
                        .join('&')}`
                    delete item.params
                    if (item.depthLinkUrl == '?') {
                        params.splice(index, 1)
                    }
                } else {
                    delete item.params
                    item.depthLinkUrl = this.deepLinkForm.depthLink
                }
            })

            this.deepLinkView = params
            this.cancelDeepParams()
        },
        copyUrl(text) {
            // 方法1：使用 textarea
            try {
                const textarea = document.createElement('textarea')
                textarea.value = text
                textarea.style.position = 'fixed'
                textarea.style.opacity = '0'
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
                this.$message.success('复制成功')
            } catch (err) {
                this.$message.error('复制失败')
                console.error('复制失败:', err)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.headerBg {
    background: #eee !important;
}
.el-table__header {
    width: 100% !important;
}
.el-table__body {
    width: 100% !important;
}
.deeplinkContent {
    list-style: none;
    .scheme_row {
        margin-bottom: 10px;
    }
    .input_item {
        border: 1px solid #ccc;
        padding: 5px;
        margin-bottom: 10px;
        .systemRow {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .paramsRow {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
    }
}
.deep-link-container {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.deep-link-item {
    display: flex;
    flex-direction: column;
    padding: 12px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 12px;
    transition: all 0.3s ease;

    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .system-label {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;

        // 可以添加图标
        &::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #409eff;
            border-radius: 50%;
            margin-right: 8px;
            vertical-align: middle;
        }
    }

    .url-wrapper {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #f5f7fa;
        padding: 8px 12px;
        border-radius: 4px;

        .url-text {
            flex: 1;
            margin: 0;
            font-size: 13px;
            color: #666;
            word-break: break-all;
            line-height: 1.4;
        }

        .copy-btn {
            flex-shrink: 0;
        }
    }
}
</style>
