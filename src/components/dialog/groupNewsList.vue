<template>
    <div>
        <el-dialog title="新闻分类列表" :visible.sync="dialogVisible" width="80%" :before-close="hideBox"
            :close-on-click-modal="false">
            <div class="filter_box">


                <div class="filter_item">
                    <p>一级分类：</p>
                    <el-select v-model="serachData.classificationId" filterable placeholder="请选择" @change="selectFirst">
                        <el-option v-for="item in groupList" :key="item.id" :label="item.classificationName"
                            :value="item.id"> </el-option>
                    </el-select>
                </div>
                <div class="filter_item">
                    <p>二级分类：</p>
                    <el-select clearable v-model="serachData.supClassificationId" filterable placeholder="请选择"
                        @change="selectSecond">
                        <el-option v-for="item in childGroupList" :key="item.id" :label="item.classificationName"
                            :value="item.id"> </el-option>
                    </el-select>
                </div>
            </div>

            <div class="table">
                <div class="table_header">
                    <div class="table_header_item" v-for="(item, index) in headerList" :key="index">
                        {{ item.name }}
                    </div>


                </div>
                <draggable :list="list" class="list-group" ghost-class="ghost" @start="draggStart" @end="draggEnd">
                    <div class="list-group-item" v-for="element in list" :key="element.name">
                        <div class="cl_item" v-for="(item, index) in headerList" :key="index">
                            <div v-if="item.value == 'title'">{{ element[item.value] }}</div>
                            <div v-if="item.value == 'id'">{{ element[item.value] }}</div>
                            <div v-if="item.value == 'newsTime'">
                                {{ element[item.value] }}
                            </div>
                            <div v-if="item.value == 'cover'">
                                <img :src="'//' + element[item.value]" alt="">
                            </div>
                        </div>

                    </div>
                </draggable>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { defineComponent } from 'vue'
    import request from '@/utils/request'
    import dayjs from 'dayjs'
    import draggable from 'vuedraggable'
    export default defineComponent({
        name: 'groupNewsList',

        props: {
            isShow: Boolean,
            groupList: Array,
        },
        data() {
            return {
                serachData: {

                    classificationId: '', //一级分类id
                    supClassificationId: '' //二级分类id 
                },
                list: [

                ],
                headerList: [
                    { name: "新闻标题", id: 0, value: 'title' },
                    { name: "新闻id", id: 1, value: 'id' },
                    { name: "新闻发布时间", id: 2, value: 'newsTime' },
                    { name: '封面图', id: 3, value: 'cover' }
                ]
            }
        },

        computed: {
            dialogVisible() {
                return this.isShow
            },
            websiteList() {
                return this.$store.state.webSiteList
            },
            childGroupList() {
                const item = this.groupList.find(item => item.id == this.serachData.classificationId)
                return item ? item.children : []
            }
        },

        watch: {
            dialogVisible(newVal, oldVal) {
                if (newVal) {
                    console.log('显示');
                    this.serachData.classificationId = this.groupList[0].id
                    this.getNewsList()


                } else {
                    console.log('隐藏');
                }
            }
        },

        methods: {


            async getNewsList() {
                try {
                    const id = this.serachData.supClassificationId || this.serachData.classificationId
                    const res = await request.get('/news/findNews', {
                        params: {
                            classificationId: id
                        }
                    })
                    console.log('新闻列表', res);

                    if (res.code == 200) {
                        this.list = res.data.newsList
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        })
                    }
                } catch (err) {
                    console.log('新闻列表', err);

                }
            },
            hideBox() {
                this.$emit('refresh')
            },
            selectFirst(val) {
                console.log('groupList', this.groupList, val);
                this.serachData.supClassificationId = ''
                this.getNewsList()
            },
            selectSecond(val) {
                console.log('groupList', this.groupList, val);
                this.getNewsList()
            },

            async updateSortIndex() {
                try {
                    const res = await request.post('/news/moveNews', {
                        relations: this.list
                    })
                    console.log('更新结果', res);
                    if (res.code == 200) {
                        this.$message({
                            message: '更新成功',
                            type: 'success',
                        })
                        this.getNewsList()
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error',
                        })
                    }
                } catch (err) {

                }
            },
            draggStart(val) {


                console.log('start', val);
            },
            draggEnd(val) {
                console.log('end', val);
                console.log('list', this.list);
                this.list.forEach((item, index) => {
                    item.sortIndex = index
                })


                this.updateSortIndex()

            },

        },

        components: {
            draggable
        },
        mounted() {

        }
    })
</script>

<style lang="less" scoped>


    .filter_box {
        display: flex;
        column-gap: 10px;
        row-gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 10px;

        .filter_item {
            display: flex;
            align-items: center;

            p {
                flex-shrink: 0;
            }
        }
    }

    .table {
        width: 100%;
        height: 500px;
        overflow: scroll;

        &::-webkit-scrollbar {
            display: none;
        }

        .table_header {
            position: sticky;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            display: flex;
            background: #fff;

            .table_header_item {
                flex: 1;
                box-sizing: border-box;
                padding: 10px;
                border-bottom: 1px solid #ccc;
            }
        }

        .list-group {
            .list-group-item {
                display: flex;
                box-sizing: border-box;
                padding: 10px 0;
                border-bottom: 1px solid #ccc;
                cursor: move;


                .cl_item {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                    padding: 10px;

                    img {
                        width: 50%;
                        height: auto;
                    }
                }
            }
        }
    }
</style>
