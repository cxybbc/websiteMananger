<template>
  <div>
    <div style="padding: 10px 0; text-align: right">
      <el-select
        clearable
        v-model="appWebsiteId"
        placeholder="请选择官网"
        style="width: 400px"
      >
        <el-option
          v-for="item in appList"
          :key="item.id"
          :label="item.webSiteName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-button class="ml-5" type="primary" @click="search">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="padding: 10px 0">
      <el-button type="primary" @click="handleAdd"
        >新增<i class="el-icon-circle-plus-outline"></i
      ></el-button>
    </div>
    <el-table
      :data="tableData"
      :key="itemKey"
      style="width: 100%"
      border
      stripe
      :header-cell-class-name="'headerBg'"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="id"
        label="编号"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="pointTitle"
        label="布局点标题"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="point"
        label="布局点"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="appWebsiteId"
        label="所属网站"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="primary">{{
            selectTag(scope.row.appWebsiteId)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sortIndex"
        label="排序索引"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
        align="center"
      >
      </el-table-column>

      <el-table-column prop="operation" label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)"
            >编辑 <i class="el-icon-edit"></i
          ></el-button>
          <el-popconfirm
            class="ml-5"
            confirm-button-text="好的"
            cancel-button-text="我在想想"
            icon="el-icon-info"
            icon-color="red"
            title="您确定删除吗？"
            @confirm="handleDelete(scope.row.id)"
          >
            <el-button type="danger" slot="reference"
              >删除<i class="el-icon-remove-outline"></i
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 布局点新增弹窗 -->
    <el-dialog title="新增布局点" :visible.sync="isStepsadd" width="40%">
      <el-form label-width="80px" size="small" ref="addForm" :model="form">
        <el-form-item
          label="布局点标题"
          :rules="{
            required: true,
            message: '请输入布局点标题',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="form.pointTitle"
            placeholder="请输入布局点标题"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="布局点"
          :rules="{
            required: true,
            message: '请输入布局点',
            trigger: 'blur',
          }"
        >
          <el-input
            type="number"
            v-model="form.point"
            placeholder="请输入布局点"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属官网"
          :rules="{
            required: true,
            message: '请选择所属官网',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.appWebSiteId"
            placeholder="请选择官网"
            style="width: 100%"
          >
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.webSiteName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isStepsadd = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 布局点编辑弹窗 -->
    <el-dialog title="编辑布局点" :visible.sync="isStepsedit" width="40%">
      <el-form label-width="80px" size="small" ref="addForm" :model="editForm">
        <el-form-item
          label="布局点标题"
          :rules="{
            required: true,
            message: '请输入布局点标题',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="editForm.pointTitle"
            placeholder="请输入布局点标题"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="布局点"
          :rules="{
            required: true,
            message: '请输入布局点',
            trigger: 'blur',
          }"
        >
          <el-input
            type="number"
            v-model="editForm.point"
            placeholder="请输入布局点"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="排序索引"
          :rules="{
            required: true,
            message: '请输入排序索引',
            trigger: 'blur',
          }"
        >
          <el-input
            type="number"
            v-model="editForm.sortIndex"
            placeholder="请输入排序索引"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属官网"
          :rules="{
            required: true,
            message: '请选择所属官网',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="editForm.appWebSiteId"
            placeholder="请选择官网"
            style="width: 100%"
          >
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.webSiteName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isStepsedit = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      tableData: [],
      appList: [],
      appWebsiteId: "",
      total: "",
      form: {
        appWebSiteId: "",
        point: "",
        pointTitle: "",
        id: "",
        sortIndex: "",
      },
      editForm: {
        appWebSiteId: "",
        point: "",
        pointTitle: "",
        id: "",
        sortIndex: "",
      },
      isStepsadd: false,
      isStepsedit: false,
    };
  },
  methods: {
    //获取教程布局点列表数据
    getStepsPositionData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };

      this.request.get("/stepsPoint/searchPoint", { params }).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.tableData = res.data.pointList.records;
          this.total = res.data.pointList.total;
          console.log("教程布局点信息列表", this.tableData);
          this.request.get("/appManage/appManages").then((res) => {
            this.appList = res.data.appList;
          });
        }
      });
    },

    //布局点新增弹窗
    handleAdd() {
      this.isStepsadd = true;
    },
    //布局点编辑弹窗
    handleEdit(row) {
      console.log("编辑", row);
      this.editForm = {
        appWebSiteId: row.appWebsiteId,
        point: row.point,
        pointTitle: row.pointTitle,
        id: row.id,
        sortIndex: row.sortIndex,
      };
      this.isStepsedit = true;
    },
    edit() {
      const data = {
        id: this.editForm.id,
        appWebsiteId: this.editForm.appWebSiteId,
        point: this.editForm.point,
        pointTitle: this.editForm.pointTitle,
        sortIndex: this.editForm.sortIndex,
      };
      console.log("编辑", data);
      this.request.post("/stepsPoint/updatePoint", data).then((res) => {
        if (res.code === "200") {
          this.$message.success("编辑布局点成功");
          this.isStepsedit = false;
          this.editForm = {
            appWebsiteId: "",
            point: "",
            pointTitle: "",
            id: "",
            sortIndex: "",
          };
          this.getStepsPositionData();
        }
      });
    },
    //保存
    save() {
      const data = {
        appWebsiteId: this.form.appWebSiteId,
        point: this.form.point,
        pointTitle: this.form.pointTitle,
      };
      console.log("data", data);
      this.request.post("/stepsPoint/addPoint", data).then((res) => {
        if (res.code === "200") {
          this.$message.success("新增布局点成功");
          this.isStepsadd = false;
          this.form = {
            appWebSiteId: "",
            point: "",
            pointTitle: "",
            id: "",
            sortIndex: "",
          };
          this.getStepsPositionData();
        }
      });
    },

    //删除
    handleDelete(id) {
      console.log("删除", id);

      // 创建 FormData 对象
      const formData = new FormData();
      formData.append("pointId", id);

      console.log("参数", formData);

      this.request.post("/stepsPoint/delPoint", formData).then((res) => {
        if (res.code === "200") {
          this.$message.success("删除布局点成功");
          this.getStepsPositionData();
        }
      });
    },

    //搜索
    search() {
      console.log("搜索", this.appWebsiteId, this.pageNum, this.pageSize);
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        appWebsiteId: this.appWebsiteId,
      };
      this.request
        .get("/stepsPoint/searchPoint", {
          params,
        })

        .then((res) => {
          console.log("搜索", res);

          this.tableData = res.data.pointList.records;
          this.total = res.data.pointList.total;
        });
    },

    //翻页
    handleSizeChange(size) {
      this.pageSize = size;
      this.getStepsPositionData();
    },
    handleCurrentChange(currentPage) {
      this.pageNum = currentPage;
      this.getStepsPositionData();
    },
    reset() {
      this.getStepsPositionData();
      this.appWebsiteId = "";
    },
  },
  computed: {
    selectTag() {
      return function (value) {
        const matchedObject = this.appList.find((obj) => obj.id == value);
        return matchedObject ? matchedObject.webSiteName : "";
      };
    },
  },
  mounted() {
    this.getStepsPositionData();
  },
};
</script>

<style lang="scss" scoped></style>
