<template>
    <div>
        <header>
            <el-form ref="formRef" style="max-width: 600px" :model="numberValidateForm" label-width="auto" class="demo-ruleForm">
                <el-form-item label="应用站点" prop="age">
                    <el-input v-model.number="numberValidateForm.age" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
                    <el-button @click="resetForm(formRef)">Reset</el-button>
                </el-form-item>
            </el-form>
        </header>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>
