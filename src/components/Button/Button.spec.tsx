import { theme } from '@/styles/theme';
import { render, screen } from '@testing-library/react-native';
import { Button } from '.';

describe('<Button/>', () => {
  it('Should render correctly', () => {
    render(<Button title="Botão" />);
    const component = screen.getByText('Botão');
    const wrapper = screen.getByTestId('Button');

    expect(component).toBeOnTheScreen();

    expect(wrapper.props.style.minHeight).toEqual(48);
    expect(wrapper.props.style.minWidth).toEqual(64);
    expect(wrapper.props.style.alignItems).toEqual('center');
    expect(wrapper.props.style.justifyContent).toEqual('center');
    expect(wrapper.props.style.borderRadius).toEqual(theme.radius.md);
    expect(wrapper.props.style.paddingHorizontal).toEqual(theme.spacing.lg);
    expect(wrapper.props.style.paddingVertical).toEqual(theme.spacing.sm);

    //expect(component?.props?.style[0].fontSize).toEqual()
  });
  it('Should render correctly when variant is primary', () => {
    render(<Button title="Botão" variant="primary" />);

    const textComponent = screen.getByText('Botão');
    const wrapper = screen.getByTestId('Button');

    console.log(textComponent.props.style);

    expect(wrapper).toBeOnTheScreen();
    expect(wrapper.props.style.backgroundColor).toEqual(theme.colors.primary);

    expect(textComponent).toBeOnTheScreen();
    expect(textComponent.props?.style[0].color).toEqual(theme.colors.textPrimary);
    expect(textComponent.props?.style[0].fontWeight).toEqual(theme.fonts.weight.text);
  });
});
