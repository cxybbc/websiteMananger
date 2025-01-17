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
        prop="supportContent"
        label="支持说明"
        width="350"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="自媒体关联" width="250" align="center"
        ><template slot-scope="scope">
          <div v-for="(item, index) in scope.row.contact" :key="index">
            {{ item.name }}
          </div>
        </template></el-table-column
      >
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
      <el-table-column prop="operation" label="操作" align="center">
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
          <el-input
            type="textarea"
            v-model="form.content"
            placeholder="请输入支持说明"
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
            @change="getContactList"
          >
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.webSiteName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自媒体关联id">
          <el-select
            clearable
            v-model="form.contactIds"
            multiple
            placeholder="请选择关联id"
            style="width: 100%"
          >
            <el-option
              v-for="item in contactList"
              :key="item.id"
              :label="item.navigationName"
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

    <el-dialog
      title="编辑更支持说明"
      :visible.sync="iseditAppsupport"
      width="40%"
    >
      <el-form label-width="80px" size="small" ref="editForm" :model="editForm">
        <el-form-item
          label="支持说明"
          :rules="{
            required: true,
            message: '请输入支持说明',
            trigger: 'blur',
          }"
        >
          <el-input
            type="textarea"
            v-model="editForm.content"
            placeholder="请输入支持说明'"
          ></el-input
        ></el-form-item>

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
            @change="editgetContactList"
          >
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.webSiteName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="自媒体管理">
          <el-select
            clearable
            multiple
            v-model="editForm.contactIds"
            placeholder="请选择关联媒体"
            style="width: 100%"
          >
            <el-option
              v-for="item in editcontactList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="iseditAppsupport = false">取 消</el-button>
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
      contactList: [],
      editcontactList: [],
      appWebsiteId: "",
      total: 0,
      isaddAppsupport: false,
      iseditAppsupport: false,
      searchContent: "",
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
        contactIds: Array.isArray(this.form.contactIds)
          ? this.form.contactIds
          : [this.form.contactIds],
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
            this.form = {
              contactIds: [],
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
      this.request
        .get("/support/supportInfo", {
          params: {
            id: row.id,
          },
        })
        .then((res) => {
          console.log("编辑", res);
          if (res.code == "200") {
            this.iseditAppsupport = true;
            this.editForm.id = res.data.info.id;
            // this.editForm.contactIds = res.data.info.contact.map(
            //   (item) => item.id
            // );
            this.editForm.content = res.data.info.content;
            this.editForm.appWebSiteId = res.data.info.appWebsiteId;
            console.log("当前绑定的自媒体", res.data.info.contact);
            const contactIds = res.data.info.contact;
            this.request
              .post("/ngManage/searchNgManage", {
                pageNum: 1,
                pageSize: 100,
                appWebSiteId: row.appWebsiteId,
              })
              .then((res) => {
                console.log("所有自媒体", res.data.searchData.records);
                this.editcontactList = (res.data.searchData.records || []).map(
                  (item) => ({
                    ...item,
                    name: item.navigationName,
                  })
                );
                const bounIds = (contactIds || []).map((item) => item.id);
                this.editForm.contactIds = bounIds;
                console.log("当前绑定的自媒体", contactIds);
              });
            this.request.get("/appManage/appManages").then((res) => {
              this.appList = res.data.appList;
            });
          }
        });
    },
    emitEdit() {
      const data = {
        id: this.editForm.id,
        appWebsiteId: this.editForm.appWebSiteId,
        contactIds: Array.isArray(this.editForm.contactIds)
          ? this.editForm.contactIds
          : [this.editForm.contactIds],
        content: this.editForm.content,
      };
      console.log("参数", data);
      this.request
        .post("/support/edit", data)
        .then((res) => {
          console.log(res);
          if (res.code == "200") {
            this.$message.success("编辑成功");
            this.iseditAppsupport = false;
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
      const formData = new FormData();
      formData.append("id", id);
      this.request
        .post("/support/del", formData)
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
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        appWebsiteId: this.appWebsiteId,
        filterStr: this.searchContent || "",
      };
      console.log("搜索", params);
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

    //获取自媒体关联id
    getContactList(val) {
      console.log(val);
      this.request
        .post("/ngManage/searchNgManage", {
          appWebSiteId: val,
          pageNum: 1,
          pageSize: 100,
        })
        .then((res) => {
          this.contactList = res.data.searchData.records;
          console.log("获取自媒体筛选数据", this.contactList);
        });
    },
    //编辑获取自媒体管理id
    editgetContactList(val) {
      console.log(val);
      this.editForm.contactIds = [];
      this.request
        .post("/ngManage/searchNgManage", {
          appWebSiteId: val,
          pageNum: 1,
          pageSize: 100,
        })
        .then((res) => {
          this.editcontactList = (res.data.searchData.records || []).map(
            (item) => ({
              ...item,
              name: item.navigationName,
            })
          );
          console.log("获取自媒体筛选数据", this.editcontactList);
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
      this.searchContent = "";
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
    formatRelation(relation) {
      if (!relation) return "";

      try {
        // 解析字符串为数组
        const arr = JSON.parse(relation);
        if (Array.isArray(arr)) {
          return arr.join(", ");
        }
      } catch (e) {
        // 如果解析失败，返回原始值
        return relation;
      }

      return relation;
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
:deep(.cell) {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 避免换行 */
  line-height: 60px; /* 设置行高 */
  padding-left: 10px;
  padding-right: 10px;
  height: 60px !important; /* 确保行高固定 */
}
</style>