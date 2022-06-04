type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => (
  <button className={`px-4 bg-white border border-gray-300 rounded-sm text-sm text-gray-600 ${props.className}`} {...props}>{children}</button>
);
