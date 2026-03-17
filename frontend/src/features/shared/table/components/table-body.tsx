// table-body.tsx
export function TableBody({
  className = "",
  children,
  ...props
}: React.HTMLProps<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-border ${className}`} {...props}>
      {children}
    </tbody>
  );
}
