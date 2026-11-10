<script setup lang="ts">
import { supabase } from '@/lib/supabaseClient';
import {
  BarController,
  BarElement,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { computed, onMounted, ref } from 'vue';
import { Chart } from 'vue-chartjs';

ChartJS.register(
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
);

const props = defineProps<{ animalId: string }>();
const entries = ref<{ measured_at: string; type: string; value: number }[]>([]);

onMounted(async () => {
  const since = new Date(Date.now() - 14 * 864e5).toISOString();
  const { data } = await supabase
    .from('entries')
    .select('measured_at, type, value')
    .eq('animal_id', props.animalId)
    .gte('measured_at', since)
    .order('measured_at');
  entries.value = data ?? [];
});

const pts = (t: string) =>
  entries.value
    .filter((e) => e.type === t)
    .map((e) => ({ x: new Date(e.measured_at).getTime(), y: e.value }));

const data = computed(() => ({
  datasets: [
    {
      type: 'line' as const,
      label: 'Glycémie (mmol/L)',
      data: pts('glucose'),
      yAxisID: 'y',
      tension: 0.25,
      borderColor: '#00b6d9',
      backgroundColor: '#00b6d9',
    },
    {
      type: 'bar' as const,
      label: 'Insuline (U)',
      data: pts('insulin'),
      yAxisID: 'y2',
      barThickness: 8,
      borderColor: '#7acc00',
      backgroundColor: '#7acc00',
    },
  ],
}));

const options = {
  responsive: true,
  scales: {
    x: { type: 'time' as const, time: { unit: 'day' as const } },
    y: { position: 'left' as const, title: { display: true, text: 'Glycémie (mmol/L)' } },
    y2: {
      position: 'right' as const,
      min: 0,
      grid: { drawOnChartArea: false },
      title: { display: true, text: 'Insuline (U)' },
    },
  },
};
</script>

<template>
  <Chart type="bar" :data="data" :options="options" />
</template>
