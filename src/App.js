import React from 'react';
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HC_exporting from 'highcharts/modules/exporting'
import ColorScheme from 'highcharts/themes/grid'
import { useTable } from 'react-table'

import './App.css'
import jsonData from './data/input.json'

if (!jsonData.hasOwnProperty('title')) {
  jsonData.title = 'Roundtrip percentiles'
}

ColorScheme(Highcharts);
HC_exporting(Highcharts);

var options = {
  title: {
    text: jsonData.title
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

var tColumns = [{
  Header: 'Summary', columns: [
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
}]

var tableData = [];

jsonData.chArray.forEach(function (entry) {
  var td = entry.stats;

  td.what = entry.name
  tableData.push(td)

  options.series.push({
    'name': entry.name,
    'data': entry.data
  })
})

options.yAxis.max = jsonData.graphMax


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

const App = () => <div>
  <div>
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  </div>
  <div className='top10m'>
    <Table
      columns={tColumns}
      data={tableData}
    />
  </div>
</div>

render(<App />, document.getElementById('root'))

export default App;