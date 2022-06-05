type SelectProps = {
  options: {
    value: string;
    name: string;
  }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ options, ...props }: SelectProps) => (
  <select
    {...props}
    className={`px-4 border border-gray-300 rounded-md outline-1 outline-blue-300 h-10 text-sm bg-white flex justify-between text-gray-700 ${props.className}`}
  >
    {options.map((option) => (
      <option value={option.value} key={option.value}>
        {option.name}
      </option>
    ))}
  </select>
);
