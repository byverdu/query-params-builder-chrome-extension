import { popupTableBuilder } from '../../src/utils/popupPage/popupTableBuilder';
import { readFileContent } from '../../utils/readFileContent';
import { propsBuilder } from './helpers';

describe('popupTableBuilder', () => {
  beforeEach(() => {
    document.body.innerHTML = readFileContent('popup');
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(popupTableBuilder).toBeInstanceOf(Function);
  });

  it('should throw an error if no table markup is found', () => {
    document.body.innerHTML = '';
    expect(() => popupTableBuilder([propsBuilder()])).toThrowError(
      'No .table selector present on the document'
    );
  });

  it('should not render extra th if an item can not be deleted', () => {
    popupTableBuilder([propsBuilder()]);

    expect(document.body.innerHTML).toMatchSnapshot();
  });

  it('should render extra th if an item can be deleted', () => {
    popupTableBuilder([propsBuilder({ canDeleteFromPopup: true })]);

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
