export default function usePeriodProcess(formData) {
  const startPeriod =
    formData.periodStart.indexOf('0') === 0
      ? formData.periodStart.substring(1, 2)
      : formData.periodStart.substring(0, 2)
  const endPeriod =
    formData.periodEnd.indexOf('0') === 0
      ? formData.periodEnd.substring(1, 2)
      : formData.periodEnd.substring(0, 2)
  formData.period = startPeriod + '点-' + endPeriod + '点'
}
