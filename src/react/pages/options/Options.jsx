import React, { useContext, useCallback } from 'react';
import { Toast } from '../../components/Toast.jsx';
import { OptionsTableBody } from '../../components/OptionsTableBody.jsx';
import { OptionContext } from './OptionsContext.jsx';
import { Form } from '../../components/Form.jsx';
import {
  updateState,
  getNewItemToSave,
  removeItemFromState,
  editItemFromState,
} from '../../utils/index.js';

export const Options = () => {
  const { setUpdateAction, setOptions } = useContext(OptionContext);
  const onSubmitHandler = useCallback(
    e => {
      e.preventDefault();

      const elements = e.target.elements || [];
      const option = getNewItemToSave('options', elements);

      setOptions(prevState => updateState(prevState, option));
      setUpdateAction('saveNewOption');
    },
    [setOptions, setUpdateAction]
  );

  const deleteHandler = event => {
    const bundleId = event.target.dataset.bundleId;

    if (bundleId) {
      setOptions(prevState => removeItemFromState(prevState, bundleId));
      setUpdateAction('deleteOption');
    }
  };

  const editHandler = e => {
    const id = e.target.parentElement.id;
    const key = e.target.dataset.valueType;
    const value = e.target.textContent.trim();

    setOptions(prevState => editItemFromState(prevState, { id, key, value }));
    setUpdateAction('updateOption');
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <h1>QueryParamsBuilder Options</h1>
        </div>
        <Toast />
        <Form onSubmitHandler={onSubmitHandler} />
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
                <OptionsTableBody
                  deleteHandler={deleteHandler}
                  editHandler={editHandler}
                />
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
