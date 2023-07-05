/**
 * @type {API}
 */
const { sendMessage } = extensionApi;

/**
 * @param {React.Dispatch<React.SetStateAction<Toast>>} setToast
 * @param {Error} error
 * @param {UpdateActions | ExtensionActions} type
 */
const sendMessageCatchHandler = (setToast, error, type) => {
  console.error(`QueryParamsBuilder extension ${type}`, String(error));
  setToast({ type: 'danger', text: error.message });
};

export { sendMessageCatchHandler };
