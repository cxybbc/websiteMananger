<template>
    <div>
        <el-dialog title="分类管理" :visible.sync="dialogVisible" width="500px" :before-close="closeDialog"
            :close-on-click-modal="false">



            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="分类层级">
                    <el-radio-group v-model="type">
                        <el-radio :label="1">一级分类</el-radio>
                        <el-radio :label="2">二级分类</el-radio>

                    </el-radio-group>
                </el-form-item>
                <el-form-item label="一级分类" v-if="type === 2">
                    <el-select v-model="form.classificationId" placeholder="请选择一级分类" @change="selectGroup">

                        <el-option v-for="item in groupList" :key="item.id" :label="item.classificationName"
                            :value="item.id"></el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="分类列表" v-if="groupListC.length">

                    <ul class="groupList">
                        <li v-for="(item, index) in groupListC" :key="index" style="margin-bottom:10px">
                            <el-input style="width: 190px;margin-right:10px"
                                v-model="item.classificationName"></el-input>
                            <el-button type="primary" @click="updateName(item)">确定</el-button>
                            <el-button type="danger" @click="deleteGroup(item)">删除</el-button>
                        </li>
                    </ul>
                </el-form-item>

            </el-form>


            <span slot=" footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'

    import request from '@/utils/request'
    export default defineComponent({
        name: 'EditorNewGroup',

        props: {
            isShow: Boolean,
            groupList: Array,
        },
        data() {
            return {
                type: 1,
                form: {
                    classificationId: 0
                },
                groupListC: []

            }
        },

        computed: {
            dialogVisible() {
                return this.isShow
            },
            websiteList() {
                return this.$store.state.webSiteList
            }
        },

        watch: {
            type(newVal, oldVal) {
                console.log('type', this.type);
                if (newVal == 1) {
                    this.groupListC = JSON.parse(JSON.stringify(this.groupList))
                    this.form.classificationId = 0
                } else {
                    this.form.classificationId = ''
                    this.groupListC = []
                }
            },
            dialogVisible(newVal, oldVal) {
                if (newVal) {
                    this.groupListC = JSON.parse(JSON.stringify(this.groupList))
                }
            },
            groupList: {
                handler(newVal, oldVal) {
                    console.log('groupList', newVal);
                    if (newVal.length) {
                        this.groupListC = JSON.parse(JSON.stringify(newVal))
                    }
                },
                deep: true
            }
        },

        methods: {
            selectGroup() {


                console.log('id', this.form.classificationId);
                const item = this.groupList.find(item => item.id == this.form.classificationId)
                console.log('object', item.children);
                this.groupListC = JSON.parse(JSON.stringify(item.children))
            },
            closeDialog() {

                this.form.classificationId = 0
                this.type = 1
                this.groupListC = []
                this.$emit('refresh')
            },

            async updateName(item) {
                try {
                    const res = await request.post('/newsClassification/save', {
                        id: item.id,
                        classificationName: item.classificationName,
                        supClassificationId: this.form.classificationId

                    })
                    console.log('res', res);
                    if (res.code == 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                        this.$emit('refresh2')


                    } else {
                        this.$message({
                            message: '修改失败',
                            type: 'error'
                        })
                    }
                } catch (err) {
                    console.log('err', err);
                }
            },
            async deleteGroup(item) {
                try {
                    const res = await request.post(`/newsClassification/del/${item.id}`)
                    console.log('res', res);
                    if (res.code == 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        })
                        this.$emit('refresh2')
                    } else {
                        this.$message({
                            message: '修改失败',
                            type: 'error'
                        })
                    }

                } catch (err) {
                    console.log('err', err);
                }
            }

        },


        mounted() {

        }
    })
</script>

<style lang="less" scoped></style>
