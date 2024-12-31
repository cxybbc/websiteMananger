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
      style="width: 100%"
      border
      stripe
      :header-cell-class-name="'headerBg'"
    >
      <el-table-column
        prop="id"
        label="编号"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="version"
        label="版本"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="content"
        label="更新记录"
        width="150"
        align="center"
        show-overflow-tooltip
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

    <!-- 新增更新记录弹窗 -->
    <el-dialog title="新增更新记录" :visible.sync="isaddApprecord" width="40%">
      <el-form label-width="80px" size="small" ref="addForm" :model="form">
        <el-form-item
          label="版本"
          :rules="{
            required: true,
            message: '请输入版本',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.version" placeholder="请输入版本"></el-input>
        </el-form-item>

        <el-form-item
          label="更新记录"
          :rules="{
            required: true,
            message: '请输入更新记录',
            trigger: 'blur',
          }"
        >
          <el-input
            type="textarea"
            v-model="form.content"
            placeholder="请输入更新记录"
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
        <el-button @click="isaddApprecord = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑更新记录弹窗 -->
    <el-dialog title="编辑更新记录" :visible.sync="iseditApprecord" width="40%">
      <el-form label-width="80px" size="small" ref="editForm" :model="editForm">
        <el-form-item
          label="版本"
          :rules="{ required: true, message: '请输入版本', trigger: 'blur' }"
        >
          <el-input
            v-model="editForm.version"
            placeholder="请输入版本"
          ></el-input
        ></el-form-item>

        <el-form-item
          label="更新记录"
          :rules="{
            required: true,
            message: '请输入更新记录',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="editForm.content"
            placeholder="请输入更新记录"
            type="textarea"
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

        <el-form-item
          label="排序索引"
          :rules="{
            required: true,
            message: '请输入排序索引',
            trigger: 'blur',
          }"
        >
          <el-input
            v-model="editForm.sortIndex"
            placeholder="请输入排序索引"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="iseditApprecord = false">取 消</el-button>
        <el-button type="primary" @click="emitEdit">确 定</el-button>
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
      total: 0,
      isaddApprecord: false,
      iseditApprecord: false,
      form: {
        version: "",
        content: "",
        appWebSiteId: "",
      },
      editForm: {
        id: "",
        version: "",
        content: "",
        appWebSiteId: "",
        sortIndex: "",
      },
    };
  },

  methods: {
    //新增更新记录
    handleAdd() {
      this.isaddApprecord = true;
    },
    save() {
      const data = {
        appWebsiteId: this.form.appWebSiteId,
        version: this.form.version,
        content: this.form.content,
      };
      console.log("参数", data);
      this.request
        .post("/record/addRecord", data)
        .then((res) => {
          console.log(res);
          if (res.code == "200") {
            this.$message.success("新增成功");
            this.isaddApprecord = false;
            this.form = {
              version: "",
              content: "",
              appWebSiteId: "",
            };
            this.load();
          } else {
            this.$message.error("新增失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //编辑更新记录
    handleEdit(row) {
      console.log("编辑", row);
      this.iseditApprecord = true;
      this.editForm.id = row.id;
      this.editForm.version = row.version;
      this.editForm.content = row.content;
      this.editForm.appWebSiteId = row.appWebsiteId;
      this.editForm.sortIndex = row.sortIndex;
    },
    emitEdit() {
      const data = {
        id: this.editForm.id,
        appWebsiteId: this.editForm.appWebSiteId,
        version: this.editForm.version,
        content: this.editForm.content,
        sortIndex: this.editForm.sortIndex,
      };
      console.log("参数", data);
      this.request
        .post("/record/editRecord", data)
        .then((res) => {
          console.log(res);
          if (res.code == "200") {
            this.$message.success("编辑成功");
            this.editForm = {
              id: "",
              version: "",
              content: "",
              appWebSiteId: "",
              sortIndex: "",
            };
            this.iseditApprecord = false;
            this.load();
          } else {
            this.$message.error("编辑失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //删除更新记录
    handleDelete(id) {
      console.log("删除", id);
      this.request
        .post("/record/delRecord", { id: id })
        .then((res) => {
          console.log(res);
          if (res.code == "200") {
            this.$message.success("删除成功");
            this.load();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch((error) => {
          console.log(error);
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
        .get("/record/searchPage", {
          params,
        })

        .then((res) => {
          console.log("搜索", res);

          this.tableData = res.data.list.records;
          this.total = res.data.list.total;
        });
    },

    //翻页
    handleSizeChange(size) {
      this.pageSize = size;
      this.load();
    },
    handleCurrentChange(currentPage) {
      this.pageNum = currentPage;
      this.load();
    },
    reset() {
      this.load();
      this.appWebsiteId = "";
    },

    //获取更新记录列表
    load() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.request.get("/record/listPage", { params }).then((res) => {
        if (res.code == "200") {
          this.tableData = res.data.list.records;
          console.log("更新记录列表", res.data.list, this.tableData);

          this.total = res.data.list.total;
          this.request.get("/appManage/appManages").then((res) => {
            this.appList = res.data.appList;
          });
        }
      });
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
    this.load();
  },
};
</script>

<style scoped>
::deep(.el-table .cell) {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 避免换行 */
  line-height: 60px !important; /* 设置行高 */
  padding-left: 10px;
  padding-right: 10px;
  height: 60px !important; /* 确保行高固定 */
}
.el-table__body-wrapper tbody tr {
  height: 100px !important; /* 设置行高 */
}
</style>