<template>
  <div>
    <div>地址组件</div>

    <nav>
      <div
        v-for="item in selected"
        :key="item.id"
        @click="() => handlerClickNav(item.id)"
      >
        {{ item.name }}
      </div>
      <div v-if="needSelected">请选择</div>
    </nav>

    <ul>
      <li
        v-for="(item, index) in currentDataList"
        :key="index"
        @click="() => handlerClick(item, item.id)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { findCurrentData } from "./utils";
import addressData from "./addressData";

export default {
  name: "Address",
  props: {
    selected: {
      type: Array,
      default: [],
    },
  },
  data() {
    // 不需要响应式，傻逼vue，跟坨屎一样，全特么this，静态分析都给丢了，傻B
    this.currentSelectedIndex = null;
    this.currentDataList = addressData;

    return {
      needSelected: true,
    };
  },
  watch: {
    selected: {
      immediate: true,
      handler(newValue) {
        if (!newValue || !newValue.length) {
          this.currentDataList = addressData;
          this.$forceUpdate();
          return;
        }

        const target = findCurrentData(addressData, newValue);
        const { parent = [], children = [], isLast } = target.at(-1) || {};
        if (isLast) this.needSelected = false;

        // 当选择过后，当前展示的地址列表为同级地址
        if (!this.needSelected) {
          this.currentDataList = parent.map((i) => ({ ...i, isLast }));
          this.$forceUpdate();
          return;
        }

        // 初始化选择时，展示的地址为其子级
        this.currentDataList = children;
        this.$forceUpdate();
      },
    },
  },
  methods: {
    handlerClick(item) {
      // 当地址项没有子级说明就是最后一级了，关闭
      if (!item.children || !item.children.length) {
        this.needSelected = false;
        this.currentSelectedIndex = null;
        this.$emit("close", false);
      } else {
        this.needSelected = true;
      }

      const selected = this.handlerSelected(item);
      this.$emit("changeData", selected);
    },
    handlerClickNav(id) {
      this.needSelected = false;
      const index = this.selected.findIndex((i) => i.id === id);
      this.currentSelectedIndex = index;

      this.$emit("changeData", this.selected.slice(0, index + 1));
    },
    handlerSelected(item) {
      // 针对最后一项地址进行截取添加数据
      if (item.isLast) {
        return this.selected.slice(0, this.selected.length - 1).concat(item);
      }

      // 针对点击了导航地址回退操作后的数据截取
      if (this.currentSelectedIndex !== null) {
        const selected = this.selected
          .slice(0, this.currentSelectedIndex)
          .concat(item);
        this.currentSelectedIndex = null;

        return selected;
      }

      // 默认就是添加数据
      return this.selected.concat(item);
    },
  },
};
</script>

<style>
nav {
  display: flex;
  align-items: center;
  margin: 10px 30px;
}

nav > div {
  margin-right: 10px;
  background: #ccc;
  min-width: 65px;
  padding: 0 5px;
  text-align: center;
  border-radius: 3px;
  cursor: pointer;
}
</style>
