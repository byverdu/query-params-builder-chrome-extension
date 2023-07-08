import React, { useContext } from 'react';
import { OptionContext } from '../pages/options/context.jsx';

export const OptionsTableBody = () => {
  const { updateOptions, options } = useContext(OptionContext);

  const editHandler = e => {
    const id = e.target.parentElement.id;
    const type = e.target.dataset.valueType;
    const value = e.target.textContent.trim();
    const newOptions = options.map(item => {
      if (item.id === id) {
        item[type] = value;
      }

      return item;
    });
    updateOptions(newOptions, 'updateOption');
  };

  const deleteHandler = id => {
    const newOptions = options.filter(item => item.id !== id);

    updateOptions(newOptions, 'deleteOption');
  };

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
              onClick={() => deleteHandler(id)}
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
