import { Bar } from 'solid-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Component, createResource, Show } from 'solid-js';
import { getFunnelMetric } from './utils/endpoints';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FunnelChart: Component = () => {
  const [funnelData] = createResource(getFunnelMetric);

  const createTooltip = () => {
    const el = document.createElement('div');
    el.id = 'chartjs-tooltip';
    el.style.position = 'absolute';
    el.style.pointerEvents = 'none';
    el.style.transition = 'all .1s ease';
    el.style.zIndex = '1000';
    document.body.appendChild(el);
    return el;
  };

  return (
    <Show when={funnelData()}>
      {(data) => {
        const funnel = data().data.slice(-1)[0];

        const chartData = {
          labels: ['Unique Visits', 'Step 1', 'Step 2'],
          datasets: [
            {
              label: 'Funnel',
              data: [funnel.unique_visitors, funnel.guests, funnel.signups],
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        };

        const options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false,
              external: (context: any) => {
                const tooltipModel = context.tooltip;
                const chart = context.chart;

                const tooltipEl = document.getElementById('chartjs-tooltip') || createTooltip();

                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = '0';
                  return;
                }

                if (tooltipModel.body) {
                  const index = tooltipModel.dataPoints[0].dataIndex;
                  let extraInfo = '';

                  if (index === 0) {
                    extraInfo = `<div>Unique Visitors: ${funnel.unique_visitors}</div>`;
                  } else if (index === 1) {
                    extraInfo = `
                      <div>Guests: ${funnel.guests}</div>
                      <div>Visitor Dropoff: ${funnel.visitors_dropoff}</div>`;
                  } else if (index === 2) {
                    extraInfo = `
                      <div>Signups: ${funnel.signups}</div>
                      <div>Guests Dropoff: ${funnel.guests_dropoff}</div>`;
                  }

                  tooltipEl.innerHTML = `
                    <div style="background:#1f2937;color:white;padding:10px;border-radius:8px;min-width:150px;text-align:left;">
                      <div><strong>${tooltipModel.title[0]}</strong></div>
                      ${extraInfo}
                    </div>`;
                }

                const { top, left } = chart.canvas.getBoundingClientRect();
                tooltipEl.style.opacity = '1';
                tooltipEl.style.left = left + window.scrollX + tooltipModel.caretX + 'px';
                tooltipEl.style.top = top + window.scrollY + tooltipModel.caretY + 'px';
              },
            },
            legend: { display: false },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#6b7280' } },
            y: { grid: { display: false }, ticks: { color: '#6b7280' } },
          },
        };

        return (
          <div class="w-full h-64 relative">
            <Bar data={chartData} options={options} />
          </div>
        );
      }}
    </Show>
  );
};

export default FunnelChart;
