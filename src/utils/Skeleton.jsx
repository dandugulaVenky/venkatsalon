const Skeleton = ({ cards }) => {
  return (
    <div className="grid grid-cols-12 md:gap-3 mx-auto md:px-4 px-2.5 w-full">
      {Array(cards)
        .fill(0)
        ?.map((_, i) => {
          return (
            <div
              className="md:col-span-3 col-span-12  card rel lg:mx-1 mx-2 h-44 cursor-pointer rounded-md  max-w-full lg:max-w-[18rem] md:max-w-[12rem] p-3.5 "
              key={i}
            >
              <div data-body className="">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Skeleton;
