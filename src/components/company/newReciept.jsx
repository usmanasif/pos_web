import React from 'react'
import { Form, Input, TextArea, Button, Select } from 'semantic-ui-react'

const genderOptions = [
  { key: '1', text: '1', value: 1 },
  { key: '2', text: '2', value: 2 },
  { key: '3', text: '3', value: 3 },
]

const NewReciept = () => (
  <Form>
    <Form.Group>
        <Form.Field
            id='form-input-control-first-name'
            icon='search'
            control={Input}
            label='Search Item'
            placeholder='Search by Code or Name'
        />
        <Form.Field
            control={Select}
            options={genderOptions}
            label={{ children: 'Select Quantity', htmlFor: 'form-select-control-gender' }}
            placeholder='Quantity'
            search  
            searchInput={{ id: 'form-select-control-gender' }}
        />
    </Form.Group>
    
    <Form.Field
      id='form-button-control-public'
      control={Button}
      content='Add to Invoice'
      label=''
    />

    <div className="w-50">
    <table className="ui compact table">
        <thead>
            <tr><th>Item No.</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Total($)</th>
        </tr></thead>
        <tbody>
            <tr>
            <td>1</td>
            <td>Lime Soap</td>
            <td>3</td>
            <td>9.50</td>
            </tr>
            <tr>
            <td>2</td>
            <td>Olives</td>
            <td>1</td>
            <td>20.00</td>
            </tr>
            <tr>
            <td>3</td>
            <td>Cheddar Cheese</td>
            <td>2</td>
            <td>15.00</td>
            </tr>
            <tr>
            <td>4</td>
            <td>Potatoes</td>
            <td>20</td>
            <td>10.00</td>
            </tr>
        </tbody>
        <tfoot>
            <tr><th></th>
            <th></th>
            <th><b>Total Bill:</b></th>
            <th>54.50</th>
            </tr>
        </tfoot>
    </table>
        <button class="ui left floated button">Pay Bill</button>
    </div>

  </Form>
)

export default NewReciept