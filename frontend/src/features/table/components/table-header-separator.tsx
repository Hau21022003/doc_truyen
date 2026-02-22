export default function TableHeaderSeparator() {
  return (
    <div
      className={`absolute top-0 right-0 bottom-0 flex items-center justify-center z-10`}
    >
      <div className=" h-[60%] w-3 flex items-center justify-center">
        <div
          className={`
          h-full w-[2px] rounded-sm bg-primary/25
        `}
        />
      </div>
    </div>
  );
}
