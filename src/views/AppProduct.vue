<template>
  <div>
    <!-- AppProduct.vue template 新增产品分类/编辑 弹窗 -->
    <el-dialog
      title="新增/编辑产品分类"
      :visible.sync="isProductCategory"
      width="50%"
      height="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="content">
        <!-- 表单内容 -->
        <el-form
          :model="productSetform"
          :rules="productSetformRules"
          ref="formRef"
          label-width="100px"
        >
          <el-form-item label="所属官网" prop="website">
            <el-select v-model="productSetform.website" placeholder="请选择">
              <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.webSiteName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="序号" prop="order">
            <el-input
              v-model="productSetform.order"
              :disabled="isEdit"
              placeholder="请输入序号"
            />
          </el-form-item>

          <el-form-item label="分类名称" prop="categoryName">
            <el-input
              v-model="productSetform.categoryName"
              placeholder="请输入分类名称"
            />
          </el-form-item>

          <el-form-item label="国际化" prop="localization">
            <el-input
              :disabled="true"
              v-model="productSetform.localization"
              placeholder='例如：{ "en": "Hot recommended" }'
            />
            <el-button type="primary" @click="handleEdit('productCategoryEdit')"
              >编辑</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: center"
      >
        <el-button type="primary" @click="isProductSet(type)">保存</el-button>
      </span>
    </el-dialog>

    <!-- 分类名称 国际化 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="productTitle"
      :visible.sync="isProductCateEditDialog"
      width="50%"
      height="400px"
    >
      <div
        class="content"
        style="display: flex; flex-direction: column; gap: 10px"
      >
        <div
          v-for="(item, index) in Localizationfrom"
          style="display: flex; gap: 10px"
          :key="index"
        >
          <el-select
            style="flex: 1"
            v-model="item.language"
            placeholder="请选择语言"
          >
            <el-option label="中文" value="zh"></el-option>
            <el-option label="英文" value="en"></el-option>
          </el-select>
          <el-input
            v-model="item.content"
            style="flex: 2"
            placeholder="请输入内容"
          />
          <el-button type="danger" @click="removeRow(index)">删除</el-button>
        </div>
      </div>

      <el-button
        style="width: 100%; margin-top: 40px"
        type="primary"
        @click="addRow"
        >添加一行</el-button
      >

      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: center"
      >
        <el-button type="primary" @click="isProductCateEditDialog = false"
          >返回</el-button
        >
        <el-button type="primary" @click="saveLocalization()">保存</el-button>
      </span>
    </el-dialog>

    <!-- 下载渠道编辑弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="编辑下载渠道"
      :visible.sync="isProductMiddleDowndialog"
      width="50%"
      height="400px"
    >
      <div
        class="content"
        style="display: flex; flex-direction: column; gap: 10px"
      >
        <div
          v-for="(item, index) in downloadfrom"
          style="display: flex; gap: 10px"
          :key="index"
        >
          <el-select
            style="flex: 1"
            v-model="item.downloadType"
            placeholder="请选择渠道"
          >
            <el-option label="ios" value="ios"></el-option>
            <el-option label="macOS" value="macOS"></el-option>
            <el-option label="Vision Pro" value="Vision Pro"></el-option>
            <el-option label="Android" value="Android"></el-option>
            <el-option label="Windows" value="Windows"></el-option>
            <el-option label="Android(海外)" value="Android(海外)"></el-option>
            <el-option label="Windows(海外)" value="Windows(海外)"></el-option>
          </el-select>
          <el-input
            v-model="item.downloadUrl"
            style="flex: 2"
            placeholder="请输入下载链接"
          />
          <el-button type="danger" @click="middleremoveRow(index)"
            >删除</el-button
          >
        </div>
      </div>

      <el-button
        style="width: 100%; margin-top: 40px"
        type="primary"
        @click="middleaddRow"
        >添加一行</el-button
      >

      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: center"
      >
        <el-button type="primary" @click="isProductMiddleDowndialog = false"
          >返回</el-button
        >
        <el-button type="primary" @click="saveDownload()">保存</el-button>
      </span>
    </el-dialog>

    <!-- 产品中台 新增编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新增/编辑产品"
      :visible.sync="productappcenter"
      width="50%"
      height="400px"
    >
      <div class="productapp_content" style="height: 500px">
        <el-form
          ref="productForm"
          :model="productMiddleSetform"
          :rules="productMiddleSetformRules"
        >
          <!-- 产品名称 -->
          <el-form-item label="产品名称" prop="name" class="form-item">
            <el-input
              v-model="productMiddleSetform.name"
              placeholder="请输入产品名称"
            />
          </el-form-item>

          <!-- 名称国际化 -->
          <el-form-item
            label="名称国际化"
            prop="internationalName"
            class="form-item"
          >
            <el-input
              :disabled="true"
              style="width: 40vh"
              v-model="productMiddleSetform.internationalName"
            />
            <el-button type="primary" @click="handleEdit('productNameEdit')"
              >编辑</el-button
            >
          </el-form-item>

          <!-- 产品简介 -->
          <el-form-item label="产品简介" prop="info" class="form-item">
            <el-input v-model="productMiddleSetform.info" />
          </el-form-item>

          <!-- 简介国际化 -->
          <el-form-item label="简介国际化" prop="internationalInfo">
            <el-input
              :disabled="true"
              style="width: 40vh"
              v-model="productMiddleSetform.internationalInfo"
            />
            <el-button type="primary" @click="handleEdit('productDetailEdit')"
              >编辑</el-button
            >
          </el-form-item>

          <!-- 产品LOGO -->
          <el-form-item label="产品LOGO" prop="logo">
            <el-input
              v-if="middlelogobase64"
              v-model="middlelogobase64"
              width="300px"
            />
            <el-upload
              ref="upload"
              action="action"
              :file-list="logoList"
              :on-change="handleuploadLogo"
              :on-remove="handleuploadLogoRemove"
              :limit="1"
              :auto-upload="false"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
                v-if="!middlelogobase64"
                >上传图片</el-button
              >
              <el-button
                slot="trigger"
                size="small"
                type="danger"
                v-if="middlelogobase64"
                @click="handleReplaceClick"
                >替换图片</el-button
              >
            </el-upload>
          </el-form-item>

          <!-- 下载渠道 -->
          <el-form-item label="下载渠道" prop="download">
            <el-input
              :disabled="true"
              style="width: 40vh"
              v-model="productMiddleSetform.download"
            />
            <el-button type="primary" @click="handleDownloadEdit()"
              >编辑</el-button
            >
          </el-form-item>

          <!-- UI大小 -->
          <el-form-item label="UI大小">
            <el-input type="number" v-model="productMiddleSetform.uiSize" />
          </el-form-item>

          <el-form-item label="官网链接">
            <el-input
              :disabled="true"
              style="width: 40vh"
              v-model="productMiddleSetform.websiteUrl"
            ></el-input>
            <el-button type="primary" @click="handleEdit('productWebsiteEdit')"
              >编辑</el-button
            >
          </el-form-item>

          <!-- UI背景图 -->
          <el-form-item label="UI背景图">
            <el-input
              v-if="middlebackgroupbase64"
              v-model="middlebackgroupbase64"
              width="300px"
            />
            <el-upload
              ref="upload2"
              action="action"
              :file-list="bgList"
              :on-change="handleuploadBg"
              :on-remove="handleuploadBgRemove"
              :limit="1"
              :auto-upload="false"
            >
              <el-button
                slot="trigger"
                v-if="!middlebackgroupbase64"
                size="small"
                type="primary"
                >+ 添加图片</el-button
              >
              <el-button
                slot="trigger"
                v-if="middlebackgroupbase64"
                size="small"
                type="danger"
                @click="handleReplaceClick2"
                >替换图片</el-button
              >
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <div class="footer">
        <el-button type="primary" @click="isProductCenterSet()">保存</el-button>
      </div>
    </el-dialog>

    <!-- 推荐产品分类 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="推荐产品分类"
      :visible.sync="isproductPreview"
      width="80%"
    >
      <div class="preview_content" style="height: 500px; overflow-y: auto">
        <div v-if="assortList.length === 0" class="empty-message">
          <p style="text-align: center">没有数据可显示</p>
        </div>
        <draggable
          v-model="assortList"
          @end="onDragEnd"
          :animation="200"
          ghost-class="dragging"
        >
          <div
            v-for="(item, index) in assortList"
            :key="index"
            class="item-card"
            style="
              position: relative;
              width: 100px;
              text-align: center;
              margin: 10px;
              display: inline-block;
            "
          >
            <!-- 勾选框 -->
            <el-checkbox
              v-model="item.selected"
              style="position: absolute; top: 5px; right: 5px"
            />
            <!-- 图片 -->
            <img
              :src="'//' + item.logo"
              :alt="item.name"
              style="width: 100px; height: 100px; border-radius: 5px"
            />
            <!-- 名称 -->
            <div style="margin-top: 5px">{{ item.name }}</div>
          </div>
        </draggable>
      </div>

      <div
        class="preview_footer"
        style="display: flex; justify-content: center; gap: 20px"
      >
        <el-button type="warning" @click="handlePreviewcenter"
          >产品中台</el-button
        >
        <el-button type="primary" @click="previewcenterselectall"
          >全部选中</el-button
        >
        <el-button type="danger" @click="previewcenterdelete"
          >删除所选</el-button
        >
        <el-button type="primary" @click="isproductPreview = false"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <!-- 推荐产品分类产品中台 -->

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="推荐产品分类"
      :visible.sync="isproductPreviewcenter"
      width="80%"
    >
      <div class="preview_content" style="height: 500px">
        <el-table
          :key="3"
          ref="table"
          stripe
          :header-cell-class-name="'headerBg'"
          style="width: 100%"
          maxHeight="500px"
          :data="rationList"
          :selection.sync="selectedRows"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            prop="sortIndex"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="产品名称"
            width="180"
          ></el-table-column>
          <el-table-column prop="info" label="产品简介"></el-table-column>
          <el-table-column prop="logo" label="产品LOGO">
            <template v-slot="scope">
              <img
                :src="'//' + scope.row.logo"
                style="width: 30px; height: 30px; border-radius: 5px"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="download" label="下载渠道"></el-table-column>
        </el-table>
      </div>

      <div
        class="preview_footer"
        style="display: flex; justify-content: center; gap: 20px"
      >
        <el-button type="primary" @click="selectAll">全部选中</el-button>
        <el-button type="primary" @click="assign">分配</el-button>
      </div>
    </el-dialog>

    <div v-if="!isProductcenter">
      <div class="header">
        <div class="product_selectbox">
          <el-select
            placeholder="请选择官网"
            v-model="WEB_ID"
            style="height: 60px"
          >
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.webSiteName"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-button
            type="primary"
            style="height: 30px"
            @click="searchProductCategory()"
            >搜索</el-button
          >
          <el-button type="warning" style="height: 30px" @click="handlereset()"
            >重置</el-button
          >
        </div>

        <div class="setbox">
          <el-button type="primary" @click="addProductCategory('add')"
            >+ 新增分类</el-button
          >
          <el-button type="warning" @click="handleProductcenter"
            >产品中台</el-button
          >
        </div>
      </div>

      <div class="main">
        <el-table
          :data="tableData"
          border
          :key="1"
          stripe
          :header-cell-class-name="'headerBg'"
          style="width: 100%"
        >
          <el-table-column prop="appWebsiteId" label="所属官网" width="180">
            <template v-slot="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="getWebsiteName(scope.row.appWebsiteId)"
                placement="top"
              >
                <span>{{ getWebsiteName(scope.row.appWebsiteId) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="Number" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="productName" label="名称"> </el-table-column>、
          <el-table-column prop="international" label="国际化">
          </el-table-column>
          <el-table-column prop="updateTime" label="最近更新时间">
          </el-table-column>
          <el-table-column prop="actions" label="操作" width="280">
            <template v-slot="scope">
              <!-- 查看分类按钮 -->
              <el-button type="primary" @click="handlePreview(scope.row)">
                查看分类
              </el-button>

              <!-- 编辑分类按钮 -->
              <el-button
                type="primary"
                @click="addProductCategory('edit', scope.row)"
              >
                编辑分类
              </el-button>

              <!-- 删除按钮 -->
              <el-button type="danger" @click="delProductCategory(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="padding: 10px 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20, 25]"
          :page-size="pageSize"
          :current-page="pageNum"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 产品中台页面 -->
    <div v-if="isProductcenter">
      <div class="headers">
        <span class="title">产品中台</span>
        <div class="product_selectbox">
          <el-input
            placeholder="请选择产品名称"
            v-model="middleAppTitle"
          ></el-input>
          <el-button
            type="primary"
            style="height: 30px; margin-left: 10px"
            @click="searchProductCenter()"
            >搜索</el-button
          >
          <el-button
            type="warning"
            style="height: 30px; margin-left: 10px"
            @click="handleCenterreset()"
            >重置</el-button
          >
        </div>

        <div class="setbox">
          <el-button type="primary" @click="handleProductcenteradd('add')"
            >+ 新增产品</el-button
          >
        </div>
        <img
          src="@/assets/dist/images/close.svg"
          class="close"
          @click="handleProductcentercolse"
          alt=""
        />
      </div>
      <div class="contentbox">
        <el-table
          :data="tableDatas"
          :row-style="{ height: '35px' }"
          :key="2"
          stripe
          style="width: 100%"
        >
          <el-table-column
            prop="sortIndex"
            label="序号"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="产品名称"
            width="180"
          ></el-table-column>
          <el-table-column prop="info" label="产品简介"></el-table-column>
          <el-table-column prop="logo" label="产品LOGO">
            <template v-slot="scope">
              <img
                :src="'//' + scope.row.logo"
                alt="产品LOGO"
                style="width: 38px; height: 38px; border-radius: 5px"
                v-if="scope.row.logo"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="download"
            :style="{ height: '60px', overflow: 'hidden' }"
            label="下载渠道"
          ></el-table-column>
          <el-table-column prop="actions" label="操作" width="280">
            <template v-slot="scope">
              <el-button
                type="primary"
                @click="handleProductcenteradd('edit', scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                @click="handleProductcenterdelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div style="padding: 10px 0">
        <el-pagination
          :page-sizes="[5, 10, 15, 20, 25]"
          :page-size="centerpageSize"
          :current-page="centerpageNum"
          @size-change="handleCenterSizeChange"
          @current-change="handleCenterCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  data() {
    return {
      WEB_ID: null, //选择的官网ID
      middleID: null, //产品中台产品ID
      pageSize: 10,
      pageNum: 1,
      centerpageSize: 10,
      centerpageNum: 1,
      total: 0,
      totals: 0,
      appList: [],
      tableData: [],
      tableDatas: [],
      rationList: [], //推荐产品分类中台列表
      assortList: [], //查看产品分类列表
      logoList: [],
      bgList: [],
      selectedRows: [], // 用于保存选中的行
      middleAppTitle: "",
      productSetform: {
        website: "",
        order: "",
        categoryName: "",
        localization: "",
      },
      productMiddleSetform: {
        name: "",
        internationalName: "",
        info: "",
        internationalInfo: "",
        download: "",
        uiSize: "",
        websiteUrl: "",
      },
      middlelogobase64: "",
      middlebackgroupbase64: "",
      productSetformRules: {
        website: [
          { required: true, message: "请选择所属官网", trigger: "blur" },
        ],
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      productMiddleSetformRules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],

        info: [{ required: true, message: "请输入产品简介", trigger: "blur" }],
      },

      Localizationfrom: [
        { language: "", content: "" }, // 初始一行数据
      ],
      downloadfrom: [
        { downloadType: "", downloadUrl: "" }, // 初始一行数据
      ],
      productTitle: "", //公共编辑国际化弹窗标题
      webProductName: "",
      isProductCategory: false, //新增/编辑产品分类弹窗
      isProductCateEditDialog: false, //产品分类编辑弹窗
      isProductMiddleDowndialog: false, //产品中台下载渠道编辑弹窗
      isProductcenter: false, //   产品中台
      productappcenter: false, // 产品中台新增/编辑
      isproductPreview: false, //查看产品分类
      isproductPreviewcenter: false, //查看产品分类产品中台
      LocalizationType: "",
      currentActionType: "",
      middleActionType: "",
      isEdit: false, //是否编辑
    };
  },
  methods: {
    //搜索官网产品数据
    searchProductCategory() {
      console.log("??????", this.WEB_ID);
      const data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        appWebsiteId: this.WEB_ID,
      };
      this.request.post("/product/searchProduct", data).then((res) => {
        console.log(res);
        if (res.code === "200") {
          console.log("搜索产品列表", res.data);
          if (res.data.searchData.records.length === 0) {
            this.$message.warning("当前暂无相关产品");
          } else {
            this.tableData = res.data.searchData.records;
            this.total = res.data.searchData.total;
            this.pageNum = res.data.searchData.pages; //当前页码
            this.pageSize = res.data.searchData.size; //每页显示条数
          }
        }
      });
    },
    //重置搜索条件
    handlereset() {
      this.WEB_ID = null;
      this.pageNum = 1;
      this.getProductList();
    },
    handleCenterreset() {
      this.middleAppTitle = "";
      this.centerpageNum = 1;
      this.getProductCenter();
    },

    //新增编辑产品分类
    addProductCategory(type, row) {
      this.isProductCategory = true;
      this.currentActionType = type;
      if (type === "add") {
        console.log("新增分类");
        this.isEdit = true;
        this.productSetform = {
          website: "",
          order: "",
          categoryName: "",
          localization: "",
        };
      } else if (type === "edit") {
        console.log("编辑分类", row);
        this.isEdit = false;
        this.request
          .post("/product/productInfo", { id: row.id })
          .then((res) => {
            console.log(res);
            if (res.code === "200") {
              this.productSetform = {
                id: res.data.productInfo.id,
                website: res.data.productInfo.app_website_id,
                categoryName: res.data.productInfo.product_name,
                localization: res.data.productInfo.international,
              };
            }
          });
      }
    },

    isProductSet() {
      if (this.currentActionType === "add") {
        console.log("保存新增产品", this.productSetform);
        const data = {
          appWebsiteId: this.productSetform.website,
          productName: this.productSetform.categoryName,
          international: this.productSetform.localization,
        };
        console.log("产品新增请求参数：", data);

        this.request.post("/product/saveProduct", data).then((res) => {
          console.log(res);
          if (res.code === "200") {
            this.$message.success("新增产品分类成功");
            this.isProductCategory = false;
            this.getProductList();
            if (this.WEB_ID) {
              console.log("当前有搜索条件，重新搜索", this.WEB_ID);
              this.searchProductCategory();
              return;
            }
          } else {
            this.$message.error("新增产品分类失败");
          }
        });
      } else if (this.currentActionType === "edit") {
        console.log("编辑保存产品", this.productSetform);
        const data = {
          id: this.productSetform.id,
          appWebsiteId: this.productSetform.website,
          productName: this.productSetform.categoryName,
          international: this.productSetform.localization,
        };
        console.log("编辑产品请求参数：", data);
        this.request.post("/product/updateProduct", data).then((res) => {
          console.log(res);
          if (res.code === "200") {
            this.$message.success("编辑产品分类成功");
            this.isProductCategory = false;
            this.getProductList();
          } else {
            this.$message.error("编辑产品分类失败");
          }
        });
      }
    },

    //删除产品分类
    delProductCategory(row) {
      this.$confirm("确定要删除这个产品分类吗？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.request
            .post("/product/deleteProduct", { id: row.id })
            .then((res) => {
              console.log(res);
              if (res.code === "200") {
                this.$message.success("删除产品分类成功");
                this.getProductList();
                if (this.WEB_ID) {
                  console.log("当前有搜索条件，重新搜索", this.WEB_ID);
                  this.searchProductCategory();
                  return;
                }
              } else {
                this.$message.error("删除产品分类失败");
              }
            })
            .catch((err) => {
              console.error(err);
              this.$message.error("删除操作失败");
            });
        })
        .catch(() => {
          this.$message.info("删除操作已取消");
        });
    },

    //删除产品中台
    handleProductcenterdelete(row) {
      this.$confirm("确定要删除这个产品吗？", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.request
            .post("/middle/deleteMiddle", { ids: [row.id] })
            .then((res) => {
              console.log(res);
              if (res.code === "200") {
                this.$message.success("删除产品成功");
                this.getProductCenter();
              } else {
                this.$message.error("删除产品失败");
              }
            })
            .catch((err) => {
              console.error(err);
              this.$message.error("删除操作失败");
            });
        })
        .catch(() => {
          this.$message.info("删除操作已取消");
        });
    },

    // 添加一行
    addRow() {
      this.Localizationfrom.push({ language: "", content: "" }); // 默认新增行使用中文
    },
    middleaddRow() {
      this.downloadfrom.push({ language: "", content: "" }); // 默认新增行使用中文
    },
    // 删除指定行
    removeRow(index) {
      this.Localizationfrom.splice(index, 1); // 删除指定索引的行
    },
    middleremoveRow(index) {
      this.downloadfrom.splice(index, 1); // 删除指定索引的行
    },

    // 编辑分类国际化
    handleEdit(type) {
      this.LocalizationType = type;
      if (type === "productCategoryEdit") {
        this.productTitle = "分类名称国际化";
        if (this.productSetform.localization) {
          this.Localizationfrom = JSON.parse(this.productSetform.localization);
        } else {
          this.Localizationfrom = [{ language: "", content: "" }];
        }
      } else if (type === "productNameEdit") {
        this.productTitle = "产品名称国际化";
        if (this.productMiddleSetform.internationalName) {
          this.Localizationfrom = JSON.parse(
            this.productMiddleSetform.internationalName
          );
        } else {
          this.Localizationfrom = [{ language: "", content: "" }];
        }
      } else if (type === "productDetailEdit") {
        this.productTitle = "简介国际化";
        if (this.productMiddleSetform.internationalInfo) {
          this.Localizationfrom = JSON.parse(
            this.productMiddleSetform.internationalInfo
          );
        } else {
          this.Localizationfrom = [{ language: "", content: "" }];
        }
      } else if (type === "productWebsiteEdit") {
        this.productTitle = "官网链接";
        if (this.productMiddleSetform.websiteUrl) {
          this.Localizationfrom = JSON.parse(
            this.productMiddleSetform.websiteUrl
          );
        } else {
          this.Localizationfrom = [{ language: "", content: "" }];
        }
      }
      this.isProductCateEditDialog = true;
    },

    //保存分类国际化编辑
    saveLocalization() {
      console.log("当前的国际化弹窗类型", this.LocalizationType);
      if (this.LocalizationType === "productCategoryEdit") {
        console.log("分类名称国际化数据formRef", this.Localizationfrom);
        this.isProductCateEditDialog = false;
        this.productSetform.localization = JSON.stringify(
          this.Localizationfrom
        );
      } else if (this.LocalizationType === "productNameEdit") {
        this.isProductCateEditDialog = false;
        this.productMiddleSetform.internationalName = JSON.stringify(
          this.Localizationfrom
        );
      } else if (this.LocalizationType === "productDetailEdit") {
        this.isProductCateEditDialog = false;
        this.productMiddleSetform.internationalInfo = JSON.stringify(
          this.Localizationfrom
        );
      } else if (this.LocalizationType === "productWebsiteEdit") {
        this.isProductCateEditDialog = false;
        this.productMiddleSetform.websiteUrl = JSON.stringify(
          this.Localizationfrom
        );
      }
    },
    //保存下载渠道
    saveDownload() {
      this.productMiddleSetform.download = JSON.stringify(this.downloadfrom);
      this.isProductMiddleDowndialog = false;
    },

    //下载渠道编辑保存
    handleDownloadEdit() {
      if (this.downloadfrom) {
        this.productMiddleSetform.download = JSON.stringify(this.downloadfrom);
      } else {
        this.productMiddleSetform.download = "";
      }
      this.isProductMiddleDowndialog = true;
    },

    //查看产品分类
    handlePreview(row) {
      console.log("查看产品分类", row);
      this.isproductPreview = true;
      this.middleID = row.id;
      const params = {
        productId: row.id,
      };
      this.request.get("/middle/assortMiddle", { params }).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.assortList = res.data.assortList.map((item) => ({
            ...item,
            selected: false,
          }));
        } else {
          this.assortList = [];
        }
      });
    },

    //推荐产品分类排序
    onDragEnd() {
      // 根据当前数组顺序更新每一项的 sortIndex
      this.assortList.forEach((item, index) => {
        item.sortIndex = index + 1; // 第一项为 1，后续递增
      });
      console.log("拖动后的数据：", this.assortList);
      const relations = this.assortList.map((item) => ({
        mid: item.id, // 中台推荐产品id
        pid: this.middleID, // 产品id
        sortIndex: item.sortIndex, // 排序
      }));

      // 构造请求数据
      const requestData = {
        relations: relations,
      };

      console.log("请求数据：", requestData);

      this.request.post("/middle/moveMiddle", requestData).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.$message.success("更新排序成功");
        } else {
          this.$message.error("更新排序失败");
        }
      });
    },

    //产品中台
    handleProductcenter() {
      console.log("产品中台");
      this.isProductcenter = true;
    },

    //产品中台关闭
    handleProductcentercolse() {
      this.isProductcenter = false;
    },

    //新增编辑产品中台
    handleProductcenteradd(type, row) {
      this.productappcenter = true;
      if (type === "add") {
        this.middleActionType = "add";
        this.productMiddleSetform = {
          name: "",
          internationalName: "",
          info: "",
          internationalInfo: "",
          logo: "",
          uiSize: "",
          uiBackGround: "",
          download: "",
          websiteUrl: "",
        };
        this.downloadfrom = [
          { downloadType: "", downloadUrl: "" }, // 初始一行数据
        ];
        this.middlebackgroupbase64 = "";
        this.middlelogobase64 = "";
        this.bgList = [];
        this.logoList = [];
      } else if (type === "edit") {
        this.middleActionType = "edit";
        console.log("编辑产品中台", row);
        this.middleID = row.id;
        this.request.post("/middle/middleInfo", { id: row.id }).then((res) => {
          if (res.code === "200") {
            console.log("????????????????????", res);

            this.productMiddleSetform = {
              name: res.data.middleInfo.name,
              internationalName: res.data.middleInfo.international_name,
              info: res.data.middleInfo.info,
              internationalInfo: res.data.middleInfo.international_info,
              uiSize: res.data.middleInfo.ui_size,
              download: res.data.middleInfo.download,
              websiteUrl: res.data.middleInfo.website_url,
            };
            this.bgList = [];
            this.middlelogobase64 = res.data.middleInfo.logo;
            this.middlebackgroupbase64 = res.data.middleInfo.ui_back_ground;
          }
        });
      }
    },
    isProductCenterSet() {
      if (this.middleActionType === "add") {
        const data = {
          name: this.productMiddleSetform.name,
          internationalName: this.productMiddleSetform.internationalName,
          info: this.productMiddleSetform.info,
          internationalInfo: this.productMiddleSetform.internationalInfo,
          logo: this.middlelogobase64,
          uiSize: this.productMiddleSetform.uiSize,
          uiBackGround: this.middlebackgroupbase64,
          download: this.productMiddleSetform.download,
          websiteUrl: this.productMiddleSetform.websiteUrl,
        };
        if (!data.logo) {
          this.$message.error("请上传产品LOGO");
          return;
        }
        if (!data.download) {
          this.$message.error("请添加下载渠道");
          return;
        }
        this.request.post("/middle/saveMiddle", data).then((res) => {
          console.log(res);
          if (res.code === "200") {
            this.$message.success("新增产品成功");
            this.productappcenter = false;
            this.getProductCenter();
          } else {
            this.$message.error("新增产品失败");
          }
        });
        console.log("产品中台新增", data);
      } else if (this.middleActionType === "edit") {
        console.log("产品中台编辑", this.productMiddleSetform);
        const data = {
          id: this.middleID,
          name: this.productMiddleSetform.name,
          internationalName: this.productMiddleSetform.internationalName,
          info: this.productMiddleSetform.info,
          internationalInfo: this.productMiddleSetform.internationalInfo,
          logo: this.middlelogobase64,
          uiSize: this.productMiddleSetform.uiSize,
          uiBackGround: this.middlebackgroupbase64,
          download: this.productMiddleSetform.download,
          websiteUrl: this.productMiddleSetform.websiteUrl,
        };
        if (!data.logo) {
          this.$message.error("请上传产品LOGO");
          return;
        }
        if (!data.download) {
          this.$message.error("请添加下载渠道");
          return;
        }
        this.request.post("/middle/updateMiddle", data).then((res) => {
          console.log(res);
          if (res.code === "200") {
            this.$message.success("编辑产品成功");
            this.productappcenter = false;
            this.getProductCenter();
          } else {
            this.$message.error("编辑产品失败");
          }
        });
      }
    },

    async handleuploadLogo(file) {
      this.middlelogobase64 = await this.fileToBase64(file.raw).then((res) => {
        return res;
      });
    },
    // 替换图片按钮点击事件
    handleReplaceClick() {
      // 清空当前上传的文件
      this.logoList = []; // 清空之前的文件列表
    },
    handleReplaceClick2() {
      // 清空当前上传的文件
      this.bgList = []; // 清空之前的文件列表
    },
    handleuploadLogoRemove(file, fileList) {
      this.middlelogobase64 = "";
    },
    async handleuploadBg(file) {
      this.middlebackgroupbase64 = await this.fileToBase64(file.raw).then(
        (res) => {
          return res;
        }
      );
    },
    handleuploadBgRemove() {
      this.middlebackgroupbase64 = "";
    },

    //产品分类 进入产品中台
    handlePreviewcenter() {
      this.isproductPreviewcenter = true;
      const params = {
        productId: this.middleID,
      };
      this.request.get("/middle/middleNotRation", { params }).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.rationList = res.data.rationList;
        } else {
        }
      });
    },

    // 全部选中按钮
    selectAll() {
      this.$nextTick(() => {
        this.rationList.forEach((row) => {
          this.$refs.table.toggleRowSelection(row, true);
        });
      });
    },

    // 分配按钮，获取选中的 id
    assign() {
      const selectedIds = this.selectedRows.map((row) => row.id);
      console.log("选中的 id:", selectedIds);
      const data = {
        ids: selectedIds,
        productIds: [this.middleID],
      };
      this.request.post("/middle/rationMiddle", data).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.$message.success("分配成功");
          this.isproductPreviewcenter = false;

          const params = {
            productId: this.middleID,
          };
          this.request.get("/middle/assortMiddle", { params }).then((res) => {
            console.log(res);
            if (res.code === "200") {
              this.assortList = res.data.assortList.map((item) => ({
                ...item,
                selected: false,
              }));
            } else {
              this.assortList = [];
            }
          });
        } else {
          this.$message.error("分配失败");
        }
      });
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },

    previewcenterselectall() {
      this.assortList.forEach((item, index) => {
        item.selected = true;
      });
    },
    previewcenterdelete() {
      const unselectedItems = this.assortList.filter((item) => item.selected);
      const unselectedIds = unselectedItems.map((item) => item.id);
      console.log("选中的 id:", unselectedIds);
      const data = {
        ids: unselectedIds,
        productIds: [this.middleID],
      };

      this.request.post("/middle/relieveMiddle", data).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.$message.success("移除成功");

          const params = {
            productId: this.middleID,
          };
          this.request.get("/middle/assortMiddle", { params }).then((res) => {
            console.log(res);
            if (res.code === "200") {
              this.assortList = res.data.assortList.map((item) => ({
                ...item,
                selected: false,
              }));
            } else {
              this.assortList = [];
            }
          });
        } else {
          this.$message.error("移除失败");
        }
      });
    },
    rowClassName({ row, rowIndex }) {
      return "fixed-row-height"; // 为每行添加类名
    },

    //初始获取产品列表
    getProductList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const productRequest = this.request.get("/product/productManageList", {
        params,
      });
      const appRequest = this.request.get("/appManage/appManages");
      Promise.all([productRequest, appRequest])
        .then(([productRes, appRes]) => {
          // 检查 productRes 的返回数据
          console.log("接口响应：", productRes, appRes);

          if (productRes.code === "200") {
            console.log("接口原始数据：", productRes.data.productList);
            this.pageSize = productRes.data.productList.size;
            this.pageNum = this.pageNum;
            this.total = productRes.data.productList.total;
            this.tableData = productRes.data.productList.records;
          } else {
            console.error("产品接口错误，code：", productRes.data.code);
          }

          // 检查 appRes 的返回数据
          if (appRes.code === "200") {
            console.log("官网数据列表：", appRes.data);
            this.appList = appRes.data.appList;
          } else {
            console.error("官网接口错误，code：", appRes.data.code);
          }
        })
        .catch((error) => {
          console.error("请求失败：", error); // 捕获请求失败的错误
        });
    },
    //获取产品中台数据
    getProductCenter() {
      const params = {
        pageNum: this.centerpageNum,
        pageSize: this.centerpageSize,
      };
      this.request.get("/middle/middleList", { params }).then((res) => {
        console.log(res);
        if (res.code === "200") {
          this.tableDatas = res.data.middleList.records;
          this.centerpageSize = res.data.middleList.size;
          this.centerpageNum = this.centerpageNum;
          this.totals = res.data.middleList.total;
        } else {
        }
      });
    },

    //产品中台搜索
    searchProductCenter() {
      const data = {
        pageNum: this.centerpageNum,
        pageSize: this.centerpageSize,
        name: this.middleAppTitle,
      };
      this.request.post("/middle/searchMiddle", data).then((res) => {
        console.log(res);
        if (res.code === "200") {
          if (res.data.searchData.records.length === 0) {
            this.$message.warning("当前暂无相关产品");
          } else {
            this.tableDatas = res.data.searchData.records;
            this.totals = res.data.searchData.total;
            this.centerpageNum = res.data.searchData.pages; //当前页码
            this.centerpageSize = res.data.searchData.size; //每页显示条数
          }
        } else {
        }
      });
    },

    // 根据 appWebsiteId 获取官网名称
    getWebsiteName(appWebsiteId) {
      const website = this.appList.find((item) => item.id === appWebsiteId);
      return website ? website.webSiteName : "未知官网"; // 如果未找到则返回'未知官网'
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

    handleSizeChange(val) {
      this.pageSize = val;
      this.getProductList();
      console.log("???", val);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      console.log("当前页码：", val);

      this.getProductList();
    },
    handleCenterSizeChange(val) {
      this.centerpageSize = val;
      this.getProductCenter();
      console.log("???", val);
    },
    handleCenterCurrentChange(val) {
      this.centerpageNum = val;
      console.log("当前页码：", val);

      this.getProductCenter();
    },
  },
  watch: {
    isProductcenter(newVal) {
      if (newVal) {
        console.log("触发 getProductCenter");
        this.getProductCenter();
      }
    },
  },
  created() {
    this.getProductList();
    if (this.isProductcenter) {
      this.getProductCenter();
    }
  },
  components: {
    draggable,
  },
};
</script>

<style scoped>
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

.fixed-row-height {
  height: 60px !important;
  line-height: 60px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 控制 el-form-item 的布局 */
.productapp_content .el-form-item {
  display: flex; /* 使用 flexbox 来实现内联布局 */
  align-items: center; /* 使表单项的内容垂直居中 */
}

/* 固定 label 宽度 */
.productapp_content .el-form-item .el-form-item__label {
  min-width: 120px; /* 设置 label 的固定宽度 */
}

/* 使输入框和按钮水平排列 */
.productapp_content .el-form-item .el-input,
.productapp_content .el-form-item .el-button {
  margin-left: 10px; /* 控制输入框和按钮之间的间距 */
}
.el-form-item__content {
  display: flex;
  margin-left: 0 !important;
}

.header {
  display: flex;
  justify-content: space-between;
  height: 60px;
}
.main {
  margin-top: 40px;
}
.headerBg {
  background: #eee !important;
}
.el-input--mini .el-input__inner {
  height: 35px;
  line-height: 28px;
}
.headers {
  display: flex;
  height: 60px;
}
.title {
  font-size: 28px;
  font: 800;
  color: #000;
  margin-right: 100px;
}
.product_selectbox {
  display: flex;
}
.setbox {
  margin-left: 460px;
  margin-right: 80px;
}
.close {
  width: 28px;
  height: 28px;
  cursor: pointer;
}
/* 禁用 el-upload 组件图片的渐变效果 */
.el-upload-list__item {
  transition: none !important; /* 取消所有过渡动画 */
}

.el-upload-list__item img {
  opacity: 1 !important; /* 保持图片不透明 */
}
</style>