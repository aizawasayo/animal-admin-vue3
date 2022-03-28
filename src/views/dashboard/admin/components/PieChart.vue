<template>
  <div
    id="homePieCharts"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  nextTick,
} from 'vue'
import resize from '@components/charts/mixins/resize'
import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components'
import { PieChart, PieSeriesOption } from 'echarts/charts'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  LabelLayout,
  CanvasRenderer,
  // UniversalTransition,
])

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | LegendComponentOption | PieSeriesOption
>

export default defineComponent({
  name: 'PieChart',
  props: {
    className: {
      type: String,
      default: 'chart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '300px',
    },
  },
  setup() {
    const { mounted, chart, beforeDestroy, activated, deactivated } = resize()

    const initChart = () => {
      const pieChart = echarts.init(
        document.getElementById('homePieCharts') as HTMLDivElement,
        'macarons'
      )
      pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
        },
        series: [
          {
            color: ['#435EBE', '#5DDAB4', '#9694FF', '#FF7976', '#57CAEB'],
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' },
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
          },
        ],
      } as EChartsOption)
      chart.value = pieChart
    }

    onMounted(() => {
      mounted()
      nextTick(() => {
        initChart()
      })
    })

    onBeforeUnmount(() => {
      // if (!chart.value) {
      //   return
      // }
      // chart.value.dispose()
      // chart.value = null
      beforeDestroy()
    })

    onActivated(() => {
      activated()
    })

    onDeactivated(() => {
      deactivated()
    })

    return {}
  },
})
</script>
