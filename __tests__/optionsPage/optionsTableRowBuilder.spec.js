import { optionsTableRowBuilder } from '../../src/utils/optionsPage/optionsTableRowBuilder';

describe('optionsTableRowBuilder', () => {
  it('should be defined', () => {
    expect(optionsTableRowBuilder).toBeInstanceOf(Function);
  });

  it('should render the <tr>', () => {
    const markup = optionsTableRowBuilder('12345', 'api key', 'apiKey');

    expect(markup).toMatchSnapshot();
  });
});
