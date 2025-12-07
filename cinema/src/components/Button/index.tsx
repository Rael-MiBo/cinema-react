
interface ButtonProps {
    type?: 'button' | 'submit' | 'reset';
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
}

export const Button = (
    { type = 'button', label, variant = 'primary', onClick }: ButtonProps
) => {
  return (
    <>
        <button type={type} className={"btn btn-" + variant} onClick={onClick}>
        {label}
        </button>
    </>
  )
}