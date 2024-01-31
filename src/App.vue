<template>
  <div id="app">
    <div class="flex" @click="isShow = true">
      <span>所在地区：</span>
      <h4>{{ address }}</h4>
    </div>

    <button @click="change">改变</button>&nbsp;
    <button @click="addressInfo = []">清空</button>
    <hr />
    <br />

    <Address
      v-show="isShow"
      :selected="addressInfo"
      @changeData="changeData"
      @close="close"
    />
  </div>
</template>

<script>
import Address from "./components/Address.vue";
import { findCurrentData } from "./components/utils";
import addressData from "./components/addressData";

export default {
  name: "App",
  components: { Address },
  data() {
    return {
      isShow: false,
      addressInfo: [
        {
          id: 5,
          name: "广东省",
        },
        {
          id: 86,
          name: "深圳市",
        },
        {
          id: 752,
          name: "宝安区",
        },
        {
          id: 8173,
          name: "西乡街道",
        },
      ],
    };
  },
  computed: {
    address() {
      const target = findCurrentData(addressData, this.addressInfo);

      return target.reduce((pre, i, index) => {
        if (index === 0) return i.name;

        return `${pre}/${i.name}`;
      }, "");
    },
  },
  methods: {
    change() {
      this.addressInfo = [
        {
          id: 3,
          name: "福建省",
        },
        {
          id: 49,
          name: "福州市",
        },
        {
          id: 507,
          name: "晋安区",
        },
      ];
    },
    changeData(data) {
      this.addressInfo = data;
    },
    close(isShow) {
      this.isShow = isShow;
    },
  },
};
</script>

<style>
#app {
  margin-left: 60px;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
