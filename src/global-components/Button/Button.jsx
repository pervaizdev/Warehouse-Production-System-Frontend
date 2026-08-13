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
  const baseClass = 'btn';
  const variantClass = variant ? `btn-${variant}` : '';
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  const loadingClass = isLoading ? 'btn-loading' : '';
  const iconOnlyClass = iconOnly ? 'btn-icon-only' : '';

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
        <span className="btn-spinner" aria-hidden="true"></span>
      )}
      {!isLoading && icon && (
        <span className="btn-icon" aria-hidden="true">{icon}</span>
      )}
      {!iconOnly && <span className="btn-text">{children}</span>}
    </button>
  );
};

export default Button;
