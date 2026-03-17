export function TableRow({
  onClick,
  children,
  className = "",
  ...props
}: React.HTMLProps<HTMLTableRowElement>) {
  return (
    <tr
      className={`table-row ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
}
