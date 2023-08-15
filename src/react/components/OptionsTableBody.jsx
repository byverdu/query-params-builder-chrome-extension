import React, { useContext } from 'react';
import { OptionContext } from '../pages/options/OptionsContext.jsx';

/**
 *
 * @param {OptionsTableBodyProps} props
 * @returns
 */
export const OptionsTableBody = ({ deleteHandler, editHandler }) => {
  const { options } = useContext(OptionContext);

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
      {options.map(({ id, bundleName, urlParamKey }) => (
        <tr id={`${id}`} key={id}>
          <td
            suppressContentEditableWarning
            onBlur={editHandler}
            className="contentEditable"
            data-value-type="bundleName"
            contentEditable="true"
          >
            {bundleName}
          </td>
          <td
            suppressContentEditableWarning
            onBlur={editHandler}
            className="contentEditable"
            data-value-type="urlParamKey"
            contentEditable="true"
          >
            {urlParamKey}
          </td>
          <td>
            <button
              data-bundle-id={id}
              onClick={deleteHandler}
              className="btn btn-outline-danger delete-bundle"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};
