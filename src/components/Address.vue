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
      <div v-if="show">请选择</div>
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
    this.currentSelectedIndex = null;
    return {
      currentDataList: addressData,
      show: true,
    };
  },
  watch: {
    selected: {
      immediate: true,
      handler(newValue) {
        if (!newValue || !newValue.length) return;
        const target = findCurrentData(addressData, newValue);
        if (!this.show) {
          const { parent = [], isLast } = target.at(-1) || {};

          this.currentDataList = parent.map((i) => ({ ...i, isLast }));
          return;
        }

        this.currentDataList = (target.at(-1) && target.at(-1).children) || [];
      },
    },
  },
  methods: {
    handlerClick(item) {
      console.log("###: --------click ", item);

      if (!item.children || !item.children.length) {
        this.show = false;
        this.currentSelectedIndex = null;
        this.$emit("close", false);
      } else {
        this.show = true;
      }

      const selected = this.handlerSelected(item);
      this.$emit("changeData", selected);
    },
    handlerClickNav(id) {
      this.show = false;
      const index = this.selected.findIndex((i) => i.id === id);
      this.currentSelectedIndex = index;
      this.$emit("changeData", this.selected.slice(0, index + 1));
    },
    handlerSelected(item) {
      if (item.isLast) {
        return this.selected.slice(0, this.selected.length - 1).concat(item);
      }

      if (this.currentSelectedIndex !== null) {
        return this.selected.slice(0, this.currentSelectedIndex).concat(item);
      }

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
