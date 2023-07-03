import React, { useContext } from 'react';
import { AppContext } from '../pages/options/index.jsx';

export const TableBody = () => {
  const { setToast, updateOptions, options } = useContext(AppContext);

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

    setToast({ type: 'danger', text: 'Option deleted!' });

    updateOptions(newOptions, 'deleteOption');
  };
  return (
    <>
      {options.map(({ id, bundleName, urlParamKey }) => (
        <tr id={`${id}`} key={id}>
          <td
            suppressContentEditableWarning
            onBlur={editHandler}
            className="contentEditable"
            data-initial-value={bundleName}
            data-value-type="bundleName"
            contentEditable="true"
          >
            {bundleName}
          </td>
          <td
            suppressContentEditableWarning
            onBlur={editHandler}
            className="contentEditable"
            data-initial-value={urlParamKey}
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
