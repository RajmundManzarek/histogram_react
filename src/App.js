import React from 'react';
import { render } from 'react-dom'
// import Parser from 'html-react-parser'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_exporting from 'highcharts/modules/exporting'
import ColorScheme from 'highcharts/themes/grid'
import { useTable } from 'react-table'

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

    console.log(window.location.href)

    this.state = { ok: 0 }

    this.msg = '';

    this.options = {
      chart: {
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
        tickInterval: 50,
        minorTickInterval: 10,
        max: 100,
        title: {
          text: 'Latency µs'
        }
      },
      series: []
    }
    this.histogramOptions = {
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
      // xAxis: {
      //   tickInterval: 1,
      //   tickPositions: [],
      //   gridLineWidth: 1,
      //   labels: {
      //     format: '{value:.2f}',
      //     rotation: -90
      //   },
      //   type: 'logarithmic',
      //   title: {
      //     text: 'Percentile'
      //   }
      // },
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
        Header: 'Standard Deviation',
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
  }

  componentDidMount() {
    var self = this

    fetch('http://localhost:4000/setup')
      .then(response => response.json())
      .then(jsonData => {
        self.options.title = { text: jsonData.title }

        if (jsonData.hasOwnProperty('subTitle')) {
          self.options.subtitle = { text: jsonData.subTitle }
        }

        if (jsonData.hasOwnProperty('graphMax')) {
          self.options.yAxis.max = jsonData.graphMax
        }

        jsonData.chArray.forEach(function (entry) {
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

        jsonData.chArray[0].data.forEach(function (element) {
          self.options.xAxis.tickPositions.push(Math.log10(element[0]))
        })

        self.setState({ ok: 1 })
      })
      .catch((err) => {
        self.setState({ ok: 2 })
        self.msg = '<p>err</p>'
      })
  }

  render() {
    if (this.state.ok === 0) {
      return null
    }

    if (this.state.ok === 2) {
      return (
        <div>Error</div>
      )
    }

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
        <div className='top10m'>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.histogramOptions}
          />
        </div>

      </div>
    );
  }
}

render(<App />, document.getElementById('root'))

export default App;