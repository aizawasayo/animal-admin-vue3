<template>
  <div
    id="homebarcharts"
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
  GridComponent,
  GridComponentOption,
  // LegendComponent,
  // LegendComponentOption,
} from 'echarts/components'
import { BarChart, BarSeriesOption } from 'echarts/charts'
// import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TooltipComponent,
  GridComponent,
  // LegendComponent,
  BarChart,
  CanvasRenderer,
  // UniversalTransition,
])

type EChartsOption = echarts.ComposeOption<
  // | TitleComponentOption
  // | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  // | LegendComponentOption
  | BarSeriesOption
>

export default defineComponent({
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
  setup(props) {
    const { mounted, chart, beforeDestroy, activated, deactivated } = resize()

    const animationDuration = 6000
    const initChart = () => {
      const barChart = echarts.init(
        document.getElementById('homebarcharts') as HTMLDivElement,
        'macarons'
      )
      barChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        // legend: { left: 'center', bottom: '10' },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
          },
        ],
        series: [
          {
            color: ['#57CAEB', '#5DDAB4', '#57CAEB', '#435EBE'],
            name: 'pageA',
            type: 'bar',
            stack: 'vistors',
            // barWidth: '60%',
            data: [79, 52, 200, 334, 390, 330, 220],
            animationDuration,
            // label: { show: true },
          },
          {
            name: 'pageB',
            type: 'bar',
            stack: 'vistors',
            // barWidth: '60%',
            data: [80, 52, 200, 334, 390, 330, 220],
            animationDuration,
          },
          {
            name: 'pageC',
            type: 'bar',
            stack: 'vistors',
            // barWidth: '60%',
            data: [30, 52, 200, 334, 390, 330, 220],
            animationDuration,
          },
        ],
      } as EChartsOption)
      chart.value = barChart
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
