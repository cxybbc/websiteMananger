<template>
    <div>
        <el-dialog
            title="编辑深度链接"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            width="40%">
            <el-form
                ref="form"
                :model="form"
                label-width="110px"
                :label-position="'left'">
                <el-form-item
                    label="官网"
                    prop="appId">
                    <el-select
                        v-model="form.appId"
                        placeholder="请选择官网"
                        filterable
                        clearable>
                        <el-option
                            v-for="item in appList"
                            :key="item.id"
                            :label="item.webSiteName"
                            :value="item.id"></el-option></el-select
                ></el-form-item>
                <el-form-item
                    label="深度链接名称"
                    prop="deepLinkName">
                    <el-input
                        v-model="form.deepLinkName"
                        placeholder="请输入深度链接名称"></el-input>
                </el-form-item>
                <el-form-item
                    label="iOS深度链接"
                    prop="deepLink">
                    <el-input
                        disabled
                        v-model="form.iOSDeepLink"
                        placeholder="深度链接"></el-input>
                    <el-button
                        style="margin-top: 5px"
                        type="primary"
                        @click="goAddDeepLink('ios')"
                        >编辑</el-button
                    >
                </el-form-item>
                <el-form-item
                    label="Android深度链接"
                    prop="deepLink">
                    <el-input
                        disabled
                        v-model="form.AndroidDeepLink"
                        placeholder="深度链接"></el-input>
                    <el-button
                        style="margin-top: 5px"
                        type="primary"
                        @click="goAddDeepLink('android')"
                        >编辑</el-button
                    >
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        v-model="form.remark"
                        type="textarea"
                        placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button
                    type="primary"
                    @click="comfirm"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:dialogVisible', 'close', 'confirm'],
    data() {
        return {
            //官网列表
            appList: [],
            form: {
                appId: '',
                iOSDeepLink: '',
                AndroidDeepLink: '',
                remark: ''
            },
            //深度链接编辑
            deepLinkEdit: false,
            editorType: '',
            scheme: '',
            deepLinkList: [
                {
                    deepParamName: '',
                    deepParamValue: ''
                }
            ]
        }
    },
    methods: {
        //关闭
        handleClose() {
            this.form = {
                appId: '',
                iOSDeepLink: '',
                AndroidDeepLink: ''
            }
            this.$emit('close')
        },
        //确认
        comfirm() {
            this.handleClose()

            this.$emit('confirm')
        },
        //获取官网列表
        async getAppList() {
            try {
                const res = await this.request.get('/appManage/appManages')

                console.log('官网列表', res)
                if (res.code == 200) {
                    this.appList = res.data.appList
                } else {
                    this.$message.error('获取官网列表失败')
                }
            } catch (err) {
                console.log('获取失败', err)
            }
        },
        //获取下载渠道
        async getDownloadChannel() {
            try {
            } catch (err) {
                console.log('获取失败', err)
            }
        },
        goAddDeepLink(type) {
            this.editorType = type
            if (type == 'ios') {
                if (this.form.iOSDeepLink) {
                    this.deepLinkList = this.form.iOSDeepLink.split('?')[1]
                        ? this.form.iOSDeepLink
                              .split('?')[1]
                              .split('&')
                              .map(item => {
                                  return {
                                      deepParamName: item.split('=')[0],
                                      deepParamValue: item.split('=')[1]
                                  }
                              })
                        : [
                              {
                                  deepParamName: '',
                                  deepParamValue: ''
                              }
                          ]
                    this.scheme = this.form.iOSDeepLink.split('?')[0]
                } else {
                    this.deepLinkList = [
                        {
                            deepParamName: '',
                            deepParamValue: ''
                        }
                    ]
                    this.scheme = ''
                }
            } else {
                if (this.form.AndroidDeepLink) {
                    this.deepLinkList = this.form.AndroidDeepLink.split('?')[1]
                        ? this.form.AndroidDeepLink.split('?')[1]
                              .split('&')
                              .map(item => {
                                  return {
                                      deepParamName: item.split('=')[0],
                                      deepParamValue: item.split('=')[1]
                                  }
                              })
                        : [
                              {
                                  deepParamName: '',
                                  deepParamValue: ''
                              }
                          ]
                    this.scheme = this.form.AndroidDeepLink.split('?')[0]
                } else {
                    this.deepLinkList = [
                        {
                            deepParamName: '',
                            deepParamValue: ''
                        }
                    ]
                    this.scheme = ''
                }
            }
            this.deepLinkEdit = true
        },
        //取消深度链接
        cancelDeepParams() {
            this.deepLinkList = [
                {
                    deepParamName: '',
                    deepParamValue: ''
                }
            ]

            this.scheme = ''
            this.deepLinkEdit = false
        },
        //确定深度链接
        comfirmDeepLink() {
            this.deepLinkList = this.deepLinkList.filter(item => item.deepParamName && item.deepParamValue)
            if (this.editorType == 'ios') {
                this.form.iOSDeepLink = this.deepLinkList.length ? `${this.scheme}?${this.deepLinkList.map(item => `${item.deepParamName}=${item.deepParamValue}`).join('&')}` : `${this.scheme}`
            } else {
                this.form.AndroidDeepLink = this.deepLinkList.length ? `${this.scheme}?${this.deepLinkList.map(item => `${item.deepParamName}=${item.deepParamValue}`).join('&')}` : `${this.scheme}`
            }

            this.cancelDeepParams()
        },
        //删除行
        removeRow(index) {
            this.deepLinkList.splice(index, 1)
        }
    },
    mounted() {
        this.getAppList()
    }
}
</script>

<style lang="less" scoped>
.deeplinkContent {
    list-style: none;
    .scheme_row {
        margin-bottom: 10px;
    }
    .input_item {
        display: flex;
        align-items: center;

        margin-bottom: 10px;
    }
}
</style>
