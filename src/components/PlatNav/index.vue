<template>
  <affix>
    <header class="header">
      <div class="h-nav">
        <div class="plat-con">
          <div class="logo" @click="goHome"></div>
          <ul class="nav-list">
            <li v-for="(item, index) in navList" :key="index">
              <router-link :to="item.pathname" v-if="item.origin">{{
                item.name
              }}</router-link>
              <a :href="item.pathname" v-else>{{ item.name }}</a>
            </li>
          </ul>

          <div class="user-info">
            <el-button
              v-if="!$store.state.userInfo.account"
              size="mini"
              @click="login"
              >登录</el-button
            >
            <template v-else>
              <el-dropdown
                @visible-change="dropStatus"
                @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <b class="name">{{ userInfo.name }}</b>
                  <img
                    :src="[
                      userInfo.photo
                        ? downloadUrl + '/' + userInfo.photo
                        : userDefault
                    ]"
                    alt="img"
                  />
                  <i
                    :class="[
                      arrowDisplay
                        ? 'el-icon-arrow-up el-icon--right'
                        : 'el-icon-arrow-down el-icon--right'
                    ]"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="2">我的学校</el-dropdown-item>
                  <el-dropdown-item command="1">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </div>
        </div>
      </div>
    </header>
  </affix>
</template>

<script>
import userDefault from "@/assets/images/nav/user-default.svg";
import Affix from "./Affix";
import { mapState } from "vuex";
export default {
  components: {
    Affix
  },
  data() {
    return {
      userDefault: userDefault,
      scroll: 0,
      el_Height: 78,
      arrowDisplay: false,
      navList: []
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo.account.userInfo,
      downloadUrl: state => state.frontConfig.downloadUrl,
      hostUrl: state => state.frontConfig
    })
  },
  methods: {
    dropStatus(status) {
      // 用户信息展示更换箭头
      this.arrowDisplay = status;
    },
    goHome() {
      this.$router.push({ name: "home" });
    },
    login() {
      window.location.href = `/login?routeurl=${window.location.origin}`;
    },
    handleCommand(command) {
      if (command === "1") {
        window.location.href = "/logout";
      } else if (command === "2") {
        window.location.href =
          this.hostUrl.homeHost + "/org/" + this.userInfo.orgId;
      }
    }
  },
  created() {
    this.navList = [
      { name: "首页", pathname: "/home", origin: true },
      { name: "互动空间", pathname: this.hostUrl.spaceHost, origin: false },
      { name: "资源中心", pathname: this.hostUrl.resHost, origin: false }
    ];
  },
  mounted() {}
};
</script>

<style lang="scss">
.header {
  .h-nav {
    width: 100%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
    background: #fff;
    .plat-con {
      width: 1200px;
      height: 78px;
      margin: 0 auto;
      position: relative;
      .logo {
        width: 139px;
        height: 32px;
        position: absolute;
        top: 22px;
        background: url("../../assets/images/logo.svg") no-repeat;
        cursor: pointer;
      }
      .nav-list {
        overflow: hidden;
        position: absolute;
        top: 15px;
        left: 190px;
        & > li {
          float: left;
          margin: 0 20px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          & > a {
            display: inline-block;
            height: 50px;
            line-height: 50px;
            &.router-link-active {
              border-bottom: 2px solid #2f5fe2;
              color: #2f60e2;
            }
            &:hover {
              border-bottom: 2px solid #2f5fe2;
              & > a {
                color: #2f60e2;
              }
            }
          }
        }
      }
      .message {
        display: inline-block;
        cursor: pointer;
        margin-right: 22px;
        vertical-align: middle;
        color: #606266;
        position: relative;
        .redPoint {
          position: absolute;
          top: 0;
          left: 14px;
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #ff4949;
        }
        span {
          padding-left: 10px;
        }
        img {
          vertical-align: middle;
        }
      }
      .user-info {
        width: 380px;
        height: 40px;
        position: absolute;
        top: 30px;
        right: 8px;
        text-align: right;
        cursor: pointer;
        & > .el-button {
          background: #2f60e2;
          color: #fff;
        }
        .el-dropdown {
          margin-right: 10px;
          .focusing:focus {
            outline-width: 0;
          }
        }
        .el-dropdown-link {
          display: inline-block;
          vertical-align: middle;
          .name {
            display: inline-block;
            font-weight: inherit;
            max-width: 100px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            vertical-align: middle;
          }
          img {
            width: 30px;
            height: 30px;
            border-radius: 15px;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
</style>
