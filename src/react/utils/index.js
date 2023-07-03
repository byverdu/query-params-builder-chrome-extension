/**
 *
 * @param {React.Dispatch<React.SetStateAction<import('../../extension/types/index.js').Toast>>} setToast
 * @param {Error} error
 * @param {string} type
 */
const sendMessageCatchHandler = (setToast, error, type) => {
  console.error(`QueryParamsBuilder extension ${type}`, String(error));
  setToast({ type: 'danger', text: error.message });
};

export { sendMessageCatchHandler };
