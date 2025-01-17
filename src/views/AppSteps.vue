<template>
  <div>
    <div style="padding: 10px 0; text-align: right">
      <el-select
        clearable
        v-model="username"
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
        prop="stepsHTitle"
        label="教程步骤主标题"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="stepsTitle"
        label="教程步骤标题"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="stepsText"
        label="教程步骤文本"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="stepsIndex"
        label="教程步骤序号"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="infoContent"
        label="教程步骤详情"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="pointTitle"
        label="布局点"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="stepsAvaurl"
        label="详情图"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <img
            v-if="scope.row.stepsAvaurl"
            :src="'//' + scope.row.stepsAvaurl"
            alt=""
            style="width: 50px; height: 50px"
          />
          <el-progress
            v-if="!uploadData && scope.row.id == currentId"
            :percentage="uploadProgress"
          ></el-progress>
        </template>
      </el-table-column>
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
        prop="functionId"
        label="所属功能"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag type="primary">{{ selectTag1(scope.row.functionId) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="applicationCategory"
        label="应用分类"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag> -->
          <el-tag type="primary" v-if="scope.row.regionCategory === 0"
            >web端</el-tag
          >
          <el-tag type="warning" v-if="scope.row.regionCategory === 1"
            >移动端</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="regionCategory"
        label="地域分类"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-tag type="primary">{{ selectTag(scope.row.appWebSiteId) }}</el-tag> -->
          <el-tag type="primary" v-if="scope.row.regionCategory === 0"
            >国内</el-tag
          >
          <el-tag type="warning" v-if="scope.row.regionCategory === 1"
            >国外</el-tag
          >
        </template>
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
    <!--分页 选页面-->
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
    <el-dialog
      title="新增教程步骤"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form label-width="80px" size="small" :model="form" ref="addForm">
        <el-form-item label="教程步骤主标题">
          <el-input v-model="form.stepsHTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="教程步骤标题"
          prop="stepsTitle"
          :rules="{
            required: false,
            message: '请填写步骤标题',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.stepsTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="教程步骤文本"
          prop="stepsText"
          :rules="{
            required: false,
            message: '请填写步骤文本',
            trigger: 'blur',
          }"
        >
          <div class="editor_container" v-if="dialogFormVisible">
            <Toolbar :editor="editorRef2" :defaultConfig="toolbarConfig2" />
            <Editor
              v-model="form.stepsText"
              ref="EditorRef"
              :defaultConfig="editorConfig2"
              style="height: 200px; overflow-y: hidden; border: 1px solid #eee"
              @onCreated="handleCreated2"
              @onChange="handleChange"
              @onDestroyed="handleDestroyed"
              @onFocus="handleFocus"
              @onBlur="handleBlur"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="教程步骤序号"
          prop="stepsIndex"
          :rules="{
            required: false,
            message: '请填写步骤序号',
            trigger: 'blur',
          }"
        >
          <el-input
            type="number"
            min="1"
            v-model="form.stepsIndex"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="步骤图">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="action"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item
          label="所属官网"
          prop="appWebsiteId"
          :rules="{
            required: true,
            message: '请选择所属官网',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.appWebsiteId"
            placeholder="请选择官网"
            style="width: 100%"
            @change="changeAppWebsiteId"
          >
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.webSiteName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="布局点" prop="pointId">
          <el-select clearable v-model="form.pointId" style="width: 100%">
            <el-option
              v-for="item in pointList"
              :key="item.id"
              :label="item.pointTitle"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="功能分类"
          prop="functionId"
          :rules="{
            required: false,
            message: '请选择功能分类',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.functionId"
            placeholder="请选择所属功能"
            style="width: 100%"
          >
            <el-option
              v-for="item in functionListCopy"
              :key="item.id"
              :label="item.functionName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="应用分类"
          prop="applicationCategory"
          :rules="{
            required: false,
            message: '请选择功能分类',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.applicationCategory"
            placeholder="请选择应用"
            style="width: 100%"
          >
            <el-option
              v-for="item in acList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="地域分类"
          prop="regionCategory"
          :rules="{
            required: true,
            message: '请选择地域分类',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.regionCategory"
            placeholder="请选择地域"
            style="width: 100%"
          >
            <el-option
              v-for="item in rcList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教程步骤详情" prop="infoContent">
          <div class="editor_container" v-if="dialogFormVisible">
            <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
            <Editor
              v-model="form.infoContent"
              ref="EditorRef"
              :defaultConfig="editorConfig"
              style="height: 500px; overflow-y: hidden; border: 1px solid #eee"
              @onCreated="handleCreated"
              @onChange="handleChange"
              @onDestroyed="handleDestroyed"
              @onFocus="handleFocus"
              @onBlur="handleBlur"
            />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="教程步骤修改"
      :visible.sync="dialogFormVisible1"
      width="30%"
    >
      <el-form label-width="80px" size="small" :model="form" ref="editForm">
        <el-form-item label="步骤ID" v-if="false">
          <el-input v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教程步骤主标题">
          <el-input v-model="form.stepsHTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="步骤标题"
          prop="stepsTitle"
          :rules="{
            required: false,
            message: '步骤标题不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.stepsTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="步骤文本"
          prop="stepsText"
          :rules="{
            required: false,
            message: '步骤文本不能为空',
            trigger: 'blur',
          }"
        >
          <div class="editor_container" v-if="dialogFormVisible1">
            <Toolbar :editor="editorRef2" :defaultConfig="toolbarConfig2" />
            <Editor
              v-model="form.stepsText"
              ref="EditorRef"
              :defaultConfig="editorConfig2"
              style="height: 200px; overflow-y: hidden; border: 1px solid #eee"
              @onCreated="handleCreated2"
              @onChange="handleChange"
              @onDestroyed="handleDestroyed"
              @onFocus="handleFocus"
              @onBlur="handleBlur"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="步骤序号"
          prop="stepsIndex"
          :rules="{
            required: false,
            message: '步骤序号不能为空',
            trigger: 'blur',
          }"
        >
          <el-input
            type="number"
            min="1"
            v-model="form.stepsIndex"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="步骤图">
          <el-input
            v-model="form.stepsAvaurl"
            autocomplete="off"
            v-if="form.stepsAvaurl"
          ></el-input>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="action"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :auto-upload="false"
            v-if="!form.stepsAvaurl"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
          </el-upload>
          <el-upload
            class="upload-demo"
            ref="upload"
            action="action"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :limit="1"
            :auto-upload="false"
            v-if="form.stepsAvaurl"
            style="margin-top: 3px"
          >
            <el-button slot="trigger" size="small" type="primary"
              >替换文件</el-button
            >
          </el-upload>
        </el-form-item>
        <el-form-item
          label="所属官网"
          prop="appWebsiteId"
          :rules="{
            required: true,
            message: '请选择所属官网',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.appWebsiteId"
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

        <el-form-item label="布局点" prop="pointId">
          <el-select clearable v-model="form.pointId" style="width: 100%">
            <el-option
              v-for="item in pointList"
              :key="item.id"
              :label="item.pointTitle"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="功能分类"
          prop="functionId"
          :rules="{
            required: false,
            message: '请选择功能分类',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.functionId"
            placeholder="请选择所属功能"
            style="width: 100%"
            value-key="id"
          >
            <el-option
              v-for="item in functionListCopy"
              :key="item.id"
              :label="item.functionName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="应用分类"
          prop="applicationCategory"
          :rules="{
            required: true,
            message: '请选择应用分类',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.applicationCategory"
            placeholder="请选择应用"
            style="width: 100%"
          >
            <el-option
              v-for="item in acList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="地域分类"
          prop="regionCategory"
          :rules="{
            required: true,
            message: '请选择地域分类',
            trigger: 'blur',
          }"
        >
          <el-select
            clearable
            v-model="form.regionCategory"
            placeholder="请选择地域"
            style="width: 100%"
          >
            <el-option
              v-for="item in rcList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教程步骤详情" prop="infoContent">
          <div class="editor_container" v-if="dialogFormVisible1">
            <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" />
            <Editor
              v-model="form.infoContent"
              ref="EditorRef"
              :defaultConfig="editorConfig"
              style="height: 500px; overflow-y: hidden; border: 1px solid #eee"
              @onCreated="handleCreated"
              @onChange="handleChange"
              @onDestroyed="handleDestroyed"
              @onFocus="handleFocus"
              @onBlur="handleBlur"
            /></div
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { serverIp } from "../../public/config";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import request from "@/utils/request";
export default {
  name: "User",
  components: { Editor, Toolbar },
  data() {
    return {
      serverIp: serverIp,
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      username: "",
      form: {
        id: "",
        stepsTitle: "",
        stepsAvaurl: "",
        stepsText: "",
        stepsIndex: "",
        appWebsiteId: "",
        applicationCategory: "",
        regionCategory: "",
        functionId: "",
        stepsHTitle: "",
        infoContent: "",
        pointId: "",
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      multipleSelection: [],
      appList: [],
      fileList: [],
      functionList: [],
      functionListCopy: [],
      base64Img: "",
      image: "",
      itemKey: "",
      uploadProgress: 0,
      uploadData: true,
      currentId: "",
      acList: [
        {
          id: 0,
          label: "web端",
        },
        {
          id: 1,
          label: "移动端",
        },
      ],
      rcList: [
        {
          id: 0,
          label: "国内",
        },
        {
          id: 1,
          label: "国外",
        },
      ],
      pointList: [],
      editorRef: null,
      editorRef2: null,
      toolbarConfig: {
        mode: "simple",
      },
      toolbarConfig2: {
        mode: "simple",
      },
      editorConfig: {
        placeholder: "请输入内容",
        MENU_CONF: {},
      },
      editorConfig2: {
        placeholder: "请输入内容",
        MENU_CONF: {},
      },
    };
  },
  watch: {
    username(newVal) {
      if (newVal != undefined && newVal != "") {
        this.pageNum = 1;
      }
    },
  },
  created() {
    //请求分页查询数据
    this.load();
  },
  watch: {
    form: {
      handler: function (val) {
        console.log("???", val.appWebsiteId, this.functionList);

        this.functionListCopy = this.functionList.filter(
          (obj) => obj.appWebSiteId == val.appWebsiteId
        );
        console.log("???", this.functionListCopy);

        // if (this.functionListCopy.length > 0) {
        //     this.form.functionId = this.functionListCopy[0].id
        // } else {
        //     this.form.functionId = ""
        // }
      },
      deep: true, //对象的深度验证
    },
  },
  computed: {
    selectTag() {
      return function (value) {
        const matchedObject = this.appList.find((obj) => obj.id == value);
        return matchedObject ? matchedObject.webSiteName : "";
      };
    },
    selectTag1() {
      return function (value) {
        const matchedObject = this.functionList.find((obj) => obj.id == value);
        return matchedObject ? matchedObject.functionName : "";
      };
    },
    seleteFunctionId() {
      return function (value) {
        const matchedObject = this.functionList.find(
          (obj) => obj.appWebsiteId == value
        );
        return matchedObject ? matchedObject.webSiteName : "";
      };
    },
  },
  methods: {
    handleCreated2(editor) {
      this.editorRef2 = Object.seal(editor);
    },
    handleCreated(editor) {
      this.editorRef = Object.seal(editor);
    },
    handleChange(editor) {
      const htmlContent = editor.getHtml();
      console.log("输入", htmlContent);
    },
    handleDestroyed(editor) {},
    handleFocus(editor) {
      console.log("获取焦点");
    },
    handleBlur(editor) {
      console.log("失去焦点");
    },
    load() {
      this.request
        .get("/stepsManage/stepsList", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          console.log("教程数据", res);
          this.itemKey = Math.random();
          this.tableData = res.data.stepsList.records;
          this.total = res.data.stepsList.total;
        });
      this.request.get("/appManage/appManages").then((res) => {
        this.appList = res.data.appList;
      });
      this.request.get("/functionManage/functionLists").then((res) => {
        this.functionList = res.data.functionLists;
      });
    },
    save() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.base64Img) {
            this.form["stepsAvaurl"] = this.base64Img;
          } else {
            this.form["stepsAvaurl"] = this.form.stepsAvaurl;
          }
          console.log("当前新增参数", this.form);

          this.request.post("/stepsManage/saveSteps", this.form).then((res) => {
            console.log(res);

            if (res.code === "200") {
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
              this.$refs.upload.clearFiles();
              this.load();
              this.form = {};
              this.base64Img = "";
              this.image = "";
            } else {
              this.$message.error("保存失败");
            }
          });
        } else {
        }
      });
    },
    edit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.base64Img) {
            this.uploadData = false;
            this.form["stepsAvaurl"] = this.base64Img;
          } else {
            this.form["stepsAvaurl"] = this.form.stepsAvaurl;
          }
          this.dialogFormVisible1 = false;
          console.log("当前编辑参数", this.form);

          this.request.post("/stepsManage/saveSteps", this.form).then((res) => {
            if (res.code === "200") {
              this.uploadProgress = 100;
              this.uploadData = true;
              this.$message.success("保存成功");
              this.dialogFormVisible1 = false;
              this.$refs.upload.clearFiles();
              this.load();
              this.form = {};
              this.base64Img = "";
              this.image = "";
              this.infoContent = "";
            } else {
              this.$message.error("保存失败");
            }
          });
        } else {
        }
      });
    },
    reset() {
      this.username = "";
      this.load();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteBatch() {
      let ids = this.multipleSelection.map((v) => v.id); // 因为后端的是List数组 而这ids是对象数组 所以要用前端的map(v => v.id)把对象数组 [{},{},{}] 转变成纯id的数组 [1,2,3,...]
      this.request.post("/user/del/batch/", ids).then((res) => {
        if (res.code === "200") {
          this.$message.success("批量删除成功");
          this.load();
        } else {
          this.$message.error("批量删除失败");
        }
      });
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.changeAppWebsiteId(row.appWebsiteId);
      this.image = this.form.navigationIcon;
      this.currentId = this.form.id;
      this.dialogFormVisible1 = true;
    },
    handleDelete(id) {
      this.request
        .post("/stepsManage/deleteSteps", {
          id,
        })
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("删除成功");
            if (this.username) {
              this.search();
            } else {
              this.load();
            }
          } else {
            this.$message.error("删除失败");
          }
        });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.pointList.splice(0, this.pointList.length);
      this.form = {};
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.username != undefined && this.username != "") {
        this.search();
      } else {
        this.load();
      }
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      if (this.username != undefined && this.username != "") {
        this.search();
      } else {
        this.load();
      }
    },
    async handlePreview(file) {
      this.base64Img = await this.fileToBase64(file.raw).then((res) => {
        return res;
      });
    },
    handleRemove(file, fileList) {
      this.base64Img = "";
    },
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        // 加载失败时
        reader.onerror = function () {
          reject(new Error("Failed to load file"));
        };
      });
    },
    search() {
      this.request
        .post("/stepsManage/searchSteps", {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          appWebsiteId: this.username,
        })
        .then((res) => {
          this.tableData = res.data.searchData.records;
          this.total = res.data.searchData.total;
        });
      this.request.get("/appManage/appManages").then((res) => {
        this.appList = res.data.appList;
      });
    },

    //选择所属官网 , 进行搜索相应布局点
    changeAppWebsiteId(value) {
      const params = {
        pageNum: "1",
        pageSize: "100",
        appWebsiteId: value,
      };
      console.log("布局点搜索参数", params);

      this.request.get("/stepsPoint/searchPoint", { params }).then((res) => {
        console.log("布局点数据", res);
        //提取出所选官网的布局点
        if (res.code == "200") {
          this.pointList = res.data.pointList.records;
        }
      });
    },
  },
  mounted() {
    this.editorConfig.MENU_CONF["uploadImage"] = {
      async customUpload(file, insertFn) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await request.post("/stepsManage/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              token: localStorage.getItem("user").token,
            },
          });
          console.log("上传图片", res);
          if (res.code == 200) {
            const url = "//" + res.data.url;
            insertFn(url);
            this.$message.success("上传成功");
          } else {
            this.$message.error("上传失败");
          }
        } catch (err) {
          console.log(err);
        }
      },
    };
  },
};
</script>

<style>
@import "@wangeditor/editor/dist/css/style.css";
.headerBg {
    background: #eee !important;
}
.el-table__header {
    width: 100% !important;
}
.el-table__body {
    width: 100% !important;
}
.el-form-item__label {
    width: 100px !important;
}
.el-form-item__content {
    margin-left: 100px !important;
}
</style>
