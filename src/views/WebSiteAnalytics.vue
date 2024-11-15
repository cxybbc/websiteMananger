<template>
    <div class="btClass" style="text-align: center">
        <div class="day_bt">
            <el-button type="primary" style="width: 300px; height:100px;" @click="formmasterBT">Formmaster当天日志分析</el-button>
            <el-button type="primary" style="width: 300px; height:100px;" @click="retouchBT">Phoretouch当天日志分析</el-button>
            <el-button type="primary" style="width: 300px; height:100px;" @click="knockoutBT">Proknockout当天日志分析</el-button>
            <el-button type="primary" style="width: 300px; height:100px;" @click="pptBT">PPT当天日志分析</el-button>
        </div>
        <div class="history_bt" style="margin-top: 20px;">
            <el-button type="primary" style="width: 300px; height:100px;" @click="formmasterOBT">Formmaster历史日志分析</el-button>
            <el-button type="primary" style="width: 300px; height:100px;" @click="retouchOBT">Phoretouch历史日志分析</el-button>
            <el-button type="primary" style="width: 300px; height:100px;" @click="knockoutOBT">Proknockout历史日志分析</el-button>
            <el-button type="primary" style="width: 300px; height:100px;" @click="pptOBT">PPT历史日志分析</el-button>
        </div>
    </div>
</template>
<script>
 export default {
    data() {
        return {}
    },
    methods: {
        formmasterBT() {
            window.open("http://47.251.33.229/formmasterLog.html", '_blank')
        },
        retouchBT() {
            window.open("http://47.251.33.229/retouchLog.html", '_blank')
        },
        knockoutBT() {
            window.open("http://47.251.33.229/proknockoutLog.html", '_blank')
        },
        pptBT() {
            window.open("http://47.251.33.229/imypptLog.html", '_blank')
        },
        formmasterOBT() {
            window.open("http://47.251.33.229/formmasterLog-old.html", '_blank')
        },
        retouchOBT() {
            window.open("http://47.251.33.229/photoretouchLog-old.html", '_blank')
        },
        knockoutOBT() {
            window.open("http://47.251.33.229/proknockoutLog-old.html", '_blank')
        },
        pptOBT() {
            window.open("http://47.251.33.229/imypptLog-old.html", '_blank')
        }
    }
 }
</script>
<style>
.day_bt {
    display: flex;
    justify-content: space-around;
}

.day_bt > el-button {
    flex-grow: 1;
}

.history_bt {
    display: flex;
    justify-content: space-around;
}

.history_bt > el-button {
    flex-grow: 1;
}
</style>