// Sorrel entry point for Vite build
// Replaces the two CDN <script> tags that previously loaded Chart.js and QuaggaJS.
// Both are exposed on window so the legacy inline scripts in index.html can reach them
// without modification.

import Chart from 'chart.js/auto';
import Quagga from '@ericblade/quagga2';

window.Chart = Chart;
window.Quagga = Quagga;
