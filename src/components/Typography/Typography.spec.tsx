import { theme } from '@/styles/theme';
import { render, screen } from '@testing-library/react-native';
import { Typography } from '.';

describe('<Typography/>', () => {
  it('Should render correctly', () => {
    render(<Typography>Teste</Typography>);

    expect(screen.getByText('Teste')).toBeOnTheScreen();
  });
  it('Should render correctly when the selected variant is equal to title', () => {
    render(<Typography variant="title">Titulo</Typography>);

    const component = screen.getByText('Titulo');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.title);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.title);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.title);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.bold);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.textPrimary);
  });
  it('Should render correctly when the selected variant is equal to subtitle', () => {
    render(<Typography variant="subtitle">Subtitulo</Typography>);

    const component = screen.getByText('Subtitulo');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.subtitle);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.subtitle);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.subtitle);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.semi);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.textPrimary);
  });
  it('Should render correctly when the selected variant is equal to section', () => {
    render(<Typography variant="section">Section</Typography>);

    const component = screen.getByText('Section');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.section);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.section);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.section);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.semi);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.textPrimary);
  });
  it('Should render correctly when the selected variant is equal to text', () => {
    render(<Typography variant="text">Texto</Typography>);

    const component = screen.getByText('Texto');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.text);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.text);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.text);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.regular);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.textPrimary);
  });
  it('Should render correctly when the selected variant is equal to textSmall', () => {
    render(<Typography variant="textSmall">Texto Pequeno</Typography>);

    const component = screen.getByText('Texto Pequeno');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.textSmall);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.textSmall);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.textSmall);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.regular);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.textSecondary);
  });
  it('Should render correctly when the selected variant is equal to label', () => {
    render(<Typography variant="label">Label</Typography>);

    const component = screen.getByText('Label');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.label);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.label);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.label);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.medium);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.textSecondary);
  });
  it('Should render correctly when the selected variant is equal to success', () => {
    render(<Typography variant="success">Sucesso</Typography>);

    const component = screen.getByText('Sucesso');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.success);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.success);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.success);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.regular);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.success);
  });
  it('Should render correctly when the selected variant is equal to error', () => {
    render(<Typography variant="error">Error</Typography>);

    const component = screen.getByText('Error');

    expect(component).toBeOnTheScreen();
    expect(component.props?.style?.[0]?.fontSize).toEqual(theme.fonts.sizes.error);
    expect(component.props?.style?.[0]?.fontWeight).toEqual(theme.fonts.weight.error);
    expect(component.props?.style?.[0]?.lineHeight).toEqual(theme.fonts.lineHeights.error);
    expect(component.props?.style?.[0]?.fontFamily).toEqual(theme.fonts.family.regular);
    expect(component.props?.style?.[0]?.color).toEqual(theme.colors.error);
  });

  it('Should render correctly when color prop is passed', () => {
    render(<Typography color="success50">Texto com cor</Typography>);

    const element = screen.getByText('Texto com cor');

    expect(element).toBeOnTheScreen();
    expect(element?.props?.style?.[2].color).toEqual(theme.colors.success50);
  });

  it('Should render correctly when weight prop is passed', () => {
    render(<Typography weight="title">Texto com peso diferente</Typography>);

    const element = screen.getByText('Texto com peso diferente');

    expect(element).toBeOnTheScreen();
    expect(element?.props?.style?.[3].fontWeight).toEqual(theme.fonts.weight.title);
  });

  it('Should render correctly when style prop is passed', () => {
    render(
      <Typography
        style={{
          backgroundColor: 'transparent',
        }}>
        Texto com estilo novo
      </Typography>,
    );

    const element = screen.getByText('Texto com estilo novo');

    expect(element).toBeOnTheScreen();
    expect(element?.props?.style?.[1].backgroundColor).toEqual('transparent');
  });
});
