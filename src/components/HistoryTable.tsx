import React from 'react'
import { Table } from 'semantic-ui-react'

const getHeader = (history: any) => {
  const headers = [];
  if (history !== null && history.length !== 0) {
    for (let i = 0; i < Object.keys(history[0]).length; i++) {
      headers.push(<Table.HeaderCell>{Object.keys(history[0])[i]}</Table.HeaderCell>)
    }
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
      for (let j = 0; j < Object.keys(history[i]).length; i++) {
        rows.push(
          <Table.Cell>{history[i][j]}</Table.Cell>
        )
      }
    }
    return (
      <Table.Body>
        <Table.Row>
          {rows}
        </Table.Row>
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
