import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled = false,
  icon = null,
  iconOnly = false,
  onClick,
  className = '',
  ...rest
}) => {
  // Construct class names based on props
  const baseClass = 'dome-btn';
  const variantClass = `dome-btn--${variant}`;
  const sizeClass = size !== 'md' ? `dome-btn--${size}` : '';
  const loadingClass = isLoading ? 'dome-btn--loading' : '';
  const iconOnlyClass = iconOnly ? 'dome-btn--icon-only' : '';

  const finalClassName = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    iconOnlyClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={finalClassName}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && (
        <span className="dome-btn-spinner" aria-hidden="true"></span>
      )}
      {!isLoading && icon && (
        <span className="dome-btn-icon" aria-hidden="true">{icon}</span>
      )}
      {!iconOnly && <span className="dome-btn-text">{children}</span>}
    </button>
  );
};

export default Button;
