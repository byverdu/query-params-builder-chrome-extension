import { readFileContent } from '../../utils/readFileContent';
import { savedOptionsToTableRows } from '../../src/utils/optionsPage/savedOptionsToTableRows';
import * as helper from '../../src/utils/optionsPage/optionsTableRowBuilder';

/**
  @type import('../../src/types/index.js').ExtensionOptions[]  
*/
const savedOptions = [
  { id: '1234', urlParamKey: 'apiKey', bundleName: 'api key' },
  { id: '5678', urlParamKey: 'geo', bundleName: 'location' },
];

beforeEach(() => {
  document.body.innerHTML = readFileContent('options');
  jest.resetAllMocks();
});

describe('savedOptionsToTableRows', () => {
  it('should be defined', () => {
    expect(savedOptionsToTableRows).toBeInstanceOf(Function);
  });

  it('should throw and Error if <tbody> is not present', () => {
    document.body.innerHTML = '';

    expect(() => savedOptionsToTableRows(savedOptions)).toThrowError(
      'No .selected_bundles tbody selector present on the document'
    );
  });

  it('should call optionsTableRowBuilder as many times as options saved', () => {
    jest.spyOn(helper, 'optionsTableRowBuilder');

    savedOptionsToTableRows(savedOptions);

    expect(helper.optionsTableRowBuilder).toBeCalledTimes(2);
    expect(helper.optionsTableRowBuilder).toHaveBeenNthCalledWith(
      1,
      '1234',
      'api key',
      'apiKey'
    );
    expect(helper.optionsTableRowBuilder).toHaveBeenNthCalledWith(
      2,
      '5678',
      'location',
      'geo'
    );
  });

  it('should render the <tbody>', () => {
    savedOptionsToTableRows(savedOptions);
    const markup = document.querySelector('.selected_bundles tbody').innerHTML;

    expect(markup).toMatchSnapshot();
  });
});
