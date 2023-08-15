import React, { useCallback, useContext } from 'react';
import { PopupContext } from '../pages/popup/PopupContext.jsx';

export const PopupTableBody = () => {
  const { options, setUpdateAction, setOptions } = useContext(PopupContext);

  const deleteTabOptionHandler = useCallback(
    event => {
      const bundleId = event.target.dataset.bundleId;

      if (bundleId) {
        const newOptions = options.filter(option => option.id !== bundleId);

        setOptions(newOptions);
        setUpdateAction('deleteTabItem');
      }
    },
    [setOptions, options, setUpdateAction]
  );

  if (!options.length) {
    return (
      <tr>
        <td style={{ display: 'table-cell', textAlign: 'center' }} colSpan={3}>
          Add some bundles!
        </td>
      </tr>
    );
  }

  return (
    <>
      {options.map(
        ({
          id,
          bundleName,
          urlParamKey,
          canDeleteFromPopup,
          checked,
          urlParamValue,
        }) => (
          <tr key={id}>
            <td className="td-checkbox">
              <label className="form-check-label" htmlFor={id}>
                <input
                  className="form-check-input me-1"
                  type="checkbox"
                  value={urlParamKey}
                  data-url-param-key={urlParamKey}
                  data-bundle-name={bundleName}
                  id={id}
                  defaultChecked={checked}
                  data-can-delete-from-popup={canDeleteFromPopup}
                />
                {bundleName}
              </label>
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                data-id={id}
                placeholder={`${urlParamKey} value`}
                value={urlParamValue}
              />
            </td>
            {canDeleteFromPopup && (
              <td>
                <button
                  onClick={deleteTabOptionHandler}
                  data-bundle-id={id}
                  className="btn btn-danger delete-new-item"
                >
                  -
                </button>
              </td>
            )}
          </tr>
        )
      )}
    </>
  );
};
