import React, { useContext } from 'react';
import { OptionsForm } from '../../components/OptionsForm.jsx';
import { Toast } from '../../components/Toast.jsx';
import { OptionsTableBody } from '../../components/OptionsTableBody.jsx';
import { OptionContext } from './context.jsx';

export const Options = () => {
  const { setUpdateAction } = useContext(OptionContext);

  return (
    <>
      <div className="container">
        <div className="row">
          <h1>QueryParamsBuilder Options</h1>
        </div>
        <Toast />
        <OptionsForm />
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
                <OptionsTableBody />
              </tbody>
            </table>
          </div>
          <div className="row save_options">
            <div className="col-2">
              <button
                onClick={() => setUpdateAction('deleteAll')}
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
