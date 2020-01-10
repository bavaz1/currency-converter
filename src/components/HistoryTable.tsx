import React from 'react'
import { Table } from 'semantic-ui-react'

const getHeader = (history: any) => {
  const headers = [];
  if (history !== null && history.length !== 0) {
    for (let i = 0; i < Object.keys(history[0]).length; i++) {
      headers.push(<Table.HeaderCell>{Object.keys(history[0])[i]}</Table.HeaderCell>)
    }
    console.log('headers', headers);
    return (
      <Table.Header>
        <Table.Row>
          {headers}
        </Table.Row>
      </Table.Header>
    )
  }
  return;
}

const getBody = (history: any) => {
  const rows = [];
  if (history !== null && history.length !== 0) {
    for (let i = 0; i < history.length; i++) {
      rows.push(
        <Table.Row>
          <Table.Cell>{history[i].from}</Table.Cell>
          <Table.Cell>{history[i].to}</Table.Cell>
          <Table.Cell>{history[i].amount}</Table.Cell>
          <Table.Cell>{history[i].result}</Table.Cell>
          <Table.Cell>{history[i].date}</Table.Cell>
        </Table.Row>
      )
    }
    console.log('rows', rows);
    return (
      <Table.Body>
        {rows}
      </Table.Body>
    )
  }
  return;
}

const HistoryTable = (props: any) => (
  <Table celled>
    {getHeader(props.history)}

    {getBody(props.history)}
  </Table>
)

export default HistoryTable;
