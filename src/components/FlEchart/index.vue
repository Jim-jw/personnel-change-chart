<template>
  <div ref="echarts" class="fl-echarts">
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'FlEchart',
  props: {
    options: {
      type: Object,
      default: () => {},
    },
    isResize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      return: {
        chart: null,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.chart = echarts.init(this.$refs.echarts);
      this.chart.setOption(this.options);
      this.chart.on('click', (params) => {
        this.echartClick(params);
      });
      this.$watch('options', (options) => {
        this.chart.setOption(options, true);
      }, { deep: true });
      if (this.isResize) {
        window.addEventListener('resize', this.resize);
      }
    });
  },
  methods: {
    resize() {
      this.chart.resize();
    },
    echartClick(params) {
      this.$emit('click', params);
    },
  },
  beforeDestroy() {
    this.isResize && window.removeEventListener('resize', this.resize);
    this.chart.clear();
  },
};
</script>
<style>
.fl-echarts {
  width: 100%;
  height: 100%;
}
</style>
