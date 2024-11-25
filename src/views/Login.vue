<template>
  <div class="wrapper">
    <div class="main">
      <!-- 整个注册盒子 -->
      <div class="loginbox">
        <!-- 左侧的注册盒子 -->
        <div class="background">
          <div class="title">Welcome to System Management Center</div>
        </div>

        <!-- 右侧的注册盒子 -->
        <div class="loginbox-in">
          <el-form
            :model="user"
            :rules="rules"
            ref="userForm"
            style="margin-left: 0px !important"
          >
            <el-form-item prop="username" style="margin-left: 0px !important">
              <div class="userbox">
                <span class="iconfont">&#58905;</span>
                <el-input
                  style="margin-left: 0px !important"
                  v-model="user.username"
                  placeholder="用户名"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="pwdbox">
                <span class="iconfont">&#58933;</span>
                <el-input
                  style="margin-left: 0px !important"
                  show-password
                  v-model="user.password"
                  placeholder="密码"
                ></el-input>
              </div>
            </el-form-item>
            <!-- <el-form-item prop="code">
                          <div class="pwdbox">
                            <span class="iconfont"><svg style="width:20px; height: 22px" t="1704858492553" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1595" width="200" height="200"><path d="M819.579259 330.619259c-0.18963 0-0.379259 0-0.663704 0 0.094815-1.422222 0.18963-2.844444 0.284444-4.171852L819.2 326.447407c-27.401481-1.896296-54.897778-7.016296-78.506667-14.601481-7.68-2.275556-15.265185-4.835556-22.945185-7.585185-16.213333-4.740741-38.305185-14.222222-63.336296-27.780741-0.284444-0.094815-0.568889-0.284444-0.758519-0.379259-5.878519-3.223704-11.946667-6.542222-18.014815-10.145185-8.248889-4.740741-16.497778-9.765926-24.651852-15.075556-0.284444-0.18963-0.663704-0.379259-0.948148-0.568889-5.878519-3.792593-11.757037-7.68-17.540741-11.757037-3.792593-2.56-7.585185-5.30963-11.377778-8.059259-2.844444-2.085926-5.688889-4.077037-8.533333-6.162963-20.764444-15.54963-41.339259-32.995556-60.586667-51.768889-19.247407 18.773333-39.727407 36.219259-60.586667 51.768889-2.844444 2.180741-5.688889 4.077037-8.533333 6.162963-3.792593 2.74963-7.585185 5.499259-11.377778 8.059259-5.783704 4.077037-11.662222 7.964444-17.540741 11.757037-0.284444 0.18963-0.663704 0.379259-0.948148 0.568889-8.154074 5.30963-16.402963 10.334815-24.651852 15.075556-6.162963 3.602963-12.136296 7.016296-18.014815 10.145185-0.284444 0.094815-0.568889 0.284444-0.758519 0.379259-25.031111 13.463704-47.122963 22.945185-63.336296 27.780741-7.68 2.74963-15.36 5.30963-22.945185 7.585185-23.608889 7.585185-51.105185 12.705185-78.506667 14.601481l-0.094815 0c0.094815 1.327407 0.18963 2.74963 0.284444 4.171852-0.18963 0-0.379259 0-0.663704 0l-0.094815 0c0.758519 12.136296 1.611852 28.16 2.56 45.605926 0.18963 0 0.284444 0 0.474074 0 4.645926 64.948148 17.825185 157.392593 37.736296 211.626667 0.853333 2.37037 1.611852 4.835556 2.56 7.205926 0.379259 1.137778 0.948148 2.085926 1.327407 3.223704 13.937778 35.460741 30.90963 68.171852 50.346667 97.374815 47.122963 71.964444 109.226667 123.733333 179.674074 146.962963l0 0.379259c13.179259 4.361481 24.177778 7.016296 32.900741 8.722963 8.722963-1.706667 19.816296-4.361481 32.900741-8.722963l0-0.379259c70.447407-23.22963 132.551111-74.998519 179.674074-146.962963 19.437037-29.297778 36.408889-61.914074 50.346667-97.374815 0.379259-1.137778 0.948148-2.085926 1.327407-3.223704 0.853333-2.37037 1.611852-4.835556 2.56-7.205926 19.911111-54.328889 33.09037-146.678519 37.736296-211.626667 0.18963 0 0.379259 0 0.474074 0C818.062222 358.779259 818.915556 342.755556 819.579259 330.619259L819.579259 330.619259zM782.885926 365.416296c-0.379259 1.611852-0.663704 3.318519-0.758519 5.025185-4.266667 61.25037-16.402963 151.988148-35.84 205.842963-0.568889 1.422222-1.042963 2.939259-1.517037 4.456296-0.284444 0.948148-0.663704 1.896296-1.137778 3.034074-0.379259 0.948148-0.758519 1.896296-1.042963 2.56-14.506667 37.546667-32.521481 71.585185-53.191111 101.451852-42.382222 60.207407-96.237037 103.063704-155.591111 122.311111-1.422222 0.474074-2.844444 1.042963-4.171852 1.611852-5.973333 1.896296-11.946667 3.413333-17.635556 4.740741-5.688889-1.327407-11.567407-2.844444-17.540741-4.740741-1.327407-0.663704-2.74963-1.232593-4.171852-1.706667-59.448889-19.342222-113.208889-62.198519-155.591111-122.311111-20.66963-29.866667-38.58963-63.81037-53.096296-101.262222-0.379259-0.948148-0.758519-1.801481-1.327407-3.128889-0.379259-0.853333-0.663704-1.801481-0.948148-2.74963-0.474074-1.517037-1.042963-2.939259-1.422222-4.171852-19.531852-54.044444-31.668148-144.782222-35.934815-206.032593-0.094815-1.706667-0.379259-3.413333-0.758519-5.025185l-0.379259-6.637037c18.488889-2.844444 36.314074-6.921481 52.527407-12.041481 7.68-2.275556 15.54963-4.835556 23.893333-7.774815 19.152593-5.688889 42.856296-15.928889 68.740741-29.582222 0.474074-0.18963 0.853333-0.474074 1.232593-0.663704 6.257778-3.318519 12.61037-6.921481 18.868148-10.42963 8.154074-4.551111 16.687407-9.765926 26.168889-15.739259 0.284444-0.18963 0.758519-0.474074 0.948148-0.663704 6.257778-3.982222 12.420741-8.059259 18.299259-12.136296 3.413333-2.37037 6.921481-4.835556 10.334815-7.300741l1.896296-1.327407 3.034074-2.180741c1.991111-1.422222 3.887407-2.74963 5.688889-4.077037 13.558519-10.05037 26.832593-20.574815 39.442963-31.573333 12.705185 10.998519 25.884444 21.522963 39.348148 31.478519 1.991111 1.422222 3.887407 2.844444 5.878519 4.171852l3.223704 2.275556 1.137778 0.853333c3.602963 2.56 7.300741 5.214815 10.619259 7.395556 6.162963 4.266667 12.420741 8.343704 18.014815 11.946667l1.611852 1.042963c9.386667 5.973333 18.014815 11.188148 25.884444 15.644444 6.542222 3.792593 12.894815 7.300741 18.962963 10.524444 0.284444 0.18963 0.758519 0.379259 1.137778 0.568889 25.979259 13.748148 49.777778 24.082963 69.025185 29.771852 8.343704 2.939259 16.118519 5.499259 23.22963 7.585185 16.592593 5.214815 34.607407 9.386667 53.191111 12.231111L782.885926 365.416296z" fill="#272536" p-id="1596"></path><path d="M662.281481 435.579259 484.598519 617.813333l-91.022222-93.297778c-6.257778-6.447407-16.497778-6.447407-22.85037 0-6.257778 6.447407-6.257778 16.971852 0 23.419259l102.4 104.96c3.128889 3.223704 7.300741 4.835556 11.377778 4.835556 4.171852 0 8.248889-1.611852 11.377778-4.835556l189.155556-193.896296c6.257778-6.447407 6.257778-16.971852 0-23.419259C678.779259 429.131852 668.634074 429.131852 662.281481 435.579259z" fill="#272536" p-id="1597"></path></svg></span>
                            <el-input v-model="user.code" placeholder="请输入验证码">
                              <template #suffix>
                                <img :src="captchaImage" @click="refreshCaptcha" alt="验证码" style="width: 65px; height: 27px"/>
                              </template>
                            </el-input>
                          </div>
                        </el-form-item> -->
            <el-form-item>
              <el-button class="login_btn" autocomplete="off" @click="login"
                >登入</el-button
              >
              <el-button
                class="register_btn"
                autocomplete="off"
                @click="$router.push('/register')"
                >注册</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setRoutes } from "@/router";

export default {
  name: "Login",
  data() {
    return {
      user: {},
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 14, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      captchaImage: "",
      code_id: "",
    };
  },
  // mounted() {
  //   this.refreshCaptcha()
  // },
  methods: {
    login() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          // 表单校验合法
          this.user["uuid"] = this.code_id;
          this.request.post("/user/login", this.user).then((res) => {
            if (res.code == "200") {
              localStorage.setItem("user", JSON.stringify(res.data)); //存储用户信息到浏览器
              localStorage.setItem("menus", JSON.stringify(res.data.menus)); //存储菜单列表信息到浏览器
              setRoutes();
              this.$message.success("登入成功");
              // if (res.data.role === 'ROLE_MEMBER') {
              //   this.$router.push("/front/home")
              // } else {
              //   this.$router.push("/")
              // }
              this.$router.push("/");
            } else {
              res;
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    // async refreshCaptcha() {
    //   try {
    //     await this.request.post(`/user/getVerify`).then(res => {
    //       if (res.code == 200) {
    //         this.captchaImage = "data:image/jpg;base64,"+ res.data["imgCode"]
    //         this.code_id = res.data["uuid"]
    //       } else {
    //         this.$message.error("验证码加载失败")
    //       }
    //     });
    //   } catch (error) {
    //     this.error = `验证码加载失败`;
    //   }
    // }
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #97c4b3, #468870);
  overflow: hidden;
}
.loginbox {
  display: flex;
  position: absolute;
  width: 800px;
  height: 400px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 #4e655d;
}
.loginbox-in {
  background-color: #89ab9e;
  width: 240px;
}

/*.userbox>>> .el-input__inner {*/
/deep/.el-input__inner {
  //border-bottom:1px solid #E9E9E9;
  background-color: rgba(255, 255, 255, 0.247) !important;
} //transparent
.userbox {
  margin-top: 120px;
  height: 30px;
  width: 200px;
  display: flex;
  margin-left: 25px;
}
.pwdbox {
  height: 30px;
  width: 200px;
  display: flex;
  margin-left: 25px;
}

.background {
  width: 570px;
  background-image: url("./img/Christmas_Trees.png");
  background-size: cover;
  font-family: sans-serif;
}
.title {
  margin-top: 320px;
  font-weight: bold;
  font-size: 20px;
  color: #4e655d;
  text-align: center;
}
.title:hover {
  font-size: 21px;
  transition: all 0.4s ease-in-out;
  cursor: pointer;
}
/*.uesr-text{*/
/*    position:left;*/
/*}*/
el-input {
  outline-style: none;
  border: 0;
  border-bottom: 1px solid #e9e9e9;
  background-color: transparent;
  height: 20px;
  font-family: sans-serif;
  font-size: 15px;
  color: #445b53;
  font-weight: bold;
}
/deep/input::-webkit-input-placeholder {
  color: #e9e9e9;
}
el-input:focus {
  border-bottom: 2px solid #445b53;
  background-color: transparent;
  transition: all 0.2s ease-in;
  font-family: sans-serif;
  font-size: 15px;
  color: #445b53;
  font-weight: bold;
}
el-input:hover {
  border-bottom: 2px solid #445b53;
  background-color: transparent;
  transition: all 0.2s ease-in;
  font-family: sans-serif;
  font-size: 15px;
  color: #445b53;
  font-weight: bold;
}

el-input:-webkit-autofill {
  /* 修改默认背景框的颜色 */
  box-shadow: 0 0 0px 1000px #89ab9e inset !important;
  /* 修改默认字体的颜色 */
  -webkit-text-fill-color: #445b53;
}

el-input:-webkit-autofill::first-line {
  /* 修改默认字体的大小 */
  font-size: 15px;
  /* 修改默认字体的样式 */
  font-weight: bold;
}
.log-box {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  width: 190px;
  margin-left: 30px;
  color: #4e655d;
  margin-top: -5px;
  align-items: center;
}
.log-box-text {
  color: #4e655d;
  font-size: 12px;
  text-decoration: underline;
}
.login_btn {
  background-color: #5f8276; /* Green */
  border: none;
  color: #fafafa;
  padding: 5px 22px;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
  border-radius: 15px;
  outline: none;
  margin-left: 25px;
}
.login_btn:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
  cursor: pointer;
  background-color: #0b5137;
  transition: all 0.2s ease-in;
}
.warn {
  margin-top: 60px;
  /* margin-right:120px; */
  margin-left: -120px;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 17px;
}

.register_btn {
  /*background-color: transparent; !* Green *!*/
  /*border: none;*/
  /*text-decoration: none;*/
  /*font-size: 15px;*/
  /* border-radius: 20px;*/
  /*!*color:#4E655D;*!*/
  /*font-size:12px;*/
  /*!*text-decoration:underline;*!*/
  /*display: flex;*/
  margin-left: 40px;
  /*outline:none;*/
  /*background-color: rgb(42, 103, 81);*/
  background-color: #5f8276; /* Green */
  border: none;
  color: #fafafa;
  padding: 5px 22px;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
  border-radius: 15px;
  outline: none;
}
.register_btn:hover {
  /*font-weight:bold;*/
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
  cursor: pointer;
  background-color: #0b5137;
  transition: all 0.2s ease-in;
}
@font-face {
  font-family: "iconfont"; /* Project id 3387991 */
  src: url("font/iconfont.eot?t=1652091954316"); /* IE9 */
  src: url("font/iconfont.eot?t=1652091954316#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("font/iconfont.woff2?t=1652091954316") format("woff2"),
    url("font/iconfont.woff?t=1652091954316") format("woff"),
    url("font/iconfont.ttf?t=1652091954316") format("truetype"),
    url("font/iconfont.svg?t=1652091954316#iconfont") format("svg");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 20px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 22px;
  color: #4e655d;
  margin-right: 10px;
  margin-top: 3px;
}

.icon-key:before {
  content: "e635";
}

.icon-yonghuzhongxin:before {
  content: "e619";
}

.loginbox-in .el-form .el-form-item .el-form-item__content {
  margin-left: 0px !important;
}
</style>
