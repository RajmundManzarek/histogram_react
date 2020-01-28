// const fs = require('fs');

import React from 'react';
import { render } from 'react-dom'
// import { withRouter } from "react-router-dom";
// import queryString from 'query-string';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// import fs from 'fs'
import HC_exporting from 'highcharts/modules/exporting'

import './App.css';

HC_exporting(Highcharts);

// DarkUnica(HighchartsReact.Highcharts);
var readJSON = function ( name ) {
  console.log("readJSON");

  // var data = fs.readFileSync(name);
  var data = require('./data/data.json');
  // var jd = JSON.parse(data);

  console.log(data);

}

const options = {
  title: {
    text: "inputData.name"
  },
  legend: {
    enabled: false
  },
  series: [{
    data: [
      [5.00, 7.511],
      [10.00, 9.687],
      [20.00, 12.263],
      [30.00, 16.543],
      [40.00, 30.543],
      [50.00, 35.071],
      [60.00, 40.415],
      [70.00, 48.447],
      [80.00, 66.047],
      [90.00, 90.943],
      [99.00, 310.015],
      [100.00, 54788.095],
    ],
    // color: rgb(13, 34, 49)
  }],
  xAxis: {
    gridLineWidth: 1,
    //  tickInterval: 1,
    //  minorTickInterval: 0.5,
    type: 'logarithmic',
    title: {
      text: 'Percentile'
    }
  },
  yAxis: {
    tickInterval: 50,
    minorTickInterval: 10,
    max: 200.00,
    title: {
      text: 'Latency µs'
    }
  }
}

const App = () => <div>
  <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
</div>

readJSON('./data/input.json')
render(<App />, document.getElementById('root'))

export default App;