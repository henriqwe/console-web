type InputProps = {
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ type = "text", ...props }: InputProps) => (
  <input
    {...props}
    type={type}
    className={`pl-4 border border-gray-300 rounded-md outline-1 outline-blue-300 h-10 text-sm text-gray-700 ${props.className}`}
  />
);
