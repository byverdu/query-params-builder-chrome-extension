import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { PopupTableBody } from '../../components/PopupTableBody.jsx';
import { PopupContext } from './PopupContext.jsx';
import { Form } from '../../components/Form.jsx';

export const Popup = () => {
  const { currentTab, setOptions, setUpdateAction } = useContext(PopupContext);
  const isLoading = useRef(currentTab !== null);

  useEffect(() => {
    return () => {
      isLoading.current = false;
    };
  }, [currentTab]);

  const onSubmitHandler = useCallback(
    e => {
      e.preventDefault();

      const elements = e.target.elements || [];
      const option = {
        checked: false,
        canDeleteFromPopup: true,
        id: crypto.randomUUID(),
      };

      for (const elem of elements) {
        if (elem.nodeName === 'INPUT') {
          option[elem.id] = elem.value;

          // remove old value
          elem.value = '';
        }
      }

      setOptions(prevState => [...prevState, option]);
      setUpdateAction('addNewTabBundle');
    },
    [setOptions, setUpdateAction]
  );

  return (
    <div className="wrapper">
      {isLoading.current && (
        <div className="container" id="popup-spinner">
          <div>
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        </div>
      )}
      <div className="container-fluid">
        <div className="row">
          <h3>QueryParamsBuilder</h3>
        </div>
        <div className="row" style={{ padding: '0 12px' }}>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>Params to Apply</span>|
                  <label htmlFor="check-all">
                    <input
                      id="check-all"
                      className="form-check-input check-all"
                      type="checkbox"
                    />
                    Check All
                  </label>
                </th>
                <th scope="col">Url param value</th>
                <th id="withExtraThead" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <PopupTableBody />
            </tbody>
          </table>
        </div>

        <div className="row">
          <div
            className="collapse"
            data-collapsed="true"
            id="extraParam"
            style={{ padding: 0 }}
          >
            <div className="card card-body">
              <Form onSubmitHandler={onSubmitHandler} />
            </div>
          </div>
        </div>
        <div className="row actions">
          <div className="col-6">
            <button
              id="applyParams"
              className="btn btn-outline-primary action-btns"
            >
              Apply Params
            </button>
          </div>
          <div className="col-6">
            <a
              onClick={() =>
                document.getElementById('extraParam')?.classList.toggle('show')
              }
              className="btn btn-outline-success action-btns"
              data-bs-toggle="collapse"
              href="#extraParam"
              role="button"
              aria-expanded="false"
              aria-controls="extraParam"
            >
              Add Param
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
