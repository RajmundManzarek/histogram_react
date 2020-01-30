import React from 'react';
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_exporting from 'highcharts/modules/exporting'
import ColorScheme from 'highcharts/themes/grid'

import './App.css';
import jsonData from './data/input.json'

ColorScheme(Highcharts);
HC_exporting(Highcharts);

var options = {
  title: {
    text: "N8 roundtrip percentiles"
  },
  legend: {
    enabled: true,
    align: 'left'
  },
  xAxis: {
    gridLineWidth: 1,
    type: 'logarithmic',
    title: {
      text: 'Percentile'
    }
  },
  yAxis: {
    tickInterval: 50,
    minorTickInterval: 10,
    max: 300,
    title: {
      text: 'Latency µs'
    }
  }
}

options.series = [];

jsonData.chArray.forEach(function(entry) {
  options.series.push({
    'name': entry.name,
    'data': entry.data
  })
})

options.yAxis.max = jsonData.graphMax

const App = () => <div>
  <div>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  </div>
  <div className='top10m'></div>
</div>

render(<App />, document.getElementById('root'))

export default App;