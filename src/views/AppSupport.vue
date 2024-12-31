<template>
  <div>
    <header>
      <div class="selectBox">
        <div class="selectBox_item">
          <p>所属官网:</p>
          <el-select clearable v-model="appWebsiteId" placeholder="请选择官网">
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.webSiteName"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="selectBox_item">
          <p>支持说明:</p>
          <el-input
            v-model="searchContent"
            placeholder="请输入支持说明"
          ></el-input>
        </div>
        <div class="searchbtn">
          <el-button class="ml-5" type="primary" @click="search"
            >搜索</el-button
          >
        </div>
        <div class="searchbtn">
          <el-button type="warning" @click="reset">重置</el-button>
        </div>
      </div>
      <el-button type="primary" @click="handleAdd"
        >新增<i class="el-icon-circle-plus-outline"></i
      ></el-button>
    </header>

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
        prop="content"
        label="支持说明"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contactIds"
        label="自媒体管理id"
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

    <!-- 新增更新记录弹窗 -->
    <el-dialog title="新增支持说明" :visible.sync="isaddAppsupport" width="40%">
      <el-form label-width="80px" size="small" ref="addForm" :model="form">
        <el-form-item
          label="支持说明"
          :rules="{
            required: true,
            message: '支持说明',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.content" placeholder="支持说明"></el-input>
        </el-form-item>

        <el-form-item label="自媒体关联id">
          <el-input
            type="number"
            v-model="form.contactIds"
            placeholder="自媒体关联id"
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
        <el-button @click="isaddAppsupport = false">取 消</el-button>
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
      total: "",
      isaddAppsupport: false,
      iseditApprecord: false,
      form: {
        contactIds: [],
        content: "",
        appWebSiteId: "",
      },
      editForm: {
        id: "",
        contactIds: [],
        content: "",
        appWebSiteId: "",
        sortIndex: "",
      },
    };
  },

  methods: {
    //新增更新记录
    handleAdd() {
      this.isaddAppsupport = true;
    },
    save() {
      const data = {
        appWebsiteId: this.form.appWebSiteId,
        contactIds: this.form.contactIds,
        content: this.form.content,
      };
      console.log("参数", data);
      this.request
        .post("/support/add", data)
        .then((res) => {
          console.log(res);
          if (res.code == "200") {
            this.$message.success("新增成功");
            this.isaddAppsupport = false;
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
        .post("/support/edit", data)
        .then((res) => {
          console.log(res);
          if (res.code == "200") {
            this.$message.success("编辑成功");
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
        .post("/support/del", { id: id })
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
        .get("/support/search", {
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
      this.request.get("/support/list", { params }).then((res) => {
        if (res.code == "200") {
          this.tableData = res.data.list.records;
          console.log("记录支持列表", res.data.list, this.tableData);

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
  
  <style lang="less">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  .selectBox {
    display: flex;
    .selectBox_item {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
    .searchbtn {
      transform: translateY(15px);
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
}
</style>