import React from 'react';
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_exporting from 'highcharts/modules/exporting'
import ColorScheme from 'highcharts/themes/grid'
import { useTable } from 'react-table'
import jsonData from './data/input.json'

import './App.css'

ColorScheme(Highcharts);
HC_exporting(Highcharts);

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } =
    useTable({
      columns,
      data,
    })
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          }
        )}
      </tbody>
    </table>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.options = {
      credits: {
        enabled: false
      },
      chart: {
        type: 'spline',
        height: 500,
        width: 1800
      },
      legend: {
        enabled: true,
        align: 'left'
      },
      xAxis: {
        tickInterval: 1,
        tickPositions: [],
        gridLineWidth: 1,
        labels: {
          format: '{value:.2f}',
          rotation: -90
        },
        type: 'logarithmic',
        title: {
          text: 'Percentile'
        }
      },
      yAxis: {
        max: 100,
        title: {
          text: 'Latency µs'
        }
      },
      series: []
    }
    this.histogramOptions = {
      credits: {
        enabled: false
      },
      chart: {
        type: 'column',
        height: 800,
        width: 1800
      },
      title: {
        text: 'Histogram'
      },
      legend: {
        enabled: true,
        align: 'left'
      },
      yAxis: {
        tickInterval: 50,
        minorTickInterval: 10,
        title: {
          text: 'Count'
        }
      },
      series: []
    }

    this.tColumns = [
      {
        Header: 'What',
        accessor: 'what',
      },
      {
        Header: 'Standard Deviation [µs]',
        accessor: 'stdDev',
      },
      {
        Header: 'Average [µs]',
        accessor: 'mean',
      },
      {
        Header: 'Median [µs]',
        accessor: 'median',
      },
      {
        Header: 'Min [µs]',
        accessor: 'min',
      },
      {
        Header: 'Max [µs]',
        accessor: 'max',
      },
      {
        Header: 'Count',
        accessor: 'count',
      },
    ]

    this.tableData = [];

    if (jsonData.hasOwnProperty('setup')) {
      if (jsonData.setup.hasOwnProperty('title')) {
        this.options.title = { text: jsonData.setup.title }
      }
      
      if (jsonData.setup.hasOwnProperty('subTitle')) {
        this.options.subtitle = { text: jsonData.setup.subTitle }
      }

      if (jsonData.setup.hasOwnProperty('graphMax')) {
        this.options.yAxis.max = jsonData.setup.graphMax
      }

      var self = this

      jsonData.setup.chArray.forEach(function (entry) {
        var td = entry.stats;

        td.what = entry.name
        self.tableData.push(td)

        self.options.series.push({
          'name': entry.name,
          'data': entry.data
        })

        self.histogramOptions.series.push({
          'name': entry.name,
          'data': entry.histogram
        })
      })

      jsonData.setup.chArray[0].data.forEach(function (element) {
        self.options.xAxis.tickPositions.push(Math.log10(element[0]))
      })
    }
  }

  render() {
    return (
      <div>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.options}
          />
        </div>
        <div className='top10m'>
          <Table
            columns={this.tColumns}
            data={this.tableData}
          />
        </div>
        {<div className='top10m'>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.histogramOptions}
          />
        </div>}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'))

export default App;