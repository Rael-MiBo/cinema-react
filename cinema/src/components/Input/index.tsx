interface InputProps {
    id?: string;
    name?: string;
    type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'date' | 'time' | 'month' | 'week' | 'color' | 'file' | 'checkbox' | 'radio' | 'hidden' | 'range' | 'reset' | 'submit' | 'button' | 'image';
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const idCaptalized = (id: string) => id.charAt(0).toUpperCase() + id.slice(1);

export const Input = ( { id, name, type = 'text',placeholder, value, onChange} : InputProps) => {
    return (
        <>
            <label htmlFor={id} className="form-label"> {id} </label>
            <input
                id={id}
                name={name ? name : idCaptalized(id || '')}
                className="form-control"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </>
    )
}