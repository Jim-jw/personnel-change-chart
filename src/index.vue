<template>
  <div>
    <FlEchart
      :options="echartOptions"
      :isResize="true"
      style="width: 100%;height: 800px;"/>
  </div>
</template>
<script>
import FlEchart from './components/FlEchart/index.vue'
import data from './data/data.js' 

export default {
  components: { FlEchart, },
  data() {
    const [date, nums, leaveNums, newNums] = [[], [], [], []]
    data.forEach((item, key) => {
      date.push(item.date)
      nums.push(item.workers.length)
      if (key > 0) {
        newNums.push(item.workers.filter(value => {
          return data[key - 1].workers.indexOf(value) === -1
        }).length)
        leaveNums.push(data[key - 1].workers.filter(value => {
          return item.workers.indexOf(value) === -1
        }).length)
      } else {
        leaveNums.push(0)
        newNums.push(0)
      }
    })
    return {
      totalData: data,
      echartOptions: {
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc',],
        toolbox: {
          show: true,
          feature: {
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['总人数', '新增', '离开'],
        },
        xAxis: {
          type: 'category',
          data: date,
          name: '日期',
        },
        yAxis: {
          type: 'value',
          name: '人数',
        },
        series: [{
          name: '总人数',
          data: nums,
          type: 'line',
          label: {
            show: true,
            position: 'top',
          },
          markLine: {
            data: [
              {type: 'average', name: '平均值'},
            ],
          },
        }, {
          name: '新增',
          data: newNums,
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              return params.value ? params.value : ''
            },
          },
        }, {
          name: '离开',
          data: leaveNums,
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              return params.value ? params.value : ''
            },
          },
        }, ],
      },
    }
  }
}
</script>