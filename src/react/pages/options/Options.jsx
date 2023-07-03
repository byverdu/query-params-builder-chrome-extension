import React, { useContext } from 'react';
import { Form } from '../../components/Form.jsx';
import { Toast } from '../../components/Toast.jsx';
import { TableBody } from '../../components/OptionsTableBody.jsx';
import { AppContext } from './index.jsx';

export const Options = () => {
  const { updateOptions } = useContext(AppContext);

  return (
    <>
      <div className="container">
        <div className="row">
          <h1>QueryParamsBuilder Options</h1>
        </div>
        <Toast />
        <Form />
        <div className="row selected_bundles">
          <div id="selected_bundles">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Param Description</th>
                  <th scope="col">Url Param Key</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <TableBody />
              </tbody>
            </table>
          </div>
          <div className="row save_options">
            <div className="col-2">
              <button
                onClick={() => updateOptions([], 'deleteAll')}
                id="removeAll"
                style={{ width: '100%' }}
                className="btn btn-danger"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
