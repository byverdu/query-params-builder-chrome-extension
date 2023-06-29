import { popupTableRowBuilder } from '../../src/utils/popupPage/popupTableRowBuilder';
import { propsBuilder } from './helpers';

describe('popupTableRowBuilder', () => {
  it('should be defined', () => {
    expect(popupTableRowBuilder).toBeInstanceOf(Function);
  });

  it('should render the <tr>', () => {
    const props = propsBuilder();
    const markup = popupTableRowBuilder(props);

    expect(markup).toMatchSnapshot();
  });

  it('should render different <tr> if items can be deleted from popup', () => {
    const props = propsBuilder({
      canDeleteFromPopup: true,
      withExtraThead: true,
    });
    const markup = popupTableRowBuilder(props);

    expect(markup).toMatchSnapshot();
  });

  it('should render different <tr> if items are not checked', () => {
    const props = propsBuilder({
      checked: false,
    });
    const markup = popupTableRowBuilder(props);

    expect(markup).toMatchSnapshot();
  });

  it('should render different <tr> if urlParamValue is not provided', () => {
    const props = propsBuilder({
      urlParamValue: undefined,
    });
    const markup = popupTableRowBuilder(props);

    expect(markup).toMatchSnapshot();
  });
});
