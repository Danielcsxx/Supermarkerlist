import { ButtonHTMLAttributes } from "react";
import styles from './styles.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  customClassName?: string;
  buttonStyle: 'buttonAdd' | 'buttonDelete' | 'buttonDetails';
}

export function Button({ children, customClassName, buttonStyle, ...rest }: ButtonProps) {
  const buttonClassName = `${styles[buttonStyle]} ${customClassName || ''}`;

  return (
    <button className={buttonClassName} {...rest}>
      {children}
    </button>
  )
}
